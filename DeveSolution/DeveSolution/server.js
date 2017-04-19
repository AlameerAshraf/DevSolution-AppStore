
var express = require('express');
var router = express.Router();
var mongodb = require('mongodb');
var url = require('url');
var download = require('download-file');
var session = require('express-session');
var path = require('path');
var app = express();
var BodyParser = require('body-parser');
var fileUpload = require('express-fileupload');
//var Busboy = require('busboy');

var client = mongodb.MongoClient; 
var dbaccessurl = "mongodb://127.0.0.1:27017/DeveSolutions"; 


app.set("view engine", "ejs");
app.use(BodyParser.json());
app.use(BodyParser.urlencoded({ extended: true }));
app.use(fileUpload());
app.use(session({ secret: 'ssshhhhh' }));




var sess; 
app.get('/Stest', function (req, res) {
    sess = req.session;
    sess.name = "Alameer Ashraf";
    res.render(__dirname + "/Pages/Home.ejs")
})    

app.get('/Scome', function (req, res) {
    sess = req.session;
    console.log(sess.name);
})
app.get('/Ssuper', function (req, res) {
    sess = req.session;
    console.log(sess.name);
})




var SessionVar; 

client.connect(dbaccessurl, function (err, db) {
    if (err)
    {
        console.log("Error Happend in db");
    }

    else {
     

        var users = db.collection("users");
        var apps = db.collection("apps");

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

        // POST login view .. 
        app.post("/login", function (req, res) {
            var mail = req.body.mail;
            var password = req.body.password;


            var promise = new Promise(function (resolve, reject) {
                users.findOne({ "Email": mail }, function (err, res) {
                    if (res != null && res.password == password)
                    {
                        resolve(res);
                    }
                    else {
                        reject("Bad");
                    }
                })
            })


            promise.then(function (result) {
                SessionVar = req.session;
                SessionVar.username = result.username;
                console.log(result.username)
                console.log(result);
                res.redirect("/AppFeed");
            }, function (err) {
                res.redirect("/login")
                });


        });


        // File Uploading ... 
        app.post("/UploadFile", function (req, res) {
            var appcode = req.body.Code;
            var Vendor = req.body.Vendor;
            var VedorSite = req.body.Vsite;
            var Description = req.body.Des;
            SessionVar = req.session;

            Vl = req.files.VLogo;
            var Ext = Vl.name.split('.').pop();
            Vl.name = Vendor + "." + Ext;

            VendorLogo = __dirname + '/Repositorie/ImagesRepo/' + Vl.name;
            VendorImage = ".\\ImagesRepo\\" + Vl.name;

            Vl.mv(VendorLogo, function (err) {
                if (err)
                    return res.status(500).send(err);
            });

            Al = req.files.ALogo;
            var Ext1 = Al.name.split('.').pop();
            Al.name = appcode + "." + Ext1;
            AppLogo = __dirname + '/Repositorie/ImagesRepo/' + Al.name;
            ImageApp = ".\\ImagesRepo\\" + Al.name;

            Al.mv(AppLogo, function (err) {
                if (err)
                    return res.status(500).send(err);
            });

            As = req.files.Source;
            var Ext2 = As.name.split('.').pop();
            As.name = appcode+"." + Ext1; 

            AppSource = __dirname + '/Repositorie/FilesRepo/' + As.name;
            AppDownloder = ".\\FilesRepo\\" + As.name;

            As.mv(AppSource, function (err) {
                if (err)
                    return res.status(500).send(err);
            });


            var Doc = {
                "Appcode": appcode,
                "Appvendor": Vendor,
                "Vendorsite": VedorSite,
                "Appsourcelink": AppDownloder,
                "AppImagelink": ImageApp,
                "username": SessionVar.username,
                "Description": Description, 
                "DownlodedLink" : As.name
            };


            var promise = new Promise(function (resolve, reject) {
                console.log("as");
                db.collection('apps').insert(Doc, function (err, records) {
                    if (err)
                        reject("bad");
                    else
                        resolve("done");
                });
            })

           
        


            promise.then(function (result) {
                res.render(__dirname + "/Pages/UploadDone.ejs", {
                    username: SessionVar.username,
                    AC: appcode,
                    V: Vendor,
                    VPS: VedorSite,
                    DES: Description
                })
            }, function (err) {
                res.redirect('/Upload')
            });

          

        })


        //Return all apps .. 
        app.get("/Applications", function (req, res) {
            db.collection('apps').find().toArray(function (err, collInfos) {
                res.send(collInfos);
            });
        })

        //Get 
        app.get(new RegExp("apps(\\.(?:htm|html))?(\\?.*)?$"), function (req, res) {
            SessionVar = req.session;

            var queryData = url.parse(req.url, true).query;

            var Code = queryData.Code;
            console.log(Code)
            var promise = new Promise(function (resolve, reject) {
                db.collection("apps").findOne({ "Appcode": Code }, function (err, res) {
                    if (res != null) {
                        resolve(res);
                    }
                    else {
                        reject("Bad");
                    }
                })
            })


            promise.then(function (result) {
                //SessionVar = req.session;
                //SessionVar.username = result.username;
                //console.log(result.username)
                //console.log(result);
                //res.redirect("/AppFeed");

                res.render(__dirname + "/Pages/AppView.ejs", {
                    username: SessionVar.username,
                    AppImagelink: result.AppImagelink,
                    vendor: result.Appvendor,
                    Appcode: result.Appcode,
                    Description: result.Description,
                    Download: "http://localhost:1337/Download?Code=" + result.Appcode
                })
                console.log(result);
            }, function (err) {
                res.redirect("/login")
            });



        })


        // Download .. 
        app.get(new RegExp("Download(\\.(?:htm|html))?(\\?.*)?$"), function (req, res, next) {
            var queryData = url.parse(req.url, true).query;
            var Code = queryData.Code;
            var promise = new Promise(function (resolve, reject) {
                db.collection("apps").findOne({ "Appcode": Code }, function (err, res) {
                    if (res != null) {
                        resolve(res);
                    }
                    else {
                        reject("Bad");
                    }
                })
            })


            promise.then(function (result) {
                path = __dirname + '/Repositorie/FilesRepo/' + result.DownlodedLink;
                res.download(path);
               // res.send("A");
            }, function (err) {
                res.redirect("/login")
                });
            

            
        });

        app.use(function (err, req, res, next) {
            // special-case 404s,
            // remember you could
            // render a 404 template here
            if (404 == err.status) {
                res.statusCode = 404;
                res.send('Cant find that file, sorry!');
            } else {
                res.send("as")
                next(err);
            }
        });

      


      
        
    }
})

//promise.then(function (result) {
//    var filepath = result.Appsourcelink;
//    var filename = result.Appcode;
//    res.download(filepath.filename);
//})
//        }, function (err) {
//    res.redirect("/login")
//});


app.get("/AppFeed", function (req, res) {
    SessionVar = req.session;

    res.render(__dirname + "/Pages/Feed.ejs", {
        username: SessionVar.username
    })
})


app.get("/", function (req, res) {
    res.render(__dirname + "/Pages/Home.ejs")
})

app.get("/index", function (req, res) {
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
    SessionVar = req.session;
    
    res.render(__dirname + "/Pages/Upload.ejs", {
        username: SessionVar.username
    });
})

app.get("/UploadRecept", function (req, res) {
    res.render(__dirname + "/Pages/UploadDone.ejs")
})





app.use(express.static("./Static"));
app.use(express.static("./Repositorie"));

app.listen(1337);
