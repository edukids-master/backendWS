var express = require("express");
var router = express.Router();
const userRouter = require("./user.routes");
const activitiesRouter = require("./activities.routes");
const auth = require("../middlewares/auth");
const restrict = require("../middlewares/restrict");

router.use("/user", userRouter);
router.use("/activities", activitiesRouter);

module.exports = router;
