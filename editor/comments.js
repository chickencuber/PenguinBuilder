Blockly.Blocks['comment_one'] = {
    init: function() {
        this.appendValueInput("NAME")
            .setCheck(null)
            .appendField("//");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(180);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};

javascript.javascriptGenerator.forBlock["comment_one"] = function() {
    return "";
}

Blockly.Blocks['comment_multi'] = {
    init: function() {
        this.appendDummyInput()
            .appendField("/*");
        this.appendStatementInput("NAME")
            .setCheck(null);
        this.appendDummyInput()
            .appendField("*/");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(180);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};

javascript.javascriptGenerator.forBlock["comment_multi"] = function() {
    return "";
}

Blockly.Blocks['value_comment'] = {
    init: function() {
        this.appendValueInput("type")
            .setCheck(null);
        this.appendValueInput("comment")
            .setCheck(null)
            .appendField("//");
        this.setInputsInline(true);
        this.setColour(180);
        this.setOutput(true, null)
        this.setTooltip("");
        this.setHelpUrl("");
    }
};

javascript.javascriptGenerator.forBlock['value_comment'] = function(block, generator) {
    const type = generator.valueToCode(block, 'type', javascript.Order.ATOMIC);
    return [type, Blockly.javascript.ORDER_ATOMIC];
};

Blockly.Blocks['bool_comment'] = {
    init: function() {
        this.appendValueInput("type")
            .setCheck("Boolean");
        this.appendValueInput("comment")
            .setCheck(null)
            .appendField("//");
        this.setInputsInline(true);
        this.setColour(180);
        this.setOutput(true, "Boolean")
        this.setTooltip("");
        this.setHelpUrl("");
    }
};


javascript.javascriptGenerator.forBlock['bool_comment'] = function(block, generator) {
    const type = generator.valueToCode(block, 'type', javascript.Order.ATOMIC);
    return [type, Blockly.javascript.ORDER_ATOMIC];
};

