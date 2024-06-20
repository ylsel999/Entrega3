var g_id_cliente = "";

//Funcion para agregar cliente
function agregarCliente() {
    // Variables
    var id_cliente = document.getElementById("txt_id_cliente").value;
    var dv = document.getElementById("txt_dv").value;
    var nombres = document.getElementById("txt_nombre").value;
    var apellidos = document.getElementById("txt_apellido").value;
    var email = document.getElementById("txt_email").value;
    var celular = document.getElementById("txt_celular").value;
    //Validacion de id_cliente
    if (id_cliente == "") {
        mostrarAlerta("Error Id Cliente: Campo obligatorio");
        return;
    }
    //Validacion de dv
    const dvValido = /^[0-9kK]$/;
    if (dv == "") {
        mostrarAlerta("Error Dv: Campo obligatorio");
        return;
    }
    if (!dvValido.test(dv)) {
        mostrarAlerta("Error Dv: Número del 0 al 9 o la letra k");
        return;
    }
    //Validacion de nombres
    if (nombres == "") {
        mostrarAlerta("Error Nombres: Campo obligatorio");
        return;
    }
    //Validacion de  apellidos
    if (apellidos == "") {
        mostrarAlerta("Error Apellidos: Campo obligatorio");
        return;
    }
    // Validacion de email
    if (email == "") {
        mostrarAlerta("Error Email: Campo obligatorio");
        return;
    }
    //Aplicacion de apicliente
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    // Variable para formatear fecha y hora
    var fechaHoraActual = obtenerFechaHora();
    const raw = JSON.stringify({
        "id_cliente": id_cliente,
        "dv": dv,
        "nombres": nombres,
        "apellidos": apellidos,
        "email": email,
        "celular": celular,
        "fecha_registro": fechaHoraActual
    });
    //agregar cliente
    const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };
    fetch("http://144.126.210.74:8080/api/cliente", requestOptions)
    .then((response)=>{
        if(response.status == 200){
            location.href = "listar.html";
        }
        if(response.status == 400){
            mostrarAlerta("El cliente ya existe");
        }
    })
    .then(result => console.log(result))
    .catch((error) => console.error(error));
}

// Funcion para Listar cliente
function listarCliente(){
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var requestOptions = {
        method: 'GET',
        redirect: 'follow'
    };
    fetch("http://144.126.210.74:8080/api/cliente?_size=200", requestOptions)
    .then(response => response.json())
    .then((json) => {
        json.forEach(completarFila);
        $('#tbl_cliente').DataTable();
    })
    .then(result => console.log(result))
    .catch((error) => console.error(error));
}

// Funcion para completarFila
function completarFila(element,index,arr){
    //formato de la tabla
    arr[index] = document.querySelector("#tbl_cliente tbody").innerHTML += 
    `<tr> 
    <td>${element.id_cliente}</td>
    <td>${element.dv}</td>
    <td>${element.nombres}</td>
    <td>${element.apellidos}</td>
    <td>${element.email}</td>
    <td>${element.celular}</td>
    <td>${element.fecha_registro}</td>
    <td>
    <a href='actualizar.html?id=${element.id_cliente}' class='btn btn-warning btn-sm'>Actualizar</a>
    <a href='eliminar.html?id=${element.id_cliente}' class='btn btn-danger btn-sm'>Eliminar</a>
    </td>
    </tr>`
}

// Funcion para el ID de actualizar el cliente
function obtenerIdActualizacion(){
    const queryString = window.location.search;
    const parametros = new URLSearchParams(queryString);
    const p_id_cliente = parametros.get('id');
    g_id_cliente = p_id_cliente;
    obtenerDatosActualizacion(p_id_cliente);
}

// Funcion para eliminar el id de cliente
function obtenerIdEliminacion(){
    const queryString = window.location.search;
    const parametros = new URLSearchParams(queryString);
    const p_id_cliente = parametros.get('id');
    g_id_cliente = p_id_cliente;
    obtenerDatosEliminacion(p_id_cliente);
}

// Funcion para obtener datos de eliminacion
function obtenerDatosEliminacion(id_cliente){
    const requestOptions = {
        method: 'GET',
        redirect: 'follow'
    };
    fetch("http://144.126.210.74:8080/api/cliente/"+id_cliente, requestOptions)
    .then((response) => response.json())
    .then((json) => json.forEach(completarEtiquetaEliminar))
    .then((result) => console.log(result))
    .catch((error) => console.error(error));
}

// Funcion para etiqueta de eliminacion
function completarEtiquetaEliminar(element){
    var nombreCliente = element.nombres;
    var apellidoCliente = element.apellidos;
    document.getElementById('lbl_eliminar').innerHTML ="¿Desea eliminar este cliente? <b>"+nombreCliente+" "+apellidoCliente+"</b>";
}

// Funcion para obtener datos de actualizacion
function obtenerDatosActualizacion(id_cliente){
    const requestOptions = {
        method: 'GET',
        redirect: 'follow'
    };
    fetch("http://144.126.210.74:8080/api/cliente/"+id_cliente, requestOptions)
    .then((response) => response.json())
    .then((json) => json.forEach(completarFormularioActualizar))
    .then((result) => console.log(result))
    .catch((error) => console.error(error));
}

// Funcion completarFormularioActualizar
function completarFormularioActualizar(element){
    var dv = element.dv;
    var nombres = element.nombres;
    var apellidos = element.apellidos;
    var email = element.email;
    var celular = element.celular;
    document.getElementById('txt_dv').value = dv;
    document.getElementById('txt_nombre').value = nombres;
    document.getElementById('txt_apellido').value = apellidos;
    document.getElementById('txt_email').value = email;
    document.getElementById('txt_celular').value = celular;
}

// Funcion para actualizar cliente
function actualizarCliente(){
    // Variable para recibir el nombre del resultado desde interfaz
    var dv = document.getElementById("txt_dv").value;
    var nombres = document.getElementById("txt_nombre").value;
    var apellidos = document.getElementById("txt_apellido").value;
    var email = document.getElementById("txt_email").value;
    var celular = document.getElementById("txt_celular").value;

    // Validacion dv
    const dvValido = /^[0-9kK]$/;
    if (dv == "") {
        mostrarAlerta("Error Dv: Campo obligatorio");
        return;
    }
    if (!dvValido.test(dv)) {
        mostrarAlerta("Error Dv: Número del 0 al 9 o la letra k");
        return;
    }
    // Validacion de nombres
    if (nombres == "") {
        mostrarAlerta("Error Nombres: Campo obligatorio");
        return;
    }
    // Validacion de apellidos
    if (apellidos == "") {
        mostrarAlerta("Error Apellidos: Campo obligatorio");
        return;
    }
    // Validacion de email
    if (email == "") {
        mostrarAlerta("Error Email: Campo obligatorio");
        return;
    }

    // Agregar api resultado
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    const raw =JSON.stringify({
        "dv": dv,
        "nombres": nombres,
        "apellidos": apellidos,
        "email": email,
        "celular": celular
    });
    const requestOptions = {
        method: 'PATCH',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };
    fetch("http://144.126.210.74:8080/api/cliente/"+g_id_cliente, requestOptions)
    .then((response)=>{
        if(response.status == 200){
            location.href = "listar.html";
        }
        if(response.status == 400){
            mostrarAlerta("No se pudo actualizar el cliente");
        }
    })
    .then((result) => console.log(result))
    .catch((error) => console.error(error));
}

// Funcion para eliminar resultado
function eliminarCliente(){
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    const requestOptions = {
        method: 'DELETE',
        headers: myHeaders,
        redirect: 'follow'
    };
    fetch("http://144.126.210.74:8080/api/cliente/"+g_id_cliente, requestOptions)
    .then((response)=>{
        if(response.status == 200){
            location.href = "listar.html";
        }
        if(response.status == 400){
            mostrarAlerta("No se puede eliminar el cliente")
        }
    })
    .then((result) => console.log(result))
    .catch((error) => console.error(error));
}

// Funcion para formatear fecha y hora
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

// Funcion para mostrar alerta de error
function mostrarAlerta(mensaje){
    const alertContainer = document.getElementById('alert-container');
    alertContainer.innerHTML = `<div class="alert alert-danger alert-dismissible fade show" role="alert">${mensaje}<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>`;
}