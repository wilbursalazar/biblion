import bibleData from "./douay-rheims.json";

type BibleData = {
  translation: string;
  abbreviation: string;
  source: string;
  books: BookData[];
};

type BookData = {
  id: number;
  name: string;
  chapters: string[][];
};

type ParsedReference = {
  book: BookData;
  startChapter: number;
  startVerse: number;
  endChapter: number;
  endVerse: number;
};

type PassageVerse = {
  chapter: number;
  verse: number;
  text: string;
};

type Passage = {
  reference: string;
  translation: string;
  abbreviation: string;
  verses: PassageVerse[];
};

type Result<T> =
  | { ok: true; value: T }
  | { ok: false; error: string };

type ExpansionResult =
  | { handled: false }
  | { handled: true; replacement: string }
  | { handled: true; error: string };

const TRIGGER = ";;";
const DATA = bibleData as BibleData;
const MODERN_BOOK_NAMES: Record<number, string> = {
  1: "Genesis",
  2: "Exodus",
  3: "Leviticus",
  4: "Numbers",
  5: "Deuteronomy",
  6: "Joshua",
  7: "Judges",
  8: "Ruth",
  9: "1 Samuel",
  10: "2 Samuel",
  11: "1 Kings",
  12: "2 Kings",
  13: "1 Chronicles",
  14: "2 Chronicles",
  15: "Ezra",
  16: "Nehemiah",
  17: "Esther",
  18: "Job",
  19: "Psalms",
  20: "Proverbs",
  21: "Ecclesiastes",
  22: "Song of Songs",
  23: "Isaiah",
  24: "Jeremiah",
  25: "Lamentations",
  26: "Ezekiel",
  27: "Daniel",
  28: "Hosea",
  29: "Joel",
  30: "Amos",
  31: "Obadiah",
  32: "Jonah",
  33: "Micah",
  34: "Nahum",
  35: "Habakkuk",
  36: "Zephaniah",
  37: "Haggai",
  38: "Zechariah",
  39: "Malachi",
  40: "Matthew",
  41: "Mark",
  42: "Luke",
  43: "John",
  44: "Acts",
  45: "Romans",
  46: "1 Corinthians",
  47: "2 Corinthians",
  48: "Galatians",
  49: "Ephesians",
  50: "Philippians",
  51: "Colossians",
  52: "1 Thessalonians",
  53: "2 Thessalonians",
  54: "1 Timothy",
  55: "2 Timothy",
  56: "Titus",
  57: "Philemon",
  58: "Hebrews",
  59: "James",
  60: "1 Peter",
  61: "2 Peter",
  62: "1 John",
  63: "2 John",
  64: "3 John",
  65: "Jude",
  66: "Revelation",
  69: "Tobit",
  70: "Judith",
  73: "Wisdom",
  74: "Sirach",
  75: "Baruch",
  80: "1 Maccabees",
  81: "2 Maccabees",
};
const EXTRA_ALIASES: Record<string, string[]> = {
  Genesis: ["Gen", "Gn"],
  Exodus: ["Ex", "Exod"],
  Leviticus: ["Lev", "Lv"],
  Numbers: ["Num", "Nm"],
  Deuteronomy: ["Deut", "Dt"],
  Joshua: ["Josh", "Josue", "Jos"],
  Judges: ["Judg", "Jdg"],
  Ruth: ["Ru"],
  "1 Samuel": ["1 Sam", "1 Sa", "1 Kings", "1 Kgs"],
  "2 Samuel": ["2 Sam", "2 Sa", "2 Kings", "2 Kgs"],
  "1 Kings": ["1 Kgs", "3 Kings", "3 Kgs"],
  "2 Kings": ["2 Kgs", "4 Kings", "4 Kgs"],
  "1 Chronicles": ["1 Chron", "1 Chr", "1 Paralipomenon", "1 Par"],
  "2 Chronicles": ["2 Chron", "2 Chr", "2 Paralipomenon", "2 Par"],
  Ezra: ["1 Esdras", "1 Esd"],
  Nehemiah: ["2 Esdras", "2 Esd", "Nehemias", "Neh"],
  Tobit: ["Tobias", "Tob"],
  Judith: ["Jdt", "Judith"],
  Esther: ["Esth", "Est"],
  Job: ["Jb"],
  Psalms: ["Psalm", "Ps", "Psa"],
  Proverbs: ["Prov", "Prv"],
  Ecclesiastes: ["Eccl", "Qoh", "Qoheleth"],
  "Song of Songs": [
    "Song",
    "Song of Solomon",
    "Canticle",
    "Canticles",
    "Canticle of Canticles",
  ],
  Wisdom: ["Wisdom of Solomon", "Wis", "Wisd"],
  Sirach: ["Ecclesiasticus", "Sir", "Ben Sira"],
  Isaiah: ["Isa", "Isaias", "Is"],
  Jeremiah: ["Jer", "Jeremias"],
  Lamentations: ["Lam"],
  Baruch: ["Bar"],
  Ezekiel: ["Ezek", "Ezechiel", "Ezech"],
  Daniel: ["Dan", "Dn"],
  Hosea: ["Hos", "Osee"],
  Joel: ["Jl"],
  Amos: ["Am"],
  Obadiah: ["Obad", "Abdias"],
  Jonah: ["Jon", "Jonas"],
  Micah: ["Mic", "Micheas"],
  Nahum: ["Nah", "Naum"],
  Habakkuk: ["Hab", "Habacuc"],
  Zephaniah: ["Zeph", "Sophonias"],
  Haggai: ["Hag", "Aggeus"],
  Zechariah: ["Zech", "Zacharias"],
  Malachi: ["Mal", "Malachias"],
  "1 Maccabees": ["1 Mac", "1 Macc", "1 Machabees", "1 Mach"],
  "2 Maccabees": ["2 Mac", "2 Macc", "2 Machabees", "2 Mach"],
  Matthew: ["Matt", "Mt"],
  Mark: ["Mk", "Mrk"],
  Luke: ["Lk", "Lu"],
  John: ["Jn", "Jhn"],
  Acts: ["Acts of the Apostles", "Act"],
  Romans: ["Rom", "Rm"],
  "1 Corinthians": ["1 Cor", "1 Co"],
  "2 Corinthians": ["2 Cor", "2 Co"],
  Galatians: ["Gal"],
  Ephesians: ["Eph"],
  Philippians: ["Phil", "Php"],
  Colossians: ["Col"],
  "1 Thessalonians": ["1 Thess", "1 Thes", "1 Th"],
  "2 Thessalonians": ["2 Thess", "2 Thes", "2 Th"],
  "1 Timothy": ["1 Tim", "1 Tm"],
  "2 Timothy": ["2 Tim", "2 Tm"],
  Titus: ["Tit"],
  Philemon: ["Philem", "Phm"],
  Hebrews: ["Heb"],
  James: ["Jas", "Jm"],
  "1 Peter": ["1 Pet", "1 Pt"],
  "2 Peter": ["2 Pet", "2 Pt"],
  "1 John": ["1 Jn", "1 Jhn"],
  "2 John": ["2 Jn", "2 Jhn"],
  "3 John": ["3 Jn", "3 Jhn"],
  Jude: ["Jud"],
  Revelation: ["Apocalypse", "Apoc", "Rev"],
};
const BOOKS_BY_ALIAS = buildBookAliasIndex(DATA.books);

export function tryExpandTriggerLine(line: string): ExpansionResult {
  const match = line.match(/^(\s*);;(.+?)\s*$/);
  if (!match) {
    return { handled: false };
  }

  const indent = match[1] ?? "";
  const reference = match[2].trim();
  const passage = getPassage(reference);

  if (!passage.ok) {
    return { handled: true, error: passage.error };
  }

  const replacement = formatPassage(passage.value)
    .split("\n")
    .map((replacementLine) => `${indent}${replacementLine}`)
    .join("\n");

  return { handled: true, replacement };
}

export function getPassage(input: string): Result<Passage> {
  const parsed = parseReference(input);
  if (!parsed.ok) {
    return parsed;
  }

  const verses: PassageVerse[] = [];
  const { book, startChapter, endChapter } = parsed.value;

  for (let chapter = startChapter; chapter <= endChapter; chapter += 1) {
    const chapterVerses = book.chapters[chapter - 1];
    if (!chapterVerses) {
      return { ok: false, error: `${book.name} ${chapter} was not found.` };
    }

    const fromVerse =
      chapter === startChapter ? parsed.value.startVerse : 1;
    const toVerse =
      chapter === endChapter ? parsed.value.endVerse : chapterVerses.length;

    for (let verse = fromVerse; verse <= toVerse; verse += 1) {
      const text = chapterVerses[verse - 1];
      if (!text) {
        return {
          ok: false,
          error: `${book.name} ${chapter}:${verse} was not found.`,
        };
      }

      verses.push({ chapter, verse, text });
    }
  }

  return {
    ok: true,
    value: {
      reference: formatReference(parsed.value),
      translation: DATA.translation,
      abbreviation: DATA.abbreviation,
      verses,
    },
  };
}

export function parseReference(input: string): Result<ParsedReference> {
  const normalizedInput = input.trim().replace(/[–—]/g, "-");
  const match = normalizedInput.match(
    /^(.+?)\s+(\d+):(\d+)(?:\s*-\s*(?:(\d+):)?(\d+))?$/,
  );

  if (!match) {
    return {
      ok: false,
      error: `Use ${TRIGGER}Book Chapter:Verse, for example ${TRIGGER}John 3:16.`,
    };
  }

  const bookName = match[1];
  const book = BOOKS_BY_ALIAS.get(normalizeBookName(bookName));
  if (!book) {
    return { ok: false, error: `Book not found: ${bookName}.` };
  }

  const startChapter = Number(match[2]);
  const startVerse = Number(match[3]);
  const endChapter = match[4] ? Number(match[4]) : startChapter;
  const endVerse = match[5] ? Number(match[5]) : startVerse;

  if (
    startChapter < 1 ||
    startVerse < 1 ||
    endChapter < 1 ||
    endVerse < 1
  ) {
    return { ok: false, error: "Chapter and verse must be greater than zero." };
  }

  if (
    endChapter < startChapter ||
    (endChapter === startChapter && endVerse < startVerse)
  ) {
    return { ok: false, error: "Verse range must go forward." };
  }

  return {
    ok: true,
    value: {
      book,
      startChapter,
      startVerse,
      endChapter,
      endVerse,
    },
  };
}

function formatPassage(passage: Passage): string {
  const includeVerseNumbers = passage.verses.length > 1;
  const quoted = passage.verses.map((verse) => {
    const label = includeVerseNumbers ? `${verse.chapter}:${verse.verse} ` : "";
    return `> ${label}${verse.text}`;
  });

  return [
    ...quoted,
    ">",
    `> -- ${passage.reference} (${passage.abbreviation})`,
  ].join("\n");
}

function formatReference(reference: ParsedReference): string {
  const start = `${getDisplayBookName(reference.book)} ${reference.startChapter}:${reference.startVerse}`;
  const sameVerse =
    reference.startChapter === reference.endChapter &&
    reference.startVerse === reference.endVerse;

  if (sameVerse) {
    return start;
  }

  const end =
    reference.startChapter === reference.endChapter
      ? `${reference.endVerse}`
      : `${reference.endChapter}:${reference.endVerse}`;

  return `${start}-${end}`;
}

function buildBookAliasIndex(books: BookData[]) {
  const aliases = new Map<string, BookData>();

  for (const book of books) {
    addAliases(
      aliases,
      book,
      book.name,
      getDisplayBookName(book),
      ...(EXTRA_ALIASES[book.name] ?? []),
    );
  }

  return aliases;
}

function getDisplayBookName(book: BookData) {
  return MODERN_BOOK_NAMES[book.id] ?? book.name;
}

function addAliases(
  aliases: Map<string, BookData>,
  book: BookData,
  ...names: string[]
) {
  for (const name of names) {
    aliases.set(normalizeBookName(name), book);
  }
}

function normalizeBookName(value: string) {
  return value
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/\bsaint\b/g, "st")
    .replace(/\bst\./g, "st")
    .replace(/\bfirst\b/g, "1")
    .replace(/\bsecond\b/g, "2")
    .replace(/\bthird\b/g, "3")
    .replace(/\bi\b/g, "1")
    .replace(/\bii\b/g, "2")
    .replace(/\biii\b/g, "3")
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, " ");
}
