const express = require("express");
const router = express.Router();
const { getRandomQuote } = require("../controllers/quoteController");

router.get("/quote", getRandomQuote);

module.exports = router;
