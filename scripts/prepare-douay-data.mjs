import fs from "node:fs";

const rawPath = "data/douayrheims.raw.json";
const outPath = "src/douay-rheims.json";

const raw = JSON.parse(fs.readFileSync(rawPath, "utf8"));

const data = {
  translation: "Douay-Rheims",
  abbreviation: "DRB",
  source: "GetBible douayrheims module, Public Domain",
  books: raw.books.map((book) => ({
    id: book.nr,
    name: book.name,
    chapters: book.chapters.map((chapter) =>
      chapter.verses.map((verse) => normalizeVerseText(verse.text)),
    ),
  })),
};

fs.writeFileSync(outPath, `${JSON.stringify(data)}\n`);

function normalizeVerseText(value) {
  return String(value)
    .replace(/<[^>]+>/g, "")
    .replace(/\s+/g, " ")
    .trim();
}
