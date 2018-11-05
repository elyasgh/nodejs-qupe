function BuyChargePin(Req,callback) 
{
var request = require("request");

var options = { method: 'POST',rejectUnauthorized: false,
      requestCert: true,
      agent: false,
  url: 'https://api.tosanboom.com:4432/v1/charge/pin',
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
     'BANK-ID': Req.KeyBank,
     'Device-Id': '192.168.1.1',
     'App-Key': '12727'
	   },
  body: 
   { 
     pan: Req.Card,  
     track2:'null',	 
     pin: Req.Pass2,
     pin_type: 'EPAY',
     cvv2: Req.Cvv2,
     exp_date: Req.Year+Req.Month,	 
	   payment_service_id:Req.Id_Service,
	   amount:Req.Amount
    },
  json: true };

request(options, function (error, response, body) {
  if (error)  Error(error);
  

  callback(body);
});
}
function BuyChargeToPup(Req,callback) 
{
 var request = require("request");
 var options = { method: 'POST',rejectUnauthorized: false,
      requestCert: true,
      agent: false,
  url: 'https://api.tosanboom.com:4432/v1/charge/topup',
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
     'BANK-ID': Req.KeyBank,
     'Device-Id': '192.168.1.1',
     'App-Key': '12727'
	   },
  body: 
   { 
     pan: Req.Card,  
     track2:'null',	 
     pin: Req.Pass2,
     pin_type: 'EPAY',
     cvv2: Req.Cvv2,
     exp_date: Req.Year+Req.Month,	 
	   payment_service_id:Req.Id_Service,
     amount:Req.Amount,
     mobile_number:Req.Mobile
    },
  json: true };

request(options, function (error, response, body) {
  if (error)  Error(error);
  

  callback(body);
});
}
module.exports.BuyChargePin=BuyChargePin;
module.exports.BuyChargeToPup=BuyChargeToPup;