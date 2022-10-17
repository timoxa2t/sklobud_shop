const express     = require('express');
const path        = require('path');
const cors        = require('cors');
const bodyParser  = require('body-parser')

require('dotenv').config()



const sqlDbRouter = require('./routes/sqlDbApi');
const { postDataToTelegram, getDataFromServer, postDataToServer } = require('./models/server');
const app = express();

const testing = process.argv.some((val) => val === "test");
const rootDir = path.join(__dirname, testing ? 'public': 'build')

app.use(express.static(rootDir));

app.use(cors());

app.use(express.json());

app.use("/storage", sqlDbRouter)

app.get("/api/telegram/*", (req, res) => {

  process.on('uncaughtException', function (err) {

  });
  postDataToTelegram(req, res)
});

app.get("/api/*", (req, res) => {

  process.on('uncaughtException', function (err) {

  });
  getDataFromServer(req, res)
});

app.post("/api/*", (req, res) => {

  process.on('uncaughtException', function (err) {

  });
  postDataToServer(req, res)
});

app.put("/api/*", (req, res) => {

  process.on('uncaughtException', function (err) {

  });
  postDataToServer(req, res)
});



app.get('/*', function (req, res) {

  res.sendFile(path.join(rootDir, 'index.html'));

});

app.listen(3000);
