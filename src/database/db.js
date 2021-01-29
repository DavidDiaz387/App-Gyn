const mysql = require('promise-mysql');

let connection = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'',
    database:'gyn_db'
})

function getConnect(){
  return connection;
}

module.exports = {
  getConnect
}