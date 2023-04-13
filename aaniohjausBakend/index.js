const express = require("express");
// Add when controller is created
const katutiedotRouter = require("./routes");

const app = express();
app.use(express.json());

// Add when controller is created
app.use("/api/katutiedot", katutiedotRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.info(`Backend is listening on port ${PORT}`);
});
