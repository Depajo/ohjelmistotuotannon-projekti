const express = require("express");
const Router = require("./routes/voicecontrol");
require("dotenv").config();

const app = express();
app.use(express.json());

app.use("/api/katutiedot", Router);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Backend is listening on port ${PORT}`);
});
