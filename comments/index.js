const express = require("express");
const bodyParser = require("body-parser");
const { randomBytes } = require("crypto");
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());
app.use(cors());
const port = 4001;

const commentsByPostId = {};

app.get("/posts/:id/comments", (req, res) => {
    res.status(200).send(commentsByPostId[req.params.id] || []);
});

app.post("/posts/:id/comments", async (req, res) => {
  const commentId = randomBytes(4).toString("hex");
  const { content } = req.body;

  const comments = commentsByPostId[req.params.id] || [];

  comments.push({id: commentId, content});
  commentsByPostId[req.params.id] = comments;

  await axios.post('http://localhost:4005/events',{
    type: "CommentCreated",
    data: {
      id: commentId,
      content,
      postId: req.params.id
    }
  }).catch((err) => {
    console.log(err.message);
  });
  res.status(201).send(comments);
});

app.post('/events',(req,res)=>{
  console.log("Events recieved", req.body.type);
  res.send({});
});

app.listen(port, () => {
  console.log("Listinng on port ", port);
});
