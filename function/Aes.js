var Crypto = require('crypto');


function Encrypt(text,key,iv) 
{

 var cipher = Crypto.createCipheriv('aes-128-cbc', key, iv);
 var encrypted = cipher.update(text, 'utf8', 'binary');
 encrypted += cipher.final('binary');
 hexVal = new Buffer(encrypted, 'binary');
 newEncrypted = hexVal.toString('hex');
 return 	newEncrypted;
}
function Decrypt(text,key,iv) 
{

	var decipher = Crypto.createDecipheriv('aes-128-cbc', key, iv);
	var decrypted = decipher.update(text, 'hex', 'binary');
	decrypted += decipher.final('binary');
 return 	decrypted;
}

function GenerateKey()
{
	var Str='12345678901234567890';
	var Res='';
	
	for(var i = 0; i < 16;i++)
 	  {
		Res+=Str[Math.floor(Math.random() * (Str.length - 0) + 0)];
		
	  }
	
	return Res;
}
function SetBillSecure(iv,key,Id_User,request,response,Mobile,Ipg,BillId,PaymentId,Ime,TpBill,PlatformTransaction,IsInsurance,callback)
{
  var Config=require('./ConfigDb.js');
  var Date=require('./Date_F'); 
  var Conn=Config.ConMySql();			
  Conn.connect(function(err)
  {
	if (err) throw console.log('elyas'); 
	var Value=[];
	Value.push([iv,key,request,response,Id_User,Mobile,Ipg,BillId,PaymentId,Date.GetDateCurrent(),Date.GetTimeCurrent(),0,Ime,TpBill,
	PlatformTransaction,IsInsurance]);
	
	var Sql="INSERT INTO tsecurebill( Iv, Key_, Request,Response,Id_User,Mobile,Id_Ipg,BillId,PaymentId,DateSabt,TimeSabt,Status,Ime,TpBill,PlatformTransaction,IsInsurance)   values ?";
	Conn.query(Sql,[Value],function(err1,resualt)
	{
	 if (err1) throw console.log(err1); 
     callback(resualt);
	 Conn.end();	 
	});	  
  });
}
function SetBillSecureInsurance(iv,key,Id_User,request,response,Mobile,Ipg,BillId,PaymentId,Ime,TpBill,PlatformTransaction,IdInstallment,callback)
{
  var Config=require('./ConfigDb.js');
  var Date=require('./Date_F'); 
  var Conn=Config.ConMySql();			
  Conn.connect(function(err)
  {
	if (err)  console.log(err); 
	var Value=[];
	Value.push([iv,key,request,response,Id_User,Mobile,Ipg,BillId,PaymentId,Date.GetDateCurrent(),Date.GetTimeCurrent(),0,Ime,TpBill,
	PlatformTransaction,IdInstallment]);
	
	var Sql="INSERT INTO tsecurebillinsurance( Iv, Key_, Request,Response,Id_User,Mobile,Id_Ipg,BillId,PaymentId,DateSabt,TimeSabt,Status,Ime,TpBill,PlatformTransaction,IdInstallment)   values ?";
	Conn.query(Sql,[Value],function(err1,resualt)
	{
	 if (err1) throw console.log(err1); 
     callback(resualt);
	 Conn.end();	 
	});	  
  });
}

function SetPaySecure(iv,key,Id_User,request,response,Mobile,Money,Ipg,Ime,Tp_Transaction,PlatformTransaction,callback)
{
  var Config=require('./ConfigDb.js');
  var Date=require('./Date_F'); 
  var Conn=Config.ConMySql();			
  Conn.connect(function(err)
  {
	if (err) throw console.log('elyas'); 
	var Value=[];
	Value.push([iv,key,request,response,Id_User,Mobile,Money,Ipg,Date.GetDateCurrent(),Date.GetTimeCurrent(),0,Ime,Tp_Transaction,
	PlatformTransaction]);
	
	var Sql="INSERT INTO tsecure( Iv, Key_, Request,Response,Id_User,Mobile,Money,Id_Ipg,DateSabt,TimeSabt,Status,Ime,TpTransaction,PlatformTransaction)   values ?";
	Conn.query(Sql,[Value],function(err1,resualt)
	{
	 if (err1) throw console.log(err1); 
     callback(resualt);
	 Conn.end();	 
	});
    
	  
  });


}

module.exports.Encrypt=Encrypt;
module.exports.Decrypt=Decrypt;
module.exports.GenerateKey=GenerateKey;
module.exports.SetBillSecure=SetBillSecure;
module.exports.SetBillSecureInsurance=SetBillSecureInsurance;
module.exports.SetPaySecure=SetPaySecure;