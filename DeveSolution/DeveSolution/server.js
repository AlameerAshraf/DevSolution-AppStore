
var express = require('express');

var path = require('path');
var app = express();
var BodyParser = require('body-parser');
var fileUpload = require('express-fileupload');
//var Busboy = require('busboy');





app.set("view engine", "ejs");
app.use(BodyParser());
app.use(fileUpload());

app.get("/", function (req, res) {
    res.render(__dirname + "/Pages/Home.ejs")
})



app.get("/signup", function (req, res) {
    res.render(__dirname + "/Pages/signup.ejs");
})

app.get("/login", function (req, res) {
    res.render(__dirname + "/Pages/login.ejs");
})


app.get("/Upload", function (req, res) {
    res.render(__dirname + "/Pages/Upload.ejs");
})

app.get("/signup.html", function (req, res) {
    console.log("Home");
    res.sendFile(__dirname + "/HomeView.html");
})


// File Uploading ... 
app.post("/UploadFile", function (req, res) {
        console.log("FileToBeUploaded");
        console.log(req.files.VLogo.name);

        sampleFile = req.files.VLogo;

        uploadPath = __dirname + '/Repositorie/' + sampleFile.name;

        sampleFile.mv(uploadPath, function (err) {
            if (err)
                return res.status(500).send(err);

            res.send('File uploaded to ' + uploadPath);
        });
        //console.log(req.files.Source);
        //console.log(req.files.ALogo);
        console.log(req.body.Vsite);

})


app.use(express.static("./Static"));

app.listen(1337);
