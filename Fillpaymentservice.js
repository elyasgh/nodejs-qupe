var app=require("express")();
var http=require("http").Server(app);
var io=require("socket.io")(http);
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";
var Config=require('./function/ConfigDb');
var bodyParser = require('body-parser');
var Date=require('./function/Date_F'); 
const request = require('request');
var urlencode = require('urlencode');
//app.use(express.static(__dirname+"/static"))
io.set('heartbeat timeout', 40000000); 
io.set('heartbeat interval', 2000);
var Conn=Config.ConMySql;
app.get("/",function(req,res,next)
{
var options = { method: 'GET',rejectUnauthorized: false,
      requestCert: true,
      agent: false,
  url: ' https://api.tosanboom.com:4432/v1/charge/payments',
  headers: 
   { 'CLIENT-USER-AGENT': 'Android - Android 5.1 - Sumsung - Gallexy8',
     'CLIENT-USER-ID': '09010903750',
     'CLIENT-DEVICE-ID': '192.168.1.1',
     'CLIENT-PLATFORM-TYPE': 'ANDROID',
     'CLIENT-IP-ADDRESS': '192.168.1.1',
     'TOKEN-ID': '08d5f4776c8b94ff8855641f0faa7b0a',
     'ACCEPT-LANGUAGE': 'fa',
     ACCEPT: 'application/json',
     'Content-Type': 'application/json',
     'BANK-ID': 'BOOMIR',
     'Device-Id': '192.168.1.1',
     'App-Key': '12727'
	   },
  json: true };

request(options, function (error, response, body) {
  if (error) throw new Error(error);


var Count=body.payment_service_groups[0].payment_service_groups.length;
var Array=body.payment_service_groups[0].payment_service_groups;
res.send(Array);
var Operator='';
var Amount=0;
var Value=[];
for(var i=0; i< Count; i++)
 {          
	
	if (Array[i].foreign_title=="Irancell") Operator="Irancell"; else
	if (Array[i].foreign_title=="IRMCI") Operator="IRMCI";
	
	var Items=Array[i].payment_services;
	for(var j=0;j<Items.length;j++)
	{
		
    Amount=parseInt(Items[j].foreign_title.substring(0,6))*100;
    console.log(Items[j].id);
    var Conn=Config.ConMySql();
    
     Value.push(['BOOMIR','Amount'+Amount.toString(),Operator,Amount,Items[j].id.toString()]);
   

	}
 }	
 Conn.connect(function(err) 
 {
  if (err)  console.log("err");
  Sql="INSERT INTO tservicepayment(KeyBank,AmountCharge,TpOperator,Amount,Id_Service) VALUES ?";
  Conn.query(Sql,[Value],function(err, result)
  {
    if (err) console.log(err);
    console.log(result);
    Conn.end();
  });
  
 });
 console.log(Value);
});
});
http.listen(1300);
console.log("connected");