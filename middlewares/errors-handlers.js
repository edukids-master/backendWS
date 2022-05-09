const logError = (err, req, res, next) => {
  console.log(err);
  next(err);
};

const sendError = (err, req, res, next) => {
  if (err) {
    if (err.name === "ValidationError")
      res.status(err.statusCode || 500).json(err);
    else res.status(err.statusCode || 500).json(JSON.parse(JSON.stringify(err, Object.getOwnPropertyNames(err))));
  }
};

module.exports = {
  logError,
  sendError,
};
