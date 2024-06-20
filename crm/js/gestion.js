// Variables
var g_id_gestion = "";

// Funcion Agregargestion
function agregarGestion(){
    // Variables para obtener nombres de la gestion desde interfaz
    var id_usuario = document.getElementById("sel_id_usuario").value;
    var id_cliente = document.getElementById("sel_id_cliente").value;
    var id_tipo_gestion = document.getElementById("sel_id_tipo_gestion").value;
    var id_resultado = document.getElementById("sel_id_resultado").value;
    var comentarios = document.getElementById("txt_comentarios").value;
    // Agregar api gestion
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    // Variable para formatear fecha y hora
    var fechaHoraActual = obtenerFechaHora();

    const raw = JSON.stringify({
        "id_usuario": id_usuario,
        "id_cliente": id_cliente,
        "id_tipo_gestion": id_tipo_gestion,
        "id_resultado": id_resultado,
        "comentarios": comentarios,
        "fecha_registro": fechaHoraActual
    });
    const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };
    fetch("http://144.126.210.74:8080/api/gestion", requestOptions)
    .then((response)=>{
        if(response.status == 200){
            location.href = "listar.html";
        }
        if(response.status == 400){
            mostrarAlerta("No se pudo agregar la gestion");
        }
    })
    .then(result => console.log(result))
    .catch((error) => console.error(error));
}

// Funcion Listargestion
function listarGestion(){
    // Agregar api gestion
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    // Agregamos sentencia sql para listar gestion
    var raw = JSON.stringify({ "query": "select ges.id_gestion as id_gestion,cli.id_cliente, ges.comentarios as comentarios,CONCAT(cli.nombres, ' ',cli.apellidos) as nombre_cliente,CONCAT(usu.nombres,' ' ,usu.apellidos) as nombre_usuario,tge.nombre_tipo_gestion as nombre_tipo_gestion,res.nombre_resultado as nombre_resultado,ges.fecha_registro as fecha_registro from gestion ges,usuario usu,cliente cli,tipo_gestion tge,resultado res where ges.id_usuario = usu.id_usuario and ges.id_cliente = cli.id_cliente and ges.id_tipo_gestion = tge.id_tipo_gestion and ges.id_resultado = res.id_resultado " });
    // metodo post
    const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };
    fetch("http://144.126.210.74:8080/dynamic", requestOptions)
    .then(response => response.json())
    .then((json) => {
        json.forEach(completarFila);
        $('#tbl_gestion').DataTable();
    })
    .then(result => console.log(result))
    .catch(error => console.log('error', error));
}

// Funcion Completar fila
function completarFila(element,index,arr){
    // Creamos formato tabla
    arr[index] = document.querySelector("#tbl_gestion tbody").innerHTML += 
    `<tr> 
    <td>${element.id_gestion}</td>
    <td>${element.nombre_cliente}</td>
    <td>${element.nombre_usuario}</td>
    <td>${element.nombre_tipo_gestion}</td>
    <td>${element.nombre_resultado}</td>
    <td>${element.comentarios}</td>
    <td>${element.fecha_registro}</td>
    <td>
    <a href='actualizar.html?id=${element.id_gestion}' class='btn btn-warning btn-sm'>Actualizar</a>
    <a href='eliminar.html?id=${element.id_gestion}' class='btn btn-danger btn-sm'>Eliminar</a>
    </td>
    </tr>`
}

// Funcion para el ID de actualizar la gestion
function obtenerIdActualizacion(){
    const queryString = window.location.search;
    const parametros = new URLSearchParams(queryString);
    const p_id_gestion = parametros.get('id');
    g_id_gestion = p_id_gestion;
    //funcion para obtener la actualizacion
    obtenerDatosActualizacion(p_id_gestion);
}

// Funcion para eliminar el ID de la gestion
function eliminarIdEliminacion(){
    const queryString = window.location.search;
    const parametros = new URLSearchParams(queryString);
    const p_id_gestion = parametros.get('id');
    g_id_gestion = p_id_gestion;
    //funcion para eliminar la gestion
    obtenerDatosEliminacion(p_id_gestion);
}

// Funcion para obtener datos de Eliminacion
function obtenerDatosEliminacion(id_gestion){
    // Metodo get
    const requestOptions = {
        method: 'GET',
        redirect: 'follow'
    };
    fetch("http://144.126.210.74:8080/api/gestion/"+id_gestion, requestOptions)
    .then(response => response.json())
    .then((json) => json.forEach(completarEtiquetaEliminar))
    .then((result) => console.log(result))
    .catch((error) => console.error(error));
}

// Funcion para obtener datos de actualizacion
function obtenerDatosActualizacion(id_gestion){
    const requestOptions = {
        method: 'GET',
        redirect: 'follow'
    };
    fetch("http://144.126.210.74:8080/api/gestion/"+id_gestion, requestOptions)
    .then((response) => response.json())
    .then((json) => json.forEach(completarFormularioActualizar))
    .then((result) => console.log(result))
    .catch((error) => console.error(error));
}

// Funcion para etiqueta de eliminacion
function completarEtiquetaEliminar(element){
    var nombreCliente = element.nombre_cliente;
    var nombreUsuario = element.nombre_usuario;
    var comentario = element.comentarios;
    document.getElementById("lbl_eliminar").innerHTML = "¿Desea eliminar la gestion de "+nombreCliente+" realizada por "+nombreUsuario+" con el siguiente comentario "+comentario+"?";
}

// Funcion para completar formulario de actualizacion
function completarFormularioActualizar(element){
    var id_usuario = element.id_usuario;
    var id_cliente = element.id_cliente;
    var id_tipo_gestion = element.id_tipo_gestion;
    var id_resultado = element.id_resultado;
    var comentarios = element.comentarios;
    document.getElementById("sel_id_usuario").value = id_usuario;
    document.getElementById("sel_id_cliente").value = id_cliente;
    document.getElementById("sel_id_tipo_gestion").value = id_tipo_gestion;
    document.getElementById("sel_id_resultado").value = id_resultado;
    document.getElementById("txt_comentarios").value = comentarios;
    //funcion cargar listas desplegables
    cargarListasDesplegables();
}

// Funcion Actualizar
function actualizarGestion(){
    // Variables para obtener nombres de la gestion desde interfaz
    var id_usuario = document.getElementById("sel_id_usuario").value;
    var id_cliente = document.getElementById("sel_id_cliente").value;
    var id_tipo_gestion = document.getElementById("sel_id_tipo_gestion").value;
    var id_resultado = document.getElementById("sel_id_resultado").value;
    var comentarios = document.getElementById("txt_comentarios").value;
    // Agregar api gestion
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
  
    const raw = JSON.stringify({
        "id_usuario": id_usuario,
        "id_cliente": id_cliente,
        "id_tipo_gestion": id_tipo_gestion,
        "id_resultado": id_resultado,
        "comentarios": comentarios,
    });
    // Metodo patch
    const requestOptions = {
        method: 'PATCH',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };
    fetch("http://144.126.210.74:8080/api/gestion/"+g_id_gestion, requestOptions)
    .then((response)=>{
        if(response.status == 200){
            location.href = "listar.html";
        }
        if(response.status == 400){
            mostrarAlerta("No se pudo actualizar la gestion");
        }
    })
    .then((result) => console.log(result))
    .catch((error) => console.error(error));
}

// Funcion Eliminar
function eliminarGestion(){
    // Agregar api gestion
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    // Metodo delete
    const requestOptions = {
        method: 'DELETE',
        headers: myHeaders,
        redirect: 'follow'
    };
    fetch("http://144.126.210.74:8080/api/gestion/"+g_id_gestion, requestOptions)
    .then((response)=>{
        if(response.status == 200){
            location.href = "listar.html";
        }
        if(response.status == 400){
            mostrarAlerta("No se puede eliminar la gestion")
        }
    })
    .then((result) => console.log(result))
    .catch((error) => console.error(error));
}

// Funcion para obtener fecha y hora
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

// Funcion para lista desplegable
function cargarListasDesplegables(){
    cargarSelectResultado();
    cargarSelectCliente();
    cargarSelectUsuario();
    cargarSelectTipoGestion();
}

// Funcion para cargar select de resultado
function cargarSelectResultado(){
    const requestOptions = {
        method: 'GET',
        redirect: 'follow'
    };
    fetch("http://144.126.210.74:8080/api/resultado?_size=200", requestOptions)
    .then(response => response.json())
    .then(json => json.forEach(completarOpcionResultado))
    .then(result => console.log(result))
    .catch((error) => console.error(error));
}

// Funcion para completar opcion de resultado
function completarOpcionResultado(element,index,arr){
    arr[index] = document.querySelector("#sel_id_resultado").innerHTML +=
    `<option value='${element.id_resultado}'> ${element.nombre_resultado} </option>` 
}

// Funcion para cargar select de cliente
function cargarSelectCliente(){
    const requestOptions = {
        method: 'GET',
        redirect: 'follow'
    };
    fetch("http://144.126.210.74:8080/api/cliente?_size=200", requestOptions)
    .then(response => response.json())
    .then(json => json.forEach(completarOpcionCliente))
    .then((result) => console.log(result))
    .catch((error) => console.error(error));
}

// Funcion para completar opcion de cliente
function completarOpcionCliente(element,index,arr){
    arr[index] = document.querySelector("#sel_id_cliente").innerHTML +=
    `<option value='${element.id_cliente}'> ${element.nombres} ${element.apellidos} </option>`
}

// Funcion para cargar select de usuario
function cargarSelectUsuario(){
    const requestOptions = {
        method: 'GET',
        redirect: 'follow'
    };
    fetch("http://144.126.210.74:8080/api/usuario?_size=200", requestOptions)
    .then(response => response.json())
    .then(json => json.forEach(completarOpcionUsuario))
    .then((result) => console.log(result))
    .catch((error) => console.error(error));
}

// Funcion para completar opcion de usuario
function completarOpcionUsuario(element,index,arr){
    arr[index] = document.querySelector("#sel_id_usuario").innerHTML +=
    `<option value='${element.id_usuario}'> ${element.nombres} ${element.apellidos} </option>`
}

// Funcion para cargar select de tipo de gestion
function cargarSelectTipoGestion(){
    const requestOptions = {
        method: 'GET',
        redirect: 'follow'
    };
    fetch("http://144.126.210.74:8080/api/tipo_gestion?_size=200", requestOptions)
    .then(response => response.json())
    .then(json => json.forEach(completarOpcionTipoGestion))
    .then((result) => console.log(result))
    .catch((error) => console.error(error));
}

// Funcion para completar opcion de tipo de gestion
function completarOpcionTipoGestion(element,index,arr){
    arr[index] = document.querySelector("#sel_id_tipo_gestion").innerHTML +=
    `<option value='${element.id_tipo_gestion}'> ${element.nombre_tipo_gestion} </option>`
}