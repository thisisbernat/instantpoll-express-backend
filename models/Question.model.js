const mongoose = require("mongoose")
const { Schema, model } = mongoose

const questionSchema = new Schema({
    title: String,
    position: Number,
    type: { type: String, enum: ["intro", "single", "multiple", "rating", "open", "ranking", "list", "thanks", "line", "paragraph", "number", "date", "email", "phone"] },
    options: [String],
    message: String,
    buttonText: String,
    ranking: [String],
    parentPoll: { type: Schema.Types.ObjectId, ref: "Poll" },
    isCompulsory: Boolean,
    answers: [{ type: Schema.Types.ObjectId, ref: "Answer" }]
},
    { timestamps: true }
)

module.exports = model("Question", questionSchema)