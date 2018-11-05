var mysql=require('mysql');
module.exports = {
  ConMySql: function () {
    var con = mysql.createConnection(
	{
     host: "192.168.1.100",
     user: "root",
     password: "123",
     database: "hampa"
    });
	return con;
  }
};