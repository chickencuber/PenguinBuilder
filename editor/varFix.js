//stole the code from the github with a few modifications
//the github is: https://github.com/google/blockly

function procedures_def(block, generator) {
  const funcName = generator.getProcedureName(block.getFieldValue("NAME"));
  let xfix1 = "";
  if (generator.STATEMENT_PREFIX) {
    xfix1 += generator.injectId(generator.STATEMENT_PREFIX, block);
  }
  if (generator.STATEMENT_SUFFIX) {
    xfix1 += generator.injectId(generator.STATEMENT_SUFFIX, block);
  }
  if (xfix1) {
    xfix1 = generator.prefixLines(xfix1, generator.INDENT);
  }
  let loopTrap = "";
  if (generator.INFINITE_LOOP_TRAP) {
    loopTrap = generator.prefixLines(
      generator.injectId(generator.INFINITE_LOOP_TRAP, block),
      generator.INDENT
    );
  }
  const branch = generator.statementToCode(block, "STACK");
  let returnValue = generator.valueToCode(block, "RETURN", javascript.Order.NONE) || "";
  let xfix2 = "";
  if (branch && returnValue) {
    // After executing the function body, revisit this block for the return.
    xfix2 = xfix1;
  }
  if (returnValue) {
    returnValue = generator.INDENT + "return " + returnValue + ";\n";
  }
  const args = [];
  const variables = block.getVars();
  for (let i = 0; i < variables.length; i++) {
    args[i] = generator.getVariableName(variables[i]);
  }
  let code =
    "function " +
    funcName +
    "(" +
    args.join(", ") +
    ") {\nconst localVars = {};\n" +
    xfix1 +
    loopTrap +
    branch +
    xfix2 +
    returnValue +
    "}";
  code = generator.scrub_(block, code);
  generator.definitions_["%" + funcName] = code;
  return code;
}

//adds the new generation to the procedure block

javascript.javascriptGenerator.forBlock.procedures_defreturn = procedures_def;
//according to the github, uses the same generator function
javascript.javascriptGenerator.forBlock.procedures_defnoreturn = procedures_def;
