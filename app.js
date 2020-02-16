function obtenerRespuesta(url) {
    return new Promise(function (resolve, reject) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url);
        xhr.responseType = 'json';
        xhr.setRequestHeader("x-api-key", "28b67f5f-39c3-449c-8a90-0c9dd8c36bf4");
        xhr.onload = function () {
            if (xhr.status == 200) {
                var respuesta = xhr.response;
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

obtenerRespuesta("https://api.thecatapi.com/v1/categories").then(
    manejarRespuestaCategories,
    manejarError
);

obtenerRespuesta("https://api.thecatapi.com/v1/images/search?page=1&limit=6&order=asc&category_ids=5").then(
    manejarRespuestaImages,
    manejarError
);

function manejarRespuestaCategories(respuesta) {
    var categorias = '<option value="">none</option>';
    for (var i = 0; i < respuesta.length; i++) {
        categorias += '<option value="' + respuesta[i].id + '">' + respuesta[i].name + '</option>';
    }
    document.getElementById("cuadroLista").innerHTML = categorias;
}

function manejarRespuestaImages(respuesta) {
    var fotos;
    for (var i = 0; i < respuesta.length; i++) {
        fotos += '<div class="col col-12 col-sm-6 col-md-4 d-block h-100"><img src="' + respuesta[i].url + '" alt="' + respuesta[i].id + '" class="img-fluid img-thumbnail"></div>';
    }
    document.getElementsByClassName("row")[0].innerHTML = fotos;
}

function manejarError() {
    console.log("**********Error*************");
}
