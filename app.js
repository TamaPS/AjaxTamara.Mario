var select = document.getElementById("cuadroLista");
var paginacion = document.getElementById("paginacion");
var paginaActual = 0;
var numPaginas;

select.addEventListener("change", function () {
    paginaActual = 0;
    obtenerFotos();
});

obtenerRespuesta("https://api.thecatapi.com/v1/categories").then(
    manejarRespuestaCategories,
    manejarError
);

obtenerFotos();

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

function obtenerFotos() {
    obtenerRespuesta("https://api.thecatapi.com/v1/images/search?page=" + paginaActual + "&limit=6&order=asc&size=small&category_ids=" + select.value).then(
        manejarRespuestaImages,
        manejarError
    );
}

function manejarRespuestaCategories(respuesta) {
    resCategorias = respuesta[1];
    var categorias = '<option value="">none</option>';
    for (var i = 0; i < resCategorias.length; i++) {
        categorias += '<option value="' + resCategorias[i].id + '">' + resCategorias[i].name + '</option>';
    }
    document.getElementById("cuadroLista").innerHTML = categorias;
}

function cambiarPagina(numPagina) {
    paginaActual = numPagina;
    obtenerFotos();
}

function manejarRespuestaImages(respuesta) {
    numTotalImages = respuesta[0];
    numPaginas = numTotalImages / 6
    resImages = respuesta[1];
    var fotos = '';
    for (var i = 0; i < resImages.length; i++) {
        fotos += '<div class="col-12 col-md-6 col-xl-4"><div class="card square  text-center"><img class="card-img-top" width="200" src="' + resImages[i].url + '" alt="' + resImages[i].id + '"></div></div>';
    }
    document.getElementsByClassName("row")[0].innerHTML = fotos;

    var a = document.createElement('a');
    a.href = '#';
    a.className = 'page-link';
    a.text = '';

    var li = document.createElement('li');
    li.className = 'page-item';

    paginacion.innerHTML = '';

    paginaInicial = paginaActual - 3;
    if (paginaInicial < 0)
        paginaInicial = 0;

    var a = document.createElement('a');
    a.setAttribute('onclick', 'cambiarPagina(' + (paginaActual-1) + ')');
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

    var a = document.createElement('a');
    a.setAttribute('onclick', 'cambiarPagina(' + (paginaActual+1) + ')');
    a.className = 'page-link';
    a.text = '>>';
    var li = document.createElement('li');
    if (paginaActual < numPaginas-1)
        li.className = 'page-item';
    else {
        li.className = 'page-item disabled';
    }
    li.appendChild(a);
    paginacion.appendChild(li);
}

function manejarError() {
    console.log("**********Error*************");
}
