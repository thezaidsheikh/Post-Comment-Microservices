const express = require('express');
const bodyParser = require('body-parser');
const { randomBytes } = require('crypto');
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const posts = {};

app.get("/posts", (req, res) => {
    res.send(posts);
});
app.post("/posts", (req, res) => {
    const id = randomBytes(4).toString("hex");
    const { title } = req.body;
    posts[id] = {
        id, title
    };
    res.send({ id, title });
    axios.post("http://localhost:4005/events", { type: "postCreated", data: { id, title } })
});

app.post('/events', (req, res) => {
    console.log("Received Event in post", req.body.type);
    res.send({});
});

app.listen(4000, () => {
    console.log("Server listening to port 4000");
});