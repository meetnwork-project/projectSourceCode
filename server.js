var express = require('express'); //Ensure our express framework has been added
var app = express();
var bodyParser = require('body-parser'); //Ensure our body-parser tool has been added
app.use(bodyParser.json());              // support json encoded bodies
//app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

var pgp = require('pg-promise')();

//EDIT BY LAUREN
var app = express();
const PORT = process.env.PORT || 5432;
//require('dotenv').config();
var flash = require('connect-flash');
var passport = require("passport");
var request = require('request');
//var session = require("express-session");
var path = require('path');
app.use(require('body-parser').urlencoded({extended: true}));
//const expressSession = require('express-session');
app.use(passport.initialize());
//app.use('/public', express.static(__dirname + '/public'));
app.use(flash());
//app.use(session({secret:'keyboard cat'}))
//app.use(bodyParser());
app.set('view engine', 'pug');
app.set('view options', {layout: false});
const LocalStrategy = require('passport-local').Strategy;
//require('.lib/routes.js')(app);
app.use(passport.initialize())
app.use(passport.session())

var app = express();
var passport = require('passport');


// ----------------------------------




const dbConfig = {
   host: 'localhost',
   port: 5432,
   database: 'meetnwork_db',
   //user: 'postgres',
   user: 'last6351',
   password: 'Y4ngchun99+'
   //password: config.db.password
};

var db = pgp(dbConfig);

module.exports = {
	query: (text, params, callback) => {
		return pool.query(text, params, callback)
	}
}


app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/'));//This line is necessary for us to use relative paths and access our resources directory


// app.post('/register',function(req,res)){//the post of register page
// 	var user_name=req.body.user_name;
// 	var user_email=req.body.user_email;
// 	var user_password=req.body.user_password;
// 	var user_first_name=req.body.user_first_name;
// 	var user_last_name=req.body.user_last_name;
// 	var major=req.body.M_choice;
// 	var year=req.body.Y_choice;
// 	var class=req.body.C_choice;
// 	var login_info="INSERT INTO login_table(user_name, user_email, user_password)VALUES('" + user_name + "','" + user_email + "','" + user_password +"') ON CONFLICT DO NOTHING;";
// 	var user_info="INSERT INTO user_table(first_name, last_name, major, year, classes, status)VALUES('" + user_first_name + "','" + user_last_name + "') ON CONFLICT DO NOTHING;";
// 	// the var user_info is uncompleted because we lack of year, major ,and class

// 	db.task('get-everything', task =>{
// 		return task.batch([
// 		task.any(login_info),
// 		task.any(user_info)
// 		]);
// 	})
//    .then(info =>{
// 	   res.render('/register',{
// 		   my_title: "register page",
// 		   //uncompleted
// 	   })
//    })
//    .catch(error =>{
// 	   request.flash('error, err');
// 	   response.render('/register',{
// 		   my_title:'register page',
// 		   //uncompleted
// 	   })
//    })
// }

// app.get('/logpage',function(req,res){
// 	var user_id=req.body.user_name;
// 	var user_password=req.body.user_password;
// 	var login ="select * from login_table where user_name='"+user_id+"'";
// 	db.any(login).then(function(/*what function we should use?*/){
// 		res.render('/logpage',{
// 			title:'log in page',
// 			//uncompleted
// 		})
// 	})
// 	.catch(function(err){
// 		request.flash('error',err);
// 		response.render('/logpage',{
// 			title:'log in page',
// 			//not complete
// 		})
// 	})
// })


// login page 

app.get('/', function(req, res, next) {
	/*
	res.render('pages/login',{
		local_css:"signin.css",
		my_title:"Login Page",
		loginInfo: '',
		loginCheck: '',
		passInfo: ''
	});
	*/
	res.render('pages/login', 
		{title: "Login", userData: req.user, messages: 
		{danger: flash('danger'), warning: flash('warning'), 
		success: flash('success')}});
	console.log(req.user);
});
app.get('/login', function(req,res,next){
	if(req.isAuthenticated()){
		res.redirect('/home');
	}
	else{
		res.render('pages/login', {title: "Log in", userData: req.user, messages:
		{danger: flash('danger'), warning: flash('warning'),
		success: flash('success')}});
	}
});

app.post('/login', passport.authenticate('local', {
 successRedirect: '/home',
 failureRedirect: '/login',
 failureFlash: true
 }), function(req,res){
	if(req.body.remember){
		req.session.cookie.maxAge = 30*24*60*60*1000;
	} else{
		req.session.cookie.expires= false;
	}
	res.redirect('/home');
}
	
);


passport.use(new LocalStrategy({passReqToCallback : true}, (req, user_name, user_password, done) => {
 loginAttempt();
 async function loginAttempt() {
	 const client = await pool.connect()
	 try{
		 await client.query('BEGIN')
		 var currentAccountsData = await JSON.stringify(client.query('SELECT user_email, user_password FROM login_table WHERE user_email=$2', [user_email], function(err, result) {
			 if(err) {
			 	return done(err)
			 } 
			 if(result.rows[0] == null){
			 	flash('danger', "Oops. Incorrect login details.");
			 	return done(null, false);
			 }
			 else{
			 	compare(user_password, result.rows[0].user_password, function(err, check) {
				 	if (err){
				 		console.log('Error while checking password');
				 		return done();
				 	}
				 else if (check){
				 	return done(null, [{user_email: result.rows[0].user_email, user_name: result.rows[0].user_name}]);
				 }
				 else{
				 	flash('danger', "Oops. Incorrect login details.");
				 	return done(null, false);
				 }	
			 	});
			 }	
		 }))	
	 }
	 catch(e){throw (e);}
 }; 
}))
passport.serializeUser(function(user, done) {
 done(null, user);
});
passport.deserializeUser(function(user, done) {
 done(null, user);
});




/*
app.get('/login/submit', function(req, res) {
	var inputEmail = req.query.email;
	console.log(inputEmail);
	var inputPassword = req.query.password;
	console.log(inputPassword);

	var loginInfo = 'SELECT user_email FROM login_table WHERE user_email = ' + inputEmail+';';
	console.log(loginInfo);

	var loginCheck = 'SELECT user_name FROM user_table WHERE user_name = ' + loginInfo+';';
	console.log(loginCheck);

	var passInfo = 'SELECT user_password FROM login_table WHERE user_email = ' + inputEmail+';';
	console.log(passInfo);

	db.any('get-everything', task => {
		return task.batch([
			task.any(loginInfo),
			task.any(loginCheck),
			task.any(passInfo)
		]);
	})

		.then(info =>{
			res.render('pages/login',{
			local_css:"signin.css", 
			my_title:"Login Page",
			loginInfo: info[0],
			loginCheck: info[1],
			passInfo: info[2]
			})
		})
	
	
		.catch(error => {
			request.flash('error', err);
			response.render('pages/login',{
				title:'Login Page',
				loginInfo: '',
				loginCheck: '',
				passInfo: ''
			})
		})
	
});
*/

// registration page 
app.get('/register', function(req, res) {
	res.render('pages/register',{
		my_title:"Registration Page"
	});
});

// profile page
app.get('/profile', function(req, res) {
	res.render('pages/profile',{
		my_title:"Profile Page"
	});
});

//edit profile page
/*
app.get('/profile_edit', function(req, res) {
	res.render('pages/profile_edit',{
		my_title:"Edit Profile Page"
	});
});

// home page

app.get('/home', function(req, res) {
	var query = 'select classes from user_table ';
	query += "WHERE first_name = 'Elizabeth';";
	console.log(query);

	db.any(query)
    .then(function (rows) {
    	console.log(rows)
        res.render('pages/home',{
			my_title: 'Home Page',
			data: rows
		})

    })
    .catch(function (err) {
        // display error message in case an error
        request.flash('error', err);
        response.render('pages/home', {
            title: 'Home Page',
            data: ''
        })
    });
	
});
*/
app.get('/home', function(req,res) {
	res.render('pages/home',{
		title:"Home Page"
	});
});


app.listen(3000);
console.log('3000 is the magic port');