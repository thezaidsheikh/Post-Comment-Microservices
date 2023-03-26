const express = require('express');
const bodyParser = require("body-parser");
const { randomBytes } = require("crypto");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(cors());
app.use(bodyParser.json());
const commentsByPostId = {};

app.get("/posts/:id/comments", (req, res) => {
    const comment = commentsByPostId[req.params.id] || [];
    res.json(comment);
});
app.post("/posts/:id/comments", (req, res) => {
    const commentId = randomBytes(4).toString("hex");
    const { content } = req.body;
    const comment = commentsByPostId[req.params.id] || [];
    comment.push({ id: commentId, content });
    commentsByPostId[req.params.id] = comment;
    axios.post("http://localhost:4005/events", { type: "commentCreated", data: { id: commentId, content, postId: req.params.id } })
    res.json(comment)
});

app.post('/events', (req, res) => {
    console.log("Received Event in comment", req.body.type);
    res.send({});
});

app.listen(4001, () => {
    console.log("Server listening to port 4001");
});