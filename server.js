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
};

var db = pgp(dbConfig);

module.exports = {
	query: (text, params, callback) => {
		return pool.query(text, params, callback)
	}
}

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/'));//This line is necessary for us to use relative paths and access our resources directory




// login page 


app.get('/', function(req, res) {
	
	res.render('pages/login',{
		local_css:"signin.css",
		my_title:"Login Page",
		login_query: '',
		message:''
		//loginCheck: '',
		
	});
	
});



app.get('/login',async function(req, res) {

    //var email=req.body.email;
    //var password=req.body.password;
    var inputEmail=req.query.email;
    console.log("email:");
    console.log(inputEmail);
    var inputPassword=req.query.password;
    console.log("pass:");
    console.log(inputPassword);

    if(inputEmail==''||inputPassword==''){
         res.render('pages/login',{
         my_title:"Log in Page",
         message:"Both email and password are required."
       });
    }
    else{
    	var login_query = "SELECT user_password FROM login_table WHERE user_email='"+inputEmail+"';";
		console.log("loginquery:");
		console.log(login_query);
        db.any(login_query).then(function(result){
        	console.log(result[0].user_password);
            if(result[0].user_password!=inputPassword){
               res.render('pages/login',{
               my_title:"Log in Page",
               message:"Incorrect password. Please try again."
               })
            }
            else{
               res.render('pages/home',{
               my_title:"Home Page"
            })
            
        }
    })
    .catch(function(err){
        res.render('pages/login',{
           my_title:"Log in Page",
           message:""
       });
    })
}
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