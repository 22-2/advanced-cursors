import type { Editor, EditorPosition, EditorSelection, EditorSelectionOrCaret } from "obsidian";
import { PositionHelper } from "src/helpers/PositionHelper";

/**
 * 選択範囲の管理と操作を行うサービス
 */
export class SelectionService {
  /**
   * 選択範囲を再構築（正規化）
   */
  reconstructSelections(sels: EditorSelectionOrCaret[]): EditorSelection[] {
    return sels.map((sel) => {
      const { anchor, head } = sel;
      return { anchor, head };
    });
  }

  /**
   * 正規表現マッチを選択範囲に変換
   */
  matchToSelection(
    ed: Editor,
    match: RegExpMatchArray,
    offset = 0
  ): EditorSelection {
    const fromOff = match.index + offset;
    const toOff = fromOff + match[0].length;

    const { line: lineA, ch: chA } = ed.offsetToPos(fromOff);
    const { line: lineH, ch: chH } = ed.offsetToPos(toOff);

    const anchor: EditorPosition = { ch: chA, line: lineA };
    const head: EditorPosition = { ch: chH, line: lineH };
    return { anchor, head };
  }

  /**
   * 選択範囲を設定（追加または置換）
   */
  setSelections(
    ed: Editor,
    newSels: EditorSelectionOrCaret[],
    append: boolean
  ): void {
    if (append) {
      const currSelections = ed.listSelections();
      const reconSelections = this.reconstructSelections([
        ...currSelections,
        ...newSels,
      ]);
      ed.setSelections(reconSelections);
    } else {
      const reconSelections = this.reconstructSelections([...newSels]);
      ed.setSelections(reconSelections);
    }
  }

  /**
   * 指定された選択範囲が既に選択されているかチェック
   */
  isSelected(ed: Editor, selection: EditorSelection): boolean {
    const [offA, offH] = [
      ed.posToOffset(selection.anchor),
      ed.posToOffset(selection.head),
    ];
    const matchingSels = ed
      .listSelections()
      .filter(
        (sel) =>
          ed.posToOffset(sel.anchor) === offA &&
          ed.posToOffset(sel.head) === offH
      );
    return !!matchingSels.length;
  }
}
