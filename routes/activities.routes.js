var express = require("express");
var router = express.Router();
const Activities = require("../models/activities");

router.get("/", function (req, res, next) {
  Activities.find((err, data) => {
      if(err) return next(err)

      res.json(data)
  })
});

module.exports = router;