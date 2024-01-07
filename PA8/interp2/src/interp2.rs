use std::{
    env, error, fs,
    io::{self, Read, Write},
};

fn main() -> Result<(), Box<dyn error::Error>> {
    let prog = fs::read(env::args().nth(1).unwrap())?;

    // "b" is for bracket
    let mut bmap = vec![0; prog.len()]; // Map from a position in the program to the jump location
    let mut bstack = vec![]; // Used to track nested brackets

    // Build the bracket map by preprocessing the program.
    for (i, &b) in prog.iter().enumerate() {
        if b == b'[' {
            bstack.push(i);
        } else if b == b']' {
            if let Some(&start) = bstack.last() {
                bmap[start] = i;
                bmap[i] = start;
                bstack.pop();
            } else {
                return Err("Unmatched brackets".into());
            }
        }
    }

    let mut pc = 0;
    let mut cells = vec![0u8; 10000];
    let mut cc = 0usize;
    while pc < prog.len() {
        match prog[pc] as char {
            '<' => cc = cc.saturating_sub(1),
            '>' => cc = cc.saturating_add(1),
            '+' => cells[cc] = cells[cc].wrapping_add(1),
            '-' => cells[cc] = cells[cc].wrapping_sub(1),
            '[' if cells[cc] == 0 => pc = bmap[pc],
            ']' if cells[cc] != 0 => pc = bmap[pc],
            '.' => io::stdout().write_all(&cells[cc..cc + 1])?,
            ',' => io::stdin().read_exact(&mut cells[cc..cc + 1])?,
            _ => (),
        }
        pc += 1;
    }
    Ok(())
}
