Blockly.Blocks['colour_hsv_sliders'] = {
    init: function () {
        this.appendDummyInput()
            .appendField('hsv ')
            .appendField(new FieldColourHsvSliders('#ff0000'), 'COLOUR');
        this.setOutput(true, 'Colour');
        this.setStyle("colour_blocks");
    },
};

javascript.javascriptGenerator.forBlock['colour_hsv_sliders'] = function (
    block,
    generator,
) {
    const code = generator.quote_(block.getFieldValue('COLOUR'));
    return [code, Blockly.JavaScript.ORDER_ATOMIC]
};

const JavascriptOrder = javascript.Order;

installAllBlocks({
  javascript: javascript.javascriptGenerator,
}); 

//had to reimplement these without changing anything because of a random bug

javascript.javascriptGenerator.forBlock["colour_rgb"] = function (
  block,
  generator,
) {
  // Compose a colour from RGB components expressed as percentages.
  const red = generator.valueToCode(block, 'RED', JavascriptOrder.NONE) || 0;
  const green =
    generator.valueToCode(block, 'GREEN', JavascriptOrder.NONE) || 0;
  const blue = generator.valueToCode(block, 'BLUE', JavascriptOrder.NONE) || 0;
  const functionName = generator.provideFunction_(
    'colourRgb',
    `
function ${generator.FUNCTION_NAME_PLACEHOLDER_}(r, g, b) {
  r = Math.max(Math.min(Number(r), 100), 0) * 2.55;
  g = Math.max(Math.min(Number(g), 100), 0) * 2.55;
  b = Math.max(Math.min(Number(b), 100), 0) * 2.55;
  r = ('0' + (Math.round(r) || 0).toString(16)).slice(-2);
  g = ('0' + (Math.round(g) || 0).toString(16)).slice(-2);
  b = ('0' + (Math.round(b) || 0).toString(16)).slice(-2);
  return '#' + r + g + b;
}
`,
  );
  const code = `${functionName}(${red}, ${green}, ${blue})`;
  return [code, JavascriptOrder.FUNCTION_CALL];
}


javascript.javascriptGenerator.forBlock["colour_random"] = function (
  block,
  generator,
) {
  // Generate a random colour.
  const functionName = generator.provideFunction_(
    'colourRandom',
    `
function ${generator.FUNCTION_NAME_PLACEHOLDER_}() {
  var num = Math.floor(Math.random() * 0x1000000);
  return '#' + ('00000' + num.toString(16)).substr(-6);
}
`,
  );
  const code = functionName + '()';
  return [code, JavascriptOrder.FUNCTION_CALL];
}

javascript.javascriptGenerator.forBlock["colour_picker"] = function (
  block,
  generator,
) {
  // Colour picker.
  const code = generator.quote_(block.getFieldValue('COLOUR'));
  return [code, JavascriptOrder.ATOMIC];
}

javascript.javascriptGenerator.forBlock["colour_blend"] = function(
  block,
  generator,
) {
  // Blend two colours together.
  const colour1 =
    generator.valueToCode(block, 'COLOUR1', JavascriptOrder.NONE) ||
    "'#000000'";
  const colour2 =
    generator.valueToCode(block, 'COLOUR2', JavascriptOrder.NONE) ||
    "'#000000'";
  const ratio =
    generator.valueToCode(block, 'RATIO', JavascriptOrder.NONE) || 0.5;
  const functionName = generator.provideFunction_(
    'colourBlend',
    `
function ${generator.FUNCTION_NAME_PLACEHOLDER_}(c1, c2, ratio) {
  ratio = Math.max(Math.min(Number(ratio), 1), 0);
  var r1 = parseInt(c1.substring(1, 3), 16);
  var g1 = parseInt(c1.substring(3, 5), 16);
  var b1 = parseInt(c1.substring(5, 7), 16);
  var r2 = parseInt(c2.substring(1, 3), 16);
  var g2 = parseInt(c2.substring(3, 5), 16);
  var b2 = parseInt(c2.substring(5, 7), 16);
  var r = Math.round(r1 * (1 - ratio) + r2 * ratio);
  var g = Math.round(g1 * (1 - ratio) + g2 * ratio);
  var b = Math.round(b1 * (1 - ratio) + b2 * ratio);
  r = ('0' + (r || 0).toString(16)).slice(-2);
  g = ('0' + (g || 0).toString(16)).slice(-2);
  b = ('0' + (b || 0).toString(16)).slice(-2);
  return '#' + r + g + b;
}
`,
  );
  const code = `${functionName}(${colour1}, ${colour2}, ${ratio})`;
  return [code, JavascriptOrder.FUNCTION_CALL];
}


