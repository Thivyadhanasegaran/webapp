import { User } from "../models/healthzModel.js";

// Function to get user information
const getUserInfo = async (req, res) => {
  try {
    // Retrieve user information (excluding password)
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ["password"] },
    });
    res.json(user);
  } catch (error) {
    console.error("Error retrieving user information:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Function to create a new user
const createUser = async (req, res) => {
  if (Object.keys(req.query).length > 0) {
    return res.status(400).json({ message: "Query parameters are not allowed" });
  }
  const { first_name, last_name, password, username } = req.body;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  try {
    if (!first_name || !last_name || !password || !username) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    // Check if email matches the email format
    if (!emailRegex.test(username)) {
      return res.status(400).json({ message: "Invalid email address" });
    }

    // Check if user with the same email already exists
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User with this email already exists" });
    }
    const newUser = await User.create({
      first_name,
      last_name,
      password,
      username,
    });

    // Return the created user
    res.status(201).json({
      id: newUser.id,
      first_name: newUser.first_name,
      last_name: newUser.last_name,
      username: newUser.username,
      account_created: new Date(),
      account_updated: new Date(),
    });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Function to update user information
const updateUser = async (req, res) => {
  if (Object.keys(req.query).length > 0) {
    return res.status(400).json({ message: "Query parameters are not allowed" });
  }
  
  const { first_name, last_name, password } = req.body;
  const userId = req.user.id;
 
  // Check if the request body is empty
  if (!first_name && !last_name && !password) {
    return res.status(400).json({ message: "Empty / Invalid payload not allowed" });
  }
  
  try {
    // Find the user by ID
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    // Check if the user is updating their own account
    if (user.id !== userId) {
      return res
        .status(403)
        .json({ message: "User Can only update his/her own account only" });
    }
    const unauthorizedFields = Object.keys(req.body).filter(
      (field) => !["first_name", "last_name", "password"].includes(field)
    );
    if (unauthorizedFields.length > 0) {
      return res.status(400).json({
        message: `User cannot update- ${unauthorizedFields.join(
          ", "
        )}`,
      });
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
      // return res.status(204).send();
      return res.status(200).json(updatedUser);
    } else {
      return res.status(204).json({ message: "No changes were made" });
    }
  } catch (error) {
    if (error.name === "SequelizeValidationError") {
      const errorMessage = error.errors.map((err) => err.message).join(", ");
      return res.status(400).json({ message: errorMessage });
    } else {
      console.error("Error updating user:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }
};

export { createUser, getUserInfo, updateUser };
