const express = require('express');
const bodyParser = require("body-parser");
const { randomBytes } = require("crypto");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const posts = {};

app.get("/posts", (req, res) => {
    res.send(posts);
});

app.post("/events", (req, res) => {
    const { type, data } = req.body;
    if (type == "postCreated") {
        const { id, title } = data;
        posts[id] = { id, title, comments: [] };
    }
    if (type == "commentCreated") {
        console.log("posts in query ====>", data, posts);
        const { id, content, postId } = data;
        const post = posts[postId];
        post.comments.push({ id, content });
    }

    res.send({});
});

app.listen(4002, () => {
    console.log("Server listening to port 4002");
});