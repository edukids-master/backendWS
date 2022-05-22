const mongoose = require("mongoose");

const ActivitiesSchema = new mongoose.Schema({
    categorie: String,
    img: String,
    titre: String,
    colors: [],
    bgImg: String
})

module.exports = mongoose.model("Activities", ActivitiesSchema, "activities");