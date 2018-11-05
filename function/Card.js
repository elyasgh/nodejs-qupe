function BalanceCard(Req,callback) 
{
var request = require("request");

var options = { method: 'POST',rejectUnauthorized: false,
      requestCert: true,
      agent: false,
  url: 'https://api.tosanboom.com:4432/v1/cards/balance',
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
     'App-Key': '12727' },
  body: 
   { pan: Req.Card,
      pin: Req.Pass2,
     pin_type: 'EPAY',
     cvv2: Req.Cvv2,
     exp_date: Req.Year+Req.Month },
  json: true };

request(options, function (error, response, body) {
  
  console.log(options);
  if (error)  console.log(error);
  

  callback(body);
});
}
function InquiryCardToCard(Req,callback) 
{
var request = require("request");

var options = { method: 'POST',rejectUnauthorized: false,
      requestCert: true,
      agent: false,
  url: 'https://api.tosanboom.com:4432/v1/cards/holder/',
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
     'App-Key': '12727' },
  body: 

   { 
   destination_pan: "6393461031211770",
   pan: '6393461031211770',    
     pin: '2574584',
     pin_type: 'EPAY',
     cvv2: '958',
     exp_date: '9911' },
  json: true };

request(options, function (error, response, body) {
  if (error) throw new Error(error);
  

  callback(body);
});
}
function TransferCardToCard(Req,callback) 
{
var request = require("request");

var options = { method: 'POST',rejectUnauthorized: false,
      requestCert: true,
      agent: false,
  url: 'https://api.tosanboom.com:4432/v1/cards/transfer',
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
     'App-Key': '12727' },
  body: 

   { 
   amount:'50',
   destination: '6393461031211804',
   destination_type: 'PAN',
   pan: '6393461031211770',    
     pin: '2574584',
     pin_type: 'EPAY',
     cvv2: '958',
     exp_date: '9911' },
  json: true };

request(options, function (error, response, body) {
  if (error) throw new Error(error);
  

  callback(body);
});
}
module.exports.BalanceCard=BalanceCard;
module.exports.InquiryCardToCard=InquiryCardToCard;
module.exports.TransferCardToCard=TransferCardToCard;