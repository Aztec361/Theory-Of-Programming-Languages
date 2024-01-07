const { List } = require('immutable');

const test_fold_left = (fold_left) => {
    try {
        // TODO: Add tests for fold_left

        // Return false if this implementation is incorrect
        const add = (a, b) => a + b;
        const multiply = (a, b) => a * b;

        // Test with an empty list
        if (!(fold_left(add, 0, List([])) === 0)) {
            return false;
        }

        // Test with a list of numbers
        if (!(fold_left(add, 0, List([1, 2, 3, 4])) === 10)) {
            return false;
        }

        // Test with a different folding function
        if (!(fold_left(multiply, 1, List([1, 2, 3, 4])) === 24)) {
            return false;
        }

        // Test with a list of strings
        const concatenate = (a, b) => a + b;
        if (!(fold_left(concatenate, '', List(['a', 'b', 'c'])) === 'abc')) {
            return false;
        }

        // Test with a list of booleans
        const and = (a, b) => a && b;
        if (!(fold_left(and, true, List([true, true, false])) === false)) {
            return false;
        }

        // Test with a list of negative numbers
        const subtract = (a, b) => a - b;
        if (!(fold_left(subtract, 0, List([-1, -2, -3, -4])) === 10)) {
            return false;
        }

        // Test with a list of floating point numbers
        if (!(fold_left(add, 0, List([1.1, 2.2, 3.3, 4.4])) === 11)) {
            return false;
        }

        // Test with recursion
        const recursiveFoldLeft = (list, func, acc) => {
            if (list.size === 0) {
                return acc;
            }
            const head = list.first();
            const tail = list.rest();
            return recursiveFoldLeft(tail, func, func(acc, head));
        };

        if (!(fold_left(add, 0, List([1, 2, 3, 4]), recursiveFoldLeft) === 10)) {
            return false;
        }

        return true; // All tests passed
    } catch (error) {
        console.error('Error in test_fold_left:', error);
        return false;
    }
};

const test_map = (map) => {
    try {
        // TODO: Add tests for map

        // Return false if this implementation is incorrect
        // Test with an empty list
        if (!map((x) => x * 2, List([])).equals(List([]))) {
            return false;
        }

        // Test with a list of numbers
        if (!map((x) => x * 2, List([1, 2, 3, 4])).equals(List([2, 4, 6, 8]))) {
            return false;
        }

        // Test with a different mapping function
        if (!map((x) => x + 1, List([1, 2, 3])).equals(List([2, 3, 4]))) {
            return false;
        }

        // Test with a list of strings
        if (!map((x) => x.toUpperCase(), List(['a', 'b', 'c'])).equals(List(['A', 'B', 'C']))) {
            return false;
        }

        // Test with a list of booleans
        if (!map((x) => !x, List([true, false, true])).equals(List([false, true, false]))) {
            return false;
        }

        // Test with a list of negative numbers
        if (!map((x) => x * 2, List([-1, -2, -3, -4])).equals(List([-2, -4, -6, -8]))) {
            return false;
        }

        // Test with a list of floating point numbers
        if (!map((x) => x + 1, List([1.1, 2.2, 3.3])).equals(List([2.1, 3.2, 4.3]))) {
            return false;
        }

        return true; // All tests passed
    } catch (error) {
        console.error('Error in test_map:', error);
        return false;
    }
};

const test_filter = (filter) => {
    try {
        // TODO: Add tests for filter

        // Return false if this implementation is incorrect
        // Test with an empty list
        if (!filter((x) => x > 0, List([])).equals(List([]))) {
            return false;
        }

        // Test with a list of numbers
        if (!filter((x) => x % 2 === 0, List([1, 2, 3, 4])).equals(List([2, 4]))) {
            return false;
        }

        // Test with a different predicate function
        if (!filter((x) => x < 3, List([1, 2, 3, 4])).equals(List([1, 2]))) {
            return false;
        }

        // Test with a list of strings
        if (!filter((x) => x.length > 1, List(['a', 'bb', 'ccc'])).equals(List(['bb', 'ccc']))) {
            return false;
        }

        // Test with a list of booleans
        if (!filter((x) => x, List([true, false, true])).equals(List([true, true]))) {
            return false;
        }

        // Test with a list of negative numbers
        if (!filter((x) => x < 0, List([-1, -2, 3, 4])).equals(List([-1, -2]))) {
            return false;
        }

        // Test with a list of floating point numbers
        if (!filter((x) => x > 1, List([1.1, 0.9, 2.2, 0.8])).equals(List([1.1, 2.2]))) {
            return false;
        }

        return true; // All tests passed
    } catch (error) {
        console.error('Error in test_filter:', error);
        return false;
    }
};

const test_partition = (partition) => {
    try {
        // TODO: Add tests for partition

        // Return false if this implementation is incorrect
        // Test with an empty list
        if (!partition((x) => x > 0, List([])).equals(List([List([]), List([])]))) {
            return false;
        }

        // Test with a list of numbers
        if (!partition((x) => x % 2 === 0, List([1, 2, 3, 4])).equals(List([List([2, 4]), List([1, 3])]))) {
            return false;
        }

        // Test with a different predicate function
        if (!partition((x) => x < 3, List([1, 2, 3, 4])).equals(List([List([1, 2]), List([3, 4])]))) {
            return false;
        }

        // Test with a list of strings
        if (!partition((x) => x.length > 1, List(['a', 'bb', 'ccc'])).equals(List([List(['bb', 'ccc']), List(['a'])]))) {
            return false;
        }

        // Test with a list of booleans
        if (!partition((x) => x, List([true, false, true])).equals(List([List([true, true]), List([false])]))) {
            return false;
        }

        // Test with a list of negative numbers
        if (!partition((x) => x < 0, List([-1, -2, 3, 4])).equals(List([List([-1, -2]), List([3, 4])]))) {
            return false;
        }

        // Test with a list of floating point numbers
        if (!partition((x) => x > 1, List([1.1, 0.9, 2.2, 0.8])).equals(List([List([1.1, 2.2]), List([0.9, 0.8])]))) {
            return false;
        }

        return true; // All tests passed
    } catch (error) {
        console.error('Error in test_partition:', error);
        return false;
    }
};

const test_quicksort = (quicksort) => {
    try {
        // TODO: Add tests for quicksort

        // Return false if this implementation is incorrect
        // Test with an empty list
        if (!quicksort(List([])).equals(List([]))) {
            return false;
        }

        // Test with a list of numbers
        if (!quicksort(List([4, 2, 1, 3])).equals(List([1, 2, 3, 4]))) {
            return false;
        }

        // Test with a list of repeated numbers
        if (!quicksort(List([4, 2, 1, 3, 2, 1])).equals(List([1, 1, 2, 2, 3, 4]))) {
            return false;
        }

        // Test with a list of strings
        if (!quicksort(List(['banana', 'apple', 'orange'])).equals(List(['apple', 'banana', 'orange']))) {
            return false;
        }

        // Test with a list of booleans
        if (!quicksort(List([true, false, true])).equals(List([false, true, true]))) {
            return false;
        }

        // Test with a list of negative numbers
        if (!quicksort(List([-1, -2, -3, -4])).equals(List([-4, -3, -2, -1]))) {
            return false;
        }

        // Test with a list of floating point numbers
        if (!quicksort(List([1.1, 2.2, 3.3, 4.4])).equals(List([1.1, 2.2, 3.3, 4.4]))) {
            return false;
        }

        // Test with a list of mixed numbers (positive, negative, floating point)
        if (!quicksort(List([1.1, -2, 3.3, -4])).equals(List([-4, -2, 1.1, 3.3]))) {
            return false;
        }

        // Test with a list of strings with different cases
        if (!quicksort(List(['Banana', 'apple', 'Orange'])).equals(List(['Banana', 'Orange', 'apple']))) {
            return false;
        }

        // Test with recursion
        const recursiveQuicksort = (list) => {
            if (list.size <= 1) {
                return list;
            }
            const pivot = list.first();
            const smaller = recursiveQuicksort(list.rest().filter((x) => x <= pivot));
            const greater = recursiveQuicksort(list.rest().filter((x) => x > pivot));
            return smaller.concat(List([pivot])).concat(greater);
        };

        // Additional Test: Test with a large list of numbers
        const largeList = List([...Array(1000).keys()]);
        const sortedLargeList = List([...Array(1000).keys()]);
        if (!quicksort(largeList).equals(sortedLargeList)) {
            return false;
        }

        return true; // All tests passed
    } catch (error) {
        console.error('Error in test_quicksort:', error);
        return false;
    }
};
/* DO NOT MODIFY BELOW THIS LINE */
exports.test_fold_left = test_fold_left;
exports.test_map = test_map;
exports.test_filter = test_filter;
exports.test_partition = test_partition;
exports.test_quicksort = test_quicksort;
