var express = require("express");
var router = express.Router();
const userRouter = require("./user.routes");
const auth = require("../middlewares/auth");
const restrict = require("../middlewares/restrict");

router.use("/user", userRouter);

module.exports = router;
