const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')

const Answer = require('../models/Answer.model')
const Question = require('../models/Question.model')
const Poll = require('../models/Poll.model')

// POST ANSWER
router.post("/answers", (req, res, next) => {
    Answer.create(req.body)
        .then(newAnswer => {
            res.json(newAnswer)
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

// GET ALL QUESTIONS BY POLL
router.get("/questions/:pollId", async (req, res, next) => {
  try {
      const poll = await Poll.findById(req.params.pollId)
      if (poll.isPublished) {
          const questions = await Question.find({ parentPoll: req.params.pollId })
          res.json(questions)
      } else if (!poll.isPublished) {
          l
          res.json([{
              title: 'This poll is not published right now 😢',
              type: 'intro',
              message: 'Please, come back another time',
              buttonText: 'ok'
          }])
      }

  } catch (err) { console.log(err) }
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

module.exports = router;