const mongoose = require("mongoose")
const { Schema, model } = mongoose

const answerSchema = new Schema({
    choices: [ String ],
    rating: { type: Number, min: 0, max: 5 },
    ranking: [ String ],
    list: [ String ],
    text: String,
    number: Number,
    date: Date,
    email: String,
    phone: String,
    replierEmail: String,
    parentQuestion: { type: Schema.Types.ObjectId, ref: "Question" }    
},
    { timestamps: true }
)

module.exports = model("Answer", answerSchema)