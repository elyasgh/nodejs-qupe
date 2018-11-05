var moment = require('moment-jalaali');
function  GetDateCurrent () {
    var Year=moment().format('jYYYY');
    var Month=moment().format('jM');
    var Day=moment().format('jD');
	var Str="";
	if (Month<10) Str="0"+Month; else Str=Month;
	if (Day<10) Str=Str+"0"+Day; else Str=Str+Day;
	return Year+Str;

  }
  function GetTimeCurrent(){
	return moment().format('HHMMSS');  
  }
  function MiladiToShamsi(DateM)
  {
   var m = moment(DateM, 'YYYY/M/D');
   return m.format('jYYYY/jMM/jDD');
  }
module.exports.GetDateCurrent=GetDateCurrent;
module.exports.GetTimeCurrent=GetTimeCurrent;
module.exports.MiladiToShamsi=MiladiToShamsi;