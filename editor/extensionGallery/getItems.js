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
        console.log(contents);
    }
})()
