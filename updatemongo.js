var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("chat");

    var myquery = { _id: 1 };
    var newvalues = { $set: { IdSocket: "900" } };
    dbo.collection("Tuser").updateOne(myquery, newvalues, function(err, res) {
        if (err) throw err;
        console.log("1 document updated");
        db.close();
    });
});
