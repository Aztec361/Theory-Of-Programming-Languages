const { List } = require('immutable')
const assert = require('assert')
const var1 = require('./quick')

/*
  The following problems will give you a chance to practice higher order
  functions. To solve these problems, you can only use map, filter, fold_left
  (see quick.js), partition, or a combination of these. You should not use for-
  or while-loops.  For each problem, a simple assertion is provided to test
  your implementation.  You may wish to add additional tests, though.
*/

let ls = List([1,2,3,4,5]);

/* QUESTION 1: Average of squares */

/*
  First, implement a function that returns the size of a list using fold_left.
*/

const ls_size = ls => /** <FILL-IN> **/ {
  const size = var1.fold_left((acc, _) => acc + 1, 0, ls);
  return size;
}; /** </FILL-IN> **/

assert(ls_size(ls) == 5);

/*
  Second, implement a function that computes the sum-of-squares of a list of
  integers using fold_left.
  Example: sum_sqrs([2,3]) => 2*2 + 3*3 = 13.
*/

const sum_sqrs = ls => /** <FILL-IN> **/ {
  const sumOfSquares = var1.fold_left((acc, x) => acc + x * x, 0, ls);
  return sumOfSquares;
};
 /** </FILL-IN> **/

assert(sum_sqrs(ls) == 55);

/*
  Finally, use both functions to implement the average of squares function.
*/

const avg_sqrs = ls => /** <FILL-IN> **/  {
  const sumSquares = sum_sqrs(ls);
  const size = ls_size(ls);
  const average = size === 0 ? 0 : sumSquares / size;
  return average;
};/** </FILL-IN> **/

assert(avg_sqrs(ls) == 11);


/* QUESTION 2: Min/Max and Evens/Odds */

/*
  Implement min and max functions using fold_left

  An empty list has no minimum or maximum value, therefore, return undefined.
*/

const ls_min = ls => /** <FILL-IN> **/{
  if (ls.size === 0) {
    return undefined; // Empty list has no minimum
  }
  return  var1.fold_left((min, x) => (x < min ? x : min), ls.first(), ls.slice(1));
}; /** </FILL-IN> **/

const ls_max = ls => /** <FILL-IN> **/{
  if (ls.size === 0) {
    return undefined; // Empty list has no maximum
  }
  return var1.fold_left((max, x) => (x > max ? x : max), ls.first(), ls.slice(1));
}; /** </FILL-IN> **/

assert(ls_min(ls) == 1);
assert(ls_max(ls) == 5);

/*
  Implement two functions that return evens and odds from a list of integers
  using filter
*/

const ls_evens = ls => /** <FILL-IN> **/ {
  return var1.filter(x => x % 2 === 0, ls);
};
 /** </FILL-IN> **/
const ls_odds  = ls => /** <FILL-IN> **/ {
  return var1.filter(x => x % 2 !== 0, ls);
}; /** </FILL-IN> **/

assert(ls_evens(ls).equals(List([2,4])));
assert(ls_odds(ls).equals(List([1,3,5])));

/*
  Using function composition, implement a function that returns the maximum
  number in the even subset of a given list and another function that returns
  the minimum number in the evens. Recall the definition of compose below:
*/
function compose(f, g) {
  return (x) => {
    return f(g(x));
  };
}

const max_even = ls => /** <FILL-IN> **/{ return ls_max(ls_evens(ls));} /** </FILL-IN> **/
const min_even = ls => /** <FILL-IN> **/ {return ls_min(ls_evens(ls));}/** </FILL-IN> **/

assert(max_even(ls) == 4);
assert(min_even(ls) == 2);


/* QUESTION 3: The reverse function and Palindromes */

/*
  Implement reverse using recursion
*/

const reverse = (ls) => {
  /** <FILL-IN> **/
  if (ls.size === 0) {
    return List([]);
  }
  return reverse(ls.slice(1)).push(ls.first());
  /** </FILL-IN> **/
};

assert(reverse(ls).equals(List([5,4,3,2,1])));

/*
  Implement reverse using fold_left
*/

const reverse2 = ls => /** <FILL-IN> **/ var1.fold_left((acc, x) => acc.unshift(x), List([]), ls); /** </FILL-IN> **/

assert(reverse2(ls).equals(List([5,4,3,2,1])));

/*
  Using map and your reverse function, write a function that takes
  a list of strings and returns a list of pairs where each pair contains the
  original string and true if it is a palindrome or false if it is not.
  You may want to use the function reverse_str below in your implementation.
*/
const reverse_str = str => reverse(List(str.split(''))).join('');

assert(reverse_str("reverse") == "esrever");

const palindromes = ls => /** <FILL-IN> **/{return var1.map(str => List([str, str === reverse_str(str)]), ls);} /** </FILL-IN> **/

const str_ls = List(["test", "testset"]);
const expected = List([List(["test", false]), List(["testset", true])]);
assert(palindromes(str_ls).equals(expected));

exports.ls_size     = ls_size;
exports.sum_sqrs    = sum_sqrs;
exports.avg_sqrs    = avg_sqrs;
exports.ls_min      = ls_min;
exports.ls_max      = ls_max;
exports.ls_evens    = ls_evens;
exports.ls_odds     = ls_odds;
exports.max_even    = max_even;
exports.min_even    = min_even;
exports.reverse     = reverse;
exports.reverse2    = reverse2;
exports.palindromes = palindromes;
