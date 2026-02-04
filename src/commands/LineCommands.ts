import type { Editor } from "obsidian";
import { EditorService } from "src/services/EditorService";
import { ScrollService } from "src/services/ScrollService";

/**
 * 行操作コマンドを提供するクラス
 */
export class LineCommands {
  constructor(
    private editorService: EditorService,
    private scrollService: ScrollService
  ) {}

  /**
   * 現在の行を上にコピー
   */
  copyLineUp(ed: Editor): void {
    this.copyLine(ed, "up");
  }

  /**
   * 現在の行を下にコピー
   */
  copyLineDown(ed: Editor): void {
    this.copyLine(ed, "down");
  }

  private copyLine(ed: Editor, mode: "up" | "down"): void {
    let [cursorFrom, cursorTo] = [ed.getCursor("from"), ed.getCursor("to")];
    const { line } = cursorTo;

    const copyLines = this.editorService.getLinesOfSelection(ed);
    const lines = ed.getValue().split("\n");
    lines.splice(line + (mode === "up" ? 0 : 1), 0, ...copyLines);
    ed.setValue(lines.join("\n"));

    if (mode === "down") {
      cursorFrom.line += copyLines.length;
      cursorTo.line += copyLines.length;
    }

    ed.setSelection(cursorFrom, cursorTo);
    this.scrollService.scrollToSelection(ed, { anchor: cursorFrom, head: cursorTo });
  }
}
