// Variable global para almacenar la ubicación
let ubicacion;

// Arreglo para almacenar los productos en el carrito
const carrito = [];

// Función para obtener el nombre del producto según su ID
const obtenerNombreProducto = id => ({1: 'Cheese Burger', 2: 'Bacon BBQ', 3: 'Engel Burger', 4: 'Papas Pequeñas', 5: 'Coca Cola de 400ml'}[id]);

// Función para obtener el precio del producto según su ID
const obtenerPrecioProducto = id => ({1: 15000, 2: 17000, 3: 19000, 4: 5000, 5: 5000}[id]);

// Función para calcular el total del carrito
const calcularTotal = () => carrito.reduce((total, producto) => total + producto.cantidad * producto.precio, 0);

// Función para actualizar la visualización del carrito en la página
const actualizarCarrito = () => {
    const listaCarrito = document.getElementById('lista-carrito');
    listaCarrito.innerHTML = '';
    let total = 0;
    carrito.forEach(producto => {
        const precioTotal = producto.cantidad * producto.precio;
        listaCarrito.innerHTML += `<li>${producto.cantidad.toLocaleString('es-ES')} ${producto.nombre} Gs. ${precioTotal.toLocaleString('es-ES')}</li>`;
        total += precioTotal;
    });
    listaCarrito.innerHTML += `<li>Total a pagar: Gs. ${total.toLocaleString('es-ES')}</li>`;
};

// Función para agregar productos al carrito
const agregarAlCarrito = (idProducto, cantidadInput) => {
    const nombreProducto = obtenerNombreProducto(idProducto);
    const precio = obtenerPrecioProducto(idProducto);
    const indice = carrito.findIndex(p => p.id === idProducto);

    if (indice !== -1) {
        carrito[indice].cantidad += parseInt(cantidadInput.value);
    } else {
        carrito.push({ id: idProducto, nombre: nombreProducto, precio: precio, cantidad: parseInt(cantidadInput.value) });
    }

    actualizarCarrito();
    cantidadInput.value = 0;
};

// Agrega event listener para el botón "Agregar al carrito" a todos los elementos con clase "agregar"
document.querySelectorAll('.agregar').forEach((boton, index) => {
    boton.addEventListener('click', () => {
        const idProducto = parseInt(boton.getAttribute('data-id'));
        const cantidadInput = document.getElementById(`cantidadProducto${idProducto}`);
        agregarAlCarrito(idProducto, cantidadInput);
    });
});

// Agrega event listener para el botón "Limpiar Lista"
document.getElementById('limpiar-carrito').addEventListener('click', () => {
    carrito.length = 0;
    actualizarCarrito();
});

// Agrega event listener para el botón "Quiero Delivery"
document.getElementById('quiero-delivery').addEventListener('click', () => {
    const respuesta = confirm('¿Quieres que entreguemos tu pedido en tu ubicación actual?');
    if (respuesta && navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const { latitude, longitude } = position.coords;
            ubicacion = `https://www.google.com/maps?q=${latitude},${longitude}`;
            alert(`Ubicación de entrega: ${ubicacion}`);
        }, error => console.error('Error al obtener la ubicación:', error.message));
    } else {
        console.error('Geolocalización no soportada por el navegador.');
    }
});

// Agrega event listener para el botón "Finalizar Pedido"
document.getElementById('finalizar-pedido').addEventListener('click', () => {
    const total = calcularTotal();
    const mensajeWhatsApp = `*¡Hola! Quiero comprar los siguientes productos:*${carrito.map(producto => `\n - *${producto.cantidad} ${producto.nombre}* Gs. ${(producto.cantidad * producto.precio).toLocaleString('es-ES')}`).join('')}\n\n*Total a pagar:* Gs. ${total.toLocaleString('es-ES')}\n\n*Ubicación de entrega:* ${ubicacion}`;

    if (carrito.length > 0) {
        const numeroWhatsApp = '+595962256851';
        const urlWhatsApp = `https://api.whatsapp.com/send?phone=${numeroWhatsApp}&text=${encodeURIComponent(mensajeWhatsApp)}`;
        window.location.href = urlWhatsApp;
    } else {
        alert('El carrito está vacío. Agrega productos antes de finalizar la compra.');
    }
});

// Función para ajustar la cantidad de productos en el carrito
const ajustarCantidad = (idProducto, operacion) => {
    const input = document.getElementById(`cantidadProducto${idProducto}`);
    input[operacion]();
};

// Agrega event listener para el botón de incrementar cantidad
const incrementarCantidad = idProducto => ajustarCantidad(idProducto, 'stepUp');

// Agrega event listener para el botón de decrementar cantidad
const decrementarCantidad = idProducto => ajustarCantidad(idProducto, 'stepDown');

// Agrega event listener para mostrar los ingredientes al poner el cursor sobre el producto
document.querySelectorAll('.producto').forEach((producto, index) => {
    const mensaje = producto.querySelector('.ingredientes-mensaje');

    producto.addEventListener('mouseover', () => {
        mensaje.style.maxHeight = '100px'; // Ajusta la altura máxima según tus preferencias
    });

    producto.addEventListener('mouseout', () => {
        mensaje.style.maxHeight = '0';
    });
});