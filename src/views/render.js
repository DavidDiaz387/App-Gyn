const {Client} = require('../main');
const {generateExcel} = require('../database/excel');

let boton = document.querySelector('.boton')
boton.addEventListener("click",()=>{
    setClient()
})
let btnF = document.querySelector('.btnF')
btnF.addEventListener("click",()=>{
    findClient()
})

let btnGR = document.querySelector('.btnGR');
btnGR.addEventListener('click',()=>{
    generateExcel('Admin')
    console.log("resumen pedido");
})



function setClient(){
    let nombre = document.querySelector('.name').value
    let apellido = document.querySelector('.lastName').value
    let fechaInicio = document.querySelector('.date').value
    let clienteId = document.querySelector('.id').value
    let client = new Client()
    client.createClient()
}

function findClient(){
    let id = document.querySelector(".idC").value
    let apellido = document.querySelector(".apellido").value
    let CL = new Client()

    if(id != "" && apellido != ""){
        CL.findClient(id,apellido)
    }else if(id != "" && apellido == ""){
        CL.findClient(id,"")
    }else if(id == "" && apellido != ""){
        CL.findClient("",apellido)
    }else{
        console.log("Debe ingresar un dato");
    }

}
