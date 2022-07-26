const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')

const Poll = require('../models/Poll.model')

// GET ALL POLLS
router.get("/polls", (req, res, next) => {
    Poll.find()
        .then(polls => {
            res.json(polls)
        })
        .catch(err => console.log(err))
})

// GET POLL
router.get("/polls/:id", (req, res, next) => {
    Poll.findById(req.params.id)
        .then(poll => {
            res.json(poll)
        })
        .catch(err => console.log(err))
})

// POST POLL
router.post("/polls", (req, res, next) => {
    Poll.create(req.body)
        .then(newPoll => {
            res.json(newPoll)
        })
        .catch(err => console.log(err))
})

// PUT POLL
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

// DELETE POLL
router.delete('/polls/:id', (req, res, next) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        res.status(400).json({ message: 'Specified id is not valid' });
        return;
    }
   
    Poll.findByIdAndRemove(req.params.id)
      .then(() => res.json({ message: `Poll with ID ${req.params.id} has been removed successfully.` }))
      .catch(error => res.json(error));
  })

module.exports = router;