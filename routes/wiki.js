const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.send("Wiki homepage");
});

router.get("/about", (req, res) => {
  res.send("About this wiki");
});

module.exports = router;
