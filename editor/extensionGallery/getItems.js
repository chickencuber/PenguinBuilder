$.loadPlugin(JSQuery.CustomElements, true);

$.custom("button-option", (elt) => {
    return $.create("button").child([$.create("img").css({
        width: "80%",
        height: "60%"
    }).props({ src: elt.getProp("src") }), $.create("div").text(elt.text()),
    $.create("div").text(elt.getProp("d")? elt.getProp("d"): "").css({
        "font-size": "10px"
    })
    ]).css({
        width: "100%",
        height: "100%",
    });
})

const data = {};

(async () => {
    const url = "https://api.github.com/repos/chickencuber/PenguinBuilder_ExtensionGallery/contents";
    const exclude = [
        "extensions.d.ts",
        "tsconfig.json"
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
        const image = contents["image.png"] ? await (await fetch(contents["image.png"].download_url)).blob() : "./default.png";
        data[ext.name] = {
            image,
            options: await (await fetch(contents["options.json"].download_url)).json(),
            javascript: await (await fetch(contents["index.js"].download_url)).text(),
        }
    }
    showData(data);
})();


function showData(data) {
    for (const value of Object.values(data)) {
        $("main").child($.create("button-option").props({ src: value.image, d: value.options.description }).text(value.options["display-name"]).click(() => {
            if(value.options["potential-danger"]) {
                if(confirm("this extension is potentially dangerous\nare you sure you want to load it")) {
                    window.loadedExtension = value.javascript;
                }
                return;
            }
            window.loadedExtension = value.javascript;
        }));
    }
}
