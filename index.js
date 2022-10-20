require("dotenv").config();

const express = require("express");

const cors = require("cors");
const dataBaseConnect = require("./database/database");
const cookieParser = require("cookie-parser");;
const fs = require('fs')


const authRoutes = require("./auth/authenticationRoutes");
const postRoutes = require("./post/postRoutes");
const codeRoutes = require("./coderoutes/codeRoutes");


const app = express();
app.use(express.urlencoded());
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin:"http://localhost:3000",
  credentials:true
  
}));

// app.use(dataBaseConnect("mongodb://localhost:27017"));
dataBaseConnect("mongodb://localhost:27017/codingPlatform");

app.get("/", (req, res) => {
  // res.cookie("rk","oishdfhdghodaf");
  res.send("hii");
});



//code routes
app.use("/api/runtimeenv",codeRoutes);

// atuh routes
app.use("/api/auth", authRoutes);

//create post route
app.use("/api/post", postRoutes);



app.listen(5000, () => {
  console.log("app is running on port 5000");
});
