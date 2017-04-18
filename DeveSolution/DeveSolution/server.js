
var express = require('express');
var mongodb = require('mongodb');
var path = require('path');
var app = express();
var BodyParser = require('body-parser');
var fileUpload = require('express-fileupload');
//var Busboy = require('busboy');

var client = mongodb.MongoClient; 
var dbaccessurl = "mongodb://127.0.0.1:27017/DeveSolutions"; 


app.set("view engine", "ejs");
app.use(BodyParser());
app.use(fileUpload());

client.connect(dbaccessurl, function (err, db) {
    if (err)
    {
        console.log("Error Happend in db");
    }

    else {
     

        var users = db.collection("users");

        //POST signup view ..
        app.post("/signup", function (req, res) {
            var username = req.body.unn;
            var job = req.body.job;
            var mail = req.body.mail;
            var password = req.body.password;
            console.log(username, job, mail, password);


            users.insertOne(
                {
                    "username": username,
                    "password": password,
                    "job": job,
                    "Email": mail
                }
            , function (err, res) {
                if (err)
                {
                    console.log("Nop!");
                }
                else 
                {
                    console.log("Done");
                }
            })
            res.redirect("/login");
        });


        app.post("/login", function (req, res) {
            var mail = req.body.mail;
            var password = req.body.password;


            var promise = new Promise(function (resolve, reject) {
                users.findOne({ "Email": mail }, function (err, res) {
                    if (res != null && res.password == password)
                    {
                        resolve("Done");
                    }
                    else {
                        reject("Bad");
                    }
                })
            })


            promise.then(function (result) {
                res.redirect("/Upload");
            }, function (err) {
                res.redirect("/login")
                });


        });


        


        app.get("/testdb", function (req, res) {
            users.find().toArray(function (err, data) {
                if (err)
                {
                    console.log("err")
                }
                else {
                    console.log(data[0].username);
                }
            })
        })
    }
})





app.get("/", function (req, res) {
    res.render(__dirname + "/Pages/Home.ejs")
})


//GET signup view ..
app.get("/signup", function (req, res) {
    res.render(__dirname + "/Pages/signup.ejs");
})

//GET login view ..
app.get("/login", function (req, res) {
    console.log("get")
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
