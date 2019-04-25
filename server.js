var express = require('express'); //Ensure our express framework has been added
var app = express();
var bodyParser = require('body-parser'); //Ensure our body-parser tool has been added
app.use(bodyParser.json());              // support json encoded bodies
//app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

var pgp = require('pg-promise')();


const dbConfig = {
   host: 'localhost',
   port: 5432,
   database: 'meetnwork_db',
   user: 'postgres',
   password: 'pass'
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




// login page 


app.get('/', function(req, res) {
	
	res.render('pages/login',{
		local_css:"signin.css",
		my_title:"Login Page",
		loginInfo: '',
		//loginCheck: '',
		passInfo: ''
	});
	
});


app.get('/login', function(req, res) {
	
	res.render('pages/login',{
		local_css:"signin.css",
		my_title:"Login Page",
		loginInfo: '',
		//loginCheck: '',
		passInfo: ''
	});
});


app.get('/login/submit', function(req, res) {
	var inputEmail = req.query.email;
	console.log(inputEmail);
	var inputPassword = req.query.password;
	console.log(inputPassword);

	//var loginInfo = "SELECT user_email FROM login_table WHERE user_email =' '"+ inputEmail+"';";
	var loginInfo = "SELECT user_email FROM login_table WHERE user_email='"+inputEmail+"';";
	console.log(loginInfo);

	//var loginCheck = 'SELECT user_name FROM user_table WHERE user_name = ' + loginInfo+';';
	//console.log(loginCheck);

	//var passInfo = "SELECT user_password FROM login_table WHERE user_email =' '"+ inputEmail+"';";
	var passInfo = "SELECT user_password FROM login_table WHERE user_email='"+inputEmail+"';";
	console.log(passInfo);

	db.task('get-everything', task => {
		return task.batch([
			task.any(loginInfo),
			//task.any(loginCheck),
			task.any(passInfo)
		]);
	})
	if(inputEmail==loginInfo){
		res.render('pages/home',{
			my_title: "Login Page"
		});
	}
	else{
		//console.log(inputEmail);
		console.log("login info:");
		console.log(loginInfo);
		db.any(loginInfo)
		.then(function(result){
			res.render('pages/login',{
				my_title:"Login page",
				loginInfo:'',
				passInfo: ''
			})
		})
		.catch(function(err){
			console.log("error");
			res.render('pages/login',{
				title:"Login page",
				loginInfo:'',
				passInfo:''
			})
		});

	}
	/*
		.then(info =>{
			res.render('pages/home',{
			local_css:"signin.css", 
			my_title:"Login Page",
			data: info[0],
			loginInfo: info[1],
			//loginCheck: info[1],
			passInfo: info[2]
			})
		})
	
		.catch(function(err){
			//req.flash('error', err);
			//console.log("error loading");
			res.render('pages/login',{
				title:'Login Page',
				loginInfo: '',
				//loginCheck: '',
				passInfo: ''
			});
		});
	*/
});

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

app.get('/profile_edit', function(req, res) {
	res.render('pages/profile_edit',{
		my_title:"Edit Profile Page"
	});
});

// home page
/*
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