let listaDeCompras = document.getElementById('listaDeCompras')
class listaDeProductos {
    constructor(producto, marca, tamano, medida, cantidad, supermercado, precio, precioComparar) {
        this.producto = producto;
        this.marca = marca;
        this.tamano = tamano;
        this.medida = medida;
        this.cantidad = cantidad;
        this.supermercado = supermercado;
        this.precio = precio;
        this.precioComparar = precioComparar;
    }
}

let productosGuardados = localStorage.getItem("productosGuardados")
let productos = productosGuardados ? JSON.parse(productosGuardados) : []

let generoProducto = localStorage.getItem("generoProducto")
let listaProductos = generoProducto ? JSON.parse(generoProducto) : []

let compraCoto = []
let compraVital = []
let compraMakro = []
let compraDia = []
let compraChangomas = []
let compraCarrefour = []

// Esta función se encarga de agregar un producto a la lista de productos o actualizar los valores de un producto existente.

let agregarProducto = () => {

    // Obtener los valores del formulario

    let producto = document.getElementById("producto").value.toLowerCase();
    let marca = document.getElementById("marca").value.toLowerCase();
    let tamano = document.getElementById("tamano").value;
    let medida = document.getElementById("medida").value.toLowerCase();

    // Obtener valores de los campos numéricos, asegurándose de que sean mayores que 0
    let cantidad = parseFloat(document.getElementById("cantidad").value) > 0 ? parseFloat(document.getElementById("cantidad").value) : 0;
    let coto = parseFloat(document.getElementById("coto").value) > 0 ? parseFloat(document.getElementById("coto").value) : 0;
    let vital = parseFloat(document.getElementById("vital").value) > 0 ? parseFloat(document.getElementById("vital").value) : 0;
    let makro = parseFloat(document.getElementById("makro").value) > 0 ? parseFloat(document.getElementById("makro").value) : 0;
    let dia = parseFloat(document.getElementById("dia").value) > 0 ? parseFloat(document.getElementById("dia").value) : 0;
    let changomas = parseFloat(document.getElementById("changomas").value) > 0 ? parseFloat(document.getElementById("changomas").value) : 0;
    let carrefour = parseFloat(document.getElementById("carrefour").value) > 0 ? parseFloat(document.getElementById("carrefour").value) : 0;

    if (cantidad > 0) {
        coto > 0 && productos.push(new listaDeProductos(producto, marca, tamano, medida, cantidad, "coto", coto, (coto / tamano).toFixed(3)))
        vital > 0 && productos.push(new listaDeProductos(producto, marca, tamano, medida, cantidad, "vital", vital, (vital / tamano).toFixed(3)))
        makro > 0 && productos.push(new listaDeProductos(producto, marca, tamano, medida, cantidad, "makro", makro, (makro / tamano).toFixed(3)))
        dia > 0 && productos.push(new listaDeProductos(producto, marca, tamano, medida, cantidad, "dia %", dia, (dia / tamano).toFixed(3)))
        changomas > 0 && productos.push(new listaDeProductos(producto, marca, tamano, medida, cantidad, "changomas", changomas, (changomas / tamano).toFixed(3)))
        carrefour > 0 && productos.push(new listaDeProductos(producto, marca, tamano, medida, cantidad, "carrefour", carrefour, (carrefour / tamano).toFixed(3)))
        listaProductos.filter(p => p == producto).length == 0 && listaProductos.push(producto)
    }


    // Guardar el array de productos en el localStorage

    localStorage.setItem("productosGuardados", JSON.stringify(productos))
    localStorage.setItem("generoProducto", JSON.stringify(listaProductos))
}

let comparacionesDePrecio = () => {
    compraCoto = []
    compraCarrefour = []
    compraChangomas = []
    compraDia = []
    compraMakro = []
    compraVital = []
    
    for (prod of listaProductos) {
        let arrayComparacion = productos.filter(p => p.producto == prod)

        arrayComparacion.sort((a, b) => a.precioComparar - b.precioComparar)
        switch (arrayComparacion[0].supermercado) {
            case "coto":
                compraCoto.push(arrayComparacion[0]);
                break;
            case "vital":
                compraVital.push(arrayComparacion[0]);
                break;
            case "makro":
                compraMakro.push(arrayComparacion[0]);
                break;
            case "changomas":
                compraChangomas.push(arrayComparacion[0]);
                break;
            case "carrefour":
                compraCarrefour.push(arrayComparacion[0]);
                break;
            case "dia %":
                compraDia.push(arrayComparacion[0]);
                break;
        }
    }

}

let recorridoDeProductos = (mrk) => {
    if (mrk.length > 0) {
        let total = 0
        listaDeCompras.innerHTML += `
        <div class="producto-individual">
            <h2>${mrk[0].supermercado}</h2>
        </div>
        `
        for (prod of mrk) {
            let subtotal = prod.precio * prod.cantidad
            total = total + subtotal
            listaDeCompras.innerHTML += `
            <div class="producto-individual">
                <div class="corto">${prod.cantidad}</div>
                <div class="largo">${prod.producto} ${prod.tamano} ${prod.medida} (${prod.marca})</div>
                <div class="corto">$ ${prod.precio}</div>
                <div class="corto">$ ${subtotal}</div>
                <button class="btnBorrar" data-pr="${prod.producto}">X</button>
            </div>
            `
        }
        listaDeCompras.innerHTML += `
        <div class="producto-individual">
            <h3>$ ${total}</h3>
        </div>
        `
    }
}

let impresionEnPantalla = () => {
    listaDeCompras.innerHTML = ''
    recorridoDeProductos(compraCoto)
    recorridoDeProductos(compraCarrefour)
    recorridoDeProductos(compraChangomas)
    recorridoDeProductos(compraMakro)
    recorridoDeProductos(compraDia)
    recorridoDeProductos(compraVital)
}

let funcionesDelChango = () => {
    agregarProducto()
    comparacionesDePrecio()
    impresionEnPantalla()
}

let borrarChango = () => {
    localStorage.removeItem('productosGuardados')
    localStorage.removeItem('generoProducto')
    console.log('borrado')
}
document.getElementById('agregarAlChango').addEventListener('click', () => funcionesDelChango())
document.getElementById('finalizarCompra').addEventListener('click', () => borrarChango())
comparacionesDePrecio()
impresionEnPantalla()


document.addEventListener('click', (event) => {
    if (event.target.classList.contains('btnBorrar')) {
        let productoBorrar = event.target.getAttribute('data-pr');
        productos = productos.filter(p => p.producto !== productoBorrar)
        listaProductos = listaProductos.filter(p => p !== productoBorrar)

    }

    localStorage.setItem('productosGuardados', JSON.stringify(productos));
    localStorage.setItem('generoProducto', JSON.stringify(listaProductos));

    comparacionesDePrecio()
    impresionEnPantalla()
});