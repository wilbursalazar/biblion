import { EditorSelection, Prec } from "@codemirror/state";
import { keymap } from "@codemirror/view";
import { Notice, Plugin } from "obsidian";
import { tryExpandTriggerLine } from "./verse";

export default class BibleVerseExpanderPlugin extends Plugin {
  onload() {
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
