const mongoose = require("mongoose")
const { Schema, model } = mongoose

const pollSchema = new Schema({
    title: String,
    isPublished: Boolean,
    isPublic: Boolean,
    questions: [{ type: Schema.Types.ObjectId, ref: "Question" }],
    participantEmails: [{ type: String, lowercase: true, trim: true }],
    duplicationCheck: { type: String, enum: ["none", "session", "ip"] },
    submissionsIds: [String],
    viewsIds: [String],
    owner: { type: Schema.Types.ObjectId, ref: "User" }
},
    { timestamps: true }
)

module.exports = model("Poll", pollSchema)
