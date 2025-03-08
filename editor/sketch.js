const version = "3.7";

const whats_new = `
added test button(opens in turbowarp due to a bug in penguinmod, and only supports sandboxed extensions right now) 
`;

$("html").on("keydown", (e) => {
    if(e.ctrlKey && e.key == "s") {
        $("#Save").click();
        e.preventDefault();
    }
});

installAllBlocks({
  javascript: javascript.javascriptGenerator,
});

class Search extends JSQuery.Plugin {
    Element() {
        return {
            $(q = "") {
                return $.from(this.elt.querySelector(q));
            },
            all(q = "") {
                return $.from(this.elt.querySelectorAll(q));
            },
        };
    }
}

$.loadPlugin(Search, true);

class Templates extends JSQuery.Plugin {
    Element() {
        return {
            replace(elt) {
                this.elt.replaceWith(elt.elt);
                return elt;
            },
            getProps() {
                const obj = {};
                for (const { name, value } of this.elt.attributes) {
                    obj[name] = value;
                }
                return obj;
            },
            create() {
                if (this.elt.tagName.toLowerCase() === "template") {
                    const temp = $.create("div");
                    const props = this.getProps();
                    delete props.id;
                    for (const [k, v] of Object.entries(props)) {
                        temp.props({ [k]: v });
                    }
                    temp.class(this.id()).html(this.html());
                    return temp;
                } else {
                    throw new Error("element isn't a template");
                }
            },
        };
    }
}

$.loadPlugin(Templates, true);


$("#version").text("v" + version);

let Extension_id = "ExtensionID";
let name = "ExtensionName";
let color1 = "#0088ff";
let forceUnsandboxed = false;

function getTopBlocks(block) {
    if (block.parentBlock_ === null) {
        return block;
    }
    return getTopBlocks(block.parentBlock_);
}

((inputs) => {
    for (const inp of inputs) {
        inp.addEventListener("keydown", function () {
            const self = this;
            setTimeout(function () {
                for (let i = 0; i < 5; i++) {
                    self.value = self.value.toLowerCase().replace(/[^a-z0-9]/g, "");
                }
            }, 0.1);
        });
    }
})(document.querySelectorAll("input.no"));

function getID() {
    Extension_id = $("#ExtensionID").value();
    if (Extension_id === "") {
        Extension_id = "ExtensionID";
    }

    name = $("#ExtensionName").value();
    if (name === "") {
        name = "ExtensionName";
    }

    color1 = $("#Color").value();
    if (color1 === "") {
        color1 = "#0088ff";
    }

    forceUnsandboxed = $("#force-unsandboxed").checked();
    if (forceUnsandboxed === "") {
        forceUnsandboxed = false;
    }

}

const todo = [];

let end = "";
let menus = 0;

function block(name) {
    return {
        kind: "block",
        type: name,
        gap: 8,
    };
}

function button(name, callbackID) {
    return {
        kind: "button",
        text: name,
        callbackKey: callbackID
    };
}

function category(name, color, contents) {
    return {
        kind: "category",
        name,
        colour: color,
        contents
    }
}

const toolbox = {
    kind: "categoryToolbox",
    contents: [
        {
            kind: "search",
            name: "Search",
            contents: [],
        },
        {
            kind: "category",
            name: "block",
            colour: "#FF00FA",
            contents: [
                block("create_block"),
                block("create_input"),
                block("input_menu"),
                block("create_menu"),
                block("create_dynamic_menu"),
                block("create_input_menu"),
                block("menu_item"),
                block("get_input"),
                block("return_block"),
                block("create_hat"),
                block("call_hat"),
                block("call_hat_with_args"),
            ],
        },
        {
            kind: "category",
            name: "Category",
            colour: "#0026ff",
            contents: [
                block("order_category"),
                block("create_label"),
                block("create_button"),
                block("use_block"),
                block("use_hat"),
            ]
        },
        {
            kind: "category",
            name: "utils",
            colour: "#00E5FF",
            contents: [
                block("to_any"),
                block("equals_exactly"),
                block("not_equals_exactly"),
                block("random_bool"),
                block("comment_one"),
                block("comment_multi"),
            ],
        },
        {
            kind: "category",
            name: "Functions+",
            colour: "#FF00E8",
            contents: [
                block("inline_function_a"),
                block("inline_function_b"),
                block("inline_function_c"),
                block("function_value"),
                block("run_function_return"),
                block("run_function_no_return"),
                block("run_function_return_args"),
                block("run_function_no_return_args"),
                block("get_function_args"),
                block("return_block_function"),
            ]
        },
        {
            kind: "category",
            name: "alert",
            colour: "#6400FF",
            contents: [block("alert"), block("alert_confirm"), block("alert_prompt")],
        },
        {
            kind: "category",
            name: "eval",
            colour: "#00FFE4",
            contents: [
                block("eval"),
                block("eval_return"),
                block("raw"),
                block("raw_ret"),
            ],
        },
        {
            kind: "category",
            name: "JSON",
            colour: "#FF0000",
            contents: [
                block("json_from"),
                block("json_from_key_value"),
                block("json_get"),
                block("json_set"),
                block("json_parse"),
                block("json_stringify"),
                block("json_empty"),
                block("json_get_keys"),
            ],
        },
        {
            kind: "category",
            name: "Variables+",
            colour: "#2F00FF",
            contents: [block("vars_set"), block("vars_get")],
        },
        {
            kind: "category",
            name: "Functions",
            colour: "#FF00E8",
            custom: "PROCEDURE",
        },
        {
            kind: "category",
            name: "Variables",
            colour: "#2F00FF",
            custom: "VARIABLE",
        },
    ],
};

function addCategory(name, color, display = name, remove = []) {
    toolbox.contents.push({
        kind: "category",
        name: display,
        colour: color,
        contents: (() => {
            const blocks = [];
            for (const Block in Blockly.libraryBlocks[name].blocks) {
                if ([...remove, ...todo].includes(Block)) {
                    continue;
                }
                blocks.push(block(Block));
            }
            return blocks;
        })(),
    });
}

function addFromPrefix(Prefix, name, color, excludes = []) {
    toolbox.contents.push({
        kind: "category",
        name,
        colour: color,
        contents: (() => {
            const blocks = [];
            for (const Block in Blockly.Blocks) {
                if (Block.startsWith(Prefix)) {
                    if ([...excludes, ...todo].includes(Block)) {
                        continue;
                    }
                    blocks.push(block(Block));
                }
            }
            return blocks;
        })(),
    });
}

addCategory("texts", "#00ff00", "string", [
    "text_create_join_container",
    "text_create_join_item",
]);

const strings = toolbox.contents.at(-1).contents;
strings.push(block("newline"));
strings.unshift(block("text_multiline"));

addCategory("math", "#0000ff", "math", []);

toolbox.contents.at(-1).contents.unshift(block("math_angle"));
toolbox.contents.at(-1).contents.push(block("math_convert_degrees"));

addCategory("lists", "#ff0000", "arrays", [
    "lists_create_with_container",
    "lists_create_with_item",
]);

addFromPrefix("controls_", "controls", "#FFCC00", [
    "controls_ifelse",
    "controls_if_if",
    "controls_if_elseif",
    "controls_if_else",
]);

let if_block;
(() => {
    const last = toolbox.contents.at(-1);
    if_block = last.contents.at(-4);
    last.contents.splice(-4, 1);
})();

addFromPrefix("logic_", "logic", "#002CB9", []);
toolbox.contents.at(-1).contents.push(if_block);

addFromPrefix("colour_", "color", "#FF00E8");

toolbox.contents.push(category("Extensions", "#555", [
    button("Load Extension", "Load_Extension"),
]));

toolbox.contents.push({kind: "sep"});

const Hats = Blockly.Theme.defineTheme('hats', {
    base: Blockly.Themes.Classic,
    startHats: true,
});

const Dark = Blockly.Theme.defineTheme('dark', {
    base: Hats,
    componentStyles: {
        workspaceBackgroundColour: '#1e1e1e',
        toolboxBackgroundColour: 'blackBackground',
        toolboxForegroundColour: '#fff',
        flyoutBackgroundColour: '#252526',
        flyoutForegroundColour: '#ccc',
        flyoutOpacity: 1,
        scrollbarColour: '#797979',
        insertionMarkerColour: '#fff',
        insertionMarkerOpacity: 0.3,
        scrollbarOpacity: 0.4,
        cursorColour: '#d0d0d0',
        blackBackground: '#333',
    },
    startHats: true,
});

const workspace = Blockly.inject("block-editor", {
    plugins: {
        toolbox: ContinuousToolbox,
        flyoutsVerticalToolbox: ContinuousFlyout,
        metricsManager: ContinuousMetrics,
    },
    renderer: "zelos",
    toolbox,
    theme: Hats,
});

$("#darkmode").click(() => {
    const self = $("#darkmode");
    self.toggleClass("dark");
    $(".blocklyTreeSeparator").toggleClass("dark");
    localStorage.setItem("PenguinBuilder", JSON.stringify({
        shown_version: version,
        dark: self.hasClass("dark"),
    }));  
    if(self.hasClass("dark")) {
        workspace.setTheme(Dark);
    } else {
        workspace.setTheme(Hats);
    }
});

workspace.scale = 0.7;

workspace.addChangeListener(Blockly.Events.disableOrphans);

let extensionWindow;

workspace.registerButtonCallback("Load_Extension", () => {
    extensionWindow = window.open("./extensionGallery/index.html" + location.search, "", "popup");
    extensionWindow.resizeTo(690, 420);
    window.onbeforeunload  = function() {
        extensionWindow.close();
    };
});

let extensions = {};

window.addEventListener("message", (e) => {
    const data = e.data.data;
    switch (e.data.type) {
        case "extension":
            if (extensions[data.id]) {
                extensionWindow.close();
                alert("this extension has already been loaded");
                return;
            };
            extensionWindow.close();
            setTimeout(() => {
                try {
                    (new Function(data.code))();
                    extensions[data.id] = data.code;
                } catch (e) { };
            }, 20);
            break;
    }
}, false);

const disableTopBlocksPlugin = new DisableTopBlocks();
disableTopBlocksPlugin.init();

const workspaceSearch = new WorkspaceSearch(workspace);

workspaceSearch.init();

let very_end = "";

/**
    * @returns {[boolean, string]}
    */
    function getFullCode() {
        end = "";
        very_end = "";
        menus = 0;
        getID();
        if (
            Object.keys(Blockly.serialization.workspaces.save(workspace)).length !== 0
        ) {
            workspace.getAllVariables().forEach(v => v.name = Extension_id + "_" + v.name);
            const str = 
                `
            // Made with PenguinBuilder ${version}
            // use PenguinBuilder at "https://chickencuber.github.io/PenguinBuilder/"
            (async function(Scratch) {
                const blocks = [];
                const vars = {};
                const menus = {};

                function wait(m) {
                    return new Promise((r) => setTimeout(() => r(), m));
                }

                ${forceUnsandboxed ? `if (!Scratch.extensions.unsandboxed) {
                    throw new Error('${name} must run unsandboxed');
                }`: ""}

                class Extension {
                    getInfo() {
                        return {
                            "id": "${Extension_id}",
                            "name": "${name}",
                            "color1": "${color1}",
                            "blocks": blocks,
                            "menus": menus,
                        }
                    }
                }
                \n` +
                    getCode() +
                    `\n
                ${end}
                ${very_end}
                Scratch.extensions.register(new Extension());
            })(Scratch);
            `;
            workspace.getAllVariables().forEach(v => v.name = v.name.replace(new RegExp("^" + Extension_id + "_", "g"), ""));
            return [true, str];
        }
        return [false, ""];
    }

$("#Test").click(() => {
    const [exists, str] = getFullCode();
    if(exists) {
        const url = encodeURI("data:application/javascript;base64," + btoa(str));
        //window.open("https://studio.penguinmod.com/editor.html?extension=" + url)
        //!Do to a bug with penguinmod, I have to use turbowarp
        window.open("https://turbowarp.org/editor?extension=" + url); 
    }
});

$("#Export").click(() => {
    const [exists, str] = getFullCode();
    if(exists) {
        download(str, Extension_id + ".js")
    }
});

function getCode() {
    return Blockly.JavaScript.workspaceToCode(workspace);
}

function download(content, filename, contentType = "text/plain") {
    const blob = new Blob([content], { type: contentType });

    const a = document.createElement("a");
    const url = window.URL.createObjectURL(blob);
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
}

function saveProject(saveName) {
    if (
        Object.keys(Blockly.serialization.workspaces.save(workspace)).length === 0
    ) {
        return;
    }
    getID();
    const blocks = encode(JSON.stringify(Blockly.serialization.workspaces.save(workspace)));
    download(
        JSON.stringify({ color1, name, Extension_id, blocks, forceUnsandboxed, extensions, newdata: true }),
        saveName + ".pb"
    );
}

function loadProject(file) {
    const reader = new FileReader();

    reader.onload = function (e) {
        try {
            const content = e.target.result;
            const blocks = JSON.parse(content);
            if(blocks.newdata) {
                const decoded = decode(blocks.blocks);
                blocks.blocks = JSON.parse(decoded);
            }
            $("#ExtensionID").elt.value = blocks.Extension_id === "ExtensionID" ? "" : blocks.Extension_id;
            $("#ExtensionName").elt.value = blocks.name === "ExtensionName" ? "" : blocks.name;
            $("#Color").value(blocks.color1);

            $("#force-unsandboxed").elt.checked = blocks.forceUnsandboxed;

            getID();

            while (toolbox.contents.length > 17) {
                toolbox.contents.pop();
            }

            workspace.updateToolbox(toolbox);
            workspace.refreshToolboxSelection();

            if (blocks.extensions) {
                extensions = blocks.extensions;
                for (const code of Object.values(extensions)) {
                    (new Function(code))();
                }
            } else {
                extensions = {};
            }

            Blockly.serialization.workspaces.load(blocks.blocks, workspace);
        } catch (er) {
            alert(`An unexpected error occured:
                ${er}`);
        }
    };

    reader.readAsText(file);
}

$("#Save").click(() => {
    getID();
    saveProject(Extension_id);
});

$("#Load").click(() => {
    getID();
    $("#fileInput").click();
});

$("#fileInput").on("change", (event) => {
    const fileInput = event.target;
    const selectedFile = fileInput.files[0];

    if (selectedFile) {
        if (checkFileExtension(selectedFile, ".pb")) {
            loadProject(selectedFile);
        } else {
            alert("Please select a .pb file");
            fileInput.value = "";
        }
    }
});

function checkFileExtension(file, allowedExtension) {
    const fileNameParts = file.name.split(".");
    const fileExtension = fileNameParts.at(-1).toLowerCase();
    return fileExtension === allowedExtension.substring(1);
}

if (localStorage.getItem("PenguinBuilder") === null) {
    localStorage.setItem("PenguinBuilder", JSON.stringify({
        shown_version: "0",
        dark: false,
    }))
}

if (JSON.parse(localStorage.getItem("PenguinBuilder")).shown_version !== version) {
    const update = $("#whats-new").create();
    update.$(".update").text(whats_new.trim());
    update.$(".close").click(() => update.remove());
    $.body().child(update);
    update.$(".whats-new-dialog").elt.showModal();
    localStorage.setItem("PenguinBuilder", JSON.stringify({
        shown_version: version,
        dark: JSON.parse(localStorage.getItem("PenguinBuilder")).dark,
    }))
}

if(JSON.parse(localStorage.getItem("PenguinBuilder")).dark) {
    $("#darkmode").click();
}

