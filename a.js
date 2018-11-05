var moment = require('moment-jalaali');
var m = moment('1989/1/24', 'YYYY/M/D');
console.log(m.format('jYYYY/jMM/jDD'));
var fs = require('fs');
var filePath = 'Image/Home/1111.png'; 
fs.unlinkSync(filePath);
