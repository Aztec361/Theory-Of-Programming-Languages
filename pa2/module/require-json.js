const path     = require('path');
const fs       = require('fs');
const require_ = require('./require.js');

/* In this module we are going to extend require()'s support to load '.json'
 * files. Specifically we are going to define a function loadJSONFile() that
 * reads and parses .json files. Then, we are going to redefine the default
 * loader (require_.loader) to call our loadJSONFile().
 *
 * There are better ways to add support for file types, but we're largely
 * doing it in this fashion to get a handle on how to work with
 * high-order functions.
 */


/* QUESTION 5 (5pts):
 *
 * Implement a function that loads the serialized JSON object contained in the
 * file at absolute path `resolvedName`. The function should return the parsed
 * JSON object and update the require_._cache.
 *
 * You will want to use JSON.parse to actually parse the file contents. If you
 * have not done this before, take a look at:
 *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse
 *
 * You can think of JSON objects as a format for representing (a subset of)
 * literal JavaScript objects as we have seen in class. JSON.parse simply
 * turns a string into one such object.
 * 
 * This function should be a caching function. That is, if the file has
 * already been loaded, it should return the cached version. Otherwise, it
 * should load the file, parse it, and cache it.
 */
function loadJSONFile(resolvedName) {
  /** <FILL-IN> **/
  /** </FILL-IN> **/
   // Check if the file is already in the cache
   if (require_._cache.hasOwnProperty(resolvedName)) {
    return require_._cache[resolvedName];
  }

  // Read the JSON file synchronously
  try {
    const fileContents = fs.readFileSync(resolvedName, 'utf8');

    // Parse the JSON content into an object
    const jsonObject = JSON.parse(fileContents);

    // Cache the parsed JSON object
    require_._cache[resolvedName] = jsonObject;

    // Return the parsed JSON object
    return jsonObject;
  } catch (error) {
    // Handle errors such as file not found or JSON parsing errors
    throw new Error(`Error loading JSON file "${resolvedName}": ${error.message}`);
  }
}
exports.loadJSONFile = loadJSONFile;

/* QUESTION 6 (15pts):
 *
 * Now that we have a function that knows how to handle '.json' files, let's
 * put it to work by registering a new loader.
 *
 * Specifically, let's redefine require_.loader to handle '.json' files. Note
 * that the default require_.loader handles '.js' files. We want to allow for
 * handling such files, but additionally want to add support for '.json' files.
 * In other words, an incorrect solution is one that only handles '.json'
 * files, as such:
 *
 *    require_.loader = (resolvedName, nextLoader) => {
 *      if (path.extname(resolvedName) === '.json') {
 *        return loadJSONFile(resolvedName);
 *      } else {
 *        return nextLoader(resolvedName);
 *      }
 *    };
 *
 * A correct solution should essentially have loaders executing in this order:
 *
 *   if is .json file
 *    then loadJSONFile
 *    else
 *      if .js file
 *        then loadJSFile
 *        else fail
 *
 * For this question you may NOT create additional variables in this module. If
 * you need to keep track of any state (hint: the original loader) you can rely
 * on the fact that JavaScript functions are first-class closures.
 */
/**require_.loader = /** <FILL-IN> **/  /** </FILL-IN> **/ // (resolvedName, nextLoader) =>{
 /*** const ext = path.extname(resolvedName);
  if (ext === '.json') {
    // Handle '.json' files
    return loadJSONFile(resolvedName);
  } else {
    // If it's not a '.json' file, pass it to the next loader
    return nextLoader(resolvedName);
  }

};**/

require_.loader = ((originalLoader) => {
  return (resolvedName, nextLoader) => {
    if (path.extname(resolvedName) === '.json') {
      return loadJSONFile(resolvedName);
    } else {
      // Call the original loader for '.js' files
      return originalLoader(resolvedName, nextLoader);
    }
  };
})(require_.loader);

