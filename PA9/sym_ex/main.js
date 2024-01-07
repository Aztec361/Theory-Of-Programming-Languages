/*
 * For this assignment we will be using the tree-sitter library
 * to parse JavaScript code into an AST. You can find the documentation
 * for tree-sitter here: https://tree-sitter.github.io/tree-sitter/
 */

const Parser = require("tree-sitter");
const JavaScript = require("tree-sitter-javascript");

// First we create a parser which we will use to parse our code
const parser = new Parser();
parser.setLanguage(JavaScript);

const toy_example_1 = () => {
  /*
   * Let's try out a toy example.
   * Given some Javascript code, let's see what the AST looks like.
   * (After using it, you can comment this code out.)
   */

  const exampleSourceCode = "let x = 1; console.log(x);";

  // The `tree` represents all the power of the AST
  const tree = parser.parse(exampleSourceCode);

  // We can print it out to see the (s-expression) representation
  console.log(tree.rootNode.toString());
};
toy_example_1();

const toy_example_2 = () => {
  // Here's an example of a function that could be passed in
  const exampleSourceCode = `
    function name(arg1, arg2) {
        let x = 0;
        if (arg1 > 0) {
            assert(false);
        }
    }`;

  const tree = parser.parse(exampleSourceCode);
  // The function has a `name`, a `parameters`, and a `body` node
  // console.log(tree.rootNode.toString());

  // Beyond inspecting the tree, we can interact with it using queries.
  // For example, let's find the `condition` expression in the code above.

  const query_str = `(if_statement 
        condition: (parenthesized_expression) @condition
        consequence: (_)
    )`;
  const query = new Parser.Query(JavaScript, query_str);
  query.matches(tree.rootNode).forEach((match) => {
    // We can print out the node that matches the query
    console.log(match.captures[0].node.toString());
    // (parenthesized_expression
    //      (binary_expression left: (identifier) right: (number)))
    // As expected, we find a binary expression between an identifier and a number
    // (the `arg1 > 0` expression)
  });
};
toy_example_2();

/*
 * Return a list of all the parameters used in the function
 * defintion.
 */
//const find_parameter_names = (func_ast) => {
  // TODO: Implement this
 // return [];
//};

const find_parameter_names = (func_ast) => {
  if (!func_ast) {
      throw new Error("AST is undefined in find_parameter_names");
  }

  const queryStr = `(function_declaration parameters: (formal_parameters (identifier) @param)*)`;
  const query = new Parser.Query(JavaScript, queryStr);

  // Ensure the query is executed against the root node of the AST
  const matches = query.matches(func_ast.rootNode);

  let parameterNames = [];
  for (const match of matches) {
      for (const capture of match.captures) {
          parameterNames.push(capture.node.text);
      }
  }

  return parameterNames;
};


/*
 * Find all conditional expressions in the function which
 * depend on the given variable name
 */
//const find_conditional_expressions = (func_ast, variable_name) => {
  // TODO: Implement this
  //return [];
//};

const find_conditional_expressions = (func_ast, variable_name) => {
  const conditional_expressions = [];
  const conditions = func_ast.rootNode.descendantsOfType("if_statement");

  // Iterate through each 'if_statement' node
  for (let i = 0; i < conditions.length; i++) {
      const condition = conditions[i];
      const conditionVariables = condition.descendantsOfType("identifier");

      // Iterate through each 'identifier' node within the 'if_statement'
      for (let j = 0; j < conditionVariables.length; j++) {
          const variable = conditionVariables[j];

          if (variable.text === variable_name) {
              // Add the condition node to the list if the variable name matches
              conditional_expressions.push(condition);
              break; // Break if a match is found to avoid duplicate entries
          }
      }
  }

  return conditional_expressions;
};


/*
 * Create a map from variable name to possible options
 * based on a conditional expression
 * NEW: required boundaries:
 *  comparison with a string (arg == "hello") (8points)
 *  comparison with a number (arg > 10) (8points)
 *  comparison with a binary operation (arg > 10 + 5) (4points)
 *  comparison with another argument (arg1 > arg2) (4points)
 *  beta-substitution (arg > x) [x := 10] (4points)
 *  complex analysis (4points)
 */
//const get_decisions = (func_ast, variable_name, conditional) => {
  // TODO: Implement this
  //return {};
//};

const get_decisions = (func_ast, variable_name, conditionalNodes) => {
  const decisions = [];
  let variableAssignments = {};

  // Function to evaluate and track variable assignments
  const evaluateAssignment = (node) => {
      let variable, value;
      if (node.type === 'variable_declarator' && node.namedChildCount >= 2) {
          variable = node.child(0).text;
          value = node.child(1).text;
      } else if (node.type === 'assignment_expression' && node.namedChildCount >= 2) {
          variable = node.child(0).text;
          value = node.child(1).text;
      }

      if (variable && value) {
          try {
              variableAssignments[variable] = eval(value);
          } catch (e) {
              variableAssignments[variable] = value;
          }
      }
  };

  // Walk through the AST to find variable assignments
  const walkASTForAssignments = (node) => {
      evaluateAssignment(node);
      for (let i = 0; i < node.childCount; i++) {
          walkASTForAssignments(node.child(i));
      }
  };

  walkASTForAssignments(func_ast.rootNode);


  // Define the regular expression for binary operations
  const binaryExpRegex = /\d+\s*[+\-*/%]\s*\d+/;

  // Process each conditional node
  for (let i = 0; i < conditionalNodes.length; i++) {
      let node = conditionalNodes[i];
      let conditionalString = node.toString();

      // Process conditionals and handle beta-substitution
      Object.keys(variableAssignments).forEach(varName => {
          const regex = new RegExp(`\\b${varName}\\b`, 'g');
          if (regex.test(conditionalString)) {
              conditionalString = conditionalString.replace(regex, variableAssignments[varName].toString());
          }
      });

      let decision = {};
      let boundary;

      // Handle comparison with a number
      if (conditionalString.match(new RegExp(`\\b${variable_name}\\b\\s*[<>=!]=?\\s*\\d+`))) {
          boundary = conditionalString.match(/\d+/)[0];
          decision = { variable: variable_name, type: 'number', boundary: parseInt(boundary) };
      }
      // Handle comparison with a string
      else if (conditionalString.match(new RegExp(`\\b${variable_name}\\b\\s*[<>=!]=?\\s*".*"`))) {
          boundary = conditionalString.match(/"([^"]+)"/)[1];
          decision = { variable: variable_name, type: 'string', boundary };
      }
      // Handle comparison with another argument (simplified)
      else if (conditionalString.match(new RegExp(`\\b${variable_name}\\b\\s*[<>=!]=?\\s*[a-zA-Z_][a-zA-Z0-9_]*`))) {
          boundary = conditionalString.match(/[a-zA-Z_][a-zA-Z0-9_]*/)[0];
          if (boundary !== variable_name) {
              decision = { variable: variable_name, type: 'arg_comparison', boundary };
          }
      }
      // Handle comparison with a binary operation
      else if (conditionalString.match(new RegExp(`\\b${variable_name}\\b\\s*[<>=!]=?\\s*` + binaryExpRegex.source))) {
          // Extract and evaluate the binary expression
          const binaryExp = conditionalString.match(binaryExpRegex)[0];
          try {
              boundary = eval(binaryExp);
              decision = { variable: variable_name, type: 'binary_operation', boundary };
          } catch (e) {
              console.error("Error evaluating binary expression:", e);
          }
      }

      // Add decision if it is valid
      if (decision && decision.variable) {
          decisions.push(decision);
      }
  }

  return decisions;
};


const test_evaluation = (func_ast, parameter_values) => {
  let passed;
  try {
    eval(
      `(${func_ast.rootNode.text})(${Object.values(parameter_values).join(
        ", "
      )})`
    );
    passed = true;
  } catch (e) {
    passed = false;
  }

  return passed;
};

/* const detect_boundary = (func_ast) => {
  // Start by finding parameters
  const parameter_names = find_parameter_names(func_ast);

  for (const parameter_name of parameter_names) {
    // Find conditional expressions that depend on the parameter
    const conditional_expressions = find_conditional_expressions(
      func_ast,
      parameter_name
    );

    // For each conditional expression, create a map from variable name to possible options
    const decisions = get_decisions(
      func_ast,
      parameter_name,
      conditional_expressions
    );

    // TODO: collate the decisions into a datastructure
  }

  // TODO: create a parameter selection generator

  let results = {
    pass: undefined,
    fail: undefined,
  };

  while (results["pass"] === undefined || results["fail"] === undefined) {
    // Use the helper function to test different evaluation patterns
    // make a parameter set choice
    let param_choice = {};
    let passed = test_evaluation(func_ast, param_choice);
    if (passed && !results["pass"]) {
      results["pass"] = param_choice;
    } else if (!passed && !results["fail"]) {
      results["fail"] = param_choice;
    }
  }

  /*
   * Return two maps from parameter name to values
   * "pass" contains parameter values that will not raise an exception
   * "fail" contains parameter values that will raise an exception
   */
  //return results;
//}; */




const detect_boundary = (func_ast) => {
  try {
      const parameter_names = find_parameter_names(func_ast);
      console.log("Parameter Names:", parameter_names);

      let results = { pass: {}, fail: {} };

      for (let i = 0; i < parameter_names.length; i++) {
          const parameter_name = parameter_names[i];
          console.log("Processing parameter:", parameter_name);

          const conditional_expressions = find_conditional_expressions(
              func_ast,
              parameter_name
          );
          console.log(`Conditional Expressions for ${parameter_name}:`, conditional_expressions);

          const decisions = get_decisions(
              func_ast,
              parameter_name,
              conditional_expressions
          );

          for (let j = 0; j < decisions.length; j++) {
              const decision = decisions[j];
              console.log(`Processing decision for ${parameter_name}:`, decision);

              switch (decision.type) {
                  case 'number':
                      results.pass[decision.variable] = decision.boundary + 1;
                      results.fail[decision.variable] = decision.boundary - 1;
                      break;
                  case 'string':
                      results.pass[decision.variable] = decision.boundary;
                      results.fail[decision.variable] = decision.boundary + '_failcase';
                      break;
                  case 'arg_comparison':
                      results.pass[decision.variable] = 0;
                      results.fail[decision.variable] = 1;
                      break;
                  case 'binary_operation':
                      results.pass[decision.variable] = decision.boundary + 1;
                      results.fail[decision.variable] = decision.boundary - 1;
                      break;
                  // Additional cases for other types...
              }
          }
      }

      if (test_evaluation(func_ast, results.pass)) {
          results.pass = results.pass;
      } else {
          results.pass = undefined;
      }
      if (!test_evaluation(func_ast, results.fail)) {
          results.fail = results.fail;
      } else {
          results.fail = undefined;
      }

      console.log("Results:", results);
      return results;
  } catch (error) {
      console.error("Error in detect_boundary:", error);
      throw error;
  }
};




const sampleFunctionCode = `
function sampleFunction(a, b) {
  if (a > 10) {
      return b;
  } else if (b === "test") {
      return a;
  } else if (a <= 5 && b !== "hello") {
      throw new Error("Invalid input");
  }
  return a + b;
}`;


// Parse the sample function to create an AST
const tree = parser.parse(sampleFunctionCode);

// Detect boundaries using the detect_boundary function
const boundaries = detect_boundary(tree);

console.log("Boundary conditions:", boundaries);

// NEW: fix export
exports.detect_boundary = detect_boundary;
