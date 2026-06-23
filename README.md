# Bible Verse Expander

An Obsidian plugin that expands a triggered Bible reference into Douay-Rheims verse text.

## Usage

Type a reference at the start of a line with the `;;` trigger, then press Enter:

```text
;;John 3:16
;;Romans 8:38-39
;;Tobit 12:15
;;Sirach 2:1
;;1 Maccabees 2:52
```

The trigger line is replaced with a Markdown block quote and a reference line.
Older Douay-style names such as `1 Machabees`, `Ecclesiasticus`, and
`Apocalypse` are accepted as aliases, but expanded references use modern book
names.

## Translation

This plugin bundles the public-domain Douay-Rheims text from the GetBible `douayrheims` module. The bundled data includes 73 books, including the deuterocanonical books.
