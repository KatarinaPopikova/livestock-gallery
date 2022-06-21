let order = [];
let gallery;
let jsonPublic;
document.addEventListener("DOMContentLoaded", () => {
    gallery = document.getElementById("gallery-wrapper");

    $('#cookMod').modal({backdrop: 'static', keyboard: false});

    const searchInput = document.getElementById("myInput");
    const cookieValue = getCookie("search");
    JSON.stringify(order);
    if (cookieValue) {
        searchInput.value = cookieValue;
    }

    fetch("resource/images.json")
        .then(response => response.json())
        .then(json => {
            const zobrazenieCookies = getCookie('zobrazenieCookie');
            if (zobrazenieCookies) {
                order = JSON.parse(zobrazenieCookies);
            } else {
                json.photos.forEach((item, index) => {
                    order[index] = index.toString();
                });
            }
            jsonPublic = json;
            polozky();
        })

});

function polozky() {

    order.forEach((item) => {
        let galleryItem = document.createElement("img");
        galleryItem.setAttribute("src", "resource/images/" + jsonPublic.photos[item].src);
        galleryItem.setAttribute("id", item);
        galleryItem.classList = 'thumbnail';
        galleryItem.setAttribute("data-target", "#carouselExampleControls");

        gallery.appendChild(galleryItem);
    });
    setCookie("zobrazenieCookie", JSON.stringify(order), 30);
    zobrazObrazok();
}

$(function () {
    $("#gallery-wrapper").sortable(
        {

            update: function () {
                let galleryItem = $("#gallery-wrapper img");
                jQuery.each(galleryItem, (item, index) => {
                    order[item] = index.id;
                })
                setCookie("zobrazenieCookie", JSON.stringify(order), 30);
                zobrazObrazok();
            }
        }
    );
    $("#gallery-wrapper").disableSelection();
});

function zobrazObrazok() {
    let fotky = $("#gallery-wrapper img");
    jQuery.each(fotky, (index, item) => {
        $(item).attr("data-slide-to", index);
    });
    $(".carousel-inner").empty();
    order.forEach((item, index) => {
        let obrazky = document.createElement("img");
        obrazky.classList.add(...["d-block", "w-100"]);
        obrazky.setAttribute("src", "resource/images/" + jsonPublic.photos[item].src);
        obrazky.setAttribute("alt", jsonPublic.photos[item].title);

        let fotka = document.createElement("div");
        fotka.classList.add("carousel-item");
        if (index === 0)
            fotka.classList.add("active");


        let titulok = document.createElement("div");
        let title = document.createElement("h5");
        title.innerText = jsonPublic.photos[item].title;
        let description = document.createElement("p");
        description.innerText = jsonPublic.photos[item].description;
        titulok.appendChild(title);
        titulok.appendChild(description);
        fotka.appendChild(obrazky);
        fotka.appendChild(titulok);
        $(".carousel-inner").get(0).append(fotka);

    });
}

function filtruj() {

    let input, filter, a, i, b;
    input = document.getElementById("myInput");
    filter = input.value.toUpperCase();
    setCookie('search', input.value, 30);

    jsonPublic.photos.forEach((item, index) => {
        a = item.title;
        b = item.description;
        i = order.indexOf(index.toString());

        if (a.toUpperCase().indexOf(filter) === -1 && b.toUpperCase().indexOf(filter) === -1) {
            if (i !== -1)
                order.splice(i, 1);

        } else {
            if (i === -1)
                order.push(index.toString());
        }
    })
    $("#gallery-wrapper").empty();
    polozky();
}

function spusti() {
    $('.carousel').carousel("cycle");
}

function stopni() {
    $('.carousel').carousel("pause");
}

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}
