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
var KeyEncrypt=  'VofTktJ,;ajPVm61';
var IvEncrypt=  '3l79E@=pt$G4%5Z&';

app.get("/",function(req,res,next)
{

  res.sendFile(__dirname+"/static/index.html");	
  
});
io.on("connection",function(socket)
{
	console.log("connection   "+socket.id);
	socket.on("SetConnect",function(data)
	{
   	  
	  var Conn=Config.ConMySql();	
	  
	  Conn.connect(function(err) 
	  {
        if (err) throw err;
		var Sql=`update tuser set IdSocket='${socket.id}' where Id=${data.Id_User}`;
  	    Conn.query(Sql, function (err, result) 
	    {
         if (err) throw console.log(err);
         io.to(socket.id).emit("SetConnect",{Resualt:true});
		
		 Conn.end();
        });
		
	  
	  });		
	});

	socket.on("Msg",function(data)
	{
    	console.log(data.toString());
		var sockets=io.sockets.sockets;
		sockets.forEach(function (item)
		{
			item.emit("Msg",{Msg:data});
		});
	});
	socket.on("Splash",function(data)
	{
		
		console.log(data.toString()+"  "+socket.id);
         MongoClient.connect(url, function(err, db) {
             if (err) throw err;
             var dbo = db.db("chat");


        //
          var myquery = { _id: data };
            var newvalues = { $set: { IdSocket: socket.id } };

            dbo.collection("TUser").updateOne(myquery, newvalues, function(err, res) {
                if (err) throw err;
                db.close();
            });
         });

	});
    socket.on("ListContact",function(data)
    {
        MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("chat");
        var f=JSON.parse(data);
        dbo.collection('TUser').find({"Tph":{$in:f}}).toArray( function(err, res) 
		{
          if (err) throw err;
          io.to(socket.id).emit("ListContact",{Contact:res});
          db.close();
        });
        });

    });
    socket.on("GetListResturant",function(data)
    {    
	 var Conn=Config.ConMySql();
	 
	 Conn.connect(function(err) 
	 {
	  if (err) throw console.log(err);
  	  var Sql=`select * from tresturan where (IsOnline=1) and Tp_Resturant=${data.TpSenf} and  (select FORMAT(( SELECT GetDistance(Latitude,Longtitude,${data.Latitude},${data.Longitude})),3)*1000 < ${data.Distance})`+
	  ` order by (select FORMAT(( SELECT GetDistance(Latitude,Longtitude,${data.Latitude},${data.Longitude})),3)*1000) Desc `;
	  Conn.query(Sql, function (err, result) 
	  {
         if (err) throw console.log(err);
        io.to(socket.id).emit("GetListResturant",result);
		 Conn.end();
      });
	 });
    });
    socket.on("GetListGroupMenuResturant",function(data)
    {    
	 var Conn=Config.ConMySql();
	 Conn.connect(function(err) 
	 {
	  if (err) throw console.log(err);
      var Sql=`select * from TGrpMenuResturant where Id_User=${data.Id_User}`;
	  Conn.query(Sql, function (err, result) 
	  {
         if (err) throw Conn.end();
		 var Sql=`select * from tmenuresturan where IdResturan=${data.Id_User}`;
		 Conn.query(Sql, function (err, Data) 
		 {
          
		  io.to(socket.id).emit("GetListGroupMenuResturant",{GroupMenu:result,DataMenu:Data});
		  Conn.end();
		 });
       });
	 });
    });
    socket.on("InsertOrderFactorResturant",function(data)
    {     
	  var Conn=Config.ConMySql();
	  Conn.connect(function(err) 
	  {
	    if (err) throw console.log(err); 
        var  Obj = JSON.parse(data);
	    var Header=Obj.Header;
	    var Details=Obj.Details;
		
		var SqlHeader="INSERT INTO torder(Date,Time,Money,Tp,Id_User, Id_TaskMaster) values ?";
	    var ValuesHeader = [];
		var ValuesDetails = [];
	    ValuesHeader.push([Date.GetDateCurrent(),Date.GetTimeCurrent(),Header.SumFactor,4,Header.Id_User,Header.Id_TaskMaster]);
        Conn.query(SqlHeader,[ValuesHeader], function (err, result) 
		 {
           if (err) throw console.log(err); 
		   
           SqlHeader="INSERT INTO torderresturanheader(IdOrder,IdResturan,Date,MoneyFactor,Time,Discount,CarryFee,Id_User, Tel,Mobile,Address,NameOrder,Description,Latitude,Longtitude) values ?";		   
		   ValuesHeader = [];
	       ValuesHeader.push([result.insertId,Header.IdResturant,Date.GetDateCurrent(),Header.SumFactor,Date.GetTimeCurrent(),Header.Discount,
	       Header.CarryFee,Header.Id_User,Header.Tel,Header.Mobile,Header.Address,Header.NameOrder,Header.Description,Header.Latitude,Header.Longtitude]);          
           Conn.query(SqlHeader,[ValuesHeader], function (err, resultRes) 
		   {
            if (err) 
			{
				io.to(socket.id).emit("InsertOrderFactorResturant",{Resualt:false});
				throw console.log(err); 
			}
  		    for(var i=0; i< Object.keys(Details).length; i++)
		    {          
			  ValuesDetails.push([resultRes.insertId,Details[i].IdKala,Details[i].Price,Details[i].Amount,Details[i].SumPrice]);
   		    }			
  		    var SqlDetails="INSERT INTO torderresturandetails(IdOrder,IdKala,Price,Amount,SumPrice) values ?";
			Conn.query(SqlDetails,[ValuesDetails], function (err, resultdetails) 
		    {
		     if (err) throw console.log(err); 
    		 io.to(socket.id).emit("InsertOrderFactorResturant",{Resualt:true,InsertId:result.insertId});
			 Conn.end();
			});
	
		   });
		   
		   
		 });		
	  });
    });
    socket.on("GetListAjans",function(data)
    {    
	 var Conn=Config.ConMySql();
	 
	 Conn.connect(function(err) 
	 {
     
	  if (err) throw console.log(err);
  	  var Sql=`SELECT Id_User,concat(Name_User,' ',Last_User) as NameAdminAjans,Mobile1,Mobile2, Tel1, Tel2, NameAjans, 
	  Address, AvaragePoints, InputPriceDay As InputPrice, AmountRequest,Lat,Longtitude,PriceUnit,PriceDelay,TpPay, IsShare,
	  NumberShareDriver,MinimumDriver,0 as DistanceMeter,Award,AvaragePoints from tajans where Tp_Sex=1 and Id_User in 
	  (select Id_User from tajansonline as t where t.Id_User=tajans.Id_User) and 
	  (select FORMAT(( SELECT GetDistance(Lat,Longtitude,${data.Latitude},${data.Longitude})),3)*1000 < ${data.Distance})`+
	  ` order by (select FORMAT(( SELECT GetDistance(Lat,Longtitude,${data.Latitude},${data.Longitude})),3)*1000) Desc `;

	  Conn.query(Sql, function (err, result) 
	  {
         if (err) throw console.log(err);
		 console.log(result);
         io.to(socket.id).emit("GetListAjans",result);
		 Conn.end();
      });
	 });
    });
    socket.on("GetListDriverOfAjans",function(data)
    {    
	 var Conn=Config.ConMySql();
	 
	 Conn.connect(function(err) 
	 {
     
	  if (err) throw console.log(err);
	  console.log(data.IdAjans);
	  
  	   var Sql=`SELECT Id_Per,Mobile,IdAjans As IdAjansMaster,IdAjans As IdAjansSlave,NamePerAjans,LastPerAjans,Pelak,
	   PhotoPer,YearModelCar,(select Tc.NameColor from tcolorcar As Tc where Tc.Id=ColorCar) As ColorCar,
       (select TbCar.NameBrand from tbrandcar AS TbCar where TbCar.IdCar=BrandCar) as BrandCar,AveragePoints,CountComplaining,CountOrder FROM tperajans 
	   where IdAjans=${data.IdAjans} and Id_Per in (select IdPer from tperajansmenonline as Tp where Tp.IdPer=Id_Per and Tp.Status=1)  `;

	   Conn.query(Sql, function (err, result) 
	   {
          if (err) throw console.log(err);
		  console.log(result);
          io.to(socket.id).emit("GetListDriverOfAjans",result);
		  Conn.end();
       });
	 });
    });	
    socket.on("GetSearchLocation",function(data)
      {
 	    var Url=`https://api.neshan.org/v1/search?term=`+urlencode(data.Term)+`&lat=${data.Lat}&lng=${data.Long}`;
	    console.log(Url);
 	    const options = 
         {  
          url: Url,
          method: 'GET',
          headers: 
  	      {
           'Accept': 'application/json',
           'Accept-Charset': 'utf-8',
           'Api-Key': 'ecdd6a7ee28b745045f5639619c169199c84266'
          }
         };	
         request(options, function(err, res, body) 
         {  
          let json = JSON.parse(body);
		  console.log(json);
	      io.to(socket.id).emit("GetSearchLocation",json);    
         });		
      });	
      socket.on("ComputeDistanceDuration",function()
      {
	   io.to(socket.id).emit("ComputeDistanceDuration",{Contact:2});  
      });	
      socket.on("OrderTempTaxiOnline",function(data)
      {
        
   	    var Conn=Config.ConMySql();
        Conn.connect(function(err) 
	    {
	      if (err) throw console.log(err); 
          var  Obj = JSON.parse(data);
		  var InfOrder=Obj.InfOrder;	  	      
		  var InfTarget=Obj.InfTarget;	
  		  var SqlOrderTmp="INSERT INTO torderajanstemp(LatUser,LongUser,LatOrder,LongOrder,Distance,Duration,Id_AjansMaster,"+
		  "Id_AjansSlave,Id_PerAjans, Date,Time,PriceUnit,InputPrice,InfCar,InfPelak)  values ?";
	      var ValuesTmp = [];
		  var ValuesTarget = [];
	      ValuesTmp.push([InfOrder.LatUser,InfOrder.LongUser,InfOrder.LatOrder,InfOrder.LongOrder,InfOrder.Distance,InfOrder.Duration,
		  InfOrder.Id_AjansMaster,InfOrder.Id_AjansSlave,InfOrder.Id_PerAjans,Date.GetDateCurrent(),Date.GetTimeCurrent(),InfOrder.PriceUnit,InfOrder.InputPrice,
		  InfOrder.InfCar,InfOrder.InfPelak]);
	      Conn.query(SqlOrderTmp,[ValuesTmp], function (err, result) 
	 	   {
            if (err) 
			{
				
				Conn.end();
				throw console.log(err); 
				
			}
			for(var i=0; i< Object.keys(InfTarget).length; i++)
		    {          
			  ValuesTarget.push([result.insertId,InfTarget[i].Lat,InfTarget[i].Long]);
   		    }			
			var SqlOrderTarget="INSERT INTO ttemptarget(Id, LatTaget,LongTarget) values ?";
			Conn.query(SqlOrderTarget,[ValuesTarget],function(err,resulttarget)
			{
              if (err) throw console.log(err); 			  
			  var SqlUser=`Select * from tuser where Id=${InfOrder.Id_AjansMaster}`;
			  console.log(SqlUser);
    		  //send to user taxi online
			  io.to(socket.id).emit("OrderTempTaxiOnline",{Resualt:true}); 		
			  Conn.query(SqlUser,function(err,resualtajans)
			  {
			   if (err) throw console.log(err);
			   if (Object.keys(resualtajans).length==1)
			   {
	   			var SqlUpdateOrderAjans=`update torderajanstemp set SendToAjans=1 where Id=${result.insertId}`;
				Conn.query(SqlUpdateOrderAjans,function(err,resualtsendajans)
			    {
    			   if (err) throw console.log(err);
				  io.to(resualtajans[0].IdSocket).emit("OrderTempTaxiOnline",{Resualt:result.insertId}); 		
				Conn.end();		
				});
                
			   }
			
			   	
			  });

			});	 
		   });

		});

      });	
      socket.on("EncryptBill",function(data)
      {			  
        var Aes = require('./function/Aes.js');
		var key=Aes.GenerateKey();
        var iv=Aes.GenerateKey();
		
        Aes.SetBillSecure(iv,key,data.Id_User,data.Id_Request,Aes.Encrypt(data.Id_Request.toString(),iv,key),data.Mobile,data.Id_Ipg.toString(),
		data.BillId,data.PaymentId,data.Ime
		,data.TpBill.toString(),data.PlatformTransaction.toString(),data.IsInsurance,function(response)
		{
          io.to(socket.id).emit("EncryptBill",{Resualt:true,ResCode:Aes.Encrypt(response.insertId.toString(),KeyEncrypt,IvEncrypt)}); 	
		});		
      });
      socket.on("EncryptBillInsurance",function(data)
      {			  
        var Aes = require('./function/Aes.js');
		var keyInner=Aes.GenerateKey();
        var IvInner=Aes.GenerateKey();
	
        Aes.SetBillSecureInsurance(IvInner,keyInner,data.Id_User,data.Id_Request,Aes.Encrypt(data.Id_Request.toString(),IvInner,keyInner),data.Mobile,data.Id_Ipg.toString(),
		data.BillId,data.PaymentId,data.Ime
		,data.TpBill.toString(),data.PlatformTransaction.toString(),data.IdInstallment,function(response)
		{
          io.to(socket.id).emit("EncryptBillInsurance",{Resualt:true,Data:{BillId:data.BillId,PaymentId:data.PaymentId,Id_Ipg:data.Id_Ipg,ResCode:Aes.Encrypt(response.insertId.toString(),KeyEncrypt,IvEncrypt)}}); 	
		});		
      });
	  
      socket.on("EncryptPayIpg",function(data)
      {			  
        var Aes = require('./function/Aes.js');
		var key=Aes.GenerateKey();
        var iv=Aes.GenerateKey();
		var keyMaster='AAAAAElyas123456';
        var ivMaster='ElyasElyas123456';
		console.log(data);
        Aes.SetPaySecure(iv,key,data.Id_User,data.Id_Request,Aes.Encrypt(data.Id_Request.toString(),iv,key),data.Mobile,data.Money,data.Id_Ipg.toString(),
		data.Ime
		,data.Tp_Transaction.toString(),data.PlatformTransaction.toString(),function(response)
		{
          io.to(socket.id).emit("EncryptPayIpg",{Resualt:true,ResCode:Aes.Encrypt(response.insertId.toString(),keyMaster,ivMaster)}); 	
		});		
      });
	  
      socket.on("GetResualtBill",function(data)
      {			  
        var Conn=Config.ConMySql();
        Conn.connect(function(err) 
	    {
     	  var Sql=`SELECT BillId,PaymentId,(select NamePsp from ttppsp where Id=Id_Ipg) as NameIpg,
           (select Description from ttp_transaction where Id=Tp_Bill) as NameTpBill,Date,Time,TraceNumber,Tp_Bill, Request,PointUser,ShareUser FROM tpaybill
           where  BillId=${data.BillId}  and PaymentId=${data.PaymentId}   and  Id_Ipg=${data.Id_Ipg} `;
		  Conn.query(Sql, function (err, result) 
	      {
           if (err) throw console.log(err);
		   
           io.to(socket.id).emit("GetResualtBill",result);	
		   Conn.end();
        });
			
			
		});
      });
      socket.on("GetResualtBillInsurance",function(data)
      {			  
        var Conn=Config.ConMySql();
        Conn.connect(function(err) 
	    {
     	  var Sql=`SELECT  tpay.BillId,tpay.PaymentId,tpay.IdOrderApp as Request,IFNULL(tpay.DatePay,0) as Date,IFNULL(tpay.TimePay,0) as Time,
		  tpay.TraceNumber,IFNULL(tpay.PointUser,0) as PointUser,IFNULL(tpay.ShareUser,0) as ShareUser,
		  ttrans.Description as NameTpBill,
                 (SELECT NamePsp   from ttppsp as psp where psp.Id=ttrans.Id_Ipg) as NameIpg FROM tpaybillinsurance as tpay
                 INNER  join ttp_transaction as ttrans
                 on tpay.Tp_Bill=ttrans.Id
                 where IFNULL(tpay.TraceNumber,0)<>0 and BillId=${data.BillId}  and PaymentId=${data.PaymentId}   and  Id_Ipg=${data.Id_Ipg} `;
		  Conn.query(Sql, function (err, result) 
	      {
			
		   if (err) 
		   {
			 io.to(socket.id).emit("GetResualtBillInsurance",{Resualt:false,ErrorCode:err.code,Msg:"خطايي در هنگام ارتباط با  بانک اطلاعاتي رخ داده است ."});	
		   } else
		   
           io.to(socket.id).emit("GetResualtBillInsurance",{Resualt:true,Data:result});	
		   Conn.end();
        });
			
			
		});
      });
	  socket.on("InquiryBillMciTci",function(Req)
      {
	    var Inquiry=require('./function/InquiryBill');
		Inquiry.InquiryBillMciTci(Req,function(data)
		{
	     console.log(data);	
		 io.to(socket.id).emit("InquiryBillMciTci",data.toString());	
			
			
		});
	
      });	
	  socket.on("InquiryBill",function(Req)
      {
		var Inquiry=require('./function/InquiryBill');
		var Date=require('./function/Date_F.js');
		Inquiry.InquiryBill(Req,function(data)
		{
		 var json=JSON.parse(data);
			if (json.code) 
			{
	         
			 io.to(socket.id).emit("InquiryBill",{code:json.code,message:json.message});				  
			} else
			{
			 if (json.pay_date)
			 {
			 var Pay_Date=Date.MiladiToShamsi(json.pay_date.substring(0,4)+"/"+json.pay_date.substring(5,7)+"/"+json.pay_date.substring(8,10));				
			  io.to(socket.id).emit("InquiryBill",{type:json.type,amount:json.amount,
				paid:json.paid,pay_date:Pay_Date,reference_number:json.reference_number,BillId:Req.BillId,PaymentId:Req.PaymentId});				  			  
			  }else
			  {
				io.to(socket.id).emit("InquiryBill",{type:json.type,amount:json.amount,
					paid:json.paid,pay_date:"",reference_number:json.reference_number,BillId:Req.BillId,PaymentId:Req.PaymentId});				  			  	  
			  }
			}   
			
			
			
		},function(error)
		{
	
		});
	
	  });	
	  
	  socket.on("PayBillPhoneWithCard",function(Req)
      {
	    var Inquiry=require('./function/InquiryBill');
		Inquiry.PayBillPhone(Req,function(data)
		{
	    var jsonParser = bodyParser.json();
		  if (data.code) 
		  {
			  console.log(data);	
		   io.to(socket.id).emit("PayBillPhoneWithCard",{code:data.code,message:data.message});				  
		  } else
		  {
           io.to(socket.id).emit("PayBillPhoneWithCard",data);				  			  
		  }

		});
	
      });	
	  socket.on("BuyChargePin",function(Req)
      {    
		var BuyCharge=require('./function/Charge.js');
		var Aes=require('./function/Aes.js')
		var Conn=Config.ConMySql();	
	    var Header=Req.Header;
		var Body=Req.Body;
		var InfoCharge=Req.InfoCharge;
		var ApiContent=Req.ApiContent;
		var Card=Aes.Decrypt(Body.Card,IvEncrypt,KeyEncrypt);
		var Pass2=Aes.Decrypt(Body.Pass2,IvEncrypt,KeyEncrypt);
		var Cvv2=Aes.Decrypt(Body.Cvv2,IvEncrypt,KeyEncrypt);
		var Year=Aes.Decrypt(Body.Year,IvEncrypt,KeyEncrypt);
		var Month=Aes.Decrypt(Body.Month,IvEncrypt,KeyEncrypt);		
		Conn.connect(function(err)
	    {
		  var Cmd=`select * from tservicepayment   where  KeyBank="${ApiContent.KeyBank}"  and AmountCharge="${InfoCharge.Amount}" and TpOperator="${InfoCharge.Operator}"`;
		  console.log(Cmd);
		  Conn.query(Cmd, function (err, result)
		  {
			if (err)
			{
				console.log(err);
			} else
			{
				var Req = {Card: Card,Cvv2:Cvv2,Pass2:Pass2,Year:Year,Month:Month,KeyBank:ApiContent.KeyBank,Amount:result[0].Amount.toString(),Id_Service:result[0].Id_Service.toString()};
                console.log(Req);
				BuyCharge.BuyChargePin(Req,function(data)	
				{			  
				  if (data.code) 
				  {
				   io.to(socket.id).emit("BuyChargePin",{code:data.code,message:data.message});				  
				  } else
				  {
				   io.to(socket.id).emit("BuyChargePin",data);				  			  
				  }
		
				});
			}
			Conn.end();
		   });
	    });
      });	
	  socket.on("BuyChargeToPup",function(Req)
      {    
		var BuyCharge=require('./function/Charge.js');
		var Aes=require('./function/Aes.js')
		var Conn=Config.ConMySql();	
	    var Header=Req.Header;
		var Body=Req.Body;
		var InfoCharge=Req.InfoCharge;
		var ApiContent=Req.ApiContent;
		var Card=Aes.Decrypt(Body.Card,IvEncrypt,KeyEncrypt);
		var Pass2=Aes.Decrypt(Body.Pass2,IvEncrypt,KeyEncrypt);
		var Cvv2=Aes.Decrypt(Body.Cvv2,IvEncrypt,KeyEncrypt);
		var Year=Aes.Decrypt(Body.Year,IvEncrypt,KeyEncrypt);
		var Month=Aes.Decrypt(Body.Month,IvEncrypt,KeyEncrypt);		
		Conn.connect(function(err)
	    {
		  var Cmd=`select * from tservicepayment   where  KeyBank="${ApiContent.KeyBank}"  and AmountCharge="${InfoCharge.Amount}" and TpOperator="${InfoCharge.Operator}"`;
		  console.log(Cmd);
		  Conn.query(Cmd, function (err, result)
		  {
			if (err)
			{
				console.log(err);
			} else
			{
				var Req = {Card: Card,Cvv2:Cvv2,Pass2:Pass2,Year:Year,Month:Month,KeyBank:
					ApiContent.KeyBank,Amount:result[0].Amount.toString(),Id_Service:result[0].Id_Service.toString(),Mobile:InfoCharge.Mobile};
                console.log(Req);
				BuyCharge.BuyChargeToPup(Req,function(data)	
				{			  
				  if (data.code) 
				  {
				   io.to(socket.id).emit("BuyChargeToPup",{code:data.code,message:data.message});				  
				  } else
				  {
				   io.to(socket.id).emit("BuyChargeToPup",data);				  			  
				  }
		
				});
			}
			Conn.end();
		   });
	    });
      });	
	  socket.on("BalanceCard",function(Req)
      {
		var Aes=require('./function/Aes.js')
		var CardBalance=require('./function/Card.js');		
	    var Header=Req.Header;
		var Body=Req.Body;
		var ApiContent=Req.ApiContent;
		var Card=Aes.Decrypt(Body.Card,IvEncrypt,KeyEncrypt);
		var Pass2=Aes.Decrypt(Body.Pass2,IvEncrypt,KeyEncrypt);
		var Cvv2=Aes.Decrypt(Body.Cvv2,IvEncrypt,KeyEncrypt);
		var Year=Aes.Decrypt(Body.Year,IvEncrypt,KeyEncrypt);
		var Month=Aes.Decrypt(Body.Month,IvEncrypt,KeyEncrypt);		
		var Request = {Card: Card,Cvv2:Cvv2,Pass2:Pass2,Year:Year,Month:Month,ApiContent:ApiContent};
		console.log(Request);

		
		CardBalance.BalanceCard(Request,function(data)	
		{
 		 console.log(data);
 	     if (data.code) 
		  {
		   io.to(socket.id).emit("BalanceCard",{code:data.code,message:data.message});				  
		  } else
		  {
           io.to(socket.id).emit("BalanceCard",data);				  			  
		  }

		});
	
      });	
	  socket.on("InquiryCardToCard",function(Req)
      {
		var Aes=require('./function/Aes.js')
		var CardInquiry=require('./function/Card.js');		
	    var Header=Req.Header;
		var Body=Req.Body;
		var ApiContent=Req.ApiContent;
		var Card=Aes.Decrypt(Body.Card,IvEncrypt,KeyEncrypt);
		var Pass2=Aes.Decrypt(Body.Pass2,IvEncrypt,KeyEncrypt);
		var Cvv2=Aes.Decrypt(Body.Cvv2,IvEncrypt,KeyEncrypt);
		var Year=Aes.Decrypt(Body.Year,IvEncrypt,KeyEncrypt);
		var Month=Aes.Decrypt(Body.Month,IvEncrypt,KeyEncrypt);		
		var Request = {Card: Card,Cvv2:Cvv2,Pass2:Pass2,Year:Year,Month:Month,ApiContent:ApiContent};
		CardInquiry.InquiryCardToCard(Request,function(data)	
		{
 		 console.log(data);
 	     if (data.code) 
		  {
		   io.to(socket.id).emit("InquiryCardToCard",{code:data.code,message:data.message});				  
		  } else
		  {
           io.to(socket.id).emit("InquiryCardToCard",data);				  			  
		  }

		});
	
      });	
	  socket.on("TransferCardToCard",function(Req)
      {
	    
		var Card=require('./function/Card.js');
		Card.TransferCardToCard(Req,function(data)	
		{
 		 console.log(data);
 	     if (data.code) 
		  {
		   io.to(socket.id).emit("TransferCardToCard",{code:data.code,message:data.message});				  
		  } else
		  {
           io.to(socket.id).emit("TransferCardToCard",data);				  			  
		  }

		});
	
	  });	
	  socket.on("PayBillBank",function(Req)
      {
	    
		var Aes=require('./function/Aes.js');
		var InquiryBill=require('./function/InquiryBill');
		var  Obj = JSON.parse(Req);
	    var Header=Obj.Header;
		var Body=Obj.Body;
		var InfoBill=Obj.InfoBill;
		var ApiContent=Obj.ApiContent;
		var Card=Aes.Decrypt(Body.Card,IvEncrypt,KeyEncrypt);
		var Pass2=Aes.Decrypt(Body.Pass2,IvEncrypt,KeyEncrypt);
		var Cvv2=Aes.Decrypt(Body.Cvv2,IvEncrypt,KeyEncrypt);
		var Year=Aes.Decrypt(Body.Year,IvEncrypt,KeyEncrypt);
		var Month=Aes.Decrypt(Body.Month,IvEncrypt,KeyEncrypt);		
		var data = {Card: Card,Cvv2:Cvv2,Pass2:Pass2,Year:Year,Month:Month,BillId:InfoBill.BillId,
			PaymentId:InfoBill.PaymentId,KeyBank:ApiContent.KeyBank};
		InquiryBill.PayBill(data,function(Res)
	   { 
		if (Res.code) 
		{
		 io.to(socket.id).emit("PayBillBank",{code:Res.code,message:Res.message});				  
		} else
		{
		 io.to(socket.id).emit("PayBillBank",Res);				  			  
		}
	 });
      });	
	  
    socket.on("OrderPos",function(data)
    {     
	  var Conn=Config.ConMySql();
	  Conn.connect(function(err) 
	  {
	    if (err) throw console.log(err); 
       var  Obj = JSON.parse(data);
		var Sql="INSERT INTO torderpos(IdMeli,NamePerson,NameUnion,Businesslicensenumber,Mobile,Tel,Address,"+
		"TpBank,TpPos,NumberAcc,AmountPos, Shaba) VALUES  ?";
	     var Value = [];
	     Value.push([Obj.IdMeli,Obj.NamePerson,Obj.Union,Obj.Businesslicensenumber,Obj.Mobile,Obj.Tel,Obj.Address,Obj.TpBank,Obj.TpPos,Obj.NumberAcc,Obj.AmountPos,Obj.Shaba]);
        Conn.query(Sql,[Value], function (err, result) 
		 {
           if (err) throw  io.to(socket.id).emit("OrderPos",{Code:1,Msg:"خطا در هنگام ذخيره داده"});				  			  
           io.to(socket.id).emit("OrderPos",{Resualt:true});				  			  
		   
		   
		 });		
	  });
    });
    socket.on("PosFollow",function(data)
      {			  
        var Conn=Config.ConMySql();
		
        Conn.connect(function(err) 
	    {
     	  var Sql=`select * from torderpos   where  IdMeli=${data.IdMeli.toString()} `;
		  
		  Conn.query(Sql, function (err, result) 
	      {
           if (err) throw console.log(err);
          
          if (result.length>0)				
		  {
		    if(result[0].StatusOrder==1) {io.to(socket.id).emit("PosFollow",{resualt:true,Msg:"درخواست شما در  حال انتظار مي باشد ."});	}
		    if(result[0].StatusOrder==2) {io.to(socket.id).emit("PosFollow",{resualt:true,Msg:"درخواست شما در حال بررسي مي باشد ."});	}
		    if(result[0].StatusOrder==3) {io.to(socket.id).emit("PosFollow",{resualt:true,Msg:"پوز شما با موفقيت نصب گرديد."});	}			
		  } else
		  {
			io.to(socket.id).emit("PosFollow",{resualt:false,Msg:"اين درخواست در سيستم وجود ندارد."});  
		  }
		   Conn.end();
        });		
 	  });
    });
	socket.on("RegisterUser",function(data)
	{			  
	  var Conn=Config.ConMySql();
	  Conn.connect(function(err) 
	  {
	
		var Sql="INSERT INTO tuser( Name,Family,Address, Pass,Mobile,Credit,"+
			"Points,Act,Tp_User,Moaref,IdSocket) VALUES ?";
		var Values= [];
		Values.push([data.Name,data.Family,'',data.Mobile,data.Mobile,'0','0','1','1',data.Moaref,socket.id.toString()]);
		
		Conn.query(Sql,[Values], function (err, result) 
		  {
			if (err) console.log('eror'); else
			{
				var rand=Math.floor(Math.random()*10000);
				io.to(socket.id).emit("RegisterUser",{Resualt:true,InfoRegister:{Name:data.Name,Family:data.Family,Mobile:data.Mobile,Id_User:result.insertId,AuthCode:rand}});
				
			}      

			Conn.end();
		  });		  
		
	  });
	});
	socket.on("LoginUser",function(data)
	{			  
	  var Conn=Config.ConMySql();
	  Conn.connect(function(err) 
	  {
	
		var Sql=`select * from tuser   where  Mobile=${data.Mobile} `;
		Conn.query(Sql, function (err, result) 
		{
		 if (err)  console.log(err);
		 	var rand=Math.floor(Math.random()*10000);
            console.log(rand);
		 if (result.length>0)			 
		 io.to(socket.id).emit("LoginUser",{Resualt:true,InfoRegister:{Name:result[0].Name,Family:result[0].Family,Mobile:result[0].Mobile,Id_User:result[0].Id,AuthCode:rand}});
		 else io.to(socket.id).emit("LoginUser",{Resualt:false,Msg:"شماره موبايل در اين سيستم تعريف نشده است ."});
		 Conn.end();
	    });
	   });
	});
	socket.on("ListAgentNearBy",function(data)
	{			  
	  var Conn=Config.ConMySql();
	  Conn.connect(function(err) 
	  {
	
		
		var Sql=`SELECT Id_Agent,Id_UserAgent,Name,Mobile,Tel,Address,Latitude,Longtitude,Tp_Agent,
		(select ttpagent.NameTpAgent   from ttpagent where ttpagent.Id=Tp_Agent) As Des_Agent FROM tagent 
		where Active=1`;
		Conn.query(Sql, function (err, result) 
		{
		 if (err)  
	 	 {
			io.to(socket.id).emit("ListAgentNearBy",{Resualt:false,Msg:"خطاي غير منتظره رخ داده است ."});
		 }else 
		 {
			 console.log(result);
			io.to(socket.id).emit("ListAgentNearBy",{Resualt:true,Info:result});
		 }

		 Conn.end();
	    });
	   });
    });
	socket.on("ListBillInstallmentInsurance",function(data)
	{			  
	  var Conn=Config.ConMySql();
	  Conn.connect(function(err) 
	  {		
		var Sql=`SELECT   tpay.Id,tpay.NumberInsurance,tpay.NumberInstallment,tpay.BillId,tpay.PaymentId,tpay.Date,tpay.IsOff,tpay.TraceNumber,tpay.Tp_Bill,ttrans.Id_Ipg,
		(select  NamePsp from ttppsp as psp where psp.Id=ttrans.Id_Ipg) as NameIpg,IFNULL(tpay.DatePay,0) as DatePay,IFNULL(tpay.TimePay,0) as TimePay,Tpay.IdOrderApp FROM tpaybillinsurance as tpay
		INNER  join ttp_transaction as ttrans
		on tpay.Tp_Bill=ttrans.Id where tpay.NumberInsurance=${data.NumberInsurance}`;
		Conn.query(Sql, function (err, result) 
		{
		 if (err)  
	 	 {
			io.to(socket.id).emit("ListBillInstallmentInsurance",{Resualt:false,Msg:"خطاي غير منتظره رخ داده است ."});
		 }else 
		 {
			 console.log(result);
			io.to(socket.id).emit("ListBillInstallmentInsurance",{Resualt:true,Data:result});
		 }
		 Conn.end();
	    });
	   });
    });
	socket.on("ListHomeNearby",function(data)
	{			  
	  var Conn=Config.ConMySql();
	  Conn.connect(function(err) 
	  {		
		var Sql=`SELECT Id, Id_Rl_thomebussinece, Description, Tp_Home, Ostan,City,Zone,Latitude, 
		Longtitude,DateStart,DateExpire, Tp_LevelAdvertising,Tp_RegistrationAdvertising,RequestView,Status, 
		(select GetDetailsHomeRegistration(Id_Rl_thomebussinece,Tp_RegistrationAdvertising)) as DetailHomeRegistration,
		 (select GetDetailsItemhome(Tp_Home,Id)) As DetailsItem FROM thome
		where  (select FORMAT(( SELECT GetDistance(Latitude,Longtitude,${data.Latitude},${data.Longitude})),3)*1000 <20000)`;
		
		
		Conn.query(Sql, function (err, result) 
		{

		 if (err)  
	 	 {
		   console.log(err);
		   io.to(socket.id).emit("ListHomeNearby",{Resualt:false,Msg:"خطاي غير منتظره رخ داده است ."});
		 }else 
		 {
			var search="";
			for (var i=0;i<result.length;i++)
			{
				search=search+result[i].Id;

			}
		    var Sql='select * from tphotohome where Id_Rl_thome in  ('+search+')';	
			Conn.query(Sql, function (err, resultphoto)
			{
			 console.log(result);
			 io.to(socket.id).emit("ListHomeNearby",{Resualt:true,Data:result,Photo:resultphoto});
             Conn.end();			 
			});
			
		 }
		 
	    });
	   });
    });
	socket.on("NewRegisterAdvertising",function(data)
	{			  
	  var Conn=Config.ConMySql();
	  var Home=require("./Function/Home.js")
	  console.log(data);
	  Home.NewRegisterAdvertising(Conn,data,function(error)
	  {
		console.log("error");
		console.log(error);
		io.to(socket.id).emit("NewRegisterAdvertising",{Resualt:false,Msg:"خطايي در ارتباط به بانک اطلاعاتي رخ داده است"});

	  },function(Res)
	  {
		console.log("res");
		console.log(Res);  
		io.to(socket.id).emit("NewRegisterAdvertising",{Resualt:true,Data:Res});
	  });
	 
    });
	socket.on("UpdateRegisterAdvertising",function(data)
	{			  
	  var Conn=Config.ConMySql();
	  var Home=require("./Function/Home.js")
	  console.log(data);
	  Home.UpdateRegisterAdvertising(Conn,data,function(error)
	  {
		console.log("update");
		console.log(error);
		io.to(socket.id).emit("UpdateRegisterAdvertising",{Resualt:false,Msg:"خطايي در ارتباط به بانک اطلاعاتي رخ داده است"});

	  },function(Res)
	  {
		console.log(Res);  
		io.to(socket.id).emit("UpdateRegisterAdvertising",{Resualt:true,Data:Res});
	  });
	 
    });	
	socket.on("SaveSaleApartmentResidential",function(data)
	{			  
	  var Conn=Config.ConMySql();
	  var Home=require("./Function/Home.js")
	 
	  Home.SaveSaleApartmentResidential(Conn,data,function(error)
	  {
		
		console.log(error);
		io.to(socket.id).emit("SaveSaleApartmentResidential",{Resualt:false,Msg:"خطايي در ارتباط به بانک اطلاعاتي رخ داده است"});

	  },function(Res)
	  {
		console.log(Res);  
		io.to(socket.id).emit("SaveSaleApartmentResidential",{Resualt:true,Data:Res});
	  });
	 
	});	
	socket.on("UpdateSaleApartmentResidential",function(data)
	{			  
	  var Conn=Config.ConMySql();
	  var Home=require("./Function/Home.js")
	 
	  Home.UpdateSaleApartmentResidential(Conn,data,function(error)
	  {
		
		console.log(error);
		io.to(socket.id).emit("UpdateSaleApartmentResidential",{Resualt:false,Msg:"خطايي در ارتباط به بانک اطلاعاتي رخ داده است"});

	  },function(Res)
	  {
		console.log(Res);  
		io.to(socket.id).emit("UpdateSaleApartmentResidential",{Resualt:true,Data:Res});
	  });
	 
    });	
	socket.on("SaveRentApartmentResidential",function(data)
	{			  
	  var Conn=Config.ConMySql();
	  var Home=require("./Function/Home.js")
	 
	  Home.SaveRentApartmentResidential(Conn,data,function(error)
	  {
		
		console.log(error);
		io.to(socket.id).emit("SaveRentApartmentResidential",{Resualt:false,Msg:"خطايي در ارتباط به بانک اطلاعاتي رخ داده است"});

	  },function(Res)
	  {
		console.log(Res);  
		io.to(socket.id).emit("SaveRentApartmentResidential",{Resualt:true,Data:Res});
	  });
	 
	});	
	socket.on("UpdateRentApartmentResidential",function(data)
	{			  
	  var Conn=Config.ConMySql();
	  var Home=require("./Function/Home.js")
	 
	  Home.UpdateRentApartmentResidential(Conn,data,function(error)
	  {
		
		console.log(error);
		io.to(socket.id).emit("UpdateRentApartmentResidential",{Resualt:false,Msg:"خطايي در ارتباط به بانک اطلاعاتي رخ داده است"});

	  },function(Res)
	  {
		console.log(Res);  
		io.to(socket.id).emit("UpdateRentApartmentResidential",{Resualt:true,Data:Res});
	  });
	 
	});	
	socket.on("SaveSaleApartmentCommercial",function(data)
	{			  
	  var Conn=Config.ConMySql();
	  var Home=require("./Function/Home.js")
	 
	  Home.SaveSaleApartmentCommercial(Conn,data,function(error)
	  {
		
		console.log(error);
		io.to(socket.id).emit("SaveSaleApartmentCommercial",{Resualt:false,Msg:"خطايي در ارتباط به بانک اطلاعاتي رخ داده است"});

	  },function(Res)
	  {
		console.log(Res);  
		io.to(socket.id).emit("SaveSaleApartmentCommercial",{Resualt:true,Data:Res});
	  });
	 
	});	
	socket.on("UpdateSaleApartmentCommercial",function(data)
	{			  
	  var Conn=Config.ConMySql();
	  var Home=require("./Function/Home.js")
	 
	  Home.UpdateSaleApartmentCommercial(Conn,data,function(error)
	  {
		
		console.log(error);
		io.to(socket.id).emit("UpdateSaleApartmentCommercial",{Resualt:false,Msg:"خطايي در ارتباط به بانک اطلاعاتي رخ داده است"});

	  },function(Res)
	  {
		console.log(Res);  
		io.to(socket.id).emit("UpdateSaleApartmentCommercial",{Resualt:true,Data:Res});
	  });
	 
	});	
	socket.on("SaveRentApartmentCommercial",function(data)
	{			  
	  var Conn=Config.ConMySql();
	  var Home=require("./Function/Home.js")
	 
	  Home.SaveRentApartmentCommercial(Conn,data,function(error)
	  {
		
		console.log(error);
		io.to(socket.id).emit("SaveRentApartmentCommercial",{Resualt:false,Msg:"خطايي در ارتباط به بانک اطلاعاتي رخ داده است"});

	  },function(Res)
	  {
		console.log(Res);  
		io.to(socket.id).emit("SaveRentApartmentCommercial",{Resualt:true,Data:Res});
	  });
	 
	});	
	socket.on("UpdateRentApartmentCommercial",function(data)
	{			  
	  var Conn=Config.ConMySql();
	  var Home=require("./Function/Home.js")
	  Home.UpdateRentApartmentCommercial(Conn,data,function(error)
	  {
		
		console.log(error);
		io.to(socket.id).emit("UpdateRentApartmentCommercial",{Resualt:false,Msg:"خطايي در ارتباط به بانک اطلاعاتي رخ داده است"});

	  },function(Res)
	  {
		console.log(Res);  
		io.to(socket.id).emit("UpdateRentApartmentCommercial",{Resualt:true,Data:Res});
	  });
	 
	});	
    socket.on("SaveSaleEarth", function (data) {
        var Conn = Config.ConMySql();
        var Home = require("./Function/Home.js")
        Home.SaveSaleEarth(Conn, data, function (error) {

            console.log(error);
            io.to(socket.id).emit("SaveSaleEarth", { Resualt: false, Msg: "خطايي در ارتباط به بانک اطلاعاتي رخ داده است" });

        }, function (Res) {
                console.log(Res);
            io.to(socket.id).emit("SaveSaleEarth", { Resualt: true, Data: Res });
            });

    });	
    socket.on("UpdateSaleEarth", function (data) {
        var Conn = Config.ConMySql();
        var Home = require("./Function/Home.js")
        Home.UpdateSaleEarth(Conn, data, function (error) {

            
            io.to(socket.id).emit("UpdateSaleEarth", { Resualt: false, Msg: "خطايي در ارتباط به بانک اطلاعاتي رخ داده است" });

        }, function (Res) {
            console.log(Res);
            io.to(socket.id).emit("UpdateSaleEarth", { Resualt: true, Data: Res });
        });

    });	

    socket.on("DeleteItemHome", function (data) {
        var Conn = Config.ConMySql();
        var Home = require("./Function/Home.js");
        console.log('33333333');
        Home.DeleteItemhome(Conn, data, function (error) {

            console.log(error);
            io.to(socket.id).emit("DeleteItemHome", { Resualt: false, Msg: "خطايي در ارتباط به بانک اطلاعاتي رخ داده است" });

        }, function (Res) {
            
            io.to(socket.id).emit("DeleteItemHome", { Resualt: true, Data: Res });
        });

    });	
	
	socket.on("disconnect",function()
    {
	   console.log("disconnect");
	
    });	
	
});

http.listen(1300);
console.log("connected");