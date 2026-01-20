const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();
const session = require('express-session');

let users = [];

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


//only registered users can login
regd_users.post("/login", (req,res) => {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "Missing credentials" });
    }    
      return res.status(200).json({ message: "Login successful" });    
  });
 

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn_num = req.params.isbn;
  const review = req.body.review;
  const username = req.session.authorization.username;

  if(!books[isbn_num]){
    return res.status(400).json({message: 'Book not found'})
  }
  books[isbn_num].reviews[username] = review;

  return res.status(200).json({message: 'Review has been added/updated successfully', book:books[isbn_num]});
  

  //return res.status(300).json({message: "Yet to be implemented"});
});

regd_users.delete('/auth/review/:isbn', (req, res) => {
    const isbn = req.params.isbn
    const token = req.headers.authorization.split(' ')[1]
  
    try {
      const decoded = jwt.verify(token, SECRET_KEY)
      const username = decoded.username
  
      if (!books[isbn]) {
        return res.status(404).json({ message: 'Book not found' })
      }
      if (!books[isbn].reviews) {
        return res.status(404).json({ message: 'No reviews found for this book' })
      }
  
      books[isbn].reviews = Object.keys(books[isbn].reviews).find(
        (r) => r.username !== username
      )
      return res.status(200).json({ message: 'Review deleted successfully' })
    } catch (error) {
      return res.status(401).json({ message: 'Unauthorized' })
    }
  })



module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
