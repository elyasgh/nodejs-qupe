var mysql=require('mysql');

function ConMySql() {
    var con = mysql.createConnection(
	{
     host: "localhost",
     user: "root",
     password: "123",
     database: "hampa"
    });
	return con;
  }

module.exports.ConMySql=ConMySql;