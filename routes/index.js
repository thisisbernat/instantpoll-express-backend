const router = require("express").Router();

router.get("/", (req, res, next) => {
  res.json("InstantPoll API up and running");
});

module.exports = router;
