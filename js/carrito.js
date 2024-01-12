let productosEnCarrito = localStorage.getItem("productos-en-carrito");
productosEnCarrito = JSON.parse(productosEnCarrito) || [];

const contenedorCarritoVacio = document.querySelector("#carrito-vacio");
const contenedorCarritoProductos = document.querySelector("#carrito-productos");
const contenedorCarritoAcciones = document.querySelector("#carrito-acciones");
const contenedorCarritoComprado = document.querySelector("#carrito-comprado");
let botonesEliminar = document.querySelectorAll(".carrito-producto-eliminar");
const botonVaciar = document.querySelector("#carrito-acciones-vaciar");
const contenedorTotal = document.querySelector("#total");
const botonComprar = document.querySelector("#carrito-acciones-comprar");
const botonGuardarDatos = document.querySelector("#guardar-datos");

// Verificar si hay datos del cliente en localStorage al cargar la página
const datosClienteGuardados = localStorage.getItem("datos-cliente");
let datosCliente;

if (datosClienteGuardados) {
    datosCliente = JSON.parse(datosClienteGuardados);
    // Rellenar el formulario con los datos guardados
    document.getElementById('nombres').value = datosCliente.nombres || "";
    document.getElementById('apellidos').value = datosCliente.apellidos || "";
    document.getElementById('direccion').value = datosCliente.direccion || "";
    document.getElementById('referencia').value = datosCliente.referencia || "";
    document.getElementById('telefono').value = datosCliente.telefono || "";
}

function cargarProductosCarrito() {
    if (productosEnCarrito && productosEnCarrito.length > 0) {
        contenedorCarritoVacio.classList.add("disabled");
        contenedorCarritoProductos.classList.remove("disabled");
        contenedorCarritoAcciones.classList.remove("disabled");
        contenedorCarritoComprado.classList.add("disabled");

        contenedorCarritoProductos.innerHTML = "";

        productosEnCarrito.forEach(producto => {
            const div = document.createElement("div");
            div.classList.add("carrito-producto");
            div.innerHTML = `
                <img class="carrito-producto-imagen" src="${producto.imagen}" alt="${producto.titulo}">
                <div class="carrito-producto-titulo">
                    <small>Título</small>
                    <h3>${producto.titulo}</h3>
                </div>
                <div class="carrito-producto-cantidad">
                    <small>Cantidad</small>
                    <p>${producto.cantidad}</p>
                </div>
                <div class="carrito-producto-precio">
                    <small>Precio</small>
                    <p>S/ ${producto.precio}</p>
                </div>
                <div class="carrito-producto-subtotal">
                    <small>Subtotal</small>
                    <p>S/ ${producto.precio * producto.cantidad}</p>
                </div>
                <button class="carrito-producto-eliminar" id="${producto.id}"><i class="bi bi-trash-fill"></i></button>
            `;

            contenedorCarritoProductos.append(div);
        })

        actualizarBotonesEliminar();
        actualizarTotal();
    } else {
        contenedorCarritoVacio.classList.remove("disabled");
        contenedorCarritoProductos.classList.add("disabled");
        contenedorCarritoAcciones.classList.add("disabled");
        contenedorCarritoComprado.classList.add("disabled");
    }
}

function actualizarBotonesEliminar() {
    botonesEliminar = document.querySelectorAll(".carrito-producto-eliminar");

    botonesEliminar.forEach(boton => {
        boton.addEventListener("click", eliminarDelCarrito);
    });
}

function eliminarDelCarrito(e) {
    Toastify({
        text: "Producto eliminado",
        duration: 3000,
        close: true,
        gravity: "top",
        position: "right",
        stopOnFocus: true,
        style: {
            background: "linear-gradient(to right, #0073a9, #0063a9)",
            borderRadius: "2rem",
            textTransform: "uppercase",
            fontSize: ".75rem"
        },
        offset: {
            x: '1.5rem',
            y: '1.5rem'
        },
        onClick: function(){}
    }).showToast();

    const idBoton = e.currentTarget.id;
    const index = productosEnCarrito.findIndex(producto => producto.id === idBoton);
    
    productosEnCarrito.splice(index, 1);
    cargarProductosCarrito();

    localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));
}

botonVaciar.addEventListener("click", vaciarCarrito);

function vaciarCarrito() {
    Swal.fire({
        title: '¿Estás seguro?',
        icon: 'question',
        html: `Se van a borrar ${productosEnCarrito.reduce((acc, producto) => acc + producto.cantidad, 0)} productos.`,
        showCancelButton: true,
        focusConfirm: false,
        confirmButtonText: 'Sí',
        cancelButtonText: 'No'
    }).then((result) => {
        if (result.isConfirmed) {
            productosEnCarrito.length = 0;
            localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));
            cargarProductosCarrito();
        }
    })
}

function actualizarTotal() {
    const totalCalculado = productosEnCarrito.reduce((acc, producto) => acc + (producto.precio * producto.cantidad), 0);
    contenedorTotal.innerText = `S/ ${totalCalculado.toFixed(2)}`;
}

botonComprar.addEventListener("click", comprarCarrito);

function comprarCarrito() {
    let nombres = document.getElementById('nombres').value;
    let apellidos = document.getElementById('apellidos').value;
    let direccion = document.getElementById('direccion').value;
    let referencia = document.getElementById('referencia').value;
    let telefono = document.getElementById('telefono').value;

    if (!nombres || !telefono) {
        alert("Por favor, ingrese al menos los nombres y el teléfono.");
        return;
    }

    const datosCliente = {
        nombres,
        apellidos,
        direccion,
        referencia,
        telefono
    };

    localStorage.setItem("datos-cliente", JSON.stringify(datosCliente));

    // Crear el mensaje con la información del cliente y los productos comprados
    let mensajeCompra = `¡Gracias por tu compra, ${nombres} ${apellidos}!\n\nInformación del Cliente:\n`;
    mensajeCompra += `- Dirección: ${direccion}\n`;
    mensajeCompra += `- Referencia: ${referencia}\n`;
    mensajeCompra += `- Número de Celular: ${telefono}\n\n`;
    mensajeCompra += `Productos Comprados:\n`;

    productosEnCarrito.forEach(producto => {
        mensajeCompra += `- ${producto.titulo} - ${producto.cantidad} unidades - S/ ${producto.precio * producto.cantidad.toFixed(2)}\n`;
    });

     // Agregar el total al mensaje de compra
     const totalCalculado = productosEnCarrito.reduce((acc, producto) => acc + (producto.precio * producto.cantidad), 0);
     mensajeCompra += `\nTotal de la Compra: S/ ${totalCalculado.toFixed(2)}`;
 

    // Actualizar el mensaje con el título deseado (puedes modificarlo según tus necesidades)
    mensajeCompra = "Resumen de Compra:\n\n" + mensajeCompra;

    // Llamar a la función para enviar el mensaje a WhatsApp
    enviarMensajeWhatsapp(mensajeCompra);

    // Limpiar el carrito después de comprar
    productosEnCarrito.length = 0;
    localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));

    // Actualizar la interfaz del carrito
    cargarProductosCarrito();

    // Abre la ventana de WhatsApp después de enviar el mensaje
    let urlWhatsapp = "https://api.whatsapp.com/send?phone=51931161425&text=" + encodeURIComponent(mensajeCompra);
    window.open(urlWhatsapp, '_blank');
}

botonGuardarDatos.addEventListener("click", guardarDatosCliente);

function guardarDatosCliente() {
    let nombres = document.getElementById('nombres').value;
    let apellidos = document.getElementById('apellidos').value;
    let direccion = document.getElementById('direccion').value;
    let referencia = document.getElementById('referencia').value;
    let telefono = document.getElementById('telefono').value;

    const datosCliente = {
        nombres,
        apellidos,
        direccion,
        referencia,
        telefono
    };

    localStorage.setItem("datos-cliente", JSON.stringify(datosCliente));

    // Mostrar alerta al guardar datos
    alert("¡Datos del cliente guardados exitosamente!");

    // Puedes cambiar la alerta por un mensaje más estilizado usando librerías como SweetAlert2 o Toastify
    // Ejemplo con SweetAlert2:
    // Swal.fire("¡Datos del cliente guardados exitosamente!", "", "success");
}

function enviarMensajeWhatsapp(mensaje) {
    // ... Código anterior (puedes dejar esta función como la tenías)
}

cargarProductosCarrito();
