{-
     Do not change the skeleton code! The point of this
     assignment is to figure out how the functions can
     be written this way (using fold). You may only
     replace the `error "TBD:..."` parts.

     For this assignment, you may use the following library functions:

     map
     foldl'
     foldr
     length
     append (or ++)
     zip
 -}

module Warmup where

import Prelude  hiding (replicate, sum, reverse)
import Data.List (foldl')

foldLeft :: (a -> b -> a) -> a -> [b] -> a
foldLeft = foldl'

foldRight :: (b -> a -> a) -> a -> [b] -> a
foldRight = foldr


-- | Sum the elements of a list
--
-- >>> sumList [1, 2, 3, 4]
-- 10
--
-- >>> sumList [1, -2, 3, 5]
-- 7
--
-- >>> sumList [1, 3, 5, 7, 9, 11]
-- 36

sumList :: [Int] -> Int
sumList xs = foldLeft (+) 0 xs--error "TBD:sumList"


-- | `digitsOfInt n` should return `[]` if `n` is not positive,
--    and otherwise returns the list of digits of `n` in the
--    order in which they appear in `n`.
--
-- >>> digitsOfInt 3124
-- [3, 1, 2, 4]
--
-- >>> digitsOfInt 352663
-- [3, 5, 2, 6, 6, 3]

digitsOfInt :: Int -> [Int]
digitsOfInt 0 = []
digitsOfInt n
  | n < 0     = []
  | otherwise = go n
  where
    go 0 = []
    go x = go (x `div` 10) ++ [x `mod` 10]
--digitsOfInt n = --error "TBD:digitsOfInt" 


-- | `digits n` retruns the list of digits of `n`
--
-- >>> digits 31243
-- [3,1,2,4,3]
--
-- digits (-23422)
-- [2, 3, 4, 2, 2]

digits :: Int -> [Int]
digits n = digitsOfInt (abs n)


-- | From http://mathworld.wolfram.com/AdditivePersistence.html
--   Consider the process of taking a number, adding its digits,
--   then adding the digits of the number derived from it, etc.,
--   until the remaining number has only one digit.
--   The number of additions required to obtain a single digit
--   from a number n is called the additive persistence of n,
--   and the digit obtained is called the digital root of n.
--   For example, the sequence obtained from the starting number
--   9876 is (9876, 30, 3), so 9876 has
--   an additive persistence of 2 and
--   a digital root of 3.
--
-- NOTE: assume additivePersistence & digitalRoot are only called with positive numbers

-- >>> additivePersistence 9876
-- 2

additivePersistence :: Int -> Int
additivePersistence n
  | n < 10 = 0  -- Base case: single-digit number has additive persistence of 0
  | otherwise = 1 + additivePersistence (digitalRoot n)
  where
    digitalRoot :: Int -> Int
    digitalRoot num = sumList (digitsOfInt num)
--additivePersistence n = error "TBD" 

-- | digitalRoot n is the digit obtained at the end of the sequence
--   computing the additivePersistence
--
-- >>> digitalRoot 9876
-- 3
digitalRoot :: Int -> Int
digitalRoot n
  | n < 10 = n  -- Base case: single-digit number has itself as the digital root
  | otherwise = digitalRoot (sumList (digitsOfInt n))
--digitalRoot n = error "TBD"


-- | listReverse [x1,x2,...,xn] returns [xn,...,x2,x1]
--
-- >>> listReverse []
-- []
--
-- >>> listReverse [1,2,3,4]
-- [4,3,2,1]
--
-- >>> listReverse ["i", "want", "to", "ride", "my", "bicycle"]
-- ["bicycle", "my", "ride", "to", "want", "i"]

listReverse :: [a] -> [a]
listReverse xs = foldLeft (\acc x -> x : acc) [] xs
--listReverse xs = error "TBD"

-- | In Haskell, a `String` is a simply a list of `Char`, that is:
--
-- >>> ['h', 'a', 's', 'k', 'e', 'l', 'l']
-- "haskell"
--
-- >>> palindrome "malayalam"
-- True
--
-- >>> palindrome "myxomatosis"
-- False

palindrome :: String -> Bool
palindrome w = w == listReverse w
--palindrome w = error "TBD"


-- | sqSum [x1, ... , xn] should return (x1^2 + ... + xn^2)
--
-- >>> sqSum []
-- 0
--
-- >>> sqSum [1,2,3,4]
-- 30
--
-- >>> sqSum [(-1), (-2), (-3), (-4)]
-- 30

sqSum :: [Int] -> Int
sqSum xs = foldLeft f base xs
  where
    f a x = a + x * x
    base = 0
   --f a x = error "TBD: sqSum f"
   --base  = error "TBD: sqSum base"



-- | `pipe [f1,...,fn] x` should return `f1(f2(...(fn x)))`
--
-- >>> pipe [] 3
-- 3
--
-- >>> pipe [(\x -> x+x), (\x -> x + 3)] 3
-- 12
--
-- >>> pipe [(\x -> x * 4), (\x -> x + x)] 3
-- 24

pipe :: [(a -> a)] -> (a -> a)
pipe fs   = foldLeft f base fs
  where
    f a x = a . x
    base = id
    --f a x = error "TBD"
    --base  = error "TBD"

-- | `sepConcat sep [s1,...,sn]` returns `s1 ++ sep ++ s2 ++ ... ++ sep ++ sn`
--
-- >>> sepConcat "---" []
-- ""
--
-- >>> sepConcat ", " ["foo", "bar", "baz"]
-- "foo, bar, baz"
--
-- >>> sepConcat "#" ["a","b","c","d","e"]
-- "a#b#c#d#e"

sepConcat :: String -> [String] -> String
sepConcat sep []    = ""
sepConcat sep (h:t) = foldLeft f base l
  where
    f a b = a ++ sep ++ b
    base = h
    l = t


intString :: Int -> String
intString = show

-- | `stringOfList pp [x1,...,xn]` uses the element-wise printer `pp` to
--   convert the element-list into a string:
--
-- >>> stringOfList intString [1, 2, 3, 4, 5, 6]
-- "[1, 2, 3, 4, 5, 6]"
--
-- >>> stringOfList (\x -> x) ["foo"]
-- "[foo]"
--
-- >>> stringOfList (stringOfList show) [[1, 2, 3], [4, 5], [6], []]
-- "[[1, 2, 3], [4, 5], [6], []]"

stringOfList :: (a -> String) -> [a] -> String
stringOfList f xs = "[" ++ sepConcat ", " (map f xs) ++ "]"--error "TBD"

-- | `clone x n` returns a `[x,x,...,x]` containing `n` copies of `x`
--
-- >>> clone 3 5
-- [3,3,3,3,3]
--
-- >>> clone "foo" 2
-- ["foo", "foo"]

clone :: a -> Int -> [a]
clone x n
  | n <= 0    = []
  | otherwise = x : clone x (n - 1)
--clone x n = error "TBD"

type BigInt = [Int]

-- | `padZero l1 l2` returns a pair (l1', l2') which are just the input lists,
--   padded with extra `0` on the left such that the lengths of `l1'` and `l2'`
--   are equal.
--
-- >>> padZero [9,9] [1,0,0,2]
-- [0,0,9,9] [1,0,0,2]
--
-- >>> padZero [1,0,0,2] [9,9]
-- [1,0,0,2] [0,0,9,9]

padZero :: BigInt -> BigInt -> (BigInt, BigInt)
padZero l1 l2
  | len1 < len2 = (clone 0 (len2 - len1) ++ l1, l2)
  | len1 > len2 = (l1, clone 0 (len1 - len2) ++ l2)
  | otherwise   = (l1, l2)
  where
    len1 = length l1
    len2 = length l2

--padZero l1 l2 = error "TBD"

-- | `removeZero ds` strips out all leading `0` from the left-side of `ds`.
--
-- >>> removeZero [0,0,0,1,0,0,2]
-- [1,0,0,2]
--
-- >>> removeZero [9,9]
-- [9,9]
--
-- >>> removeZero [0,0,0,0]
-- []

removeZero :: BigInt -> BigInt
removeZero ds = dropWhile (== 0) ds
--removeZero ds = error "TBD"


-- | `bigAdd n1 n2` returns the `BigInt` representing the sum of `n1` and `n2`.
--
-- >>> bigAdd [9, 9] [1, 0, 0, 2]
-- [1, 1, 0, 1]
--
-- >>> bigAdd [9, 9, 9, 9] [9, 9, 9]
-- [1, 0, 9, 9, 8]

bigAdd :: BigInt -> BigInt -> BigInt
bigAdd l1 l2 = removeZero finalRes
  where
    (l1', l2') = padZero l1 l2
    (carry, res) = foldr f base (zip l1' l2')
    finalRes = if carry > 0 then carry : res else res
    f (x1, x2) (carry, sum) = let 
      s = x1 + x2 + carry
      in
        (s `div` 10, s `mod` 10 : sum) 
    base = (0, [])
    args = zip l1' l2'
    --f (x1, x2) (carry, sum)  = error "TBD"
   -- base                     = error "TBD"
    --args                     = error "TBD"


-- | `mulByDigit i n` returns the result of multiplying
--   the digit `i` (between 0..9) with `BigInt` `n`.
--
-- >>> mulByDigit 9 [9,9,9,9]
-- [8,9,9,9,1]

mulByDigit :: Int -> BigInt -> BigInt
mulByDigit i [] = []
mulByDigit i l = integerToList (fromIntegral i * listToInteger l)

listToInteger :: [Int] -> Integer
listToInteger = foldl' (\acc x -> acc * 10 + toInteger x) 0

integerToList :: Integer -> [Int]
integerToList 0 = []
integerToList n = map (\c -> read [c] :: Int) (show n)
--mulByDigit i l = error "TBD"

-- | `bigMul n1 n2` returns the `BigInt` representing the product of `n1` and `n2`.
--
-- >>> bigMul [9,9,9,9] [9,9,9,9]
-- [9,9,9,8,0,0,0,1]
--
-- >>> bigMul [9,9,9,9,9] [9,9,9,9,9]
-- [9,9,9,9,8,0,0,0,0,1]

bigMul :: BigInt -> BigInt -> BigInt
bigMul l1 l2 = snd (foldRight f base args)
  where
    f x (z, p) = (z+1, bigAdd (mulByDigit x (l1 ++ clone 0 z)) p)
    base       = (0, [])
    args       = l2


    --f x (z, p) = error "TBD"
    --base       = error "TBD"
    --args       = error "TBD"
