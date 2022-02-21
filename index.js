require("dotenv").config({path: "./config.env"});
const express = require("express");
const connectDB = require("./config/db");
const errorHandler = require("./middleware/errors");
const winston = require("winston");

// logging errors
// require("./utils/logger")();

// initializind express
const app = express()

// initialize the database
connectDB()

// middleware
app.use(express.json());
app.use("/api/users", require("./routes/auth"));
app.use("/api/allusers", require("./routes/users"));

// last middleware
app.use(errorHandler)

// port no and port listener
const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
    winston.info(`Listening to port : ${PORT}`)
})

// handling rejected promised
process.on("unhandledRejection", (err, promise) => {
    winston.info(`Logged Error: ${err.message}`);
    process.exit(1)
})