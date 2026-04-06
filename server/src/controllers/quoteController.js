const Quote = require("../models/Quote");

const getRandomQuote = async (req, res) => {
	try {
		const count = await Quote.countDocuments();
		const random = Math.floor(Math.random() * count);
		const quote = await Quote.findOne().skip(random);
		res.status(200).json({ quote: quote.text });
	} catch (error) {
		res.status(500).json({ message: "Failed to fetch quote!" });
	}
};

module.exports = { getRandomQuote };
