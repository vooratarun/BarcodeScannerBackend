/**
 * Created by admin on 20-Jan-17.
 */

// Initialize Express APP.
var express = require('express');
const bodyParser = require('body-parser');
var app = express();
var cors = require('cors');
app.use(cors());
var dbOps = require("./elasticsearch.js");
var amazon = require("./amazon.js");


// startin app server.
app.listen(3000, function () {
    console.log('Example app listening on port 3000!')
});

// Normal api to check
app.get("/",function(req,res){
    res.send("Hi hello world");
});

// Books API . it will render all books and send to front-end
app.get("/books",function(req,res){

    console.log("on books");
    dbOps.getAllBooks(function(result){
       res.send(result);
    });

});

app.get("/book/:isbn",function(req,res){

    console.log("on book isbn ");
    var isbn = req.params.isbn + "";
    console.log(isbn);
    console.log(typeof  isbn);
    amazon.findBookByISBN(isbn,function(result){
        res.send(result);
    })

});

// Create new book json. It stores the book object in database.
app.post("/create/book",function(req,res){

    console.log("On post form");
    if (req.method == 'POST') {
        var jsonString = '';
        req.on('data', function (data) {
            jsonString += data;
        });
        req.on('end', function () {
            var data = JSON.parse(jsonString);
            console.log(data);

            // It calculates the max book Id to define new book id.
            dbOps.booksCount(function(result){
                var max = 0;
                for(var i=0;i<result.length;i++){
                    if(max < result[i]["_id"])
                        max = result[i]["_id"];
                }
                // Inserts the new book in JSON Array.
                dbOps.insertBook(data,max+1,function(result){
                    console.log("result sending ..",result);
                    res.send({"result" : result});
                });
            });

        });
    }

});