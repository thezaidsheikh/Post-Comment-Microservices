const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();
app.use(bodyParser.json());

app.post("/events", (req, res) => {
  const { type, data } = req.body;

  if (type === "commentCreated") {
    const status = data.content.includes("fuck") ? "rejected" : "approved";
    axios.post("http://event-bus-srv:4005/events", {
      type: "commentModerated",
      data: { id: data.id, postId: data.postId, content: data.content, status },
    });
    res.send({});
  }
});

app.listen(4003, () => {
  console.log("Server listening to port 4003");
});
