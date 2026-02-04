import type { Editor, EditorPosition, EditorSelection } from "obsidian";
import { PositionHelper } from "src/helpers/PositionHelper";

/**
 * エディタ操作を抽象化するサービス
 * CM5/CM6の違いを吸収し、統一的なインターフェースを提供
 */
export class EditorService {
  /**
   * 選択範囲の行を取得
   */
  getLinesOfSelection(ed: Editor): string[] {
    const [from, to] = [ed.getCursor("from"), ed.getCursor("to")];
    const [fromLine, toLine] = [from.line, to.line];

    const lines: string[] = [];
    for (let i = fromLine; i <= toLine; i++) {
      lines.push(ed.getLine(i));
    }
    return lines;
  }

  /**
   * カーソル位置の単語を取得（CM5/CM6対応）
   */
  getWordAtCursor(ed: Editor): {
    word: string;
    wordA: EditorPosition | undefined;
    wordH: EditorPosition | undefined;
  } {
    let word: string, wordH: EditorPosition, wordA: EditorPosition;

    try {
      const cursor = ed.getCursor();
      
      if (ed.cm?.findWordAt) {
        // CM5
        const wordRange = ed.cm.findWordAt(cursor);
        [wordA, wordH] = [wordRange.anchor, wordRange.head];
        word = ed.getRange(wordA, wordH);
      } else if (ed.cm?.viewState.state.wordAt) {
        // CM6
        const cursorOff = ed.posToOffset(cursor);
        const wordObj = ed.cm.viewState.state.wordAt(cursorOff);
        
        if (wordObj !== null) {
          const { from, to } = wordObj;
          [wordA, wordH] = [ed.offsetToPos(from), ed.offsetToPos(to)];
          word = ed.getRange(wordA, wordH);
        } else {
          const { length } = ed.getValue();
          if (length === 0) {
            // 空のドキュメント
            const start = { line: 0, ch: 0 };
            return { word: "", wordA: start, wordH: start };
          } else if (cursorOff < length) {
            [wordA, wordH] = [cursor, ed.offsetToPos(cursorOff + 1)];
            word = ed.getRange(wordA, wordH);
          } else {
            // ドキュメントの末尾
            [wordA, wordH] = [ed.offsetToPos(cursorOff - 1), cursor];
            word = ed.getRange(wordA, wordH);
          }
        }
      } else {
        throw new Error("Cannot determine if cm5 or cm6");
      }
      
      if (PositionHelper.isAnchorAheadOfHead(ed, { anchor: wordA, head: wordH })) {
        return { word, wordA: wordH, wordH: wordA };
      }
      return { word, wordA, wordH };
    } catch (error) {
      console.log(error);
      return { word: "", wordA: undefined, wordH: undefined };
    }
  }

  /**
   * 選択されているテキストを取得
   * 何も選択されていない場合はカーソル位置の単語を返す
   */
  getSelectedOrWordAtCursor(ed: Editor): {
    text: string;
    wordA: EditorPosition | undefined;
    wordH: EditorPosition | undefined;
  } {
    const { anchor, head } = ed.listSelections().last();
    
    // 最後の選択範囲に何か選択されている場合
    if (!(anchor.line === head.line && anchor.ch === head.ch)) {
      const text =
        ed.posToOffset(anchor) < ed.posToOffset(head)
          ? ed.getRange(anchor, head)
          : ed.getRange(head, anchor);
      return { text, wordA: undefined, wordH: undefined };
    }

    // 何も選択されていない場合はカーソル位置の単語を取得
    const { word, wordA, wordH } = this.getWordAtCursor(ed);
    return { text: word, wordA, wordH };
  }
}
