/**
 * Created by admin on 20-Jan-17.
 */

var express = require('express');
const bodyParser = require('body-parser');
var app = express();
var cors = require('cors');
app.use(cors());
var dbOps = require("./elasticsearch.js");
var INDEX_NAME = "books_index";
var TYPE_NAME = "books_type";

app.listen(3000, function () {
    console.log('Example app listening on port 3000!')
});

app.get("/",function(req,res){
    res.send("Hi this is tarun..");
});

app.get("/books",function(req,res){

    console.log("on books");
    dbOps.getAllBooks(function(result){
       res.send(result);
    });

});

app.post("/create/book",function(req,res){

    console.log("on post data");

    console.log("On post form");
    if (req.method == 'POST') {
        var jsonString = '';
        req.on('data', function (data) {
            jsonString += data;
        });
        req.on('end', function () {
            var data = JSON.parse(jsonString);
            console.log(data);

            var dbQuery = {
                index: INDEX_NAME,
                type: TYPE_NAME,
                body :{
                    "query" :{
                        "match_all" : {	}
                    }
                }
            };

            dbOps.booksCount(function(result){

                var max = 0;
                for(var i=0;i<result.length;i++){
                    if(max < result[i]["_id"])
                        max = result[i]["_id"];
                }

                dbOps.insertBook(data,max+1,function(result){
                    console.log("result sending ..",result);
                    res.send({"result" : result});
                });
            });
            //var id = 0;
            //dbOps.insertBook(data,id+1,function(result){
            //    console.log("result sending ..",result);
            //    res.send(result);
            //});

        });
    }

});