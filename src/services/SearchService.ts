import type { Editor } from "obsidian";
import type { Mode, Query } from "src/interfaces";
import { SelectionService } from "./SelectionService";
import { createRegex } from "../helpers/RegexHelper";

/**
 * 検索とマッチングを行うサービス
 */
export class SearchService {
  constructor(private selectionService: SelectionService) {}

  /**
   * 全てのマッチを検索
   */
  findAllMatches(content: string, query: Query): RegExpMatchArray[] {
    const regex = createRegex(query);
    return [...content.matchAll(regex)];
  }

  /**
   * 次/前の未選択マッチを検索
   */
  findNextNotSelected(
    ed: Editor,
    matches: RegExpMatchArray[],
    fromOffset: number,
    mode: Mode
  ): RegExpMatchArray | undefined {
    if (mode === "Next") {
      return (
        matches.find((m) => m.index > fromOffset) ??
        matches.find((m) => {
          const sel = this.selectionService.matchToSelection(ed, m);
          return m.index < fromOffset && !this.selectionService.isSelected(ed, sel);
        })
      );
    } else if (mode === "Prev") {
      return (
        matches.filter((m) => m.index < fromOffset).last() ??
        matches
          .filter((m) => {
            const sel = this.selectionService.matchToSelection(ed, m);
            return m.index > fromOffset && !this.selectionService.isSelected(ed, sel);
          })
          .last()
      );
    }
  }
}
