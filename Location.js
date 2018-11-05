const request = require('request');

function GetLocation(data1,data2,error,callback )  
{
  var Url=`http://maps.googleapis.com/maps/api/distancematrix/json?origins=${data1.Lat},${data1.Long}&destinations=${data2.Lat},${data2.Long}&mode=driving&language=en-EN&sensor=true`;	
   const options = 
         {  
          url: Url,
          method: 'GET',
          headers: 
  	      {
           'Accept': 'application/json',
           'Accept-Charset': 'utf-8',
          }
         };	
		  request(options, function(err, res, body) 
         {  
	 	  if (err) throw error(err);
          let json = JSON.parse(body);
		  callback(json);
        });
}
module.exports.GetLocation = GetLocation;
