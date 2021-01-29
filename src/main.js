const {BrowserWindow } = require('electron');
const {getConnect} = require('./database/db');
const {generateExcel,getResumen} = require('./database/excel');


function createWindow () {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  })

  win.loadFile('src/views/index.html')
}

let fecha = new Date();
let anio = fecha.getFullYear()
let mes = fecha.getMonth()
/* Condicion para activar la creacion del Excel automatizado en el ultimo dia del mes que no sea Domingo */

if(fecha.getDate() == 1 || fecha.getDate() == 2){

}
/*  Es para pasar por parametro en la busqueda de la fecha del mes pasado
if(fecha.getMonth()-1 == -1){
    mes = fecha.getMonth() + 11
    anio = fecha.getFullYear()-1
    appResumen(anio,mes)
}else{
    mes = fecha.getMonth() - 1;
    anio = fecha.getFullYear();
    appResumen(anio,mes)
}
*/

async function appResumen(anio,mes){
  let fecha = await getResumen(anio,mes)
  return fecha
}


class Client {
  
  constructor(clienteId,nombre,apellido,fechaInicio){
    this.clienteId = clienteId,
    this.nombre = nombre,
    this.apellido = apellido,
    this.fechaInicio = fechaInicio
  }
  
  async connect(){
    let con = await getConnect()
    return con
  }
  
  async createClient(){
    let con = await this.connect()
    let clientes = await con.query(`INSERT INTO clientes (clienteId,nombre,apellido,fechaInicio)
    VALUES ("${this.clienteId}","${this.nombre}","${this.apellido}","${this.fechaInicio}")`)
    console.log(clientes);
  }

  async findClient(id,apellido){
    let con = await this.connect()
    let where
    if(id != "" && apellido != ""){
      where = `WHERE clienteId = '${id}' AND apellido LIKE '${apellido}'`
    }else if(id != ""){
      where = `WHERE clienteId = '${id}'`
    }else if(apellido != ""){
      where = `WHERE apellido LIKE '${apellido}'`
    }
    let cliente = await con.query(`SELECT * FROM clientes ${where}`)
    
    console.log(cliente);
  }

}


module.exports = {
  createWindow,
  Client
}