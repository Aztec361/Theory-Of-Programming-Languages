use std::{
    env, error, fs,
    io::{self, Read, Write},
};

enum Ops {
    Left,
    Right,
    Add(u8),
    Sub,
    LBrack(usize),
    RBrack(usize),
    Output,
    Input,
}

fn main() -> Result<(), Box<dyn error::Error>> {
    let mut prog = vec![];
    let bytes = fs::read(env::args().nth(1).unwrap())?;
    let mut i = 0;
    while i < bytes.len() {
        match bytes[i] as char {
            '<' => prog.push(Ops::Left),
            '>' => prog.push(Ops::Right),
            '+' => prog.push(Ops::Add(1)), // Change to Add(1) or another value as needed
            '-' => prog.push(Ops::Sub),
            '[' => prog.push(Ops::LBrack(usize::max_value())),
            ']' => prog.push(Ops::RBrack(usize::max_value())),
            '.' => prog.push(Ops::Output),
            ',' => prog.push(Ops::Input),
            _ => (),
        }
        i += 1;
    }

    let mut bstack = vec![];
    let mut i = 0;
    while i < prog.len() {
        match &mut prog[i] {
            Ops::LBrack(_) => {
                bstack.push(i);
            }
            Ops::RBrack(val) => {
                if let Some(start) = bstack.pop() {
                    *val = start;
                    if let Ops::LBrack(val) = &mut prog[start] {
                        *val = i;
                    }
                } else {
                    return Err("Unmatched brackets".into());
                }
            }
            _ => (),
        }
        i += 1;
    }

    let mut cells = vec![0u8; 10000];
    let mut cc: usize = 0; // specify the type of cc
    let mut pc = 0;
    while pc < prog.len() {
        match &prog[pc] {
            Ops::Left => cc = cc.saturating_sub(1),
            Ops::Right => cc = cc.saturating_add(1),
            Ops::Add(val) => cells[cc] = cells[cc].wrapping_add(*val),
            Ops::Sub => cells[cc] = cells[cc].wrapping_sub(1),
            Ops::LBrack(val) if cells[cc] == 0 => pc = *val,
            Ops::RBrack(val) if cells[cc] != 0 => pc = *val,
            Ops::Output => io::stdout().write_all(&cells[cc..cc + 1])?,
            Ops::Input => io::stdin().read_exact(&mut cells[cc..cc + 1])?,
            _ => (),
        }
        pc += 1;
    }
    Ok(())
}
