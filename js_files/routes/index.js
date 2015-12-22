var express = require('express');
var router = express.Router();

var isAuthenticated = function (req, res, next) {
	// if user is authenticated in the session, call the next() to call the next request handler 
	// Passport adds this method to request object. A middleware is allowed to add properties to
	// request and response objects
	if (req.isAuthenticated())
		return next();
	// if the user is not authenticated then redirect him to the login page
	res.redirect('/account');
}

module.exports = function(passport){

	/* GET login page. */
	router.get('/account', function(req, res) {
    	// Display the Login page with any flash message, if any
		res.render('index', { message: req.flash('message') });
	});

	/* Handle Login POST */
	router.post('/account/login', passport.authenticate('login', {
		successRedirect: '/home',
		failureRedirect: '/account',
		failureFlash : true  
	}));

	/* GET Registration Page */
	router.get('/account/signup', function(req, res){
		res.render('register',{message: req.flash('message')});
	});

	/* Handle Registration POST */
	router.post('/account/signup', passport.authenticate('signup', {
		successRedirect: '/home',
		failureRedirect: '/account/signup',
		failureFlash : true  
	}));

	/* GET Home Page */
	router.get('/home', isAuthenticated, function(req, res){
		//res.render('home', { user: req.user });
		//res.redirect('/main')
		res.render('indexBootstrap.ejs', {
	        isAuthenticated: req.isAuthenticated(),
	        user: req.user,
	        page: 1
    	});
	});

	/* Handle Logout */
	router.get('/account/signout', function(req, res) {
		req.logout();
		res.redirect('/');
	});

	return router;
}





