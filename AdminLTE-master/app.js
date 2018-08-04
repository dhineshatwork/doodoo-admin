var express = require("express");
var swig = require("swig");
var bodyParser = require("body-parser");
var cons = require('consolidate');
var path = require('path');

var app = express();
app.engine('html', cons.swig)
app.set('view engine','html');
//app.set('views',__dirname+'/views');
app.use(express.static(path.join(__dirname)));
//app.use(bodyParser.urlencoded({extended: false}));
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8888');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

app.get('/',function(req,res){
    res.render('index');
})


console.log("listening...",process.env.PORT )
app.listen(process.env.PORT || 2018)
/*app.listen(2018,function(req,res){
    console.log("listening...")
})*/