var express = require('express'); //Ensure our express framework has been added
var app = express();
var bodyParser = require('body-parser'); //Ensure our body-parser tool has been added
// const { body,validationResult } = require('express-validator/check');
// const { sanitizeBody } = require('express-validator/filter');
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

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/'));//This line is necessary for us to use relative paths and access our resources directory


// registration page 
app.get('/register', function(req, res) {
	res.render('pages/register',{
		my_title:"Registration Page",
		data: ''
	})
});

// login page 
app.get('/', function(req, res) {
	res.render('pages/login',{
		local_css:"signin.css", 
		my_title:"Login Page"
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
		my_title:"Edit Profile Page"
	})
});

// home page

app.get('/home', function(req, res) {
	res.cookie('name', 'elro2540@colorado.edu'); //Sets email, (move to login when working)
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

app.listen(3000);
console.log('3000 is the magic port');