var express = require("express");
var router = express.Router();
const Quiz = require("../models/quiz");

router.get("/", function (req, res, next) {
    Quiz.findOne((err, data) => {
      if(err) return next(err)

      res.json(data)
  })
});

module.exports = router;