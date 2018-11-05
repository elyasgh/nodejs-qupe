function InquiryBill(Req,callback,ResponseError) 
{

  var request = require("request");
 var options = { method: 'GET',
      rejectUnauthorized: false,
      requestCert: true,
      agent: false,
  url: `https://api.tosanboom.com:4432/v1/bills/${Req.BillId}/payments/${Req.PaymentId}`,
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
     'BANK-ID': `${Req.KeyBank}`,
     'Device-Id': '192.168.1.1',
     'App-Key': '12727' } };

     
request(options, function (error, response, body) {
  if (error) ResponseError(error);else callback(body);
});

}


function InquiryBillMciTci(Req,callback) 
{

var request = require("request");

var options = { method: 'GET',
      rejectUnauthorized: false,
      requestCert: true,
      agent: false,
  url: 'https://api.tosanboom.com:4432/v1/bills/phone/info',
  qs: 
   { phone_number: Req.Number.toString(),
     midterm: Req.midterm,
     phone_type: Req.Phone_Type },
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
     'App-Key': '12727' } };

request(options, function (error, response, body) {
  if (error) throw new Error(error);
  
callback(body);
});

}
function PayBillPhone(Req,callback) 
{
var request = require("request");

var options = { method: 'POST',rejectUnauthorized: false,
      requestCert: true,
      agent: false,
  url: `https://api.tosanboom.com:4432/v1/bills/${Req.BillId}/payments/${Req.PaymentId}/card`,
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
     track2: null,
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
function PayBill(Req,callback) 
{
var request = require("request");

var options = { method: 'POST',rejectUnauthorized: false,
      requestCert: true,
      agent: false,
  url: `https://api.tosanboom.com:4432/v1/bills/${Req.BillId}/payments/${Req.PaymentId}/card`,
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
     'BANK-ID':  `${Req.KeyBank}`,
     'Device-Id': '192.168.1.1',
     'App-Key': '12727' },
  body: 
   { pan: Req.Card,
     track2: null,
     pin: '2574584',
     pin_type: 'EPAY',
     cvv2: '958',
     exp_date: '9911'},
  json: true };

request(options, function (error, response, body) {
  if (error) throw new Error(error);
  consol.log(body);

  callback(body);
});
}
module.exports.InquiryBill=InquiryBill;
module.exports.InquiryBillMciTci=InquiryBillMciTci;
module.exports.PayBillPhone=PayBillPhone;
module.exports.PayBill=PayBill;