const express = require("express");
require("dotenv").config();
const cors = require("cors");

const katutiedotRouter = require("./routes");

const app = express();
app.use(express.json());
app.use("/api/katutiedot", katutiedotRouter);
app.use(express.static("public"));
app.use(cors());

app.get("/health", (req, res) => {
  res.send("OK");
});

module.exports = app;
