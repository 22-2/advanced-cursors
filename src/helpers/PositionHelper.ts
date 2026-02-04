import type { Editor, EditorPosition, EditorSelection, EditorSelectionOrCaret } from "obsidian";

/**
 * エディタ内での位置計算を行うヘルパークラス
 */
export class PositionHelper {
  /**
   * アンカーがヘッドより前にあるかどうかを判定
   */
  static isAnchorAheadOfHead(
    ed: Editor,
    sel: EditorSelection | EditorSelectionOrCaret
  ): boolean {
    return ed.posToOffset(sel.anchor) > ed.posToOffset(sel.head);
  }

  /**
   * 2つの位置を比較
   * @returns pos1がpos2より前なら負、同じなら0、後なら正
   */
  static comparePositions(
    ed: Editor,
    pos1: EditorPosition,
    pos2: EditorPosition
  ): number {
    return ed.posToOffset(pos1) - ed.posToOffset(pos2);
  }

  /**
   * 選択範囲が指定された位置オフセットの範囲内にあるかチェック
   */
  static isInRange(
    ed: Editor,
    sel: EditorSelection,
    fromOffset: number,
    toOffset: number
  ): boolean {
    const anchorOffset = ed.posToOffset(sel.anchor);
    const headOffset = ed.posToOffset(sel.head);
    const minOffset = Math.min(anchorOffset, headOffset);
    const maxOffset = Math.max(anchorOffset, headOffset);
    
    return minOffset >= fromOffset && maxOffset <= toOffset;
  }
}
