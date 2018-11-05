  var Aes = require('./function/Aes.js');
		
		var key='VofTktJ,;ajPVm61';
        var iv='VofTktJ,;ajPVm61';
		var f1=Aes.Encrypt('elyas',iv,key);
		var f2=Aes.Encrypt('elyas',key,iv);
		console.log(f1);
		console.log(f2);