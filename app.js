//CONSTANTES Y VARIABLES
const usuarios = [];
const facturas = [];
const productos = [];
let carrito = [];
let producto;
let pass;
let contador=0;
let usuarioLogueado;

///ELEMENTOS EN HTML////////
const linKMiSaldo = document.querySelector("#LinkMiSaldo");
const eventoBotonRegistro = document.querySelector("#btnRegistro");
const html = document.querySelector("#Productos")
const templateCard = document.querySelector("#templateCard").content;
const fragment = document.createDocumentFragment();
const templateCARRITO = document.querySelector("#templatelistaCarrito").content; //aca es donde va la data
const eventoBotonComprar = document.querySelector("#btnComprar");
const cerrarSesion = document.querySelector("#divCerrarSesion");
const botonCerrarSesion = document.createElement("a");
const linkRegistrarse = document.querySelector("#LinkRegistro");
const linkIngresar = document.querySelector("#Linkingresar");
const linKMiCuenta = document.querySelector("#LinkMiCuenta");
const linKRecargar = document.querySelector("#LinkRecargar");
const eventoBotonCerrarSesion = document.querySelector("#LinkCerrar");
const eventoBotonVaciar = document.querySelector("#btnBorrar");
const lineaMontoTotal=document.querySelector("#totCompra");
const totSaldoCarrtio=document.querySelector("#totSaldo");
const urlJsonProductos="./productos.json";



// CONSTRUCTOR FACTURA
class Factura {
    constructor(idUsuario, nroFactura, fecha, total, items) {
        this.idUsuario = idUsuario;
        this.nroFactura = nroFactura
        this.fecha = fecha;
        this.total = total;
        this.items = items;
    }
}



// CONSTRUCTOR USUARIO
class Usuario {
    constructor(id, nombre, apellido, nombreUsuario, pass, cuenta, email) {
        this.id = id;
        this.nombre = nombre;
        this.apellido = apellido;
        this.pass = pass;
        this.nombreUsuario = nombreUsuario;
        this.cuenta = cuenta;
        this.email = email;
    }
}

//para borrar, SI BIEN SE Puede AGREGAR USUARIOS , SE HARCODEA PARA TRABAJAR MAS RAPIDO
const usuario1 = new Usuario(1, "Diego", "Tocchetto", "dtoccho", "131313", 100000, "diego.tocchetto@gmail.com");
const usuario2 = new Usuario(2, "Profesor Coder", "js", "profe", "111111", 5000, "profesor@gmail.com");
usuarios.push(usuario1);
usuarios.push(usuario2);



// CONSTRUCTOR PRODUCTO
class Producto {
    constructor(id, descripcion, valor, cantidad, imagen) {
        this.id = id;
        this.descripcion = descripcion;
        this.valor = valor;
        this.cantidad = cantidad;
        this.imagen = imagen;
    }
}



async function cargarProductos() { //CARGO LOS PRODUCTOS DESDE EL JSON Y LOS METO EN EL ARRAY
 await fetch(urlJsonProductos)
.then((resp)=>resp.json())
.then((data)=>{
    data.forEach((producto)=>{
    producto = new Producto(producto.id,producto.descripcion,producto.valor,producto.cantidad,producto.imagen);
    productos.push(producto); 
    })
})
}


class Carrito {
    constructor(idProducto, descProducto, cantidad, precioLineaCarrito, total) {
        this.idProducto = idProducto;
        this.descProducto = descProducto;
        this.precioLineaCarrito = precioLineaCarrito;
        this.cantidad = cantidad;
        this.total = total;
    }
}



//FUNCIONES UTILES

function fechaActual() {
    let date = new Date();
    const formatDate = (date) => {
        let formatted_date = date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear()
        return formatted_date;
    }
    return (formatDate(date));
}



//SE VALIDA EL USUARIO AL LOGUEO
function validarUsuario(nombreUsuario, password) {

    let valido = false;
    usuarioLogueado = usuarios.find(usuario => usuario.nombreUsuario.toLowerCase() === nombreUsuario.toLowerCase());
    if (usuarioLogueado != undefined) {
        if (usuarioLogueado.pass === password) {
            valido = true;
            sessionStorage.setItem("usuario", JSON.stringify(usuarioLogueado)); //GUARDO EL USUARIO
        }
    }
    return valido;

}


//AGREGA AL USUARIO 
function agregarUsuario(usuarioNuevo) {
    console.log("LLEGA");
    console.log(usuarioNuevo.email);
    const existeUsuarioMail = usuarios.find(usuario => usuario.email === usuarioNuevo.email);
    const existeUsuarioNombreUsuario = usuarios.find(usuario => usuario.nombreUsuario === usuarioNuevo.nombreUsuario);

    if (!existeUsuarioMail && !existeUsuarioNombreUsuario) {
        usuarios.push(usuarioNuevo);
     // ALERT
        Swal.fire(
            (`Hola ${usuarioNuevo.nombre} ${usuarioNuevo.apellido}, te has registrado correctamente`),
            '',
            'Vamos...seguí comprando'
          )
    }


    
    //SI EXISTE EL USUARIO VERIFICO QUE NO TENGAN  LL NOMBREUSUARIO O EL CORREO
    if (existeUsuarioMail) {
        Swal.fire({
            icon: 'error',
            title: "YA EXISTE UN USUARIO CON ESE CORREO ELECTRÓNICO",

          })
    
    }
    if (existeUsuarioNombreUsuario) {
         Swal.fire({
            icon: 'error',
            title: "YA EXISTE UN USUARIO CON ESE NOMBRE DE USUARIO",
          })
    }

}


//VACIAR CARRRITO
function vaciarCarrito(accion) {
    const tamanioCarrtitoOriginal = carrito.length;
    for (let i = carrito.length; i > 0; i--) { 

        const lineacarrito = new Carrito(carrito[i - 1].idProducto, carrito[i - 1].descripcion, carrito[i - 1].cantidad, carrito[i - 1].precioLineaCarrito);
        carrito.pop(); //  //borro de abajo para arriba
        let contadorCarrito=document.querySelector("#contador");
        contador=0;
        contadorCarrito.innerHTML=contador;
        document.querySelector("#btnCerrar").click();
    }

    
    if (tamanioCarrtitoOriginal === 0 && accion === 0) {
        Swal.fire({
            icon: 'error',
            title: "No hay items en su carrito",


          })
    }

    if (accion === 0 && tamanioCarrtitoOriginal > 0) //0 sE INVOCA DESDE VACIAR CARRITO / 1 - SE INVOCA DESDE EL PAGAR 
    {
         Swal.fire('Los items del carrito se quitaron correctamente','vamos, busca el producto que te gusta y agregalo'
          )
    }
}


//AGREGAR DINERO A LA CUENTA DEL USUARIO // NO FUNCIONAL AUN CON DOM
function agregarDineroACuentaUsuario(usuarioLogueado) {

    for(ElementoUsuario of usuarios)
    {
        if (ElementoUsuario.nombreUsuario === usuarioLogueado.nombreUsuario)
         {
            let deposito = parseFloat(document.querySelector("#xtSaldo").value);
            let saldo = ElementoUsuario.cuenta;
            ElementoUsuario.cuenta = saldo + deposito;
            usuarioLogueado = ElementoUsuario;
            Swal.fire('Se ha acreditado correctamente','vamos , busca el producto que te gusta y comprálo')
            break;
          }
    }

  
}



//GENERAR FACTURA 
function generarFactura(total, carrito) 
{
    let nroFactura = Math.ceil(Math.random() * 1000000).toString();
    const factura = new Factura(usuarioLogueado.id, nroFactura, fechaActual(), total, carrito);
    facturas.push(factura);
}



//VER FACTURAS // NO FUNCIONAL AUN CON DOM
function verFactura(idusuario) {

    let misfacturas = "";
    if (facturas.length > 0) 
    {
        for(elementoFactura of facturas)
        {
            if (elementoFactura.idUsuario === usuarioLogueado.id) {
                        misfacturas += "Nro. Factura: " + facturas[i].nroFactura + " - " + "Fecha: " + facturas[i].fecha + " - " + "Total $: " + facturas[i].total + "\n";
                    } }
    }
    else 
    {
        misfacturas = "Usted no ha hecho ninguna compra";
    }
    return misfacturas
}




//SUMA TODOS LOS TOTALES DE CADA LINEA DEL CARRITO Y DEVUELVE EL TOTAL A PAGAR
function montoCompra() {
    let montoTotal = 0;
    for(elementoCarrito of carrito){
        montoTotal = parseFloat(montoTotal) + parseFloat(elementoCarrito.total);
    }
    return montoTotal;
}




function comprar() {
 let total = parseFloat(montoCompra());
    if (carrito.length > 0) {

        let i = usuarios.findIndex(usuario => usuario.nombreUsuario === JSON.parse(sessionStorage.getItem("usuario")).nombreUsuario);
        if (parseFloat(usuarios[i].cuenta) >= parseFloat(total)) {
            usuarios[i].cuenta -= total;   //  actualizo el saldo en el array de usuariosd
            generarFactura(total, carrito);//GENERO LA FACTURA
            vaciarCarrito(1); // VACIO CARRITO 
            const compraOk=`Gracias ${usuarios[i].nombre} ${usuarios[i].apellido}, tu Compra se ha realizado con éxito, recibirás un correo a ${usuarios[i].email} con los detalles`
            Swal.fire(compraOk,'Tus pedidos ya se están preparando',)
        }
        else {
            const compraError  =`Saldo Insuficiente, su saldo es de $ ${parseFloat(usuarios[i].cuenta)} , recargue dinero para continuar con la compra`;
            Swal.fire({icon: 'error', title: compraError,})
        }
    }
    else {
        Swal.fire({ icon: 'error', title: "Su carrito esta vacío, agregue productos para poder comprar", })
    }
}






// FUNCION MOMENTANEAMENTE NO LLAMADA
function moverStock(modo, lineacarrito) //    //MODO 0 ES DEBITAR / MODO 1 ACREDITAR Y VIENE UN OBJETO CARRITO QUE ES LA LINEA
{
    let i = productos.findIndex(prod => prod.id == lineacarrito.idProducto); //obtengo el indice del idproducto del objeto carrito
    modo === 1 ? productos[i].cantidad+= lineacarrito.cantidad : productos[i].cantidad-= lineacarrito.cantidad;
}


function calcularPrecioLinea(precio, cantidad){
    let totalLinea = precio * cantidad;
    return (totalLinea);
}




//FUNCION PARA MOSTRAR PRODUCTOS

function mostrarProductos() {
    html.innerHTML = "";
    for (producto of productos) { //EN EL FOR VOY AGREGAANDO UNA TARJETA Por CADA PRODUCTO
        templateCard.querySelector("h5").textContent = producto.descripcion;
        templateCard.querySelector("p").textContent = `$ ${producto.valor}`;
        templateCard.querySelector("img").setAttribute("src", `imagenes/${producto.imagen}`);
        templateCard.querySelector("button").textContent = "Agregar al carrito";
        templateCard.querySelector("button").dataset.id = producto.id;
        templateCard.querySelector("button").removeAttribute("disabled");
        if (producto.cantidad <= 0) { //SI EL PRODUCTO NO TIENE STOCK DESHABILITO EL BOTON PERO IGUAL LO MUESTRO
            templateCard.querySelector("p").textContent = "Sin Stock";
            templateCard.querySelector("button").textContent = "Agotado";
            templateCard.querySelector("button").setAttribute("disabled", "true");
        }
        const cardClonada = templateCard.cloneNode(true);
        fragment.appendChild(cardClonada);
    }
    html.appendChild(fragment);
}


//AGREGAR ITEMS AL CARRITO
function agregaraCarrito(idProdSeleccionado, descProdSeleccionado, valorProdSeleccionado) {


    if (carrito.length > 0) //SI EL CARRITO TIENE ALGO , VERIFICO SI EL PRODUCTO QUE LLEGA YA SE ENCUENTRA PARA SUMARLO
    {
            const i = carrito.findIndex(prod => prod.idProducto == idProdSeleccionado); //obtengo el indice del idproducto del objeto carrito
                  if (i == -1) {
                             //SI NO SE ENCUENTRA EN EL CARRITO LO GUARDO
                             const lineacarrito = new Carrito(idProdSeleccionado, descProdSeleccionado, 1, valorProdSeleccionado, valorProdSeleccionado);
                             carrito.push(lineacarrito);//guardo un objeto carrito que contiene la info de la linea
                  }
                 else {
                            //SI SE ENCUENTRA EN EL CARRITO SUMO LA CANTIDAD Y EL TOTAL
                             carrito[i].cantidad += 1;    
                             carrito[i].total = carrito[i].cantidad * parseFloat(carrito[i].precioLineaCarrito);
                   }
    }
    else {  //SI EL CARRITO ESTA VACIO LO AGREGO //HAY QUE OPTIMIZAR
        const lineacarrito = new Carrito(idProdSeleccionado, descProdSeleccionado, 1, valorProdSeleccionado, valorProdSeleccionado);
        carrito.push(lineacarrito);//guardo un objeto carrito que contiene la info de la linea  
    }

     if (localStorage.getItem("carrito") === null) {
                localStorage.setItem("carrito", JSON.stringify(carrito));
         }
            else 
            {
                localStorage.removeItem("carrito")
                localStorage.setItem("carrito", JSON.stringify(carrito));
            }
      }




/////////////////////////////////EVENTOS ///////////////////////////////////





//EVENTO DEL BOTON AGREGAR AL CARRITO EN CADA TARJETA
html.addEventListener('click', e => {


    if (e.target.classList.contains('btn-dark')) //si hago click en el boton COMPRAR DE CADA CARD
    {
        let idProdSeleccionado = e.target.dataset.id;//con esto obtengo el idproducto clickeado
        let i = productos.findIndex(prod => prod.id == idProdSeleccionado); //Busco en productos el objeto
        productoEnCarrito = productos[i];
        let descProdSeleccionado = e.target.parentElement.querySelector("h5").textContent;
        let valorProdSeleccionado = e.target.parentElement.querySelector("p").textContent;
        agregaraCarrito(idProdSeleccionado, descProdSeleccionado, productoEnCarrito.valor);
        mostrarProductos();
        let contadorCarrito=document.querySelector("#contador");
        contador+=1;
        contadorCarrito.innerHTML=contador;
        localStorage.setItem("contador", JSON.stringify(contador)); //guardo la cantidad del carrito
        const totalCarrito=document.getElementById("totCompra");
        totalCarrito.content=`MONTO TOTAL  $ ${montoCompra()}`;
        Toastify({
            text: "Producto agregado al carrito!",
            duration: 3000,
            gravity: 'bottom',
            position: 'center',
            style: {
                background: 'linear-gradient(to left, #00b09b, #96c92d)'
            }
        }).showToast();  
    }
});



//EVENTO RECARGA DINERO
    
const btnRecargar = document.querySelector("#btnRecargar");
    btnRecargar.addEventListener('click', e => {
    agregarDineroACuentaUsuario(usuarioLogueado);
    linKMiSaldo.textContent  = `Saldo Disponible $${usuarioLogueado.cuenta}`;
})


//EVENTO DEL BOTON VER CARRITO
const vercarrito = document.querySelector("#btnVerCarrito");
vercarrito.addEventListener('click', e => {
verCarrito();

})




//EVENTO BOTON LOGIN
const eventoBotonLogin = document.querySelector("#btnLogin");
eventoBotonLogin.addEventListener('click', e => {

    const usuarioDigitado = document.querySelector("#txtUser").value;
    const UsuarioPassword = document.querySelector("#txtPass").value;
    const valido = validarUsuario(usuarioDigitado, UsuarioPassword);

    if (valido) { // SI VALIDÓ USUARIO
                     totSaldoCarrtio.textContent=`Saldo: $${usuarioLogueado.cuenta}`;
                      //COMPORTAMIENTO LINK MICUENTA
                     linKMiCuenta.setAttribute("class", "nav-link active")
                     linKMiCuenta.setAttribute("disabled", "true"); 
                     linKMiCuenta.textContent  = "Mi Cuenta";
                    //COMPORTAMIENTO LINK RECARGAR
                     linKRecargar.setAttribute("class", "nav-link active")
                     linKRecargar.setAttribute("disabled", "true"); 
                     linKRecargar.textContent  = "Recargar Saldo";
                     //COMPORTAMIENTO LINK SALDO
                     
                     linKMiSaldo.setAttribute("class", "nav-link active")
                     linKMiSaldo.setAttribute("disabled", "true"); 
                     linKMiSaldo.textContent  = `Saldo Disponible $${usuarioLogueado.cuenta}`;
                    // const usuarioDigitado = document.getElementById("txtsaldoActual").value;
                     //txtsaldoActual
                      //COMPORTAMIENTO LINK INGRESAR
                     linkIngresar.setAttribute("disabled", "true");   //SI VALIDO MARCO EL LINK deshabilitado PARA QUE NO SE PUEDA INGRESAR DE NUEVo
                     linkIngresar.textContent = `Bienvenido ${JSON.parse(sessionStorage.getItem("usuario")).nombre}`
                     linkIngresar.setAttribute("class", "nav-link disabled");
                    //COMPORTAMIENTO LINK REGISTRARSE
                    linkRegistrarse.setAttribute("disabled", "true"); 
                    linkRegistrarse.setAttribute("class", "nav-link disabled");
                    linkRegistrarse.textContent  = "";
                     //COMPORTAMIENTO BOTON CERRAR SESION
                     botonCerrarSesion.id = "LinkCerrar";
                     botonCerrarSesion.className = "nav-link active";
                     botonCerrarSesion.setAttribute("data-bs-target", "#staticBackdrop");
                     botonCerrarSesion.setAttribute("href", "");
                     botonCerrarSesion.setAttribute("aria-current", "page");
                     botonCerrarSesion.setAttribute("class", "btn-Cerrar'");
                     botonCerrarSesion.setAttribute("class", "nav-link active")
                     botonCerrarSesion.textContent = "Cerrar Sesion";
                    //COMPORTAMIENTO LINK MI CUENTA
                    linKMiCuenta.setAttribute("class", "nav-link active")
                    linKMiCuenta.textContent = "Mi cuenta";
        
                   cerrarSesion.appendChild(botonCerrarSesion);
                   Toastify({
                    text: "Has iniciado sesion correctamente!",
                    duration: 2000,
                    gravity: 'bottom',
                    position: 'center',
                    style: {
                        background: 'linear-gradient(to left, #00b09b, #96c92d)'
                    }
                }).showToast();


            //EVENTO BOTÓN CERRAR SESION
             botonCerrarSesion.addEventListener('click', e => {
            //ELIMINO EL SESSION STORAGE y quito el boton cerrar session Y CAMBIO EL ESTADO DEL BOTON INGRESAR
            sessionStorage.removeItem("usuario");// QUITO AL USUARIO DEL STORAGE
            cerrarSesion.removeChild(botonCerrarSesion); //QUITO EL BOTON CERRAR SESION
            linkIngresar.textContent = `Ingresar`;
            linkIngresar.removeAttribute("class", "nav-link disabled");
            linKMiCuenta.removeAttribute("class", "nav-link disabled");
          
        })
    }
    else { //SI NO VALIDÓ    
Swal.fire({
    icon: 'error',
    title: 'Usuario o Contraseña incorrectos, vuelve a intentarlo',
  })
    }
})




//EVENTO BOTON VACIAR CARRITO
eventoBotonVaciar.addEventListener('click', e => {
    vaciarCarrito(0);
    html.innerHTML = "";
    mostrarProductos();
    localStorage.removeItem("carrito");
    localStorage.removeItem("contador");
    contador=0;
    contadorCarrito.innerHTML=contador;
})


//EVENTO BOTON REGISTRARSE
eventoBotonRegistro.addEventListener('click', e => {

    const nombreUsuario = document.querySelector("#txtUser1").value;
    const nombre = document.querySelector("#txtNombre").value;
    const apellido = document.querySelector("#txtApellido").value;
    const id=Math.ceil(Math.random() * 1000).toString();
    const cuenta=0;
    const email=document.querySelector("#txtmail").value;
    const pass=document.querySelector("#txtPass1").value;
    const UsuarioNuevo= new Usuario(id,nombre,apellido,nombreUsuario,pass,cuenta,email);
    agregarUsuario(UsuarioNuevo);


})


//EVENTO BOTON PAGAR
eventoBotonComprar.addEventListener('click', e => {
    //VERIFICO QUE ESTE ALGUIEN LOGUEADO
    if (sessionStorage.getItem("usuario") === null) {
        Swal.fire({
            icon: 'error',
            title: "Usuario,debes loguearte para poder comprar",
          })
    }
    else {
        comprar();
        localStorage.removeItem("carrito")
        linKMiSaldo.textContent  = `Saldo Disponible $${usuarioLogueado.cuenta}`;
    }
})


// FUNCION PARA EVENTOS DE SUMAR Y RESTAR EN CARRITO
SumoResto = () => {
 
    const botonSumar= document.querySelectorAll("#carritoConProducto .btn-info")
    const botonRestar= document.querySelectorAll("#carritoConProducto .btn-danger")
    //RECORRO TODOS LOS BOTONES BTNSUMAR
    botonSumar.forEach(btn => {
    btn.addEventListener('click',()=> {
     const i = carrito.findIndex(prod => prod.idProducto == btn.dataset.id); //obtengo el indice del idproducto del objeto carrito
     carrito[i].cantidad+=1;
     carrito[i].total= calcularPrecioLinea(carrito[i].precioLineaCarrito, carrito[i].cantidad)
     contador++;
     verCarrito() ;
     contadorCarrito.innerHTML=contador;
     actualizarlocalStorageCarrito();
    })
    })
    
    
    
    //RECORRO TODOS LOS BOTONES RESTar
    botonRestar.forEach(btn => {
            btn.addEventListener('click',()=> {
             //   console.log(contador)
            const i = carrito.findIndex(prod => prod.idProducto == btn.dataset.id); //obtengo el indice del idproducto del objeto carrito
            carrito[i].cantidad-=1;
            contador--;
            carrito[i].total= calcularPrecioLinea(carrito[i].precioLineaCarrito, carrito[i].cantidad)
            carrito[i].cantidad==0 && carrito.splice(i,1); //if
            verCarrito() ;
            contadorCarrito.innerHTML=contador
            actualizarlocalStorageCarrito();
    
        })
        })
    }



    function actualizarlocalStorageCarrito(){ //SETEO EL LOCAL STORAGE EN CADA MOVIMIENTO DEL CARRITO
        localStorage.setItem("contador", JSON.stringify(contador)); //guardo la cantidad del carrito
        localStorage.setItem("carrito", JSON.stringify(carrito)); //guardo la linea carrito
    }




//VER CARRITO
function verCarrito() {
     
    document.querySelector("#carritoConProducto").innerHTML = "";
    for (elementoCarrito of carrito) 
    {
        templateCARRITO.querySelectorAll("td")[0].textContent = elementoCarrito.descProducto;
        templateCARRITO.querySelectorAll("td")[1].textContent = elementoCarrito.cantidad;
        templateCARRITO.querySelector("span").textContent = elementoCarrito.total;
        templateCARRITO.querySelectorAll("button")[0].dataset.id = elementoCarrito.idProducto;
        templateCARRITO.querySelectorAll("button")[1].dataset.id = elementoCarrito.idProducto;
        const clone = templateCARRITO.cloneNode(true);
        fragment.appendChild(clone);
    }
        document.querySelector("#carritoConProducto").appendChild(fragment)
        lineaMontoTotal.textContent=textContent=`Total Compra: $${montoCompra()} `;
      
        SumoResto () ; //funcion de los botones de sumar y restar
       
      
}


                                       

async function inicioProductos()
{
    await cargarProductos();
    mostrarProductos();

}
                                      
inicioProductos();//ARRANCO PROGRAMA
sessionStorage.removeItem("usuario"); //AL INICIAR PROGRAMA BORRO EL SESSIONSTORAGE PARA SEGURIDAD QUE HAYA QUEDADO DUPLICADO
carrito= JSON.parse(localStorage.getItem("carrito")) || [] ;//CARGO EL CARRITO, SI HAY ALGO.
contador=JSON.parse(localStorage.getItem("contador"))|| 0; //CARGO EL CONTADOR CARRTIO, SI HAY ALGO.
let contadorCarrito=document.querySelector("#contador");
contadorCarrito.innerHTML=contador;


