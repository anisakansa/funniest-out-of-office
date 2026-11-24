// The Funniest Out-of-Office — one line, deterministic.
//
// Why this line won (5 candidates scored against the rubric:
// out-of-office voice > specific humour > twist > concision):
//   A (103 chars, 19/20) — "I'm out of office. My inbox is now a museum:
//   look, don't touch, and please don't feed the unread count."
//   An inbox reframed as a museum is an out-of-office voice only an
//   auto-reply can pull off: the unread count becomes an exhibit
//   visitors must not feed. The museum rule ("look, don't touch")
//   lands the twist in the second sentence, and the final clause
//   ("feed the unread count") is the joke only an inbox can tell.
//   Runner-up C ("filed under 'later'", the drawer where my
//   motivation lives) scored 18 — the same trick, told flatter
//   and with less room to breathe.
//
// Guards: no clock, no randomness, no I/O beyond the entry file.
// The line is a constant; the program only checks it and writes it.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

const LINE =
  "I'm out of office. My inbox is now a museum: look, don't touch, and please don't feed the unread count.";

const MIN_CHARS = 1;
const MAX_CHARS = 120;
const OUT_PATH = "/output/entry.txt";

function fail(message: string): never {
  throw new Error(message);
}

// One line, within the length gate, no leading/trailing whitespace.
const chars = [...LINE];
if (chars.length < MIN_CHARS || chars.length > MAX_CHARS) {
  fail(`entry must be ${MIN_CHARS}-${MAX_CHARS} characters, got ${chars.length}`);
}
if (LINE.includes("\n") || LINE.includes("\r")) {
  fail("entry must be a single line");
}
if (LINE.trim() !== LINE) {
  fail("entry must not start or end with whitespace");
}
// Pure ASCII: byte length must equal character count.
if (Buffer.from(LINE, "utf8").length !== chars.length) {
  fail("entry must be pure ASCII");
}

mkdirSync("/output", { recursive: true });
writeFileSync(OUT_PATH, LINE, "utf8");

// Round-trip check: what was written must read back byte-identical.
const back = readFileSync(OUT_PATH, "utf8");
if (back !== LINE) {
  fail("round-trip mismatch: written entry differs from the line");
}

console.log(LINE);
