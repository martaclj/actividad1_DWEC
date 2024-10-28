document.addEventListener('DOMContentLoaded', function() {
  var productos = [];
  var carrito = new Carrito();

  function mostrarProducto(producto) {
    let tr = document.createElement('tr');
    let tdNombre = document.createElement('td');
    let tdCantidad = document.createElement('td');
    let tdPrecio = document.createElement('td');
    let tdTotal = document.createElement('td');
    let botonAgregar = document.createElement('button');
    let botonQuitar = document.createElement('button');

    tdNombre.textContent = producto.title;
    tdPrecio.textContent = producto.price + '€';
    botonAgregar.textContent = '+';
    botonQuitar.textContent = '-';

    botonAgregar.addEventListener('click', function() {
      carrito.agregarProducto(producto.sku, producto.price);
      actualizarCarrito();
    });

    botonQuitar.addEventListener('click', function() {
      carrito.quitarProducto(producto.sku);
      actualizarCarrito();
    });

    tdCantidad.appendChild(botonAgregar);
    tdCantidad.appendChild(botonQuitar);
    tr.appendChild(tdNombre);
    tr.appendChild(tdCantidad);
    tr.appendChild(tdPrecio);
    tr.appendChild(tdTotal);
    let tabla = document.getElementById('cuerpoTabla');
    tabla.appendChild(tr);
  }

  function actualizarCarrito() {
    let carritoInfo = carrito.obtenerCarrito();
    let tablaCarrito = document.getElementById('cuerpoTabla');
    tablaCarrito.innerHTML = '';

    carritoInfo.productos.forEach(producto => {
      let tr = document.createElement('tr');
      let tdNombre = document.createElement('td');
      let tdCantidad = document.createElement('td');
      let tdPrecio = document.createElement('td');
      let tdSubtotal = document.createElement('td');

      let productoOriginal = productos.find(p => p.sku === producto.sku);
      if (productoOriginal) {
        tdNombre.textContent = productoOriginal.title;
        tdPrecio.textContent = productoOriginal.price + '€';
      }

      tdCantidad.textContent = producto.cantidad;
      tdSubtotal.textContent = producto.subtotal + '€';

      tr.appendChild(tdNombre);
      tr.appendChild(tdCantidad);
      tr.appendChild(tdPrecio);
      tr.appendChild(tdSubtotal);
      tablaCarrito.appendChild(tr);
    });

    let totalDisplay = document.getElementById('totalFinal');
    totalDisplay.textContent = carritoInfo.total + '€';
  }

  fetch('https://jsonblob.com/api/1296797574781329408')
    .then(response => response.json())
    .then(infoArray => {
      productos = infoArray.products;
      productos.forEach(producto => {
        mostrarProducto(producto);
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

class Carrito {
  constructor() {
    this.carrito = [];
  }

  agregarProducto(sku, precio) {
    let productoEnCarrito = this.carrito.find(p => p.sku === sku);
    if (productoEnCarrito) {
      productoEnCarrito.cantidad += 1;
    } else {
      this.carrito.push({ sku: sku, cantidad: 1, precio: precio });
    }
  }

  quitarProducto(sku) {
    let productoEnCarrito = this.carrito.find(p => p.sku === sku);
    if (productoEnCarrito) {
      productoEnCarrito.cantidad -= 1;
      if (productoEnCarrito.cantidad === 0) {
        this.carrito = this.carrito.filter(p => p.sku !== sku);
      }
    }
  }

  obtenerCarrito() {
    let total = 0;
    let productosCarrito = [];
    this.carrito.forEach(producto => {
      let subtotal = producto.cantidad * producto.precio;
      total += subtotal;
      productosCarrito.push({
        sku: producto.sku,
        cantidad: producto.cantidad,
        subtotal: subtotal.toFixed(2)
      });
    });
    return {
      total: total.toFixed(2),
      productos: productosCarrito
    };
  }
}