var moment = require('moment-jalaali');
var Year=moment().format('jYYYY');
var Month=moment().format('jM');
var Day=moment().format('jD');
if (Month<10) console.log("0"+Month);