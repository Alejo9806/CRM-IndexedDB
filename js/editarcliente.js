(function () {

    let idCliente;
    let DB;
    const nombreInput = document.querySelector('#nombre');
    const emailInput  = document.querySelector('#email');
    const telefonoInput  = document.querySelector('#telefono');
    const empresaInput  = document.querySelector('#empresa');

    const formulario = document.querySelector('#formulario');

    document.addEventListener('DOMContentLoaded',()=>{
        conectarDB();

        //Actualiza el registro
        formulario.addEventListener('submit',actulizarCliente);

        //Verificar el ID de la URL
        const parametrosURL = new URLSearchParams(window.location.search);
        idCliente = parametrosURL.get('id');
        if (idCliente) {
            setTimeout(()=>{
                obtenerCliente(idCliente);
            },100)
            
        }
    });

    function conectarDB() {
        const abrirConexion = window.indexedDB.open('crm',1);
    
        abrirConexion.onerror = function () {
            console.log('Hubo un error en la conexion');
        }
        abrirConexion.onsuccess = function () {
            console.log('conectada');
            DB = abrirConexion.result;
        }
    }

    
    function actulizarCliente(e) {
        e.preventDefault();

        if (nombreInput.value === '' || emailInput.value === '' || telefonoInput.value === '' || empresaInput.value === '') {
            imprimirAlerta('Todos los campos son obligatorios','error');
            return;
        }

        //Actualizar cliente
        const clienteActualizado = {
            nombre:nombreInput.value,
            telefono:telefonoInput.value,
            email:emailInput.value,
            empresa:empresaInput.value,
            id:Number(idCliente)
        }

        const transaction = DB.transaction(['crm'],'readwrite');
        const objectStore = transaction.objectStore('crm');

        objectStore.put(clienteActualizado);

        transaction.oncomplete = function () {
            imprimirAlerta('Editado Correctamente');

            setTimeout(()=>{
                window.location.href = 'index.html';
            },3000)
        };

        transaction.onerror = function () {

            imprimirAlerta('Hubo un error','error')
        };

    }
    function obtenerCliente() {
        const transaction = DB.transaction(['crm'],'readonly');
        const objectStore = transaction.objectStore('crm');

        objectStore.openCursor().onsuccess = function (e) {
            const cursor = e.target.result;
            if (cursor) {
                if (cursor.value.id === Number(idCliente)) {
                    llenarFormulario(cursor.value);
                }
                cursor.continue();
            }
        }
    }

    function llenarFormulario(datosCliente) {
        const {nombre,email,telefono,empresa} = datosCliente
        nombreInput.value = nombre;
        emailInput.value = email;
        telefonoInput.value = telefono;
        empresaInput.value = empresa;
    }

    function conectarDB() {
        const abrirConexion = window.indexedDB.open('crm',1);

        abrirConexion.onerror = function () {
            console.log('Hubo un error en la conexion');
        }
        abrirConexion.onsuccess = function () {
            DB = abrirConexion.result;
        }
    }

})();