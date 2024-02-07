import express from "express";
import bodyParser from "body-parser";
import checkPayloadAndQueryParams from "./middlewares/checkPayloadAndQueryParams.js";
import healthzRoute from "./routes/healthzRoute.js";
import { sequelize } from "./models/healthzModel.js";
import userRoute from "./routes/userRoute.js";

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

// Middleware to parse JSON for all API requests
app.use((req, res, next) => {
  bodyParser.json()(req, res, (error) => {
    if (error && req.method === "GET") {
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
});


// Route for User
app.use("/", userRoute);


// Middleware to handle other methods
app.use("/", (req, res, next) => {
   if (req.method !== "GET") {
    //  if (req.method !== "GET" && req.url !== "/") {
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

// Middleware to validate payload and query parameters for GET request
app.use("/healthz", (req, res, next) => {
  if (req.method === "GET") {
    checkPayloadAndQueryParams(req, res, next);
  } else {
    next();
  }
});

// Route for healthz
app.use("/healthz", healthzRoute);

app.use((req, res, next) => {
  res
    .status(404)
    .header("Cache-Control", "no-cache, no-store, must-revalidate")
    .header("Pragma", "no-cache")
    .header("X-Content-Type-Options", "nosniff")
    .send();
});

sequelize.sync().then(() => {
  // Start the server after syncing
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
