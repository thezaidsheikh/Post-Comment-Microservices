const express = require("express");
const bodyParser = require("body-parser");
const { randomBytes } = require("crypto");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const posts = {};

const handleEvent = (type, data) => {
  if (type == "postCreated") {
    const { id, title } = data;
    posts[id] = { id, title, comments: [] };
  }
  if (type == "commentCreated") {
    console.log("posts in query ====>", data, posts);
    const { id, content, postId, status } = data;
    const post = posts[postId];
    post.comments.push({ id, content, status });
  }
  if (type === "commentUpdated") {
    const { id, content, postId, status } = data;
    const post = posts[postId];
    const comment = post.comments.find((comment) => comment.id === id);
    comment.status = status;
    comment.content = content;
  }
};

app.get("/posts", (req, res) => {
  res.send(posts);
});

app.post("/events", (req, res) => {
  const { type, data } = req.body;
  handleEvent(type, data);

  res.send({});
});

app.listen(4002, async () => {
  try {
    console.log("Server listening to port 4002");
    const res = await axios.get("http://event-bus-srv:4005/events");
    console.log("query fetch events ===>", res.data);
    if (res.data.length) {
      for (const event of res.data) {
        console.log("processing event : ", event.type);
        handleEvent(event.type, event.data);
      }
    }
  } catch (error) {
    console.log("error in 4002 ==>", error.message);
  }
});
