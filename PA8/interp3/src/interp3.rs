use std::{
    env, error, fs,
    io::{self, Read, Write},
};

enum Ops {
    Left,
    Right,
    Add,
    Sub,
    LBrack,
    RBrack,
    Output,
    Input,
}

fn main() -> Result<(), Box<dyn error::Error>> {
    /* Notice: prog is now a vec of Ops, not a string */
    let mut prog = vec![];

    /* First parse the program into a sequence of opcodes */
    for b in fs::read(env::args().nth(1).unwrap())? {
        match b as char {
            '<' => prog.push(Ops::Left),
            '>' => prog.push(Ops::Right),
            '+' => prog.push(Ops::Add),
            '-' => prog.push(Ops::Sub),
            '[' => prog.push(Ops::LBrack),
            ']' => prog.push(Ops::RBrack),
            '.' => prog.push(Ops::Output),
            ',' => prog.push(Ops::Input),
            _ => (),
        }
    }

    let mut pc = 0;
    let mut bmap = vec![0; prog.len()];
    let mut bstack = vec![];

    // Build the bracket map by preprocessing the program.
    for (i, op) in prog.iter().enumerate() {
        match *op {
            Ops::LBrack => bstack.push(i),
            Ops::RBrack => {
                if let Some(&start) = bstack.last() {
                    bmap[start] = i;
                    bmap[i] = start;
                    bstack.pop();
                } else {
                    return Err("Unmatched brackets".into());
                }
            }
            _ => (),
        }
    }

    let mut cells = vec![0u8; 10000];
    let mut cc = 0usize;
    while pc < prog.len() {
        match prog[pc] {
            Ops::Left => cc = cc.saturating_sub(1),
            Ops::Right => cc = cc.saturating_add(1),
            Ops::Add => cells[cc] = cells[cc].wrapping_add(1),
            Ops::Sub => cells[cc] = cells[cc].wrapping_sub(1),
            Ops::LBrack if cells[cc] == 0 => pc = bmap[pc],
            Ops::RBrack if cells[cc] != 0 => pc = bmap[pc],
            Ops::Output => io::stdout().write_all(&cells[cc..cc + 1])?,
            Ops::Input => io::stdin().read_exact(&mut cells[cc..cc + 1])?,
            _ => (),
        }
        pc += 1;
    }
    Ok(())
}
