Blockly.Blocks['create_hat'] = {
    init: function () {
        this.appendDummyInput()
            .appendField("Create Hat")
            .appendField(new Blockly.FieldTextInput("ID"), "ID")
            .appendField(new Blockly.FieldTextInput("Text"), "Text");
        this.setColour(0);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};

javascript.javascriptGenerator.forBlock['create_hat'] = function (block, generator) {
    const id = block.getFieldValue('ID');
    const text = block.getFieldValue('Text');
    return `blocks.push({
        blockType: Scratch.BlockType.EVENT,
            opcode: "${id}",
            text: "${text}",
            isEdgeActivated: false
    })`;
};

Blockly.Blocks['call_hat'] = {
    init: function () {
        this.appendDummyInput()
            .appendField("Call Hat")
            .appendField(new Blockly.FieldTextInput("ID"), "ID");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(0);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};

javascript.javascriptGenerator.forBlock['call_hat'] = function (block, generator) {
    const id = block.getFieldValue('ID');
    return `Scratch.vm.runtime.startHats('${Extension_id}_${id}');\n`;
};
