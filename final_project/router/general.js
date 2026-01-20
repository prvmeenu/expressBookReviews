const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const {username, password} = req.body;

  if(!username || !password){
    return res.status(400).json({message: 'Invalid username & password'});
      }if(users.includes(username)){
        return res.status(400).json({message: 'User already exists'})
      } else{
        users.push({ "username": username, "password": password });
        return res.status(200).json({message: 'User register successfully'})
      }
  //return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    res.send(JSON.stringify(books,null,4));
  //return res.status(300).json({message: "Yet to be implemented"});
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn_num = req.params.isbn;
  res.send(books[isbn_num]);
 // return res.status(300).json({message: "Yet to be implemented"});
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author_name = req.params.author;
  const res_book = Object.values(books).find((b) => b.author === author_name);
  if(res_book){
    res.send(JSON.stringify(res_book,null,4));
  }else{
    res.send(`Book with authout name ${author_name} not found`);
  }
  
  //return res.status(300).json({message: "Yet to be implemented"});
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title_name = req.params.title;
  const res_title = Object.values(books).filter((b) => b.title === title_name);
  if(res_title){
    res.send(JSON.stringify(res_title,null,4));
  } else {
    res.send(`Book with title name ${title_name} not found`);
  }
  //return res.status(300).json({message: "Yet to be implemented"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn_num =req.params.isbn;
  const result = books[isbn_num];
  const review = result.reviews;
  if(review){
    res.send(JSON.stringify(review,null,4))
  }else {
    res.send(`Book with ISBN ${isbn} not found.`);
}
  //return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
