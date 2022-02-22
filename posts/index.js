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
const port = 4000;

const posts = {};

app.get("/posts", (req, res) => {
    res.status(200).send(posts);
});

app.post("/posts", async (req, res) => {
  const id = randomBytes(4).toString("hex");
  const { title } = req.body;
  posts[id] = { id, title };

  await axios.post('http://localhost:4005/events',{
    type: "PostCreated",
    data: {
      id, title
    }
  }).catch((err) => {
    console.log(err.message);
  });

  res.status(201).send(posts[id]);
});

app.post('/events',(req,res)=>{
  console.log("Events recieved", req.body.type);
  res.send({});
})


app.listen(port, () => {
  console.log("Listinng on port ", port);
});
