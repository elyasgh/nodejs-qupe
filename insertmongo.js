var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var dbo = db.db("chat");
  
  
  

dbo.collection("Tuser").count(function(err,res)
{
 var myobj ={
     "NameUser" : "Userelyas",
     "IdSocket" : "ZhpHpdqfGcUh9IcuAAAA",
     "Tph" : "989155235780",
     "PicProfile" : ""
 };

   dbo.collection("Tuser").insertOne(myobj, function(err, res) {
     if (err) throw err;
    console.log("1 document inserted");
    db.close();
   });	
});

});
