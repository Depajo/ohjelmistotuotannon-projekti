/**
 * App.js created for SuperTest to be able to use the express app. 
This allows SuperTest can assign a random PORT for testing the API server. 
Also added following to package.json
    "test": "jest --forceExit"
 —forceExit makes sure that all handles are closed. The will be a call added to close the database connection as well.
These changes added for API testing.
 */

const express = require("express");
const addressRouter = require("./routes/voicecontrol");

const app = express();

app.use(express.json());
app.use("/api/katutiedot", addressRouter);

module.exports = app;