const jwt = require("jsonwebtoken");
const createHttpError = require("http-errors");

const config = process.env;

const verifyToken = (req, res, next) => {
  // const authHeader = req.headers["authorization"];
  // const token = authHeader && authHeader.split(" ")[1];
  const token =
    req.body.token || req.query.token || req.headers["x-access-token"];

  if (!token) {
    // return res.status(403).send("A token is required for authentication");
    return next(
      new createHttpError.Forbidden("A token is required for authentication")
    );
  }
  try {
    const decoded = jwt.verify(token, config.JWT_TOKEN_KEY);
    req.user = decoded;
  } catch (err) {
    // return res.status(401).send("Invalid Token");
    return next(new createHttpError.Unauthorized("Invalid Token"));
  }
  return next();
};

module.exports = verifyToken;
