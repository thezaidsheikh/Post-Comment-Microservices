const express = require("express");
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
  comment.push({ id: commentId, content, status: "pending" });
  commentsByPostId[req.params.id] = comment;
  axios.post("http://event-bus-srv:4005/events", {
    type: "commentCreated",
    data: { id: commentId, content, postId: req.params.id, status: "pending" },
  });
  res.json(comment);
});

app.post("/events", async (req, res) => {
  console.log("Received Event in comment", req.body.type);
  const { type, data } = req.body;
  if (type === "commentModerated") {
    const { postId, id, status, content } = data;
    const comments = commentsByPostId[postId];
    const comment = comments.find((comment) => comment.id === id);
    comment.status = status;
    await axios.post("http://event-bus-srv:4005/events", {
      type: "commentUpdated",
      data: { id, status, postId, content },
    });
  }
  res.send({});
});

app.listen(4001, () => {
  console.log("Server listening to port 4001");
});
