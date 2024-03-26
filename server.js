import express from "express";
import bodyParser from "body-parser";
import healthzRoute from "./routes/healthzRoute.js";
import verifyEmail from "./routes/verifyEmail.js"
import { sequelize } from "./models/healthzModel.js";
import { handlePayload } from "./middlewares/checkPayloadAndQueryParams.js";
import userRoute from "./routes/userRoute.js";
import moment from 'moment';

const app = express();
const PORT = process.env.PORT || 8080;
app.disable("x-powered-by");

app.use("/healthz/*", (req, res) => {
  res
    .status(404)
    .header("Cache-Control", "no-cache, no-store, must-revalidate")
    .header("Pragma", "no-cache")
    .header("X-Content-Type-Options", "nosniff")
    .send();
});

// // Middleware to check for invalid query parameters
// app.use("/", (req, res, next) => {
//   if (Object.keys(req.query).length > 0) {
//     res
//       .status(400)
//       .header("Cache-Control", "no-cache, no-store, must-revalidate")
//       .header("Pragma", "no-cache")
//       .header("X-Content-Type-Options", "nosniff")
//       .send();
//   } else {
//     next();
//   }
// });
// Middleware to check for invalid query parameters
app.use("/", (req, res, next) => {
  // Check if the request path is not "/verify-email" and there are query parameters
  if (req.path !== "/verify-email" && Object.keys(req.query).length > 0) {
    res
      .status(400)
      .header("Cache-Control", "no-cache, no-store, must-revalidate")
      .header("Pragma", "no-cache")
      .header("X-Content-Type-Options", "nosniff")
      .send();
  } else {
    next();
  }
});
// Middleware to check for invalid methods
app.use("/healthz", (req, res, next) => {
  if (req.method !== "GET") {
    res
      .status(405)
      .header("Cache-Control", "no-cache, no-store, must-revalidate")
      .header("Pragma", "no-cache")
      .header("X-Content-Type-Options", "nosniff")
      .send();
  } else {
    next();
  }
});

app.use('/healthz', handlePayload);

// Middleware to handle invalid payloads for GET requests
const parser = bodyParser.json();
app.use("/healthz", (req, res, next) => {
  if (req.method === "GET") {
    parser(req, res, (error) => {
      if (error) {
        res
          .status(400)
          .header("Cache-Control", "no-cache, no-store, must-revalidate")
          .header("Pragma", "no-cache")
          .header("X-Content-Type-Options", "nosniff")
          .send();
      } else {
        next();
      }
    });
  } else {
    next();
  }
});

// Route for healthz
app.get("/healthz", healthzRoute);

// Route for verify email
app.get("/verify-email", verifyEmail);

// Middleware to handle invalid methods for non-existent endpoints

const allowedEndpoints = {
  '/v1/user': ['POST'],
  '/v1/user/self': ['GET', 'PUT']
};

app.use((req, res, next) => {
  const { path, method } = req;
  
  if (allowedEndpoints[path]) {
    if (!allowedEndpoints[path].includes(method)) {
      res.status(405).send();
    } else {
      next();
    }
  } else {
    res.status(404).send();
  }
});


app.use(bodyParser.json());

app.use("/", userRoute);

app.use((error, req, res, next) => {
  const syntaxError = error instanceof SyntaxError;
  const errorStatus = error.status === 400;
  const hasBody = 'body' in error;

  if (syntaxError && errorStatus && hasBody) {
    logger.error("Invalid JSON in request body");
    res.status(400).json({ error: 'Invalid JSON in request body' });
  } else {
    next(error);
  }
});

sequelize.sync().then(() => {
  // Start the server after syncing
  const currentTime = new Date();
  console.log(currentTime.getTime());
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});

export default app;
