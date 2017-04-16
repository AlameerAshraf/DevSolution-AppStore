'use strict';
var express = require('express');
var path = require('path');
var app = express();

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/Home.html");
})

app.get("/index.html", function (req, res) {
    res.sendFile(__dirname + "/Home.html");
})

app.get("/HomeView", function (req, res) {
    console.log("Home");
    //res.sendFile(__dirname + "./Views/HomeView.html");
})


app.use(express.static("./Static"));

app.listen(1337);
