const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const { Parser } = require("json2csv")
const fs = require("fs")
const submissionCleaner = require('../utils/utils.js')

const Poll = require('../models/Poll.model')
const Question = require('../models/Question.model')
const Answer = require('../models/Answer.model')

// GET ALL POLLS
router.get("/polls/:userId", (req, res, next) => {
    Poll.find({ owner: req.params.userId })
        .then(polls => {
            const updatedPolls = []
            polls.forEach(poll => {
                const pollCopy = { ...poll._doc }
                pollCopy.submissions = poll.submissionsIds.length
                pollCopy.views = poll.viewsIds.length
                delete pollCopy['viewsIds']
                delete pollCopy['submissionsIds']
                updatedPolls.push(pollCopy)
            })
            res.json(updatedPolls)
        })
        .catch(err => console.log(err))
})

// GET POLL IN CSV - TEST
router.get("/polls/csv/:id", async (req, res, next) => {
    try {
        const poll = await Poll.findById(req.params.id)
        const { questions } = await Poll.findById(req.params.id).populate('questions')
        const questionsObject = {}
        questions.forEach(question => questionsObject[question._id] = question)
        const { submissionsIds, questions: questionsIds } = poll
        const responseArray = []
        for (let i = 0; i < submissionsIds.length; i++) {
            let response = {}
            const submission = await Answer.find({ submissionId: submissionsIds[i] })
            const submissionCopy = []
            submission.forEach((element, index) => {
                if (questionsIds.includes(element.parentQuestion)) {
                    let elementCopy = { ...element._doc }
                    elementCopy['type'] = questionsObject[elementCopy.parentQuestion]['type']
                    elementCopy['questionTitle'] = questionsObject[elementCopy.parentQuestion]['title']
                    const cleanElement = submissionCleaner(elementCopy)
                    submissionCopy.push(cleanElement)
                }
            })
            response['timeStamp'] = submission[0].createdAt
            response['userEmail'] = submission[0].replierEmail
            submissionCopy.forEach(sub => {
                const [key] = Object.keys(sub)
                response[key] = sub[key]
            })
            responseArray.push(response)
        }
        // res.status(200).json(responseArray)
        const json2csvParser = new Parser()
        const csv = json2csvParser.parse(responseArray)
        res.status(200).send(csv)
    } catch (error) {
        console.log(error)
    }
})

// GET POLL STATUS
router.get("/polls/status/:id", async (req, res, next) => {
    try {
        const poll = await Poll.findById(req.params.id)
        const response = {
            _id: poll._id,
            viewsIds: poll.viewsIds.length,
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

// GET ALL QUESTIONS BY POLL
router.get("/polls/:pollId/questions", async (req, res, next) => {
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

module.exports = router;