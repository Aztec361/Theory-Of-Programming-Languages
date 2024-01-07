/* This file is for testing helpers.js, require-js.js, lazy.js
 * it may help to revisit your initial pa2 submission           */

function isTrue(condition) {

  return condition;

}

const { List } = require('immutable')

//const test_for_ = (for_) => {
  // TODO: Add tests

  // Return false if this implementation is incorrect
 // return false;
//};


const test_for_ = (for_) => {

  let answer = true;


  let count = 1;

  for_(1, x => x <= 6, x => x + 1, x => { count *= x; });

  answer = answer && isTrue(count === 720);


  let array = [1, 2, 6, 4, 5];

  let sum = 0;

  for_(0, i => i < array.length, i => i + 1, i => { sum += array[i]; });

  answer = answer && isTrue(sum === 18);


  sum = 0;

  for_(0, i => i < 0, i => i + 1, i => { sum += i; });

  answer = answer && isTrue(sum === 0);


  let objects = [{ value: 5 }, { value: 2 }, { value: 3 }];

  let objectSum = 0;

  for_(0, i => i < objects.length, i => i + 1, i => { objectSum += objects[i].value; });

  answer = answer && isTrue(objectSum === 10);


  let decrement = 5;

  for_(5, x => x > 0, x => x - 1, x => { decrement--; });

  answer = answer && isTrue(decrement === 0);


  let unchanged = 0;

  for_(0, x => x < 5, x => x + 1, x => { unchanged = unchanged; });

  answer = answer && isTrue(unchanged === 0);


  let letters = ['x', 'y', 'z', 'w'];

  let concatenated = '';

  for_(0, i => i < letters.length, i => i + 1, i => { concatenated += letters[i]; });

  answer = answer && isTrue(concatenated === 'xyzw');


  let depth = 0;

  const maxDepth = 5;

  for_(1, x => x <= maxDepth, x => x + 1, x => { depth++; });

  answer = answer && isTrue(depth === maxDepth);

  const isRecursive = /for_\(/.test(for_.toString());
  answer = answer && isRecursive;

  return answer;


};



//const test_each = (each) => {
  // TODO: Add tests

  // Return false if this implementation is incorrect
  //return false;
//};

const test_each = (each) => {

  let answer = true;


  let count = 0;

  each(List([]), () => count++);

  answer = answer && isTrue(count === 0);


  count = 0;

  each(List([1, 2, 3]), () => count++);

  answer = answer && isTrue(count === 3);


  let sum = 0;

  each(List([1, 2, 9]), x => sum += x);

  answer = answer && isTrue(sum === 12);


  let indices = [];

  each(List(['a', 'b', 'c']), (x, i) => indices.push(i));

  answer = answer && isTrue(JSON.stringify(indices) === JSON.stringify([0, 1, 2]));


  let modified = [];

  each(List([4, 2, 3]), x => modified.push(x * 2));

  answer = answer && isTrue(JSON.stringify(modified) === JSON.stringify([8, 4, 6]));


  let objects = [{ value: 1 }, { value: 2 }, { value: 5 }];

  let totalValue = 0;

  each(List(objects), obj => totalValue += obj.value);

  answer = answer && isTrue(totalValue === 8);


  let returnValue = each(List([1, 2, 3]), x => x);

  answer = answer && isTrue(returnValue === undefined);


  return answer;

}


// Here we want to test the properties of Question 4.
// Make sure that the cache is properly caching requirements
const test_check_cache = (cache) => {
  // TODO: Add tests

  // Return false if this implementation is incorrect
  return false;
};

// test.json exists in the auto-grader folder. You can load this file in for testing
// with loadJSONFile("test.json")
// it has the following structure:
// {
//   "key": 10,
//   "key2": 20
// }
//const test_loadJSONFile = (loadJSONFile) => {
  // TODO: Add tests

  // Return false if this implementation is incorrect
  //return false;
//};

const test_loadJSONFile = (loadJSONFile) => {
  try {
    // Test case 1: Valid JSON file
    fs.writeFileSync('valid.json', JSON.stringify({ key: "value" }));
    const validJson = loadJSONFile('valid.json');
    if (!(validJson && validJson.key === "value")) {
      console.error('Test case 1 failed');
      return false;
    }

    // Test case 2: Non-existent file (should throw an error)
    try {
      loadJSONFile('non_existent.json');
      console.error('Test case 2 failed');
      return false; // The function should have thrown an error
    } catch (error) {
      // The function correctly threw an error
    }

    // Test case 3: Invalid JSON file (should throw a parsing error)
    fs.writeFileSync('invalid.json', 'This is not a valid JSON content');
    try {
      loadJSONFile('invalid.json');
      console.error('Test case 3 failed');
      return false; // The function should have thrown an error
    } catch (error) {
      // The function correctly threw an error
    } finally {
      // Clean up: Delete the invalid file
      fs.unlinkSync('invalid.json');
    }

    // Test case 4: Empty JSON file
    fs.writeFileSync('empty.json', '{}');
    const emptyJson = loadJSONFile('empty.json');
    if (!(emptyJson && Object.keys(emptyJson).length === 0)) {
      console.error('Test case 4 failed');
      return false;
    }

    // Test case 5: Caching with different files
    fs.writeFileSync('another_valid.json', JSON.stringify({ anotherKey: "anotherValue" }));
    const anotherValidJson = loadJSONFile('another_valid.json');
    if (!(anotherValidJson && anotherValidJson.anotherKey === "anotherValue")) {
      console.error('Test case 5 failed');
      return false;
    }

    // Test case 6: JSON file that contains an array
    fs.writeFileSync('array.json', JSON.stringify([1, 2, 3]));
    const arrayJson = loadJSONFile('array.json');
    if (!(Array.isArray(arrayJson) && arrayJson.length === 3 && arrayJson[0] === 1 && arrayJson[1] === 2 && arrayJson[2] === 3)) {
      console.error('Test case 6 failed');
      return false;
    }

  } catch (error) {
    console.error('Error during testing:', error.message);
    return false;
  } finally {
    // Clean up: Delete temporary files
    ['valid.json', 'non_existent.json', 'empty.json', 'another_valid.json', 'array.json'].forEach(file => {
      if (fs.existsSync(file)) {
        fs.unlinkSync(file);
      }
    });
  }

  // All test cases passed
  console.log('All test cases passed');
  return true;
};



exports.test_for_ = test_for_;
exports.test_each = test_each;
exports.test_check_cache = test_check_cache;
exports.test_loadJSONFile = test_loadJSONFile;
