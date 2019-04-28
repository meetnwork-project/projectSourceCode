var express = require('express'); //Ensure our express framework has been added
var app = express();
var bodyParser = require('body-parser'); //Ensure our body-parser tool has been added

var cookieParser = require('cookie-parser');
app.use(cookieParser());

app.use(bodyParser.json());              // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

var pgp = require('pg-promise')();

const dbConfig = {
	host: 'localhost',
	port: 5432,
	database: 'meetnwork_db',
	user: 'postgres',
	password: 'user'
};

var db = pgp(dbConfig);


module.exports = {//Lauren
	query: (text, params, callback) => {
		return pool.query(text, params, callback)
	}
}

app.set('views', __dirname + '/views');//Lauren

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/'));//This line is necessary for us to use relative paths and access our resources directory


// login page 


app.get('/', function(req, res) {
	res.render('pages/login',{
		// local_css:"signin.css",
		my_title:"Login Page",
		// login_query: '',
		message:''
		//loginCheck: '',
	});
});

app.get('/login', function(req, res) {

    //var email=req.body.email;
    //var password=req.body.password;
    var inputEmail=req.query.email;
    var inputPassword=req.query.password;

    if(inputEmail==''||inputPassword==''){
         res.render('pages/login',{
         my_title:"Log in Page",
         message:"Both email and password are required."
       });
    }
    else{
    	var login_query = "SELECT user_password FROM login_table WHERE user_email='"+inputEmail+"';";
        db.any(login_query).then(function(result){
            if(result[0].user_password!=inputPassword){
               res.render('pages/login',{
               my_title:"Log in Page",
               message:"Incorrect password. Please try again."
               })
            }
            else{
                res.cookie('name', inputEmail);
				var current_user_email = req.cookies['name'];

				var current_user_name = "SELECT user_table.first_name, user_table.last_name FROM user_table INNER JOIN login_table ON(user_table.user_name = ";
				current_user_name += "login_table.user_name) WHERE login_table.user_email = '"+current_user_email+"';";

				var current_user_id = "SELECT user_table.user_id FROM user_table INNER JOIN login_table ON(user_table.user_name = ";
				current_user_id += "login_table.user_name) WHERE login_table.user_email = '"+current_user_email+"';";

				var all_classes = 'SELECT class_name FROM class_table;';

				var user_todo_classes = 'SELECT classes FROM user_todos WHERE user_id = ANY(';
				user_todo_classes += "SELECT user_table.user_id FROM user_table INNER JOIN login_table ON(user_table.user_name = ";
				user_todo_classes += "login_table.user_name) WHERE login_table.user_email = '"+current_user_email+"');";

				var other_users = 'SELECT user_todos.user_id, todos, user_todos.classes , first_name, last_name, ';
				other_users += 'user_todos.location, user_todos.location_desc ';
				other_users += 'FROM user_todos INNER JOIN user_table ON (user_todos.user_id = user_table.user_id)';
				other_users += 'WHERE user_todos.classes && ';
				other_users += 'ANY(SELECT classes FROM user_todos WHERE user_id = ANY(';
				other_users += "SELECT user_table.user_id FROM user_table INNER JOIN login_table ON(user_table.user_name = ";
				other_users += "login_table.user_name) WHERE login_table.user_email = '"+current_user_email+"'));";
				
				var all_user_classes = 'SELECT classes FROM user_table WHERE user_id = ANY(';
				all_user_classes += "SELECT user_table.user_id FROM user_table INNER JOIN login_table ON(user_table.user_name = ";
				all_user_classes += "login_table.user_name) WHERE login_table.user_email = '"+current_user_email+"');";



				db.task('get-everything', task =>{
						return task.batch([
						task.any(current_user_name),
						task.any(current_user_id),
						task.any(all_classes),
						task.any(user_todo_classes),
						task.any(other_users),
						task.any(all_user_classes)
						]);
					})
				.then(info =>{
				   res.render('pages/home',{
					   my_title: "Home Page",
					   data: info[2],
					   my_data: info[3],
					   other_userdata: info[4],
					   user_classes:info[5],
					   curr_users_name:info[0],
					   curr_users_id:info[1]
				   })
			   })
				.catch(error =>{
				   request.flash('error, err');
				   response.render('pages/home',{
					   my_title:'Home Page',
					   data : '',
					   my_data: '',
					   other_userdata: '',
					   user_classes:'',
					   curr_users_name:'',
					   curr_users_id:''
				   })
            })
            
        }
    })
    .catch(function(err){
        res.render('pages/login',{
           my_title:"Log in Page",
           message:""
       });
    });
}
});


// home page

app.get('/home', function(req, res) {

	var current_user_email = req.cookies['name'];

	var current_user_name = "SELECT user_table.first_name, user_table.last_name FROM user_table INNER JOIN login_table ON(user_table.user_name = ";
	current_user_name += "login_table.user_name) WHERE login_table.user_email = '"+current_user_email+"';";

	var current_user_id = "SELECT user_table.user_id FROM user_table INNER JOIN login_table ON(user_table.user_name = ";
	current_user_id += "login_table.user_name) WHERE login_table.user_email = '"+current_user_email+"';";

	var all_classes = 'SELECT class_name FROM class_table;';

	var user_todo_classes = 'SELECT classes FROM user_todos WHERE user_id = ANY(';
	user_todo_classes += "SELECT user_table.user_id FROM user_table INNER JOIN login_table ON(user_table.user_name = ";
	user_todo_classes += "login_table.user_name) WHERE login_table.user_email = '"+current_user_email+"');";

	var other_users = 'SELECT user_todos.user_id, todos, user_todos.classes , first_name, last_name, ';
	other_users += 'user_todos.location, user_todos.location_desc ';
	other_users += 'FROM user_todos INNER JOIN user_table ON (user_todos.user_id = user_table.user_id)';
	other_users += 'WHERE user_todos.classes && ';
	other_users += 'ANY(SELECT classes FROM user_todos WHERE user_id = ANY(';
	other_users += "SELECT user_table.user_id FROM user_table INNER JOIN login_table ON(user_table.user_name = ";
	other_users += "login_table.user_name) WHERE login_table.user_email = '"+current_user_email+"'));";
	
	var all_user_classes = 'SELECT classes FROM user_table WHERE user_id = ANY(';
	all_user_classes += "SELECT user_table.user_id FROM user_table INNER JOIN login_table ON(user_table.user_name = ";
	all_user_classes += "login_table.user_name) WHERE login_table.user_email = '"+current_user_email+"');";



	db.task('get-everything', task =>{
			return task.batch([
			task.any(current_user_name),
			task.any(current_user_id),
			task.any(all_classes),
			task.any(user_todo_classes),
			task.any(other_users),
			task.any(all_user_classes)
			]);
		})
	.then(info =>{
	   res.render('pages/home',{
		   my_title: "Home Page",
		   data: info[2],
		   my_data: info[3],
		   other_userdata: info[4],
		   user_classes:info[5],
		   curr_users_name:info[0],
		   curr_users_id:info[1]
	   })
   })
   .catch(error =>{
	   request.flash('error, err');
	   response.render('pages/home',{
		   my_title:'Home Page',
		   data : '',
		   my_data: '',
		   other_userdata: '',
		   user_classes:'',
		   curr_users_name:'',
		   curr_users_id:''
	   })
   })
});

//On homepage, updates status, location, and 'how can I find you?'
app.post('/home/status', function(req, res) {
  var location = req.body.location;
  var location_desc = req.body.location_desc;
  var current_user_email = req.cookies['name'];

  var insert_statement = "UPDATE user_todos SET location = '"+location+"' WHERE user_id = ";
  insert_statement += "(SELECT user_table.user_id FROM user_table INNER JOIN login_table ON(user_table.user_name = ";
  insert_statement += "login_table.user_name) WHERE login_table.user_email = '"+current_user_email+"');";

  var insert_statement2 = "UPDATE user_todos SET location_desc = '"+location_desc+"' WHERE user_id = ";
  insert_statement2 += "(SELECT user_table.user_id FROM user_table INNER JOIN login_table ON(user_table.user_name = ";
  insert_statement2 += "login_table.user_name) WHERE login_table.user_email = '"+current_user_email+"');";
  
  console.log(insert_statement)
  db.task('get-everything', task => {
        return task.batch([
            task.any(insert_statement),
            task.any(insert_statement2)
        ]);
    })
    var current_user_name = "SELECT user_table.first_name, user_table.last_name FROM user_table INNER JOIN login_table ON(user_table.user_name = ";
	current_user_name += "login_table.user_name) WHERE login_table.user_email = '"+current_user_email+"';";

	var current_user_id = "SELECT user_table.user_id FROM user_table INNER JOIN login_table ON(user_table.user_name = ";
	current_user_id += "login_table.user_name) WHERE login_table.user_email = '"+current_user_email+"';";

	var all_classes = 'SELECT class_name FROM class_table;';

	var user_todo_classes = 'SELECT classes FROM user_todos WHERE user_id = ANY(';
	user_todo_classes += "SELECT user_table.user_id FROM user_table INNER JOIN login_table ON(user_table.user_name = ";
	user_todo_classes += "login_table.user_name) WHERE login_table.user_email = '"+current_user_email+"');";

	var other_users = 'SELECT user_todos.user_id, todos, user_todos.classes , first_name, last_name, ';
	other_users += 'user_todos.location, user_todos.location_desc ';
	other_users += 'FROM user_todos INNER JOIN user_table ON (user_todos.user_id = user_table.user_id)';
	other_users += 'WHERE user_todos.classes && ';
	other_users += 'ANY(SELECT classes FROM user_todos WHERE user_id = ANY(';
	other_users += "SELECT user_table.user_id FROM user_table INNER JOIN login_table ON(user_table.user_name = ";
	other_users += "login_table.user_name) WHERE login_table.user_email = '"+current_user_email+"'));";
	
	var all_user_classes = 'SELECT classes FROM user_table WHERE user_id = ANY(';
	all_user_classes += "SELECT user_table.user_id FROM user_table INNER JOIN login_table ON(user_table.user_name = ";
	all_user_classes += "login_table.user_name) WHERE login_table.user_email = '"+current_user_email+"');";



	db.task('get-everything', task =>{
			return task.batch([
			task.any(current_user_name),
			task.any(current_user_id),
			task.any(all_classes),
			task.any(user_todo_classes),
			task.any(other_users),
			task.any(all_user_classes)
			]);
		})
	.then(info =>{
	   res.render('pages/home',{
		   my_title: "Home Page",
		   data: info[2],
		   my_data: info[3],
		   other_userdata: info[4],
		   user_classes:info[5],
		   curr_users_name:info[0],
		   curr_users_id:info[1]
	   })
   })
   .catch(error =>{
	   request.flash('error, err');
	   response.render('pages/home',{
		   my_title:'Home Page',
		   data : '',
		   my_data: '',
		   other_userdata: '',
		   user_classes:'',
		   curr_users_name:'',
		   curr_users_id:''
	   })
   })
});


app.post('/home/todos', function(req, res) {//in an ideal world, this would be dynamic
	var classes = [];
	var todos =[];
	if(req.body.class1!=undefined && req.body.class1!=''){
		var class1 = req.body.class1;
		classes.push(1);
		todos.push(class1.toString());

	}
	if(req.body.class2!=undefined && req.body.class2!=''){
		var class2 = req.body.class2;
		classes.push(2);
		todos.push(class2.toString());

	}
	if(req.body.class3!=undefined && req.body.class3!=''){
		var class3 = req.body.class3;
		todos.push(class3.toString());
		classes.push(3);

	}
	if(req.body.class4!=undefined && req.body.class4!=''){
		var class4 = req.body.class4;
		classes.push(4);
		todos.push(class4.toString());

	}

  // var insert_statement = 'INSERT INTO user_todos (todos) VALUES('+todos+')';
  // insert_statement += ' WHERE user_id = 11;';

  var current_user_email = req.cookies['name'];
  var insert_statement = 'UPDATE user_todos SET todos = ARRAY[';
  var length = todos.length;
  var i = 1;
  todos.forEach(function(each_todo){
  		insert_statement += "'"+each_todo+"'";
  		if(i != length){
  			insert_statement += ', ';
  		}
  		i +=1;
  	});
  insert_statement += '] WHERE user_id = ';
  insert_statement += "(SELECT user_table.user_id FROM user_table INNER JOIN login_table ON(user_table.user_name = ";
  insert_statement += "login_table.user_name) WHERE login_table.user_email = '"+current_user_email+"');";

  var insert_statement2 = "UPDATE user_todos SET classes = ARRAY["+classes+"] WHERE user_id = ";
  insert_statement2 += "(SELECT user_table.user_id FROM user_table INNER JOIN login_table ON(user_table.user_name = ";
  insert_statement2 += "login_table.user_name) WHERE login_table.user_email = '"+current_user_email+"');";
  

  console.log(insert_statement)
  db.task('get-everything', task => {
        return task.batch([
            task.any(insert_statement),
            task.any(insert_statement2)
        ]);
    })
  var current_user_name = "SELECT user_table.first_name, user_table.last_name FROM user_table INNER JOIN login_table ON(user_table.user_name = ";
	current_user_name += "login_table.user_name) WHERE login_table.user_email = '"+current_user_email+"';";

	var current_user_id = "SELECT user_table.user_id FROM user_table INNER JOIN login_table ON(user_table.user_name = ";
	current_user_id += "login_table.user_name) WHERE login_table.user_email = '"+current_user_email+"';";

	var all_classes = 'SELECT class_name FROM class_table;';

	var user_todo_classes = 'SELECT classes FROM user_todos WHERE user_id = ANY(';
	user_todo_classes += "SELECT user_table.user_id FROM user_table INNER JOIN login_table ON(user_table.user_name = ";
	user_todo_classes += "login_table.user_name) WHERE login_table.user_email = '"+current_user_email+"');";

	var other_users = 'SELECT user_todos.user_id, todos, user_todos.classes , first_name, last_name, ';
	other_users += 'user_todos.location, user_todos.location_desc ';
	other_users += 'FROM user_todos INNER JOIN user_table ON (user_todos.user_id = user_table.user_id)';
	other_users += 'WHERE user_todos.classes && ';
	other_users += 'ANY(SELECT classes FROM user_todos WHERE user_id = ANY(';
	other_users += "SELECT user_table.user_id FROM user_table INNER JOIN login_table ON(user_table.user_name = ";
	other_users += "login_table.user_name) WHERE login_table.user_email = '"+current_user_email+"'));";
	
	var all_user_classes = 'SELECT classes FROM user_table WHERE user_id = ANY(';
	all_user_classes += "SELECT user_table.user_id FROM user_table INNER JOIN login_table ON(user_table.user_name = ";
	all_user_classes += "login_table.user_name) WHERE login_table.user_email = '"+current_user_email+"');";



	db.task('get-everything', task =>{
			return task.batch([
			task.any(current_user_name),
			task.any(current_user_id),
			task.any(all_classes),
			task.any(user_todo_classes),
			task.any(other_users),
			task.any(all_user_classes)
			]);
		})
	.then(info =>{
	   res.render('pages/home',{
		   my_title: "Home Page",
		   data: info[2],
		   my_data: info[3],
		   other_userdata: info[4],
		   user_classes:info[5],
		   curr_users_name:info[0],
		   curr_users_id:info[1]
	   })
   })
   .catch(error =>{
	   request.flash('error, err');
	   response.render('pages/home',{
		   my_title:'Home Page',
		   data : '',
		   my_data: '',
		   other_userdata: '',
		   user_classes:'',
		   curr_users_name:'',
		   curr_users_id:''
	   })
   })
});

// registration page 
app.get('/register', function(req, res) {
	res.render('pages/register',{
		my_title:"Registration Page",
		message: ''
		// local_css:"signin.css", 
	})
});

// profile page
app.get('/profile', function(req, res) {
	res.render('pages/profile',{
		my_title:"Profile Page"
	})
});

//edit profile page

app.get('/profile_edit', function(req, res) {
	res.render('pages/profile_edit',{
		my_title:"Edit Profile Page",
		message: ''
	})
});
////////////////////////////////////////////////////
app.post('/register', function(req, res) {
  var username=req.body.name;
  var email=req.body.email;
  var first_name=req.body.first_name;
  var last_name=req.body.last_name;
  var password=req.body.password;
  var confirm_password=req.body.confirm_password;
  var major=req.body.M_choice;
  var grade=req.body.G_choice
  var classes=req.body.C_choice;
  console.log(username);
  console.log(email);
  console.log(first_name);
  console.log(last_name);
  console.log(password);
  console.log(confirm_password);
  console.log(major);
  console.log(grade);
  console.log(classes);
  if(username==''||email==''||password==''||first_name==''||last_name==''||major==''||grade==''||classes==''){
        res.render('pages/register',{
          my_title:"Registration Page",
          message:"Every field is required."
        });
  }
  else if(password!=confirm_password){
      res.render('pages/register',{
        my_title:"Registration Page",
        message:"Password and Confirm Password fields don't match."
      });
  }
  else{
    try{
      var email_check_query = "SELECT user_email FROM login_table WHERE user_email='"+email+"';";
      console.log("email check query: "+ email_check_query)
      db.any(email_check_query)
      .then(function(result)
      {
        console.log(result.user_email);
        console.log("Inside db query");
          if(result.user_email==email){
            console.log("execute 1");
            res.render('pages/register',{
              my_title:"Registration Page",
              message:"This email is already in use. Please try another."
            });
          }
          else{
            console.log("Inside else block: " + classes);
            var insert_query2 = "INSERT into user_table(first_name, last_name, major, year, classes, status, user_name) VALUES('"+first_name+"','"+last_name+"','"+major+"','"+grade+"', ARRAY["+classes+"],CAST(1 AS BOOL),'"+username+"');";
            console.log(insert_query2);
            db.any(insert_query2)
            .then(function(insert_result2){
                console.log("execute 2");
                var insert_query = "INSERT into login_table(user_name, user_email, user_password) VALUES('"+username+"','"+email+"','"+password+"');";
                console.log("Insert query: " + insert_query);
                db.any(insert_query)
                .then(function(insert_result){
                  console.log("execute 2");
                  res.render('pages/login',{
                  my_title:"Login page",
                  message:''
                  });
                })
                .catch(function(err){
                  console.log("error in insert_query from db");
                  res.render('pages/register',{
                  my_title:"Registration Page",
                  message:"Something went wrong, please try again."
                });
                });
            })
            .catch(function(err){
              console.log("error in insert_query from db");
              res.render('pages/register',{
              my_title:"Registration Page",
              message:"Something went wrong, please try again."
            });
            });
          }
      })
      .catch(function(err) {
        console.log(err);
          console.log("Inside db query - err");
          res.render('pages/register',{
              my_title:"Registration Page",
              message:"Something went wrong, please try again."
            });
      });
    }
    catch(e){
      throw(e)
      res.render('pages/register',{
              my_title:"Registration Page",
              message:''
            });
    }
  }
});

//profile edit
app.post('/profile_edit', function(req, res) {
 var username=req.body.name;
 var first_name=req.body.first_name;
 var last_name=req.body.last_name;
 var password=req.body.password;
 var confirm_password=req.body.confirm_password;
 var major=req.body.M_choice;
 var grade=req.body.G_choice
 var classes=req.body.C_choice;
 console.log(username);
 console.log(first_name);
 console.log(last_name);
 console.log(password);
 console.log(confirm_password);
 console.log(major);
 console.log(grade);
 console.log(classes);
 if(password==''||first_name==''||last_name==''||major==''||grade==''||classes==''){
       res.render('pages/profile_edit',{
         my_title:"profile edition page",
         message:"Every field is required."
       });
 }
 else if(password!=confirm_password){
     res.render('pages/profile_edit',{
       my_title:"Registration Page",
       message:"Password and Confirm Password fields don't match."
     });
 }
 else{
      try{
           console.log("Inside else block: " + classes);
           var edit_query = "UPDATE login_table SET user_name='"+username+"', user_password='"+password+"' WHERE user_email='goodluck@colorado.edu';";
            var edit_query2="UPDATE user_table SET first_name='"+first_name+"',last_name='"+last_name+"',major='"+major+"',year='"+grade+"',classes=ARRAY["+classes+"] WHERE user_name='goodluck';";
           console.log("Insert query: " + edit_query);
           console.log("Insert query2: " + edit_query2);
           db.task('get-everything', task =>{
               return task.batch([
               task.any(edit_query),
               task.any(edit_query2)
                ]);
            })
           .then(function(edition){
             console.log("execute 1");
             res.render('pages/login',{
               my_title:"Login page"
             });
           })
           .catch(function(err){
             console.log("error in insert_query from db");
             res.render('pages/profile_edit',{
             my_title:"profile edition Page",
             message:"Something went wrong, please try again."
           });
           });
     }
     catch(e){
     throw(e)
     res.render('pages/profile_edit',{
             my_title:"profile edition Page",
             message:"Something went wrong, please try again."
           });
    }  
   }
 });



app.listen(3000);
console.log('3000 is the magic port');