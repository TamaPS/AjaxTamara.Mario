var select = document.getElementById("cuadroLista");
var paginacion = document.getElementById("paginacion");
var boton = document.getElementById("botonBuscar");
var paginaActual = 0;
var numPaginas;

/*
Cuando se abre la página se llama a la función obtener fotos, 
sin categoría y en página 0 por defecto 
*/
obtenerFotos();

/*
Cuando se selecciona en el "cuadrolista" una categoría, 
y se pulsa el botón, se vuelve a la página inicial
y se llama a la función 
"ObtenerFotos" 
*/
boton.addEventListener("click", function () {
    paginaActual = 0;
    obtenerFotos();
});

/*
Llama a la función obtener respuesta y le pasa los dos parámetros 
(caso resolve y caso reject)
y la API de las categorías que se encuentra en mi git
*/
obtenerRespuesta("https://my-json-server.typicode.com/TamaPS/categorias/categorias").then(
    manejarRespuestaCategories,
    manejarError
);

/*
Llama a la función obtener respuesta y le pasa los dos parámetros 
(caso resolve y caso reject)
y la API de las razas
*/
obtenerRespuesta('https://api.thecatapi.com/v1/breeds?attach_breed=0').then(
    manejarRespuestaRazas,
    manejarError
);

/*
Función que recibe la url de la API de categorías.
Devuelve una promesa, que redirige a 
"manejarRespuestaCategories" o "manejarError"
setRequestHeader es la clave que solicita la API
*/
function obtenerRespuesta(url) {
    return new Promise(function (resolve, reject) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url);
        xhr.responseType = 'json';
        xhr.setRequestHeader("x-api-key", "28b67f5f-39c3-449c-8a90-0c9dd8c36bf4");
        xhr.onload = function () {
            if (xhr.status == 200) {
                var respuesta = [xhr.getResponseHeader('Pagination-Count'), xhr.response];
                resolve(respuesta);
            } else {
                reject(Error(xhr.statusText));
            }
        };
        xhr.onerror = function () {
            reject(Error("******Network Error*****"));
        };
        xhr.send();
    })
}

/*
Función para cargar las fotos de una determinada categoría
*/
function obtenerFotos() {
    obtenerRespuesta("https://api.thecatapi.com/v1/images/search?page=" + paginaActual + "&limit=6&order=asc&size=small&category_ids=" + select.value + "&breed_ids=" + raza.value).then(
        manejarRespuestaImages,
        manejarError
    );
}

/*
Función para recoger la categoría en el select
por defecto es none
*/
function manejarRespuestaCategories(respuesta) {
    resCategorias = respuesta[1];
    var categorias = '<option value="">none</option>';
    for (var i = 0; i < resCategorias.length; i++) {
        categorias += '<option value="' + resCategorias[i].id + '">' + resCategorias[i].name + '</option>';
    }
    document.getElementById("cuadroLista").innerHTML = categorias;
}

/*
Función para recoger la raza en el select
por defecto es none
*/
function manejarRespuestaRazas(listaRazas) {
    resRazas = listaRazas[1];
    var razas = '<option value="">none</option>';
    for (var i = 0; i < resRazas.length; i++) {
        razas += '<option value="' + resRazas[i].id + '">' + resRazas[i].name + '</option>';
    }
    document.getElementById("raza").innerHTML = razas;
}


/*
Función para cambiar de página
y obtener fotos de dicha página
Recibe la página que se quiere mostrar
*/
function cambiarPagina(numPagina) {
    paginaActual = numPagina;
    obtenerFotos();
}

/*
Función para recoger las imágenes
1º Recoge la imágenes que hay en cada categoría
2º Define el número de páginas por categoría = 6 imágenes por x páginas
3º Carga las imágenes en un contenedor row del html
*/
function manejarRespuestaImages(respuesta) {
    numTotalImages = respuesta[0];
    numPaginas = numTotalImages / 6
    resImages = respuesta[1];
    var fotos = '';
    for (var i = 0; i < resImages.length; i++) {
        fotos += '<div class="col-12 col-md-6 col-xl-4"><div class="card square  text-center"><img class="card-img-top" width="200" src="' + resImages[i].url + '" alt="' + resImages[i].id + '"></div></div>';
    }
    document.getElementsByClassName("row")[0].innerHTML = fotos;
    /*
    SECCIÓN PARA CREAR LA PAGINACIÓN
    */
    var a = document.createElement('a');
    a.href = '#';
    a.className = 'page-link';
    a.text = '';

    var li = document.createElement('li');
    li.className = 'page-item';

    paginacion.innerHTML = '';

    /*
    Las páginas avanzan y retroceden de 3 en 3
    */
    paginaInicial = paginaActual - 3;

    /*
    Defina la página inicial como página 0 si
    al restarle 3 es menor a 0
    */
    if (paginaInicial < 0)
        paginaInicial = 0;

    /*
    Se añade el evento onclick a la página de retroceso
    y llama a la función cambiar página pasándole la página actual -1
    */
    var a = document.createElement('a');
    a.setAttribute('onclick', 'cambiarPagina(' + (paginaActual - 1) + ')');
    a.className = 'page-link';
    a.text = '<<';
    var li = document.createElement('li');
    if (paginaActual > 0)
        li.className = 'page-item';
    else {
        li.className = 'page-item disabled';
    }
    li.appendChild(a);
    paginacion.appendChild(li);

    /*
    Creación de los botones del 1 al 6
    */
    for (var i = paginaInicial; i < (paginaInicial + 6); i++) {
        if (i < numPaginas) {
            var a = document.createElement('a');
            a.setAttribute('onclick', 'cambiarPagina(' + i + ')');
            a.className = 'page-link';
            a.text = i + 1;
            var li = document.createElement('li');
            if (i == paginaActual) {
                li.className = 'page-item active';
            } else {
                li.className = 'page-item';
            }
            li.appendChild(a);
            paginacion.appendChild(li);
        }
    }

    /*
    Se añade el evento onclick a la página de avance
    y llama a la función cambiar página pasándole la página actual +1
    */
    var a = document.createElement('a');
    a.setAttribute('onclick', 'cambiarPagina(' + (paginaActual + 1) + ')');
    a.className = 'page-link';
    a.text = '>>';
    var li = document.createElement('li');
    if (paginaActual < numPaginas - 1)
        li.className = 'page-item';
    else {
        li.className = 'page-item disabled';
    }
    li.appendChild(a);
    paginacion.appendChild(li);
}


/*
Función a la que envía la llamada a la promesa 
en caso de "manejarError"
*/
function manejarError() {
    console.log("**********Error*************");
}
