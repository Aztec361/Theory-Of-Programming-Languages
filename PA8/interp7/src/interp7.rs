use std::{
    env, error, fs,
    io::{self, Read, Write},
};

enum Ops {
    Left(usize),
    Right(usize),
    Add(u8),
    Sub(u8),
    LBrack(usize),
    RBrack(usize),
    Zero,
    Output,
    Input,
}

fn main() -> Result<(), Box<dyn error::Error>> {
    let mut prog = vec![];
    let bytes = fs::read(env::args().nth(1).unwrap())?;
    let mut i = 0;

    // Compile
    while i < bytes.len() {
        match bytes[i] as char {
            '<' => {
                let count = bytes[i..].iter().take_while(|&&x| x == b'<').count();
                prog.push(Ops::Left(count));
                i += count - 1;
            }
            '>' => {
                let count = bytes[i..].iter().take_while(|&&x| x == b'>').count();
                prog.push(Ops::Right(count));
                i += count - 1;
            }
            '+' => {
                let count = bytes[i..].iter().take_while(|&&x| x == b'+').count() as u8;
                prog.push(Ops::Add(count));
                i += count as usize - 1;
            }
            '-' => {
                let count = bytes[i..].iter().take_while(|&&x| x == b'-').count() as u8;
                prog.push(Ops::Sub(count));
                i += count as usize - 1;
            }
            '[' => prog.push(Ops::LBrack(usize::max_value())),
            ']' => prog.push(Ops::RBrack(usize::max_value())),
            '.' => prog.push(Ops::Output),
            ',' => prog.push(Ops::Input),
            _ => (),
        }
        i += 1;
    }

    // Multicode Optimization
    let mut a = 0;
    while a < prog.len() {
        if a + 3 <= prog.len() && matches!(prog[a], Ops::LBrack(_)) && 
        matches!(prog[a + 1], Ops::Sub(_)) && 
        matches!(prog[a + 2], Ops::RBrack(_)) {
            prog.drain(a..a+3);
            prog.insert(a, Ops::Zero);
        } else {
            a += 1;
        }
    }

    // Loop Caching
    let mut bstack = Vec::new();
    for pc in 0..prog.len() {
        if let Ops::LBrack(_) = prog[pc] {
            bstack.push(pc);
        }
        else if let Ops::RBrack(_) = prog[pc]{
            if let Some(&last_value) = bstack.last() {
                prog[pc] = Ops::RBrack(last_value);
                prog[last_value] = Ops::LBrack(pc);
                bstack.pop();
            }
        }
    }

    // Interpret / Evaluate
    let mut cells = vec![0u8; 10000];
    let mut cc: usize = 0;
    let mut pc = 0;
    while pc < prog.len() {
        match prog[pc] {
            Ops::Right(value) => {
                cc += value; // Move the pointer to the right by 'value'
                if cc >= cells.len() {
                    cc = cells.len() - 1; // Ensure the pointer stays within bounds
                }
            },
            Ops::Left(value) => {
                if value > cc {
                    cc = 0; 
                } else {
                    cc -= value
                }
            },
            Ops::Add(value) => {
                cells[cc] += value; 
            },
            Ops::Sub(value) => {
                cells[cc] -= value;
            },
            Ops::LBrack(value) if cells[cc] == 0 => pc = value,
            Ops::RBrack(value) if cells[cc] != 0 => pc = value,
            Ops::Output => io::stdout().write_all(&cells[cc..cc + 1])?,
            Ops::Input => io::stdin().read_exact(&mut cells[cc..cc + 1])?,
            Ops::Zero => cells[cc] = 0,
            _ => (), 
        }
        pc += 1;
    }
    Ok(())
}
