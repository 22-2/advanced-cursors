import type { Editor, EditorSelection } from "obsidian";

/**
 * エディタのスクロール制御を行うサービス
 */
export class ScrollService {
  /**
   * 選択範囲が見えるようにスクロール（前後1行を含む）
   */
  scrollToSelection(ed: Editor, sel: EditorSelection): void {
    const [A, H] = [sel.anchor, sel.head];
    const lastLine = ed.lastLine();

    const aLine = A.line >= 1 ? A.line - 1 : A.line;
    const hLine = H.line <= lastLine - 1 ? H.line + 1 : H.line;

    ed.scrollIntoView({
      from: { line: aLine, ch: A.ch },
      to: { line: hLine, ch: H.ch },
    });
  }
}
