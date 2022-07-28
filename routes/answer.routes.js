const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')

const Answer = require('../models/Answer.model')

// GET ALL QUESTIONS
router.get("/answers/:pollId", (req, res, next) => {
    Answer.find({ parentQuestion: req.params.userId })
        .then(answers => {
            res.json(answers)
        })
        .catch(err => console.log(err))
})

// GET QUESTION
router.get("/answers/:id", (req, res, next) => {
    Answer.findById(req.params.id)
        .then(answer => {
            res.json(answer)
        })
        .catch(err => console.log(err))
})

// POST QUESTION
router.post("/answers", (req, res, next) => {
    Answer.create(req.body)
        .then(newAnswer => {
            res.json(newAnswer)
        })
        .catch(err => console.log(err))
})

// PUT QUESTION
router.put('/answers/:id', (req, res, next) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        res.status(400).json({ message: 'Specified id is not valid' });
        return;
    }

    Answer.findByIdAndUpdate(req.params.id, req.body, { new: true })
        .then((updatedAnswer) => {
            res.json(updatedAnswer)
        })
        .catch(error => res.json(error));
})

// DELETE QUESTION
router.delete('/answers/:id', (req, res, next) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        res.status(400).json({ message: 'Specified id is not valid' });
        return;
    }
   
    Answer.findByIdAndRemove(req.params.id)
      .then(() => res.json({ message: `Answer with ID ${req.params.id} has been removed successfully.` }))
      .catch(error => res.json(error));
  })

module.exports = router;