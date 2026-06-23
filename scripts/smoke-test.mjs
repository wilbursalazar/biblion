import assert from "node:assert/strict";
import {
  getPassage,
  parseReference,
  tryExpandTriggerLine,
} from "../dist/verse-test.mjs";

const john = getPassage("John 3:16");
assert.equal(john.ok, true);
assert.equal(john.value.reference, "John 3:16");
assert.match(john.value.verses[0].text, /only begotten Son/i);

const range = getPassage("Romans 8:38-39");
assert.equal(range.ok, true);
assert.equal(range.value.verses.length, 2);

const crossChapterRange = getPassage("John 3:16-4:2");
assert.equal(crossChapterRange.ok, true);
assert.equal(crossChapterRange.value.reference, "John 3:16-4:2");

const deuterocanon = getPassage("Tobit 12:15");
assert.equal(deuterocanon.ok, true);
assert.match(deuterocanon.value.verses[0].text, /Raphael/i);

const modern = getPassage("1 Maccabees 2:52");
assert.equal(modern.ok, true);
assert.equal(modern.value.reference, "1 Maccabees 2:52");

const alias = getPassage("1 Machabees 2:52");
assert.equal(alias.ok, true);
assert.equal(alias.value.reference, "1 Maccabees 2:52");

const parsed = parseReference("Apocalypse 1:8");
assert.equal(parsed.ok, true);
assert.equal(parsed.value.book.name, "Revelation");

const romanNumeralBook = parseReference("III John 1:2");
assert.equal(romanNumeralBook.ok, true);
assert.equal(romanNumeralBook.value.book.name, "3 John");

const oldTestamentAlias = getPassage("Canticle of Canticles 2:1");
assert.equal(oldTestamentAlias.ok, true);
assert.equal(oldTestamentAlias.value.reference, "Song of Songs 2:1");

const zeroVerse = parseReference("John 3:0");
assert.equal(zeroVerse.ok, false);
assert.equal(zeroVerse.error, "Chapter and verse must be greater than zero.");

const expanded = tryExpandTriggerLine(";;John 3:16");
assert.equal(expanded.handled, true);
assert.match(expanded.replacement ?? "", /> For God so loved the world/i);

const untouched = tryExpandTriggerLine("John 3:16");
assert.equal(untouched.handled, false);

const invalid = tryExpandTriggerLine(";;John 999:1");
assert.equal(invalid.handled, true);
assert.equal(invalid.replacement, undefined);

console.log("Parser smoke tests passed.");
