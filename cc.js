const request = require('request');
  var Url=`https://api.tosanboom.com:4432/v1/auth/market/login`;
	    console.log(Url);
 	    const options = 
         {  
          url: Url,
          method: 'POST',
          headers: 
  	      {
           'Accept': 'application/json',
           'Accept-Charset': 'utf-8',

          }
         };	
         request(options, function(err, res, body) 
         {  
          // let json = JSON.parse(body);
		  console.log(res);
	     
         });