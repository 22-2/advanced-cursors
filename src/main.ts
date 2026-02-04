import {
  Editor,
  EditorPosition,
  EditorSelection,
  EditorSelectionOrCaret,
  Notice,
  Plugin,
  TextMarker
} from "obsidian";
import { saveViewSide } from "obsidian-community-lib";
import { IncrementingIModal } from "src/IncrementingIModal";
import type { ACSettings, Mode, Query } from "src/interfaces";
// import SavedQView from "src/SavedQView";
import { blankQ, cmdId, cmdName, roundNumber } from "src/utils";
import { DEFAULT_SETTINGS, MODES, VIEW_TYPE_AC } from "./const";
// import { CursorsModal } from "./CursorsModal";
import { ACSettingTab } from "./SettingTab";

// Services
import { EditorService } from "./services/EditorService";
import { SelectionService } from "./services/SelectionService";
import { SearchService } from "./services/SearchService";
import { ScrollService } from "./services/ScrollService";

// Commands
import { CommandManager } from "./commands/CommandManager";
import { SelectionCommands } from "./commands/SelectionCommands";
import { CursorCommands } from "./commands/CursorCommands";
import { LineCommands } from "./commands/LineCommands";

export default class ACPlugin extends Plugin {
  settings: ACSettings;
  // view: SavedQView;

  // Services
  private editorService: EditorService;
  private selectionService: SelectionService;
  private searchService: SearchService;
  private scrollService: ScrollService;

  // Commands
  private commandManager: CommandManager;
  private selectionCommands: SelectionCommands;
  private cursorCommands: CursorCommands;
  private lineCommands: LineCommands;

  async onload() {
    console.log("Loading advanced cursors");

    await this.loadSettings();

    // サービスの初期化
    this.editorService = new EditorService();
    this.selectionService = new SelectionService();
    this.searchService = new SearchService(this.selectionService);
    this.scrollService = new ScrollService();

    // コマンドの初期化
    this.selectionCommands = new SelectionCommands(
      this.editorService,
      this.selectionService,
      this.searchService,
      this.scrollService,
      this.settings,
      (msg: string) => new Notice(msg)
    );
    this.cursorCommands = new CursorCommands(this.selectionService);
    this.lineCommands = new LineCommands(this.editorService, this.scrollService);
    
    this.commandManager = new CommandManager(
      this,
      this.app,
      this.selectionCommands,
      this.cursorCommands,
      this.lineCommands
    );

    // 全コマンドを登録
    this.commandManager.registerAllCommands(this.settings.savedQueries);

    // Incrementing I コマンド
    this.addCommand({
      id: "write-incrementing-i",
      name: "Insert an incrementing value at each cursor",
      editorCallback: (ed) => {
        new IncrementingIModal(this.app, this, ed).open();
      },
    });

    // this.addCommand({
    //   id: "open-savedQ-view",
    //   name: "Open Saved Query View",
    //   callback: async () => {
    //     await openView(
    //       this.app,
    //       VIEW_TYPE_AC,
    //       SavedQView,
    //       this.settings.savedQViewSide
    //     );
    //   },
    // });

    // !SECTION Commands

    // this.registerView(
    //   VIEW_TYPE_AC,
    //   (leaf: WorkspaceLeaf) => (this.view = new SavedQView(leaf, this))
    // );
    // this.app.workspace.onLayoutReady(async () => {
    //   if (this.settings.openViewOnload) {
    //     await openView(
    //       this.app,
    //       VIEW_TYPE_AC,
    //       SavedQView,
    //       this.settings.savedQViewSide
    //     );
    //   }
    // });

    this.addSettingTab(new ACSettingTab(this.app, this));
  }

  /**
   * クエリコマンドを追加（設定画面から使用）
   */
  addQueryCommand(q: Query): void {
    this.commandManager.registerQueryCommands([q]);
  }

  /**
   * クエリコマンドを削除（設定画面から使用）
   */
  removeQueryCommand(q: Query): void {
    this.commandManager.unregisterQueryCommand(q);
  }

  async onunload() {
    await saveViewSide(this.app, this, VIEW_TYPE_AC, "savedQViewSide");
    this.app.workspace.detachLeavesOfType(VIEW_TYPE_AC);
  }

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }
}
