# Biblion

Biblion expands a Bible reference into Douay-Rheims verse text directly in your Obsidian note.

## Usage

Type `;;`, then a Bible reference, then press Enter.

For example, type this on its own line:

```text
;;John 3:16
```

Biblion replaces it with:

```markdown
> For God so loved the world, as to give his only begotten Son: that whosoever believeth in him may not perish, but may have life everlasting.
>
> -- John 3:16 (DRB)
```

More examples:

```text
;;Romans 8:38-39
;;Tobit 12:15
;;Sirach 2:1
;;1 Maccabees 2:52
```

Ranges can stay within one chapter, such as `;;Romans 8:38-39`, or cross chapters, such as `;;John 3:16-4:2`.

Older Douay-style names such as `1 Machabees`, `Ecclesiasticus`, and `Apocalypse` are accepted as aliases, but expanded references use modern book names.

## Translation

This plugin bundles the public-domain Douay-Rheims text from the GetBible `douayrheims` module. The bundled data includes 73 books, including the deuterocanonical books.
