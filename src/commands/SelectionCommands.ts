import type { Editor } from "obsidian";
import type { Mode } from "src/interfaces";
import { EditorService } from "src/services/EditorService";
import { ScrollService } from "src/services/ScrollService";
import { SearchService } from "src/services/SearchService";
import { SelectionService } from "src/services/SelectionService";
import { blankQ } from "src/utils";

/**
 * 選択範囲操作コマンドを提供するクラス
 */
export class SelectionCommands {
  constructor(
    private editorService: EditorService,
    private selectionService: SelectionService,
    private searchService: SearchService,
    private scrollService: ScrollService,
    private showNotice: (message: string) => void
  ) {}

  /**
   * インスタンスを選択（次/前/全て）
   */
  selectInstance(
    ed: Editor,
    appendQ: boolean,
    mode: Mode,
  ): void {
    const { text, wordA, wordH } = this.editorService.getSelectedOrWordAtCursor(ed);
    
    // カーソル下の単語を選択
    if (!ed.somethingSelected()) {
      ed.setSelection(wordA, wordH);
      return;
    }

    const q = blankQ(text, false);

    let content = ed.getValue();
    let matches = this.searchService.findAllMatches(content, q);

    if (mode === "All") {
      let offset = 0;
      if (ed.somethingSelected()) {
        offset = ed.posToOffset(ed.getCursor("from"));
        const currSel = ed.getSelection();
        matches = this.searchService.findAllMatches(currSel, q);
      }
      const nextSels = matches.map((m) => 
        this.selectionService.matchToSelection(ed, m, offset)
      );
      this.selectionService.setSelections(ed, nextSels, appendQ);
      
      return;
    }

    const latestSel =
      mode === "Next"
        ? ed.listSelections().last()
        : ed.listSelections().first();

    const lastPos = latestSel[mode === "Next" ? "head" : "anchor"];
    const fromOffset = ed.posToOffset(lastPos);

    const match = this.searchService.findNextNotSelected(ed, matches, fromOffset, mode);
    const toSelect = match?.[0] ?? text;

    if (match !== undefined) {
      const nextSel = this.selectionService.matchToSelection(ed, match);
      this.selectionService.setSelections(ed, [nextSel], appendQ);
      this.scrollService.scrollToSelection(ed, nextSel);
    } else {
      this.showNotice(`No more matches for "${toSelect}".`);
    }
  }
}
