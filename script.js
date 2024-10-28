document.addEventListener('DOMContentLoaded', function() {
  var productos = [];

  function mostrarProducto(producto) {
    let tr = document.createElement('tr');
    let td1 = document.createElement('td');
    let td2 = document.createElement('td');
    td1.textContent = producto.title;
    td2.textContent = producto.price;
    tr.appendChild(td1);
    tr.appendChild(td2);
    let tabla = document.getElementById('tablaProductos');
    tabla.appendChild(tr);
  }

fetch('https://jsonblob.com/api/1296797574781329408')
  .then(response => response.json())
  .then(infoArray => {
    productos = infoArray.products;
    console.log(productos);
    productos.forEach(producto => {
      mostrarProducto(producto);
    })
  }).catch((err) => {
    console.log(err);
  });
});

