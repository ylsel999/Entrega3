// Variables
var g_id_resultado = "";

// Funcion Agregar
function agregarResultado(){
    // Variable para obtener nombre del tipo de gestion desde interfaz
    var nombre_resultado = document.getElementById("txt_nombre_resultado").value;
    // Agregar api tipo de gestion
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    // variable para formatear fecha y hora
    var fechaHoraActual = obtenerFechaHora();
    const raw =JSON.stringify({
        "nombre_resultado": nombre_resultado,
        "fecha_registro": fechaHoraActual
    });
    // Metodo post
    const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };
    fetch("http://144.126.210.74:8080/api/resultado", requestOptions)
    .then((response)=>{
        if(response.status == 200){
            location.href = "listar.html";
        }
        if(response.status == 400){
            mostrarAlerta("No se pudo agregar el resultado");
        }
    })
    .then((result) => console.log(result))
    .catch((error) => console.error(error));
}

// Funcion para Listar resultado
function listarResultado(){
    // Metodo get
    const requestOptions = {
        method: 'GET',
        redirect: 'follow'
    };
    fetch("http://144.126.210.74:8080/api/resultado?_size=200", requestOptions)
    .then(response => response.json())
    .then((json) => {
        json.forEach(completarFila);
        $('#tbl_resultado').DataTable();
    })
    .then((result) => console.log(result))
    .catch((error) => console.error(error));
}

// Funcionpara Completar fila
function completarFila(element,index,arr){
    // Creamos la tabla
    arr[index] = document.querySelector("#tbl_resultado tbody").innerHTML += 
    `<tr> 
    <td>${element.id_resultado}</td>
    <td>${element.nombre_resultado}</td>
    <td>${element.fecha_registro}</td>
    <td>
    <a href='actualizar.html?id=${element.id_resultado}' class='btn btn-warning btn-sm'>Actualizar</a>
    <a href='eliminar.html?id=${element.id_resultado}' class='btn btn-danger btn-sm'>Eliminar</a>
    </td>
    </tr>`
}

// Funcion para el ID de actualizar el resultado
function obtenerIdActualizacion(){
    const queryString = window.location.search;
    const parametros = new URLSearchParams(queryString);
    const p_id_resultado = parametros.get('id');
    g_id_resultado = p_id_resultado;
    // funcion para obtener datos de actualizacion
    obtenerDatosActualizacion(p_id_resultado);
}

// Funcion para eliminar el id de resultado
function obtenerIdEliminacion(){
    const queryString = window.location.search;
    const parametros = new URLSearchParams(queryString);
    const p_id_resultado = parametros.get('id');
    g_id_resultado = p_id_resultado;
    //funcion para eliminar resultado
    obtenerDatosEliminacion(p_id_resultado);
}

// Funcion para obtener datos de eliminacion
function obtenerDatosEliminacion(id_resultado){
    // Metodo get 
    const requestOptions = {
        method: 'GET',
        redirect: 'follow'
    };
    fetch("http://144.126.210.74:8080/api/resultado/"+id_resultado, requestOptions)
    .then((response) => response.json())
    .then((json) => json.forEach(completarEtiquetaEliminar))
    .then((result) => console.log(result))
    .catch((error) => console.error(error));
}

// Funcion para etiqueta de eliminacion
function completarEtiquetaEliminar(element){
    var nombreResultado = element.nombre_resultado;
    document.getElementById('lbl_eliminar').innerHTML ="¿Desea eliminar este resultado? <b>"+nombreResultado +"</b>";
}

// Funcion para obtener datos de actualizacion
function obtenerDatosActualizacion(id_resultado){
    // Metodo get 
    const requestOptions = {
        method: 'GET',
        redirect: 'follow'
    };
    fetch("http://144.126.210.74:8080/api/resultado/"+id_resultado, requestOptions)
    .then((response) => response.json())
    .then((json) => json.forEach(completarFormularioActualizar))
    .then((result) => console.log(result))
    .catch((error) => console.error(error));
}

// Funcion para completar formulario de actualizacion
function completarFormularioActualizar(element){
    var nombreResultado = element.nombre_resultado;
    document.getElementById('txt_nombre_resultado').value = nombreResultado;
}

// Funcion actualizar
function actualizarResultado(){
    // Variable para obtener nombre del resultado desde interfaz
    var nombre_resultado = document.getElementById("txt_nombre_resultado").value;
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    const raw =JSON.stringify({
        "nombre_resultado": nombre_resultado,
    });
    // Metodo patch
    const requestOptions = {
        method: 'PATCH',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };
    fetch("http://144.126.210.74:8080/api/resultado/"+g_id_resultado, requestOptions)
    .then((response)=>{
        if(response.status == 200){
            location.href = "listar.html";
        }
        if(response.status == 400){
            mostrarAlerta("No se pudo actualizar el resultado");
        }
    })
    .then((result) => console.log(result))
    .catch((error) => console.error(error));
}

// Funcion para eliminar resultado
function eliminarResultado(){

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    // Metodo delete
    const requestOptions = {
        method: 'DELETE',
        headers: myHeaders,
        redirect: 'follow'
    };
    fetch("http://144.126.210.74:8080/api/resultado/"+g_id_resultado, requestOptions)
    .then((response)=>{
        if(response.status == 200){
            location.href = "listar.html";
        }
        if(response.status == 400){
            mostrarAlerta("No se puede eliminar el tipo de gestión")
        }
    })
    .then((result) => console.log(result))
    .catch((error) => console.error(error));
}

// Funcion para formatear la fecha y hora
function obtenerFechaHora(){
    var fechaHoraActual = new Date();
    var fechaFormateada = fechaHoraActual.toLocaleDateString('es-ES',{
        hour12: false,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    }).replace(/(\d+)\/(\d+)\/(\d+)\,\s*(\d+):(\d+):(\d+)/,'$3-$2-$1 $4:$5:$6');
    return fechaFormateada;
}

// Funcion para mostrar error
function mostrarAlerta(mensaje){
    const alertContainer = document.getElementById('alert-container');
    alertContainer.innerHTML = `<div class="alert alert-danger alert-dismissible fade show" role="alert">${mensaje}<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>`;
}