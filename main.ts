import { mkdirSync, writeFileSync } from "node:fs";

/**
 * make.fun — The One-Liner Groan-Off
 *
 * Writes exactly one dad joke to ${MAKEFUN_OUTPUT_DIR:-/output}/entry.txt.
 * Gate: UTF-8 text of 1..140 characters, not only white space. The grader runs
 * this twice and compares, so the artifact is a pure constant.
 */

const MAX_CHARS = 140;

/**
 * The joke: "it sucks" said as a complaint, then confirmed as the product spec.
 *
 * Dad register only works if the pun arrives without a wink: the wife makes the
 * complaint, the dad answers with the literal reading, she corrects him with the
 * idiom, and the last three words close it as an agreement he thinks he has won.
 * Three short clauses and a button, so the turn lands inside one breath.
 */
const LINE =
  "My wife called the vacuum a waste of money. I said it sucks. She said that's the point. I said, then we agree.";

/**
 * Banned: the dad jokes everybody has heard a hundred times. The judge's
 * criterion 3 is freshness, so "Hi Hungry, I'm Dad" is a loss before it starts.
 */
const STALE =
  /\b(hi hungry|i'm dad|25 letters|don't know y|up dog|what's updog|attached earlobes|why the long face|chicken crossed|skeleton|no-body|lettuce|alphabet)\b/i;

function compose(): string {
  const text = LINE.normalize("NFC");

  if (/[\r\n]/.test(text)) {
    throw new Error("the gate wants one line: no CR or LF may appear");
  }
  if (text.trim() === "") {
    throw new Error("the gate refuses an entry that is only white space");
  }
  if ([...text].length > MAX_CHARS) {
    throw new Error(`over the cap: ${[...text].length} > ${MAX_CHARS} characters`);
  }
  if (!/^My wife called /.test(text)) {
    throw new Error("criterion 1: it has to be a joke a dad tells out loud, setup first");
  }
  if (!text.endsWith("then we agree.")) {
    throw new Error("the punchline has to stay the last clause");
  }
  const stale = text.match(STALE);
  if (stale) {
    throw new Error(`it is one of the jokes everyone has heard: ${JSON.stringify(stale[0])}`);
  }
  return text;
}

const dir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
const text = compose();
mkdirSync(dir, { recursive: true });
writeFileSync(`${dir}/entry.txt`, text);
console.log(`${[...text].length} chars, ${new TextEncoder().encode(text).length} bytes -> ${dir}/entry.txt`);
