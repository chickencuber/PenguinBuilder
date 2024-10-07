function createOption(data) {
    return $.create("button").child([$.create("img").css({
        width: "65%",
        height: "45%"
    }).props({ src: data.image }), $.create("div").text(data.options["display-name"]),
    $.create("div").text(data.options.description).css({
        "font-size": "10px"
    }),
    $.create("div").text(`by: ${data.options.creator}`).css({
        "font-size": "10px",
    })
    ]).class("option");
}

const data = {};

(async () => {
    const url = "https://api.github.com/repos/chickencuber/PenguinBuilder_ExtensionGallery/contents?cache=" + Date.now();
    const exclude = [
        "extensions.d.ts",
        "tsconfig.json",
        "README.md",
        "example",
    ]
    const val = (await (await fetch(url)).json()).filter(v => {
        return !exclude.includes(v.name);
    });
    for (const ext of val) {
        //gets const contents of the directory as an object
        const contents = ((v) => {
            const obj = {};
            for (const file of v) {
                obj[file.name] = file;
            }
            return obj;
        })(await (await fetch(ext.url)).json());
        const image = contents["image.png"] ? contents["image.png"].download_url + "?cache=" + Date.now() : "./default.png";
        data[ext.name] = {
            image,
            options: await (await fetch(contents["options.json"].download_url + "?cache=" + Date.now())).json(),
            javascript: await (await fetch(contents["index.js"].download_url + "?cache=" + Date.now())).text(),
        }
        if(data[ext.name].options.WIP && !((new URLSearchParams(location.search)).has("WIP"))) {
            delete data[ext.name];
            continue;
        }
        if (data[ext.name].options.loader) {
            data[ext.name].code = new Function(data[ext.name].javascript);
        }
    }
    showData(data);
})();


function showData(data) {
    for (const [key, value] of Object.entries(data)) {
        $("main").child(createOption(value).click(() => {
            if (value.options["potential-danger"] || value.options.loader) {
                if (confirm("this extension is potentially dangerous\nare you sure you want to load it")) {
                    postData(key, value);
                }
                return;
            }
            postData(key, value);
        }));
    }
}

function postData(key, value) {
    if (value.options.loader) {
        value.code().then(v => {
            opener.postMessage({ type: "extension", data: { code: v, id: crypto.randomUUID() } }, "*");
        })
        return;
    }
    opener.postMessage({ type: "extension", data: { code: value.javascript, id: key } }, "*");
}
