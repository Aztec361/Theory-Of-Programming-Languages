/* This file is for testing lazy.js
 * it may help to revisit your initial pa3 submission */

const esprima = require('esprima');

function isTrue(condition) {

    return condition;

}

const isFunctionalStyle = (func) => {
    const funcStr = func.toString();
    const ast = esprima.parseScript(funcStr);

    let isFunctional = true;

    // Recursive function to traverse the AST
    const traverse = (node) => {
        switch (node.type) {
            case 'ForStatement':
            case 'WhileStatement':
            case 'DoWhileStatement':
            case 'ForInStatement':
            case 'ForOfStatement':
                isFunctional = false;
                break;
            case 'VariableDeclaration':
                if (node.kind === 'var') {
                    isFunctional = false;
                }
                break;
            default:
                if (node.children) {
                    node.children.forEach(traverse);
                }
                break;
        }
    };

    traverse(ast);

    return isFunctional;
};


const test_delay = (delay) => {
  let answer = true;

  try {
      let computationCount = 0;
      const compute = () => {
          computationCount++;
          return 99;  
      };
      const delayedCompute = delay(compute);

      let result1 = delayedCompute();
      answer = answer && isTrue(computationCount === 1 && result1 === 99);

      let result2 = delayedCompute();
      answer = answer && isTrue(computationCount === 1 && result2 === 99);

      let stringValue = "Greetings, Universe!";  
      const returnString = () => stringValue;
      const delayedString = delay(returnString);

      let stringResult1 = delayedString();
      answer = answer && isTrue(stringResult1 === stringValue);

      const returnNothing = () => { };
      const delayedNothing = delay(returnNothing);

      let nothingResult = delayedNothing();
      answer = answer && isTrue(nothingResult === undefined);

  } catch (e) {
      console.error("test_delay function crashed: ", e);
      answer = false;
  }

  return answer && isFunctionalStyle(delay);
};


const test_enumFrom = (enumFrom) => {
  let answer = true;

  try {
      let enum1 = enumFrom(10); // Change starting value from 1 to 10
      for (let i = 10; i <= 13; i++) { // Change loop range
          let currentElement = enum1();
          answer = answer && isTrue(currentElement.head === i);
          enum1 = currentElement.tail;
      }

      let enum20 = enumFrom(5); // Change starting value from 1 to 5
      let current = enum20();
      for (let i = 5; i <= 14; i++) { // Change loop range
          answer = answer && isTrue(current.head === i);
          current = current.tail();
      }
  } catch (e) {
      console.error("test_enumFrom function crashed: ", e);
      answer = false;
  }
  
  const isRecursive = /enumFrom\(/.test(enumFrom.toString());
  answer = answer && isRecursive;

  return answer;
};



const test_map = (map) => {
  let answer = true;
  try {

      const mockEnumFrom = (n) => delay(() => ({ head: n, tail: mockEnumFrom(n + 1) }));

      const doubled = map(x => x * 2, mockEnumFrom(1));
      let firstElement = force(doubled);
      answer = answer && isTrue(firstElement.head === 2); // 1 * 2

      let secondElement = force(firstElement.tail);
      answer = answer && isTrue(secondElement.head === 4); // 2 * 2

      const addThree = map(x => x + 3, mockEnumFrom(1));
      firstElement = force(addThree);
      answer = answer && isTrue(firstElement.head === 4); // 1 + 3


      const mapped = map(x => x * 2, mockEnumFrom(1));

      let current = force(mapped);
      for (let i = 1; i <= 5; i++) {
          answer = answer && isTrue(current.head === i * 2);
          current = force(current.tail);
      }
  } catch (e) {
      console.error("test_map function crashed: ", e);
      answer = false;
  }
  const isRecursive = /map\(/.test(map.toString());
  answer = answer && isRecursive;

  return answer;
};


const test_zipWith = (zipWith) => {
  let answer = true;

  const infiniteList = (n) => delay(() => ({ head: n, tail: infiniteList(n + 2) })); // Change increment value

  try {
    const sum = (x, y) => x + y;
    const zippedSum = zipWith(sum, infiniteList(2), infiniteList(2)); // Change starting values from 1 to 2

    let current = force(zippedSum);
    for (let i = 2; i <= 6; i += 2) { // Adjust loop range and increment value
      answer = answer && isTrue(current.head === i + i);
      current = force(current.tail);
    }

    const multiply = (x, y) => x * y;
    const zippedMultiply = zipWith(multiply, infiniteList(2), infiniteList(3)); // Change starting values

    current = force(zippedMultiply);
    for (let i = 2; i <= 6; i += 2) { // Adjust loop range and increment value
      answer = answer && isTrue(current.head === i * (i + 1));
      current = force(current.tail);
    }
  } catch (e) {
    console.error("zipWith function crashed: ", e);
    answer = false;
  }

  const isRecursive = /zipWith\(/.test(zipWith.toString());
  answer = answer && isRecursive;

  return answer;
};




const test_tail = (tail) => {
  let answer = true;

  const mockEnumFrom = (n) => delay(() => ({ head: n, tail: mockEnumFrom(n + 1) }));

  try {
      // Test basic functionality of tail
      const tailOfEnum = tail(mockEnumFrom(1));
      let current = force(tailOfEnum);
      for (let i = 2; i <= 5; i++) {
          answer = answer && isTrue(current.head === i);
          current = force(current.tail);
      }

      // Test nested tail functionality
      const secondTail = tail(tailOfEnum);
      const thirdTail = tail(secondTail);

      let secondTailFirstElement = force(secondTail).head;
      let thirdTailFirstElement = force(thirdTail).head;
      answer = answer && isTrue(secondTailFirstElement === 3 && thirdTailFirstElement === 4);

  } catch (e) {
      console.error("tail function crashed: ", e);
      answer = false;
  }

  // Check for recursive implementation
  const isRecursive = /tail\(/.test(tail.toString());
  answer = answer && isRecursive;

  return answer;
};


function delay(f) {
  let computed = false;
  let cached;
  return function () {
      if (!computed) {
          cached = f();
          computed = true;
      }
      return cached;
  };
}

function force(t) {
  return t();
}

function cons(head, thunk_tail) {

  return delay(function () {

      return {

          head: head,

          tail: cons(force(thunk_tail).head, force(thunk_tail).tail)

      };



  });

}

//const test_cons = (cons) => {
  // TODO: Add tests

  // Return false if this implementation is incorrect
  //return false;
//};

const test_cons = (cons) => {
  let answer = true;

  try {
    // Create a simple list using cons
    const list = cons(1, () => cons(2, () => cons(3, () => null)));

    // Test the first element
    const firstElement = list();
    console.log("First Element:", firstElement); // Add this line
    debugger; // Set breakpoint here
    answer = answer && (firstElement.head === 1);

    // Test the second element
    const secondElement = firstElement.tail();
    console.log("Second Element:", secondElement); // Add this line
    debugger; // Set breakpoint here
    answer = answer && (secondElement.head === 2);

    // Test the third element
    const thirdElement = secondElement.tail();
    console.log("Third Element:", thirdElement); // Add this line
    debugger; // Set breakpoint here
    answer = answer && (thirdElement.head === 3);

    // Test nested cons
    const nestedList = cons(1, () => cons(cons(2, () => cons(3, () => null))));
    const nestedElement = nestedList().tail().head();
    console.log("Nested Element:", nestedElement); // Add this line
    debugger; // Set breakpoint here
    answer = answer && (nestedElement.head === 2);

  } catch (e) {
    console.error("test_cons function crashed: ", e);
    debugger; // Set breakpoint here
    answer = false;
  }

  // Check for recursive implementation
  const isRecursive = /cons\(/.test(cons.toString());
  console.log("Is Recursive:", isRecursive); // Add this line
  debugger; // Set breakpoint here
  answer = answer && isRecursive;

  return answer;
};

const consResult = test_cons(cons);
console.log(consResult)



exports.test_delay = test_delay;
exports.test_enumFrom = test_enumFrom;
exports.test_map = test_map;
exports.test_zipWith = test_zipWith;
exports.test_tail = test_tail;
exports.test_cons = test_cons;
