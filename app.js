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

obtenerRespuesta("https://api.thecatapi.com/v1/images/search?page=1&limit=6&order=asc&category_ids=").then(
    manejarRespuestaImages,
    manejarError
);

var select = document.getElementById("cuadroLista");

select.addEventListener("change", function() {
    obtenerRespuesta("https://api.thecatapi.com/v1/images/search?page=1&limit=6&order=asc&category_ids="+select.value).then(
        manejarRespuestaImages,
        manejarError
    );
});

function manejarRespuestaCategories(respuesta) {
    var categorias = '<option value="">none</option>';
    for (var i = 0; i < respuesta.length; i++) {
        categorias += '<option value="' + respuesta[i].id + '">' + respuesta[i].name + '</option>';
    }
    document.getElementById("cuadroLista").innerHTML = categorias;
}

function manejarRespuestaImages(respuesta) {
    var fotos = '';
    for (var i = 0; i < respuesta.length; i++) {
        //fotos += '<div class="card square"><div class="card-body"><img class="card-img-top" width="200" src="' + respuesta[i].url + '" alt="' + respuesta[i].id + '"></div></div>';
        fotos += '<div class="col-12 col-md-6 col-xl-4"><div class="card square  text-center"><img class="card-img-top" width="200" src="' + respuesta[i].url + '" alt="' + respuesta[i].id + '"></div></div>';
    }
    document.getElementsByClassName("row")[0].innerHTML = fotos;
}

function manejarError() {
    console.log("**********Error*************");
}
