/**
 * Created by admin on 21-Jan-17.
 */


var amazon = require('amazon-product-api');

var client = amazon.createClient({
    awsId: "AKIAI7SZEKEZNMFWGJDQ",
    awsSecret: "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",
    awsTag: "tarun016-20"
    // associate id  : vooratarun-21
});


function findBookByISBN(isbn ,cb){

    client.itemLookup({
        'searchIndex': 'Books',
        'idType': 'ISBN',
        'condition':'Used',
        'itemId': isbn,
        'responseGroup': "Images,ItemAttributes,Offers",
        'domain' : 'webservices.amazon.in'
    }, function(err, results, response) {
        if (err) {
            console.log("error");
            var obj = {};
            obj["response"] = false;
            cb && cb(obj);
            console.log(JSON.stringify(err));
        } else {
            var product = results[0];
            var obj = {};
            obj["response"] = true;
            try {
                obj["imageUrl"] = product["SmallImage"][0]["URL"][0];
                console.log("image url");
            }catch(err){
                console.log(err);
            }
            try {
                obj["author"] = product["ItemAttributes"][0]["Author"][0];
                console.log("author");
            }catch(err){
                console.log(err);
            }

            try {
                obj["amazonPrice"] = product["ItemAttributes"][0]["ListPrice"][0]["FormattedPrice"][0];
                console.log("price");
            }catch(err){

            }

            try{
                obj["title"] = product["ItemAttributes"][0]["Title"][0];
                console.log("title");
            }catch(err){
                console.log(err);
            }

            cb && cb(obj);
            console.log(results[0]["ItemAttributes"][0]);  // products (Array of Object)
           // console.log(response); // response (Array where the first element is an Object that contains Request, Item, etc.)
        }
    });

}

module.exports = {
    findBookByISBN:findBookByISBN
};