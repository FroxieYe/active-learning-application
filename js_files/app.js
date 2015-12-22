var express = require('express');
var path = require('path');
var fs = require('fs');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var User = require('./models/user');
var helper = require('./public/js/getQuestionWindow.js');
var uploadDone=false;

var dbConfig = require('./db');
var mongoose = require('mongoose');
// Connect to DB
mongoose.connect(dbConfig.url);
var db = mongoose.connection;
db.on('error', console.error);

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Configuring Passport
var passport = require('passport');
var expressSession = require('express-session');
// TODO - Why Do we need this key ?
app.use(expressSession({secret: 'mySecretKey'}));
app.use(passport.initialize());
app.use(passport.session());

var Schema = mongoose.Schema;
var schema = new Schema({
    id: String,
    photo: {
        data: Buffer,
        contentType: String
    },
    NV: Number,
    NYYes: Number,
    QSO: Number,
    QSOYes: Number,
    BE: Number,
    BEYes: Number,
    CEPH: Number,
    CEPHYes: Number,
    RRL: Number,
    RRLYes: Number,
    EB: Number,
    EBYes: Number,
    ML: Number,
    MLYes: Number,
    LPV: Number,
    LPVYes: Number,
    isLabel: Number,
    Label: String
});

var profilePic = "img/silhouette.jpg";

var Photo = mongoose.model('Photo', schema);

 // Using the flash middleware provided by connect-flash to store messages in session
 // and displaying in templates
var flash = require('connect-flash');
app.use(flash());

// Initialize Passport
var initPassport = require('./passport/init');
initPassport(passport);

var routes = require('./routes/index')(passport);
app.use('/', routes);

app.get('/', function (req, res) {
    res.render('indexBootstrap.ejs', {
        isAuthenticated: req.isAuthenticated(),
        user: req.user,
        page: 1
    });
});

app.get('/contact', function (req, res) {
    res.render('indexBootstrap.ejs', {
        isAuthenticated: req.isAuthenticated(),
        user: req.user,
        page: 6
    });
});

app.get('/statistics', function (req, res) {
    res.render('visualization.ejs', {
        isAuthenticated: req.isAuthenticated(),
    })
})

app.get('/demo_1', function (req, res) {
    res.render('demo.ejs', {
        page: 1
    });
});

app.get('/demo_2', function (req, res) {
    res.render('demo.ejs', {
        page: 2
    });
});

app.get('/about', function (req, res) {
    res.render('indexBootstrap.ejs', {
        isAuthenticated: req.isAuthenticated(),
        user: req.user,
        page: 5
    });
});

var cur;
var labels = ['NV', 'QSO', 'BE', 'CEPH', 'RRL', 'EB', 'ML', 'LPV'];

/*
This list should be put into a separate json file and will be updated as we add more time series
to the database.
*/
var id_list = 
['BE14530136R',
 'BE14653105B',
 'CEPH1344813B',
 'CEPH1344962R',
 'EB13444614B',
 'EB13444880R',
 'LPV1345053B',
 'LPV135617R',
 'ML101209081433B',
 'ML101209102922R',
 'QSO135962237B',
 'QSO136805324R',
 'RRL134431313B',
 'RRL134431335R']

var ry = Math.floor((Math.random() * id_list.length));
var surveyLabel = Math.floor((Math.random() * labels.length));
var count = 0;
var num_questions = 5;

app.get('/survey', function (req, res, next){
    Photo.find({id: id_list[ry]}, function (err, doc) {
        if (doc.length) {
            count += 1
            if (err) return next(err);
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.write('<html><body background="img/surveyBackground.jpg">');
            res.write('<center><text font-family="cursive">');
            res.write(labels[surveyLabel]);
            cur = labels[surveyLabel];
            res.write('</text></center>')
            res.write('<img style="display: block; margin-top: 2%; margin-left: auto; margin-right: auto" src="data:image/png;base64,');
            res.write(new Buffer(doc[0].photo.data).toString('base64'));
            res.write('"/ border = 0 width = "550"></body>');
            res.write('<form action = "/survey" method = "post">');
            res.write('<div><input style="margin-left: 20%" type = "radio" name = "picture" value = "Y">');
            res.write('Yes');
            res.write('</input>');
            res.write('<input style="margin-left: 55%" type = "radio" name = "picture" value = "N">');
            res.write('No');
            res.write('</input><br>');
            res.write('</div>');
            if (count < 5) {
                res.write('<div><center><label><input type="submit" value = "Next"></center></div>');
            }
            else {
                res.write('<div><center><label><input type="submit" value = "Finish"></center></div>');
            }
            res.write('</form>');
            res.write('</html>');
            
            //res.render("survey.ejs");
        } else {
          console.log("Cannot find any time series graph...");
        }
    });
});

app.get('/profile', function (req, res) {
    res.render('profile.ejs', {
        isAuthenticated: req.isAuthenticated(),
        user: req.user,
        pic: profilePic
    });
})

app.post('/survey', function (req, res) {
    Photo.findOne({id: id_list[ry]}, function (err, doc) {
        if (err) return next(err);
        doc[cur] += 1;
        if (req.body.picture == "Y") doc[cur + "Yes"] += 1;
        doc.save(function (err) {
            if (err)
            {
                // TODO: Handle the error!
            }
        });
        if (doc["isLabel"] == 1) {
            req.user["numResponse"] += 1;
            if (req.body.picture == "Y" && cur == doc["Label"]) req.user["correctResponse"] += 1;
            if (req.body.picture == "N" && cur != doc["Label"]) req.user["correctResponse"] += 1;
            req.user.save(function(err) {})
        }

    });

    ry = Math.floor((Math.random() * id_list.length));
    surveyLabel = Math.floor((Math.random() * labels.length));
    if (count < num_questions) {
        res.redirect('/survey');
    }
    else {
        console.log(count)
        count = 0;
        res.redirect('/');
    }
});

app.get('/tutorial', function (req, res) {
    res.render("tutorial.ejs");
})

/// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

module.exports = app;

var port = process.env.PORT || 1337

app.listen(8000, function() {
    console.log('http://127.0.0.1' + port + '/');
}) 
