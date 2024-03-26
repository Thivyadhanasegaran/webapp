import { User } from "../models/healthzModel.js";
import nameValidator from "validator";
import emailValidator from "email-validator";
import logger from "../logger/logger.js";
import { PubSub } from '@google-cloud/pubsub';
import moment from 'moment';



// const projectId = 'tf-gcp-infra-415001';
const pubsub = new PubSub();
// const pubsub = new PubSub({ projectId });
const topicName = 'verify_email'; 


// Function to get user information
const getUserInfo = async (req, res) => {
  try {
    logger.debug("Fetching user information");
    if (req.headers.authorization === undefined) {
      logger.error("Authorization header is missing.");
      res.status(403).json({ message: "Authorization header is missing." });
    }
    // Retrieve user information (excluding password)
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ["password"] },
    });
    if (!user.isVerified) {
      return res.status(403).json({ message: 'User account is not verified' });
    }
    res.json(user);
  } catch (error) {
    logger.error("Error retrieving user information:", error);
    console.error("Error retrieving user information:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Function to create a new user
const createUser = async (req, res, next) => {
  try {
    logger.debug("Processing user creation");
    if (Object.keys(req.query).length > 0) {
      return res
        .status(400)
        .json({ message: "Query parameters are not allowed" });
    }

    // Check for empty request body
    if (Object.keys(req.body).length === 0) {
      logger.warn("Empty / Invalid payload not allowed");
      return res
        .status(400)
        .json({ message: "Empty / Invalid payload not allowed" });
    }

    // Check if authorization headers are present
    if (req.headers.authorization) {
      logger.warn("Authorization headers are not allowed for creating a user");
      return res
        .status(400)
        .json({
          message: "Authorization headers are not allowed for creating a user",
        });
    }

    const allowedAttributes = [
      "first_name",
      "last_name",
      "id",
      "password",
      "username",
      "account_created",
      "account_updated",
      "isVerified",
      "validity_time",
      "token",
    ];
    const receivedAttributes = Object.keys(req.body);

    const { first_name, last_name, password, username } = req.body;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!first_name || !last_name || !password || !username) {
      logger.warn("Missing required fields");
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Password validation
    if (password.length < 5) {
      logger.warn("Password must be at least 5 characters long");
      return res
        .status(400)
        .json({ message: "Password must be at least 5 characters long" });
    }

    // Check if email matches the email format

    if (!emailValidator.validate(`${req.body.username}`)) {
      logger.debug("Invalid email address:", req.body.username);
      return res.status(400).json({ message: "Invalid email address" });
    }

    //  Check for extra attributes
    const extraAttributes = receivedAttributes.filter(
      (attr) => !allowedAttributes.includes(attr)
    );
    if (extraAttributes.length > 0) {
      return res
        .status(400)
        .json({
          message: `Extra attributes are not allowed: ${extraAttributes.join(
            ", "
          )}`,
        });
    }
    next();
  } catch (error) {
    console.error("Error in createUser middleware:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const createUserPost = async (req, res) => {

  const isTesting = process.env.NODE_ENV === 'test';
  const isVerified = isTesting ? true : false;
  const { first_name, last_name, password, username, validity_time, token } = req.body;

  const existingUser = await User.findOne({ where: { username } });
  if (existingUser) {
    logger.error(`User with username '${username}' already exists`, { username: username });
    return res
      .status(400)
      .json({ message: "User with this email already exists" });
  }
  // const newUser = await User.create({
  //   first_name,
  //   last_name,
  //   password,
  //   username,
  // });

  // const isTesting = process.env.NODE_ENV === 'test';
  // const isVerified = isTesting ? true : false;

  const newUser = await User.create({
    first_name,
    last_name,
    password,
    username,
    isVerified, 
    validity_time,
    token,
  });

  // Publish a message to the Pub/Sub topic
  const messagePayload = {
    username: newUser.username,
  };

  try {
    const messageBuffer = Buffer.from(JSON.stringify(messagePayload));
  
    // Publish the message to the topic
    await pubsub.topic(topicName).publish(messageBuffer);
    console.log('Message published successfully.');
  } catch (error) {
    console.error('Error publishing message:', error);
  }
  
  
  logger.info("New user created successfully", { username: req.body.username });
  // Return the created user
  res.status(201).json({
    id: newUser.id,
    first_name: newUser.first_name,
    last_name: newUser.last_name,
    username: newUser.username,
    account_created: new Date(),
    account_updated: new Date(),
  });
};

const isAlphaString = (str) => {
  return nameValidator.isAlpha(str);
};

// Function to check update user information

const updateUserCheck = async (req, res, next) => {
  try {
    logger.debug("Updating user information");
    if (Object.keys(req.query).length > 0) {
      return res
        .status(400)
        .json({ message: "Query parameters are not allowed" });
    }
    // Check for empty request body
    if (Object.keys(req.body).length === 0) {
      logger.warn("Empty / Invalid payload not allowed");
      return res
        .status(400)
        .json({ message: "Empty / Invalid payload not allowed" });
    }

    const { first_name, last_name, password } = req.body;
    if (
      !isAlphaString(req.body.first_name) ||
      !isAlphaString(req.body.last_name)
    ) {
      logger.warn("Missing required fields");
      return res.status(400).json({ message: "Missing required fields" });
    }
    // Check if the request body is empty
    if (!first_name && !last_name && !password) {
      logger.warn("Missing required fields");
      return res.status(400).json({ message: "Missing required fields" });
    }

   

    const unauthorizedFields = Object.keys(req.body).filter(
      (field) => !["first_name", "last_name", "password"].includes(field)
    );
    if (unauthorizedFields.length > 0) {
      return res.status(400).json({
        message: `User cannot update- ${unauthorizedFields.join(", ")}`,
      });
    }

    // Password validation
   if (password && password.length < 5) {
    logger.warn("Password must be at least 5 characters long");
    return res
      .status(400)
      .json({ message: "Password must be at least 5 characters long" });
  }
  
    if (req.headers.authorization === undefined) {
      logger.error("Authorization header is missing.");
      return res
        .status(403)
        .json({ message: "Authorization header is missing." });
    }
    next();
  } catch (error) {
    logger.error("Error in updateUserCheck middleware:", error);
    console.error("Error in createUser middleware:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
// Function to update user information
const updateUser = async (req, res) => {
  const { first_name, last_name, password } = req.body;
  const userId = req.user.id;

  try {
    // Find the user by ID
   
    const user = await User.findByPk(userId);
    if (!user.isVerified) {
      return res.status(403).json({ message: 'User account is not verified' });
    }
    if (!user) {
      logger.error("User not found");
      return res.status(404).json({ message: "User not found" });
    }
    // Check if the user is updating their own account
    if (user.id !== userId) {
      logger.warn("User can only update his/her own account");
      return res
        .status(403)
        .json({ message: "User Can only update his/her own account only" });
    }

    let changesMade = false;

    if (password !== undefined && password !== user.password) {
      user.password = password;
      changesMade = true;
    }

    if (first_name !== undefined && first_name !== user.first_name) {
      user.first_name = first_name;
      changesMade = true;
    }
    if (last_name !== undefined && last_name !== user.last_name) {
      user.last_name = last_name;
      changesMade = true;
    }

    // Update the account_updated field only if changes were made
    if (changesMade) {
      user.account_updated = new Date();
      await user.save();
    }

    const updatedUser = await User.findByPk(userId, {
      attributes: { exclude: ["password", "createdAt", "updatedAt"] },
    });

    if (changesMade) {
      logger.info("User updated successfully", { username: user.username });
      return res.status(204).send();
    } else {
      return res.status(204).send();
    }
  } catch (error) {
    if (error.name === "SequelizeValidationError") {
      const errorMessage = error.errors.map((err) => err.message).join(", ");
      return res.status(400).json({ message: errorMessage });
    } else {
      logger.error("Error updating user:", error);
      console.error("Error updating user:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }
};




const verifyEmail = async (req, res) => {
  const { username, token } = req.query;
  const currentTime = new Date();

  try {
      // Fetch validity_time from the database based on username
      const user = await User.findOne({ where: { username } });
      if (!user) {
          return res.status(400).send("User not found");
      }
      
      const validity_time = user.validity_time;
      const validityTime = new Date(validity_time);
      
       // Calculate the maximum validity time allowed (2 minutes from the current time)
    const maxValidityTime = new Date(currentTime.getTime() + 2 * 60 * 1000);
    console.log('maxValidityTime:', maxValidityTime);
    console.log('Validity Time:', validityTime);
    // Check if validity_time is within 2 minutes from now
    if (validityTime > maxValidityTime) {
        
          // Perform token validation (e.g., check if token is valid)
          if (await validateToken(username, token)) {
              // Update database to mark the user as verified
              await updateDatabase(username);
              return res.status(200).send("Email verified successfully!");
          } else {
              return res.status(400).send("Invalid token or username");
          }
      } else {
          return res.status(400).send("Link expired");
      }
  } catch (error) {
      console.error("Error verifying email:", error);
      return res.status(500).send("Internal server error!!!!!");
  }
};


async function validateToken(username, token) {
  try {
      const user = await User.findOne({ where: { username, token } });
      return !!user; 
  } catch (error) {
      console.error("Error validating token:", error);
      throw error;
  }
}

async function updateDatabase(username) {
  try {
      
      await User.update({ isVerified: true }, { where: { username } });
  } catch (error) {
      console.error('Error updating database:', error);
      throw error;
  }
}

export { createUser, getUserInfo, updateUser, createUserPost, updateUserCheck, verifyEmail };

