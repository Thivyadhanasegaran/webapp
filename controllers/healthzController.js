import logger from "../logger/logger.js";

// Controller function to handle healthz endpoint

const healthzCheck = async (req, res) => {
  try {
    logger.info("Health check endpoint accessed");
    res
      .status(200)
      .header("Cache-Control", "no-cache, no-store, must-revalidate")
      .header("Pragma", "no-cache")
      .header("X-Content-Type-Options", "nosniff")
      .send();
  } catch (error) {
    logger.error("Error occurred while handling healthz check:", error);
    res.status(500).send();
  }
};

export default healthzCheck;