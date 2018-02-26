var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');

var admin = require('firebase-admin');
var serviceAccount = require("./serviceAccountKey.json");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://messaging-8f57f.firebaseio.com"
});
var defaultAuth = admin.auth();
var defaultDatabase = admin.database();


var app = express();
app.set('views', __dirname + '/views');
app.set('view engine', 'pug');
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({extended : true}));
app.use(express.json());

app.get('/', function(req, res){
    res.render('index', { title: 'Express' });
});

app.post("/message", function(req, res){
    var title = req.body["title"];
    var body = req.body["body"];
    //console.log(req);
    var notification = {};
    notification.title = title;
    notification.body = body;
    notification.click_action = 'https://google.com';
    message(notification);
});
app.listen(3000,function(){
    console.log("listen");
});



function message(notification){
    var token = "f1mQjOjLvOg:APA91bEZD0t26Zm0RYQDBuV4U_sFewY3p9Uko6kWUxBiCIWqES8_8q01Lc6uDGU22kDLF7i65xcocLjAVrJRC7wXTRf43hKi6NLyuB8m1e2T2Rq2CcrArMxZZz2fG_5scCNvG8ZxR4XR";
    notification.icon = 'logo.png';
    var payload = {
        notification:notification,
        data: {
            score: "850",
            time: "2:45"
        }
    };

    var options = {
        priority: "high",
        timeToLive: 60*60*24
    };

    admin.messaging().sendToDevice(token, payload, options)
        .then(function(response){
            console.log("success: ", response);
        }).catch(function(error){
            console.log("error: ", error);
        });
}



