const app = require("./app");

const PORT = process.env.PORT || 3306;
app.listen(PORT, () => {
  console.info(`Backend is listening on PORT ${PORT}`);
});
