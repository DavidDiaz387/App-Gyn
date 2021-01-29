var {getConnect} = require('./db');
var Excel = require('exceljs');


var meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];


async function generateExcel(user = 'App Gyn'){
    let workbook = new Excel.Workbook();
    let fecha = new Date();
    let anio = fecha.getFullYear()
    let mes = fecha.getMonth()
    // Validar si es por Admin o por App Gyn
    /*  Es para pasar por parametro en la busqueda de la fecha del mes pasado
    if(fecha.getMonth()-1 == -1){
        mes = fecha.getMonth() + 11
        anio = fecha.getFullYear()-1
    }else{
        mes = fecha.getMonth() - 1;
        anio = fecha.getFullYear();
    }
    */
    let res = await getResumen(anio,mes) // Es para poner la utlima fecha de creacion del resumen
    console.log(res);
    let response;
    // ---Informacion de la hoja Excel
    /* En caso de que alguien lo genere, poner Admin */
    workbook.creator = user;
    /* Poner Admin en caso de que alguien lo haya generado */
    workbook.lastModifiedBy = user;
    workbook.created = fecha;
    workbook.modified = fecha;
    /* Que aparesca la ultima fecha en que se genera un excel */
    workbook.lastPrinted = new Date(res[0]);

    // --- Creacion de la hoja Excel
    var sheet = workbook.addWorksheet(`Ingresos de ${meses[fecha.getMonth()]}`);
    sheet.properties.defaultColWidth = 15 

    sheet.columns = [
        { header: 'Nombre', key: 'nombre' },
        { header: 'Apellido', key: 'apellido' },
        { header: 'Mes', key: 'mes' },
        { header: 'Año', key: 'anio' },
        { header: 'Ingreso por Mes', key: 'cash' },
        { header: 'Total de ingreso', key: 'total' }
    ]
    
    // Hacer query de datos y agregar las filas
    
    let datos = await getClient(meses[fecha.getMonth()])
    let total = 0;

    datos.forEach(dato =>{
        total = total + dato.precioXMes              
    })
    datos.forEach(dato => {
        sheet.addRow({nombre:`${dato.nombre}`,apellido:`${dato.apellido}`,mes:`${dato.mes}`,anio:`${fecha.getFullYear()}`,cash:`${dato.precioXMes}`});
    });
    sheet.addRow({total:`Total: ${total}`})
    // Guardar Excel en PC
    workbook.xlsx.writeFile(`${user}-Resumen de ${meses[fecha.getMonth()]}.xlsx` )
    .then(function() {
        // Success Message
        response = 'Hoja Excel creada con exito!'
    });
    
    await setResumen(user,'Resumen de ' + meses[fecha.getMonth()])

    return response
}

/* Funciones de Query para la base de datos con respecto al Excel */

async function getClient(mes){
    let con = await getConnect()
    let datos = await con.query(`SELECT c.nombre, c.apellido, c.mes, c.precioXMes FROM clientes c
    WHERE mes = '${mes}'`)
    return datos
}

async function getResumen(anio,mes){
    let con = await getConnect()
    let res = await con.query(`SELECT r.fecha FROM resumenes r
    WHERE user = 'App Gyn' AND fecha LIKE '%${anio}-${mes}%'`)
    return res 
}

async function setResumen(user,resumen){
    let con = await getConnect()
    let res = await con.query(`INSERT INTO resumenes (user,resumen) 
    VALUES('${user}', '${resumen}')`)
    console.log(res);
}


module.exports = {
    generateExcel,
    getResumen
}