const version = "2.5";

let Extension_id = "ExtensionID";
let name = "ExtensionName";
let color1 = "#0088ff";
let forceUnsandboxed = false;

((inputs) => {
  for (const inp of inputs) {
    inp.addEventListener("keydown", function () {
      const self = this;
      setTimeout(function () {
        for(let i = 0; i < 5; i++) {
          self.value = self.value.toLowerCase().replace(/[^a-z0-9]/g, "");
        }
      }, 0.1);
    });
  }
})(document.querySelectorAll("input.no"));

function getID() {
  Extension_id = $("#ExtensionID")[0].value;
  if (Extension_id === "") {
    Extension_id = "ExtensionID";
  }

  name = $("#ExtensionName")[0].value;
  if (name === "") {
    name = "ExtensionName";
  }

  color1 = $("#Color")[0].value;
  if (color1 === "") {
    color1 = "#0088ff";
  }
  
  forceUnsandboxed = $("#force-unsandboxed")[0].checked;
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
        block("create_input_menu"),
        block("menu_item"),
        block("get_input"),
        block("return_block"),
      ],
    },
    {
      kind: "category",
      name: "utils",
      colour: "#00E5FF",
      contents: [
        block("newline"),
        block("to_any"),
        block("equals_exactly"),
        block("not_equals_exactly"),
        block("random_bool"),
        block("comment_one"),
        block("comment_multi"),
        block("inline_function_a"),
        block("inline_function_b"),
        block("inline_function_c"),
      ],
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
    {
      kind: "category",
      name: "Typed Vars",
      colour: "#00DCFF",
      custom: "VARIABLE_DYNAMIC",
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

addCategory("math", "#0000ff", "math", []);

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

addFromPrefix("logic_", "logic", "#002CB9", []);

addCategory("colour", "#FFF800", "color");

const workspace = Blockly.inject("block-editor", {
  plugins: {
    toolbox: ContinuousToolbox,
    flyoutsVerticalToolbox: ContinuousFlyout,
    metricsManager: ContinuousMetrics,
  },
  toolbox,
});

workspace.addChangeListener(Blockly.Events.disableOrphans);

const disableTopBlocksPlugin = new DisableTopBlocks();
disableTopBlocksPlugin.init();

const workspaceSearch = new WorkspaceSearch(workspace);

workspaceSearch.init();

$("#Export").on("click", () => {
  end = "";
  menus = 0;
  getID();
  if (
    Object.keys(Blockly.serialization.workspaces.save(workspace)).length !== 0
  ) {
    download(
      `
// Made with PenguinBuilder ${version}
// use PenguinBuilder at "https://editor.p5js.org/chicken_cuber/full/bzsWsaQHS"
(function(Scratch) {
  const blocks = [];
  const vars = {};
  const menus = {};

  ${forceUnsandboxed? `if (!Scratch.extensions.unsandboxed) {
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
  Scratch.extensions.register(new Extension());
})(Scratch);
`,
      Extension_id + ".js"
    );
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
  const blocks = Blockly.serialization.workspaces.save(workspace);
  download(
    JSON.stringify({ color1, name, Extension_id, blocks, forceUnsandboxed }),
    saveName + ".pb"
  );
}

function loadProject(file) {
  const reader = new FileReader();

  reader.onload = function (e) {
    try {
      const content = e.target.result;
      const blocks = JSON.parse(content);

      $("#ExtensionID")[0].value =
        blocks.Extension_id === "ExtensionID" ? "" : blocks.Extension_id;
      $("#ExtensionName")[0].value =
        blocks.name === "ExtensionName" ? "" : blocks.name;
      $("#Color")[0].value = blocks.color1;
      
      $("#force-unsandboxed")[0].checked = blocks.forceUnsandboxed;

      getID();

      Blockly.serialization.workspaces.load(blocks.blocks, workspace);
    } catch (er) {
      alert(`An unexpected error occured:
${er}`);
    }
  };

  reader.readAsText(file);
}

$("#Save").on("click", () => {
  getID();
  saveProject(Extension_id);
});

$("#Load").on("click", () => {
  getID();
  $("#fileInput")[0].click();
});

$("#fileInput").on("change", () => {
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
