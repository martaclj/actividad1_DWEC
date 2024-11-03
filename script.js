document.addEventListener('DOMContentLoaded', function() {
  var productos = [];
  var carrito = new Carrito();

  function mostrarProducto(producto) {
      let tr = document.createElement('tr');
      tr.id = 'fila-' + producto.SKU;
      let tdNombre = document.createElement('td');
      let tdCantidad = document.createElement('td');
      let spanCantidad = document.createElement('span');
      let tdPrecio = document.createElement('td');
      let tdTotal = document.createElement('td');
      let botonAgregar = document.createElement('button');
      let botonQuitar = document.createElement('button');

      tdNombre.textContent = producto.title;
      tdPrecio.textContent = `${parseFloat(producto.price).toFixed(2)}€`;
      spanCantidad.textContent = '0';
      botonAgregar.textContent = '+';
      botonQuitar.textContent = '-';

      tdCantidad.appendChild(botonQuitar);
      tdCantidad.appendChild(spanCantidad);
      tdCantidad.appendChild(botonAgregar);
      tdTotal.textContent = '0€';

      tr.appendChild(tdNombre);
      tr.appendChild(tdCantidad);
      tr.appendChild(tdPrecio);
      tr.appendChild(tdTotal);
      document.getElementById('cuerpoTabla').appendChild(tr);

      botonAgregar.addEventListener('click', function() {
          carrito.agregarProducto(producto.SKU, parseFloat(producto.price), producto.title);
          actualizarCarrito();
      });

      botonQuitar.addEventListener('click', function() {
          carrito.quitarProducto(producto.SKU);
          actualizarCarrito();
      });
  }

  function actualizarCarrito() {
    let carritoInfo = carrito.obtenerCarrito();
    let totalDisplay = document.getElementById('totalFinal');
    totalDisplay.textContent = `${carritoInfo.total}€`;

    let listaCarrito = document.getElementById('productosCarrito');
    listaCarrito.innerHTML = '';

    carritoInfo.productos.forEach(producto => {
        let item = document.createElement('li');
        item.textContent = `${producto.title} x ${producto.cantidad} = ${producto.subtotal}€`;
        listaCarrito.appendChild(item);

        let filaProducto = document.getElementById('fila-' + producto.SKU);
        if (filaProducto) {
          let spanCantidad = filaProducto.querySelector('span');
          spanCantidad.textContent = producto.cantidad;
          let tdTotal = filaProducto.cells[3];
          tdTotal.textContent = `${producto.subtotal}€`;
        }
    });

    productos.forEach(producto => {
      let filaProducto = document.getElementById('fila' + producto.SKU);
      if (filaProducto && !carritoInfo.productos.find(p => p.SKU === producto.SKU)) {
        filaProducto.querySelector('span').textContent = '0';
        filaProducto.cells[3].textContent = '0€';
      }
    });
}


  fetch('https://jsonblob.com/api/1296797574781329408')
      .then(response => response.json())
      .then(stock => {
          productos = stock.products;
          productos.forEach(producto => mostrarProducto(producto));
      })
      .catch(err => console.error('Error al cargar productos:', err));
});

class Carrito {
  constructor() {
      this.carrito = [];
  }

  agregarProducto(SKU, precio, title) {
      let productoEnCarrito = this.carrito.find(p => p.SKU === SKU);
      if (productoEnCarrito) {
          productoEnCarrito.cantidad++;
      } else {
          this.carrito.push({ SKU, cantidad: 1, precio, title });
      }
      this.calcularTotal();
  }

  quitarProducto(SKU) {
      let productoEnCarrito = this.carrito.find(p => p.SKU === SKU);
      if (productoEnCarrito && productoEnCarrito.cantidad > 0) {
          productoEnCarrito.cantidad--;
          if (productoEnCarrito.cantidad === 0) {
              this.carrito = this.carrito.filter(p => p.SKU !== SKU);
          }
      }
      this.calcularTotal();
  }

  obtenerCarrito() {
      let total = 0;
      let productosCarrito = this.carrito.map(producto => {
          let subtotal = producto.cantidad * producto.precio;
          total += subtotal;
          return {
              SKU: producto.SKU,
              title: producto.title,
              cantidad: producto.cantidad,
              precio: producto.precio,
              subtotal: subtotal.toFixed(2)
          };
      });
      return {
          total: total.toFixed(2),
          productos: productosCarrito
      };
  }

  calcularTotal() {
      let total = this.carrito.reduce((acc, producto) => acc + producto.cantidad * producto.precio, 0);
      document.getElementById('totalFinal').textContent = `${total.toFixed(2)}€`;
  }
}
