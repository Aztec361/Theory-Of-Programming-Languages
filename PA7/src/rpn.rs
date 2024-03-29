/*
 * Reverse Polish Notation: rpn.rs
 * See `rpn.md` for the overview.
 */

 use std::io;
 use rand::Rng;
 
 
 // Stacks will work with Items, which either either integers or booleans
 #[derive(Eq, PartialEq, Ord, PartialOrd, Debug)]
 pub enum Item {
     Int(i32),
     Bool(bool),
 }
 
 // List of possible errors
 #[derive(Debug)]
 pub enum Error {
     Empty,         // Tried to pop empty stack
     Extra,         // Stack ended with extra elements
     Type,          // Type mismatch
     Syntax,        // Syntax error, didn't recognize op
     IO(io::Error), // Some kind of IO error
     Quit,          // User quitting
 }
 
 // Base operations supported by calculator, see rpn.md
 #[derive(Debug)]
 pub enum Op {
     Add,
     Eq,
     Neg,
     Swap,
     Rand,
     Cond,
     Quit,
 }
 
 // We'll define a result type for our calculator: either a valid value, or a calculator Error
 pub type Result<T> = std::result::Result<T, Error>;
 
 // Define a type for Stacks
 #[derive(Debug)]
 pub struct Stack(Vec<Item>);
 
 // Implement the following functions on Stacks
 impl Stack {
     // Make a new Stack
     pub fn new() -> Self {
         
         Stack(Vec::new())
     }
 
     // Check if a Stack is empty
     pub fn empty(&self) -> bool {
         self.0.is_empty()
     }
 
     // Push an item onto a stack (should never error)
     pub fn push(&mut self, item: Item) -> Result<()> {
         self.0.push(item);
         Ok(())
     }
 
     // Pop an item off the Stack; may result in Empty error
     pub fn pop(&mut self) -> Result<Item> {
         self.0.pop().ok_or(Error::Empty)
     }
 
     /*
      * Main evaluation function: apply an operation to a Stack
      *
      * Complete each of the cases. 
      *
      * Hint: You'll probably want to use the "question-mark" syntax quite a bit; see `rpn.md`.
      */
     pub fn eval(&mut self, op: Op) -> Result<()> {
         match op {
             Op::Add => {
                 if let (Item::Int(b), Item::Int(a)) = (self.pop()?, self.pop()?) {
                     self.push(Item::Int(a + b))?;
                 } else {
                     return Err(Error::Type);
                 }
             }


             Op::Eq => {
                let b = self.pop()?;
                let a = self.pop()?;
                match (a, b) {
                    (Item::Int(x), Item::Int(y)) => self.push(Item::Bool(x == y)),
                    (Item::Bool(x), Item::Bool(y)) => self.push(Item::Bool(x == y)),
                    _ => Err(Error::Type),
                }
            },
            
            
            
            
            
            
            

            
            
            
             Op::Neg => {
                 if let Item::Bool(a) = self.pop()? {
                     self.push(Item::Bool(!a))?;
                 } else {
                     return Err(Error::Type);
                 }
             }
             Op::Swap => {
                let (a, b) = (self.pop()?, self.pop()?);
                self.push(a)?; // Push the first popped item (originally at the top of the stack)
                self.push(b)?; // Then push the second popped item
            }
            
            
             Op::Rand => {
                 if let Item::Int(top) = self.pop()? {
                     if top <= 0 {
                         return Err(Error::Syntax);
                     }
                     let rand_num = rand::thread_rng().gen::<i32>() % top;
                     self.push(Item::Int(rand_num))?;
                 } else {
                     return Err(Error::Type);
                 }
             }
             
             
             Op::Cond => {
                if let (b, a, Item::Bool(cond)) = (self.pop()?, self.pop()?, self.pop()?) {
                    let result = if cond { a } else { b };
                    self.push(result)?;
                } else {
                    return Err(Error::Type);
                }
            }
            
             Op::Quit => return Err(Error::Quit),
         }
         Ok(())
     }
 }
 