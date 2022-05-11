const mongoose = require("mongoose");

const QuizSchema = new mongoose.Schema({
    question: Object,
    indice: Object,
    reponses: []
})

module.exports = mongoose.model("Quiz", QuizSchema, "quiz");