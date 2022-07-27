const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')

const Poll = require('../models/Poll.model')

// GET ALL POLLS
router.get("/polls/:userId", (req, res, next) => {
    Poll.find({ owner: req.params.userId })
        .then(polls => {
            res.json(polls)
        })
        .catch(err => console.log(err))
})

// GET ONE POLL
router.get("/polls/:id", (req, res, next) => {
    Poll.findById(req.params.id)
        .then(poll => {
            res.json(poll)
        })
        .catch(err => console.log(err))
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