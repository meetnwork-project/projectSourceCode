<b>MeetnWork</b>

This project is a way for students to connect. We found that an issue for students when working on an assignment or studying for a class, they get stuck on something, but there are no people around or they want to work with people for multiple classes but don't know anyone who is available. 

Our website helps bring students together to get work done. To get started, the user must first register on the site. Once they register, they can log in, and will be redirected to the home page.  The home page will appear blank in the middle until they add to the the assignments/work they are working on to "todos" on the left-hand side of the homepage and press submit.  From there, the homepage reloads with only the classes they filled in in the "todos" form with a list of the other people who are also working on assignments for that class.  There is a separate form to update location and location description (you might add where in the building you are and a way to recognize you here). <b> For a more comprehensive tutorial, see our New_User_Tutorial.md </b> 

We hope you like this project!

The repo includes all pages, resources, and a database page to run the site. The website was deployed to Heroku, so the NodeJS server page is the one we used to deploy.  If you would like to run this locally, there are commented-out portions in the server.js file at the beginning and the end you will need to substitute so the database will work correctly.  To initialize the database, simply copy in our database file into your postgres terminal and substitute your password into the server.js file in dbConfig.

To run this website, click on the following link: https://meetnwork-softwaredev.herokuapp.com/. As stated above, a new user must register first and then log in. The site only accepts login information stored in the database (i.e. after registering, the user's info will be added to the database). Upon typing in tasks/homework for one or more of your classes, the home page will be populated with the other users and what they are working on/where based on which fields the user entered. If the user is not working on one of the classes he/she is enrolled in, then that table on the home page will not appear.

Best Regards, MeetnWork Team
