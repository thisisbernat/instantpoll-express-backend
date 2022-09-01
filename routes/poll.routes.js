const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')

const Poll = require('../models/Poll.model')
const Question = require('../models/Question.model')
const Answer = require('../models/Answer.model')

// GET ALL POLLS
router.get("/polls/:userId", (req, res, next) => {
    Poll.find({ owner: req.params.userId })
        .then(polls => {
            const updatedPolls = []
            polls.forEach(poll => {
                const viewsArray = poll.views.length
                const pollCopy = { ...poll._doc }
                delete pollCopy['views']
                pollCopy.views = viewsArray
                updatedPolls.push(pollCopy)
            })
            res.json(updatedPolls)
        })
        .catch(err => console.log(err))
})

// GET POLL STATUS
router.get("/polls/status/:id", async (req, res, next) => {
    try {
        const poll = await Poll.findById(req.params.id)
        const response = {
            _id: poll._id,
            views: poll.views.length,
            submissions: poll.submissions,
            isPublic: poll.isPublic,
            isPublished: poll.isPublished,
            createdAt: poll.createdAt,
            updatedAt: poll.updatedAt
        }
        res.json(response)
    } catch (error) {
        console.log(error)
    }
})

// ADD NEW POLL
router.post("/polls", (req, res, next) => {
    Poll.create(req.body)
        .then(newPoll => {
            res.json(newPoll)
        })
        .catch(err => console.log(err))
})

// ADD VIEW TO POLL
router.post("/polls/views/:id", async (req, res, next) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        res.status(400).json({ message: 'Specified id is not valid' });
        return;
    }
    try {
        const poll = await Poll.findById(req.params.id)
        if (!poll.views.includes(req.body.visitId)) {
            const viewsArray = [...poll.views, req.body.visitId]
            const updatedPoll = await Poll.findByIdAndUpdate(req.params.id, { views: viewsArray }, { new: true })
            res.json(updatedPoll)
        }
        res.json('visit ID already registered')
    } catch (error) {
        console.log(error)
    }
})

// UPDATE POLL (PUT - COMPLETE OBJECT)
router.put('/polls/:id', (req, res, next) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        res.status(400).json({ message: 'Specified id is not valid' });
        return;
    }

    Poll.findByIdAndUpdate(req.params.id, req.body, { new: true })
        .then((updatedPoll) => {
            res.json(updatedPoll)
        })
        .catch(error => res.json(error));
})

// UPDATE POLL (PATCH - ONLY CHANGES)
router.patch('/polls/:id', (req, res, next) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        res.status(400).json({ message: 'Specified id is not valid' });
        return;
    }

    Poll.findByIdAndUpdate(req.params.id, req.body, { new: true })
        .then((updatedPoll) => {
            res.json(updatedPoll)
        })
        .catch(error => res.json(error));
})

// DELETE POLL
router.delete('/polls/:id', async (req, res, next) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        res.status(400).json({ message: 'Specified id is not valid' });
        return;
    }

    //Delete all the answers related to the poll
    try {
        const questions = await Question.find({ parentPoll: req.params.id })

        for (const [index, question] of questions.entries()) {
            const howManyDel = await Answer.deleteMany({ parentQuestion: question._id })
        }

    } catch (error) {
        console.log(error)
    }
    //Delete all the questions related to the poll
    try {
        await Question.deleteMany({ parentPoll: req.params.id })
    } catch (error) {
        console.log(error)
    }
    //Delete the poll itself
    try {
        await Poll.findByIdAndRemove(req.params.id)
        res.json({ message: `Poll with ID ${req.params.id} has been removed successfully.` })
    } catch (error) {
        console.log(error)
    }
})

module.exports = router;