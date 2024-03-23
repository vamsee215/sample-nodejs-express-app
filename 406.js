const express = require('express');
const app = express();
const port = 3001;
const request = require('request');


const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore} = require('firebase-admin/firestore');


var serviceAccount = require('./key.json');

initializeApp({
    credential : cert(serviceAccount)
});

const db = getFirestore();





app.set("view engine","ejs");

app.get("/", (req, res) => {
    res.send("up");
 });


 app.get("/signup", (req, res) => {
    res.render("signup");
 });

 app.get("/signin", (req, res) => {
    res.render("signin");
 });

 app.get("/signinsubmit", (req, res) => {

    const emailid = req.query.emailid;
    const password = req.query.password;
db.collection("college")
  .where("emailid", "==" ,emailid)
  .where("password", "==" ,password)
  .get()
  .then((docs) =>{
    if(docs.size > 0){
        var usersData = [];
        db.collection("college")
          .get()
          .then((docs) => {
            docs.forEach((doc) => {
              usersData.push(doc.data());
            });
          })
          .then(() => {
            console.log(usersData);
            res.render("home", { userData: usersData });
          });
    }
    else{
        console.log("Login failed");
    }
  });
    
 });



 app.get('/searchsubmit', (req, res) => {
    res.render("movie");
  });


  app.get('/moviesubmit', (req, res) => {
    const Title = req.query.Title;
    request(
      "https://www.omdbapi.com/?t=" + Title + "&apikey=3cdbe472",
      function (error, response, body) {
        if (error) {
          console.error(error);
          res.render("movie"); // Render error page or message
          return;
        }
  
        try {
          const data = JSON.parse(body);
          if ("Error" in data) {
            // Movie not found
            res.render("movie"); // Render message indicating movie not found
            return;
          }
  
          const { Title, Released, Runtime } = data; // Destructure relevant properties
  
          res.render('Title', { Title, Released, Runtime });
        } catch (error) {
          console.error("Error parsing JSON response:", error);
          res.render("movie"); // Render error page or message
        }
      }
    );
  });
  




app.get("/signupsubmit", (req, res) => {
    const name = req.query.name;
    const emailid = req.query.emailid;
    const password = req.query.password;
 
db.collection("college")
.add({
    name:name,
    emailid:emailid,
    password:password,
}).then(()=>{
    res.send("Signup successfully");
})


});


  

    
 





app.listen(port,()=>{
    console.log('Exaple app listening on port 3001');
})
   