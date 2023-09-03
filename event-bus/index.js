const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();
app.use(bodyParser.json());
const eventsDataStorage = [];

app.post("/events", (req, res) => {
  const event = req.body;
  eventsDataStorage.push(event);
  axios
    .post("http://posts-clusterip-srv:4000/events", event)
    .catch((error) => console.log(error.message)); // Post Service
  axios
    .post("http://comments-srv:4001/events", event)
    .catch((error) => console.log(error.message)); // Comment Service
  axios
    .post("http://query-srv:4002/events", event)
    .catch((error) => console.log(error.message)); // Query Service
  axios
    .post("http://moderation-srv:4003/events", event)
    .catch((error) => console.log(error.message)); // Moderation Service
  res.send({ status: "OK" });
});

app.get("/events", (req, res) => {
  res.send(eventsDataStorage);
});
app.listen(4005, () => {
  console.log("Server listening to port 4005");
});
