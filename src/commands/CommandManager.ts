import type { App, Editor, Plugin } from "obsidian";
import type { Mode, Query } from "src/interfaces";
import { cmdId, cmdName } from "src/utils";
import { SelectionCommands } from "./SelectionCommands";
import { CursorCommands } from "./CursorCommands";
import { LineCommands } from "./LineCommands";

/**
 * コマンドの登録と管理を行うクラス
 */
export class CommandManager {
  constructor(
    private plugin: Plugin,
    private selectionCommands: SelectionCommands,
    private cursorCommands: CursorCommands,
    private lineCommands: LineCommands
  ) {}

  /**
   * 全てのコマンドを登録
   */
  registerAllCommands(): void {
    // 次/前のマッチに移動
    this.plugin.addCommand({
      id: "move-to-next-match",
      name: "Move to next instance of current selection",
      editorCallback: (ed: Editor) => 
        this.selectionCommands.selectInstance(ed, false, "Next"),
    });
    this.plugin.addCommand({
      id: "move-to-previous-match",
      name: "Move to previous instance of current selection",
      editorCallback: (ed: Editor) => 
        this.selectionCommands.selectInstance(ed, false, "Prev"),
    });

    // 次/前のマッチを選択範囲に追加
    this.plugin.addCommand({
      id: "add-next-match-to-selections",
      name: "Add next instance of current selection to selections",
      editorCallback: (ed: Editor) => 
        this.selectionCommands.selectInstance(ed, true, "Next"),
    });
    this.plugin.addCommand({
      id: "add-prev-match-to-selections",
      name: "Add previous instance of current selection to selections",
      editorCallback: (ed: Editor) => 
        this.selectionCommands.selectInstance(ed, true, "Prev"),
    });

    // 行をコピー
    this.plugin.addCommand({
      id: "copy-line-up",
      name: "Copy Current Line Upwards",
      editorCallback: (ed: Editor) => this.lineCommands.copyLineUp(ed),
    });
    this.plugin.addCommand({
      id: "copy-line-down",
      name: "Copy Current Line Downwards",
      editorCallback: (ed: Editor) => this.lineCommands.copyLineDown(ed),
    });

    // カーソルを追加
    this.plugin.addCommand({
      id: "add-cursor-above",
      name: "Add a cursor on the line above",
      editorCallback: (ed: Editor) => this.cursorCommands.addCursorAbove(ed),
    });
    this.plugin.addCommand({
      id: "add-cursor-below",
      name: "Add a cursor on the line below",
      editorCallback: (ed: Editor) => this.cursorCommands.addCursorBelow(ed),
    });
  }
}
