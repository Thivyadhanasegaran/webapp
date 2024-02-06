// Function to check for any payload or query parameters in the request

const checkPayloadAndQueryParams = (req, res, next) => {
  try {
    if (Object.keys(req.body).length > 0 || req.headers["content-length"] > 0) {
      return res
        .status(400)
        .header("Cache-Control", "no-cache, no-store, must-revalidate")
        .header("Pragma", "no-cache")
        .header("X-Content-Type-Options", "nosniff")
        .send();
    }
    if (Object.keys(req.query).length > 0) {
      return res
        .status(400)
        .header("Cache-Control", "no-cache, no-store, must-revalidate")
        .header("Pragma", "no-cache")
        .header("X-Content-Type-Options", "nosniff")
        .send();
    }
    next();
  } catch (error) {
    return res.status(500).send();
  }
};

export default checkPayloadAndQueryParams;
