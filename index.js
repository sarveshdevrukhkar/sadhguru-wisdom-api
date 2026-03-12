// const express = require("express");
// const path = require("path");
// const app = express();

// const port = 8080;

// app.use(express.urlencoded({ extended: true }));
// app.use(express.json()); // to support JSON-encoded bodies.

// app.set("view engine", "ejs");
// app.set("view engine", path.join(__dirname, "views"));
// app.set(express.static(path.join(__dirname, "/public")));

// app.listen(port, () => {
//     console.log(`Listening on port ${port}...`);
// })

// app.get("/", (req, res) => {
//     res.send("Server is live.");
// });

const express = require("express");
const app = express();
const port = 8080;

app.get("/", (req, res) => {
    res.send("Sadhguru Wisdom API app is live.");
});

const quote = "I am not this Body, I am not even the Mind!";

app.get("/quote", (req, res) => {
    res.send(quote);
});

app.listen(port, () => {
    console.log(`Sadhguru Wisdom API is listening on ${port}...`);
});