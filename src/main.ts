import { EditorSelection, Prec } from "@codemirror/state";
import { keymap } from "@codemirror/view";
import { Notice, Plugin, type Editor } from "obsidian";
import { tryExpandTriggerLine } from "./verse";

export default class BibleVerseExpanderPlugin extends Plugin {
  onload() {
    this.addCommand({
      id: "expand-bible-reference",
      name: "Expand Bible reference on current line",
      editorCallback: (editor) => {
        expandEditorLine(editor);
      },
    });

    this.registerEditorExtension(
      Prec.highest(keymap.of([
        {
          key: "Enter",
          run: (view) => {
            const selection = view.state.selection.main;
            if (!selection.empty) {
              return false;
            }

            const line = view.state.doc.lineAt(selection.head);
            const cursorOffset = selection.head - line.from;
            const beforeCursor = line.text.slice(0, cursorOffset);
            const afterCursor = line.text.slice(cursorOffset);

            if (afterCursor.trim().length > 0) {
              return false;
            }

            const result = tryExpandTriggerLine(beforeCursor);
            if (!result.handled) {
              return false;
            }

            if (!("replacement" in result)) {
              new Notice(result.error);
              return true;
            }

            const insert = `${result.replacement}\n`;
            view.dispatch({
              changes: {
                from: line.from,
                to: line.to,
                insert,
              },
              selection: EditorSelection.cursor(line.from + insert.length),
            });

            return true;
          },
        },
      ])),
    );
  }
}

function expandEditorLine(editor: Editor) {
  const cursor = editor.getCursor("head");
  const lineText = editor.getLine(cursor.line);
  const result = tryExpandTriggerLine(lineText);

  if (!result.handled) {
    new Notice("Type ;;John 3:16 on the current line, then run this command.");
    return;
  }

  if (!("replacement" in result)) {
    new Notice(result.error);
    return;
  }

  const insert = `${result.replacement}\n`;
  editor.replaceRange(
    insert,
    { line: cursor.line, ch: 0 },
    { line: cursor.line, ch: lineText.length },
  );
  editor.setCursor({ line: cursor.line + insert.split("\n").length - 1, ch: 0 });
}
