const mongoose = require("mongoose")
const { Schema, model } = mongoose

const answerSchema = new Schema({
    choices: [{ choice: String, votes: Number }],
    rating: { type: Number, min: 0, max: 5 },
    ranking: [{ word: String, position: Number }],
    list: [String],
    text: String,
    number: Number,
    word: String,
    date: Date,
    email: String,
    phoneNum: String,
    parentQuestion: { type: Schema.Types.ObjectId, ref: "Question" },
    replierEmail: String
},
    { timestamps: true }
)

module.exports = model("Answer", answerSchema)