const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')

const Question = require('../models/Question.model')
const Poll = require('../models/Poll.model')

// GET ALL QUESTIONS
router.get("/questions/:pollId", async (req, res, next) => {
    try {
        const poll = await Poll.findById(req.params.pollId)
        if (poll.isPublished) {
            const questions = await Question.find({ parentPoll: req.params.pollId })
            res.json(questions)
        } else if (!poll.isPublished) {
            res.json([{
                title: 'This poll is not published right now 😢',
                type: 'intro',
                message: 'Please, come back another time',
                buttonText: 'ok'
            }])
        }

    } catch (err) { console.log(err) }
})

// GET QUESTION
router.get("/questions/:id", (req, res, next) => {
    Question.findById(req.params.id)
        .then(question => {
            res.json(question)
        })
        .catch(err => console.log(err))
})

// POST QUESTION
router.post("/questions", (req, res, next) => {
    Question.create(req.body)
        .then(newQuestion => {
            res.json(newQuestion)
        })
        .catch(err => console.log(err))
})

// PUT QUESTION
router.put('/questions/:id', (req, res, next) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        res.status(400).json({ message: 'Specified id is not valid' });
        return;
    }

    Question.findByIdAndUpdate(req.params.id, req.body, { new: true })
        .then((updatedQuestion) => {
            res.json(updatedQuestion)
        })
        .catch(error => res.json(error));
})

// DELETE QUESTION
router.delete('/questions/:id', (req, res, next) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        res.status(400).json({ message: 'Specified id is not valid' });
        return;
    }

    Question.findByIdAndRemove(req.params.id)
        .then(() => res.json({ message: `Question with ID ${req.params.id} has been removed successfully.` }))
        .catch(error => res.json(error));
})

module.exports = router;