const mongoose = require("mongoose");

const ActivitiesSchema = new mongoose.Schema({
    categorie: String,
    img: String
})

module.exports = mongoose.model("Activities", ActivitiesSchema, "activities");