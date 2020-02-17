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

obtenerRespuesta("https://api.thecatapi.com/v1/categories").then(
    manejarRespuestaCategories,
    manejarError
);

obtenerRespuesta("https://api.thecatapi.com/v1/images/search?page=0&limit=6&order=asc&size=small&category_ids=").then(
    manejarRespuestaImages,
    manejarError
);

var select = document.getElementById("cuadroLista");

select.addEventListener("change", function() {
    obtenerRespuesta("https://api.thecatapi.com/v1/images/search?page=0&limit=6&order=asc&size=small&category_ids="+select.value).then(
        manejarRespuestaImages,
        manejarError
    );
});

function manejarRespuestaCategories(respuesta) {
    resCategorias = respuesta[1];
    var categorias = '<option value="">none</option>';
    for (var i = 0; i < resCategorias.length; i++) {
        categorias += '<option value="' + resCategorias[i].id + '">' + resCategorias[i].name + '</option>';
    }
    document.getElementById("cuadroLista").innerHTML = categorias;
}

function manejarRespuestaImages(respuesta) {
    numTotalImages = respuesta[0];
    
    resImages = respuesta[1];
    var fotos = '';
    for (var i = 0; i < resImages.length; i++) {
        fotos += '<div class="col-12 col-md-6 col-xl-4"><div class="card square  text-center"><img class="card-img-top" width="200" src="' + resImages[i].url + '" alt="' + resImages[i].id + '"></div></div>';
    }
    document.getElementsByClassName("row")[0].innerHTML = fotos;
}

function manejarError() {
    console.log("**********Error*************");
}
