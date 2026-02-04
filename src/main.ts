import {
  Notice,
  Plugin
} from "obsidian";
// import { IncrementingIModal } from "src/IncrementingIModal";
// import SavedQView from "src/SavedQView";
// import { CursorsModal } from "./CursorsModal";

// Services
import { EditorService } from "./services/EditorService";
import { ScrollService } from "./services/ScrollService";
import { SearchService } from "./services/SearchService";
import { SelectionService } from "./services/SelectionService";

// Commands
import { CommandManager } from "./commands/CommandManager";
import { CursorCommands } from "./commands/CursorCommands";
import { LineCommands } from "./commands/LineCommands";
import { SelectionCommands } from "./commands/SelectionCommands";

export default class ACPlugin extends Plugin {

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
      (msg: string) => new Notice(msg)
    );
    this.cursorCommands = new CursorCommands(this.selectionService);
    this.lineCommands = new LineCommands(this.editorService, this.scrollService);
    this.commandManager = new CommandManager(
      this,
      this.selectionCommands,
      this.cursorCommands,
      this.lineCommands
    );

    // 全コマンドを登録
    this.commandManager.registerAllCommands();
  }
}
