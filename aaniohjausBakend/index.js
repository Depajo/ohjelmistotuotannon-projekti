const express = require("express");


const katutiedotRouter = require("./routes/voicecontrol");

const app = express();

app.use(express.json());

app.use("/api/katutiedot", katutiedotRouter);
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.info(`Backend is listening on port ${PORT}`);
});
