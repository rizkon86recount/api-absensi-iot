// Load environment variables dari .env
require("dotenv").config();

// import express
const express = require("express");

// import CORS
const cors = require("cors");

// import bodyParser
const bodyParser = require("body-parser");

// import routes
const absensiRoutes = require("./routes/absensiRoutes");
const authRoutes = require("./routes/authRoutes");

// init app
const app = express();

// use cors
app.use(cors());

// use body parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// serve static file uploads
app.use("/uploads", express.static("uploads"));

// use routes
app.use("/api/absensi", absensiRoutes);

// route user
const userRoutes = require("./routes/userRoutes");
app.use("/api/users", userRoutes);

// route regis untuk admin
app.use("/api/auth", authRoutes);

// test route
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// testing
app.get("/ping", (req, res) => {
  res.send("pong");
});

// define port
const port = 3000;

// start server
app.listen(port, () => {
  console.log(`🚀 Server started on http://localhost:${port}`);
});

// Express.js server
// app.listen(3000, "0.0.0.0", () => {
//   console.log("Server listening on all IPs!");
// });
