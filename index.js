const domain = "https://raw.githubusercontent.com/iaa2005/iaa/main";
let global_index = 0;

$(document).ready(function() {
    $.get("/header.html", function(data) {
        $(".header").append(data);
    });
    $.get("/footer.html", function(data) {
        $("#footer-div").append(data);
    });
    $.get("/header-menu.html", function(data) {
        $("#header-menu-div").append(data);

        $("#titles").addClass("disappear");

        $("#open-btn").on('click', function() {
            $("#menu-header").addClass("open");
            $("#open-btn").addClass("disappear");
            $("#titles").removeClass("disappear");
        });

        $("#close-btn").on('click', function() {
            $("#menu-header").removeClass("open");
            $("#open-btn").removeClass("disappear");
            $("#titles").addClass("disappear");
        });

        load_markdown();
    });

});

function getParameterByName(name, url = window.location.href) {
    name = name.replace(/[\[\]]/g, '\\$&');
    let regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

function make_block(metadata, filename) {
    let color = "";
    let type_url = "";
    switch (metadata.type) {
        case "Физика":
            color = "blue";
            type_url = "physics";
            break;
        case "Электроника":
            color = "yellow";
            type_url = "electronics";
            break;
        case "Биохимия":
            color = "violet";
            type_url = "biochemistry";
            break;
        case "Квантум":
            color = "pink";
            type_url = "quantum";
            break;
        case "Алгоритм":
            color = "orange";
            type_url = "algorithm";
            break;
        case "Крипто":
            color = "crypto";
            type_url = "crypto";
            break;
        case "Планета":
            color = "green";
            type_url = "planet";
            break;
        case "Космос":
            color = "space";
            type_url = "space";
            break;
        default:
            color = "";
    }
    return `<div class="block">
        <div class="card" style="background-image: url(${metadata.image})">
            <div class="inblock-text">
                <div class="type-article-theme-mode">
                    <div class="type-article">
                        <a href="https://iaa2005.tk/${type_url}" class="type-article-text ${color}">${metadata.type} 􀁵</a>
                    </div>
                </div>
                <a href="https://iaa2005.tk?topic=${filename}" class="h1 roboto700">${metadata.title}</a>
                <a href="https://iaa2005.tk?topic=${filename}" class="h2 roboto400">${metadata.description}</a>
                <a class="h3">${metadata.by} • ${metadata.time}</a>
            </div>
        </div>
    </div>
    `
}

function make_topic(metadata, data) {
    let color = "";
    let type_url = "";
    switch (metadata.type) {
        case "Физика":
            color = "blue";
            type_url = "physics";
            break;
        case "Электроника":
            color = "yellow";
            type_url = "electronics";
            break;
        case "Биохимия":
            color = "violet";
            type_url = "biochemistry";
            break;
        case "Квантум":
            color = "pink";
            type_url = "quantum";
            break;
        case "Алгоритм":
            color = "orange";
            type_url = "algorithm";
            break;
        case "Планета":
            color = "green";
            type_url = "planet";
            break;
        case "Крипто":
            color = "crypto";
            type_url = "crypto";
            break;
        case "Космос":
            color = "space";
            type_url = "space";
            break;
        default:
            color = "";
    }
    return `<div class="block">
        <a>
            <img class="inblock-image" src="${metadata.image}">
        </a>
        <div class="inblock-text-block">
            <div class="type-article-theme-mode">
                <div class="type-article">
                    <a href="https://iaa2005.tk/${type_url}" class="type-article-text ${color}">${metadata.type} 􀁵</a>
                </div>
            </div>
            <a class="h1-topic roboto700">${metadata.title}</a>
            <a class="h2-topic roboto400">${metadata.description}</a>
            <a class="h3-topic">${metadata.by} • ${metadata.time}</a>
            ${data}
        </div>
    </div>
    `
}

async function load_block(filename) {
    new Promise( function(resolve, reject) {
        $.get(`${domain}/markdown/${filename}/index.md`, function (data) {
            let converter = new showdown.Converter({metadata: true});
            let html_code = converter.makeHtml(data);
            let metadata = converter.getMetadata(false);
            let html_block = make_block(metadata, filename);
            $(".blocks").append(html_block);
        });
    });
}

function load_markdown() {
    let pathname = window.location.pathname;
    if (pathname === "/") {
        let query = String(getParameterByName("topic"));
        $.get("/markdown/filemap.txt", function (data) {
            list = data.split("\n");
            list.sort(); list.reverse();
            if (list.indexOf(query) === -1) {
                let types = ["PH", "EL", "CH", "QU", "CR", "AL", "SP", "PL"];
                let check = [0, 0, 0, 0, 0, 0, 0, 0];
                let new_list = [];
                for (const filename of list) {
                    if ((types.indexOf(filename.substring(8, 10)) !== -1) &&
                    (check[types.indexOf(filename.substring(8, 10))] === 0)) {
                        new_list.push(filename);
                        check[types.indexOf(filename.substring(8, 10))] = 1;
                    }
                }
                for (const filename of new_list) {
                    $.get(`${domain}/markdown/${filename}/index.md`, function (data) {
                        let converter = new showdown.Converter({metadata: true});
                        let html_code = converter.makeHtml(data);
                        let metadata = converter.getMetadata(false);
                        let html_block = make_block(metadata, filename);
                        $(".blocks").append(html_block);
                    });
                }
            } else {
                $(".see-all-block").addClass("remove");
                $.get(`${domain}/markdown/${query}/index.md`, function (data) {
                    let converter = new showdown.Converter({metadata: true});
                    let html_code = converter.makeHtml(data);
                    let metadata = converter.getMetadata(false);
                    let html_topic = make_topic(metadata, html_code);
                    document.title = `${metadata.title} | IAA Inc.`;
                    $(".blocks").append(html_topic);

                    $("#theme-btn").on('click', function() {
                        if ($("#theme-btn").hasClass("dark-mode")) {
                            light_mode_on();
                        } else {
                            dark_mode_on();
                        }
                    });
                });
            }
        });
    } else if (pathname === "/physics/" || 
    pathname === "/electronics/" || 
    pathname === "/biochemistry/" || 
    pathname === "/quantum/" || 
    pathname === "/crypto/" || 
    pathname === "/space/" ||  
    pathname === "/algorithm/" || 
    pathname === "/planet/") {
        let type = ""
        switch (pathname) {
            case "/physics/":
                type = "PH";
                break;
            case "/electronics/":
                type = "EL";
                break;
            case "/biochemistry/":
                type = "CH";
                break;
            case "/quantum/":
                type = "QU";
                break;
            case "/algorithm/":
                type = "AL";
                break;
            case "/planet/":
                type = "PL";
                break;
            case "/crypto/":
                type = "CR";
                break;
            case "/space/":
                type = "SP";
                break;
            default:
                type = "";
        }
        $.get("/markdown/filemap.txt", async (data) => {
            let nofilter_list = data.split("\n");
            nofilter_list.sort(); nofilter_list.reverse();
            let list = []
            for (const filename of nofilter_list) {
                if (type == filename.substring(8, 10)) {
                    list.push(filename);
                }
            }
            let i = 0;
            while (true) {
                await load_block(list[global_index]);
                console.log(i, global_index);
                i += 1; global_index += 1;
                if (global_index >= list.length) {
                    break;
                }
                if (i === 6) {
                    break;
                }
            }
            if (global_index < list.length) {
                $(".more-block").removeClass("remove");
            }
            $("#more-button").on('click', async () => {
                if (global_index >= list.length) {
                    $(".more-block").addClass("remove");
                } else {
                    let i = 0;
                    while (true) {
                        await load_block(list[global_index]);
                        console.log(i, global_index);
                        i += 1; global_index += 1;
                        if (global_index === list.length) {
                            $(".more-block").addClass("remove");
                            break;
                        }
                        if (i === 6) {
                            break;
                        }
                    }
                }
            });
        });
    } else if (pathname === "/all/") {
        $.get("/markdown/filemap.txt", async (data) => {
            list = data.split("\n");
            list.sort(); list.reverse();
            let i = 0;
            while (true) {
                await load_block(list[global_index]);
                console.log(i, global_index);
                i += 1; global_index += 1;
                if (global_index >= list.length) {
                    break;
                }
                if (i === 6) {
                    break;
                }
            }
            if (global_index < list.length) {
                $(".more-block").removeClass("remove");
            }
            $("#more-button").on('click', async () => {
                if (global_index >= list.length) {
                    $(".more-block").addClass("remove");
                } else {
                    let i = 0;
                    while (true) {
                        await load_block(list[global_index]);
                        console.log(i, global_index);
                        i += 1; global_index += 1;
                        if (global_index === list.length) {
                            $(".more-block").addClass("remove");
                            break;
                        }
                        if (i === 6) {
                            break;
                        }
                    }
                }
            });
        });
    }
}
