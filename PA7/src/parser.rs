/*
 * Reverse Polish Notation: parser.rs
 * See `rpn.md` for the overview.
 */

extern crate rand;

use std::io::{self, Write};

use super::rpn;

pub fn rpn_repl() -> rpn::Result<()> {
    let mut stack = rpn::Stack::new();
    let mut input = String::new();

    // Read-eval-print loop
    loop {
        // Clear the input buffer
        input.clear();

        // Prompt the user
        print!("> ");
        io::stdout().flush().map_err(rpn::Error::IO)?;

        // Read a line and evaluate it
        io::stdin().read_line(&mut input).map_err(rpn::Error::IO)?;
        evaluate_line(&mut stack, &input)?;

        // A successful run should end with a stack with a exactly one item: the result
        let res = stack.pop()?;
        if stack.empty() {
            println!("Reply> {:?}", res);
        } else {
            return Err(rpn::Error::Extra);
        }
    }
}

pub fn evaluate_line(stack: &mut rpn::Stack, buf: &str) -> rpn::Result<()> {
    // Trim whitespace and split; this gives an iterator of tokens.
    let tokens = buf.trim().split_whitespace();

    for tok in tokens {
        if let Ok(parsed) = tok.parse::<i32>() {
            // If parsing is successful, push the integer onto the stack
            stack.push(rpn::Item::Int(parsed))?;
        } else if tok == "+" {
            // Handle addition
            stack.eval(rpn::Op::Add)?;
        } else if tok == "true" {
            // Handle the 'true' boolean
            stack.push(rpn::Item::Bool(true))?;
        } else if tok == "false" {
            // Handle the 'false' boolean
            stack.push(rpn::Item::Bool(false))?;
        } else {
            // Handle other cases or report an error
            return Err(rpn::Error::Syntax);
        }
    }
    Ok(())
}


