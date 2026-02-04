import type { Editor, EditorSelectionOrCaret } from "obsidian";
import { SelectionService } from "src/services/SelectionService";

/**
 * カーソル操作コマンドを提供するクラス
 */
export class CursorCommands {
  constructor(private selectionService: SelectionService) {}

  /**
   * 上の行にカーソルを追加
   */
  addCursorAbove(ed: Editor): void {
    this.addCursor(ed, "up");
  }

  /**
   * 下の行にカーソルを追加
   */
  addCursorBelow(ed: Editor): void {
    this.addCursor(ed, "down");
  }

  private addCursor(ed: Editor, mode: "up" | "down"): void {
    const sels: EditorSelectionOrCaret[] = ed.listSelections();
    const { ch, line } = sels[mode === "up" ? "first" : "last"]().anchor;

    const lineTo = line + (mode === "up" ? -1 : 1);
    const chTo = Math.min(ch, ed.getLine(lineTo).length);

    const anchor = {
      line: lineTo,
      ch: chTo,
    };
    sels.push({ anchor, head: anchor });
    ed.setSelections(this.selectionService.reconstructSelections(sels));
  }
}
