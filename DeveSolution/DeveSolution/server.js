'use strict';
var express = require('express');
var path = require('path');
var app = express();



app.set("view engine", "ejs");



app.get("/", function (req, res) {
    res.render(__dirname + "/Pages/Home.ejs")
})



app.get("/signup", function (req, res) {
    res.render(__dirname + "/Pages/signup.ejs");
})

app.get("/login", function (req, res) {
    res.render(__dirname + "/Pages/login.ejs");
})

app.get("/signup.html", function (req, res) {
    console.log("Home");
    res.sendFile(__dirname + "/HomeView.html");
})


app.use(express.static("./Static"));

app.listen(1337);
