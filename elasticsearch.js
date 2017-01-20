
var HOST = "http://127.0.0.1:9200";
var INDEX_NAME = "books_index";
var TYPE_NAME = "books_type";

var elasticsearch = require('elasticsearch');
var client = new elasticsearch.Client({
    host: HOST
    // log: 'trace'
});

function runQuery(query, callback) {
    client.search(query).then(function (resp) {
        var hits = resp.hits.hits;
        callback && callback(hits,null);
    }, function (err) {
        callback && callback(null,err);
    });
}

// BookCount API.
function booksCount(callback){
    var dbQuery = {
        index: INDEX_NAME,
        type: TYPE_NAME,
        body :{
            "query" :{
                "match_all" : {	}
            }
        }

    };
    client.search(dbQuery).
        then(function(resp){
            console.log("response came");
            callback(resp.hits.hits)
        },function(err){
            console.log(err);
        });
}

// Insertbook into object
function insertBook(obj,id,cb){
    console.log(obj);
    client.index({
        index: INDEX_NAME,
        type: TYPE_NAME,
        body: obj,
        id:id,
    },function(resp){
        cb && cb("one doc inserted")
    },function(err){

    })
}

// GetAll books
function getAllBooks(cb){

    var dbQuery = {
        index: INDEX_NAME,
        type: TYPE_NAME,
        body :{
            "query" :{
                "match_all" : {	}
            }
        }
    };
    client.search(dbQuery).
        then(function(resp){
            var respArray = [];
            for(var i=0;i<resp.hits.hits.length;i++) {
                respArray.push(resp.hits.hits[i]["_source"]);
            }
            cb && cb(respArray);
        },function(err){
        });
}


module.exports = {
    insertBook:insertBook,
    getAllBooks:getAllBooks,
    booksCount:booksCount,
    runQuery:runQuery
};