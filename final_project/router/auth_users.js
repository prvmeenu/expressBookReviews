const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();
const session = require('express-session');

let users = [{"username": "user1", "password": "password2"}];

const isValid = (username)=>{ //returns boolean
let userwithsamename = users.filter((user) => {
    return user.username === username;
});
return userwithsamename.length>0;
    //write code to check is the username is valid
};

const authenticatedUser = (username,password)=>{ //returns boolean
let validuser = users.filter((user) => {
    return user.username === username && user.password === password;
});
return validuser.length>0;
    //write code to check if username and password match the one we have in records.
};

const app = express();
app.use(express.json);

app.use(session({ secret: "fingerpint" })); 

app.use('/auth', (req,res,next) => {
    if(req.session.authorization){
        token = req.session.authorization['accessToken'];
        jwt.verify(token, "access", (err,user) => {
            if(!err){
                req.user = user;
                next();
            }else{
                return res.status(403).json({message: "User not authenticated."});
            }
        });
    } else{
        return res.status(403).json({message: 'User not logged In'});
    }
});

//only registered users can login
app.post("/customer/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if(!username || !password){
    return res.status(404).json({message: "Error logged in"});
  }

  if(authenticatedUser(username,password)){
    let accessToken = jwt.sign({ data: password}, 'access',{expiresIn: 60 * 60} );

    req.session.authorization = { accessToken, username };
    return res.status(200).json({message: 'User successfully logged in'});
  } else{
    return res.status(400).json({message: 'Invalid login username and password'});
  }
    //Write your code here
  //return res.status(300).json({message: "Yet to be implemented"});
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

app.get("/auth/get_message", (req, res) => {
    return res.status(200).json({ message: "Hello, You are an authenticated user. Congratulations!" });
  });

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
