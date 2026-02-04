import type { App } from "obsidian";
import { DECIMALS, MODES } from "src/const";
import type { Mode, Query } from "src/interfaces";
// 正規表現関連の関数はRegexHelperに移動し、ここからre-export
import { displayQ as _displayQ } from "src/helpers/RegexHelper";
export { createRegex, displayRegex, displayQ } from "src/helpers/RegexHelper";

export const cmdId = (q: Query, mode: Mode) =>
  `AC-${mode}: ${q.name} -> ${q.query}`;
export const cmdName = (q: Query, mode: Mode) => `${mode}: ${_displayQ(q)}`;

export const removeQCmds = (app: App, q: Query) => {
  MODES.forEach((mode) => {
    app.commands.removeCommand("advanced-cursors:" + cmdId(q, mode));
  });
};

export function roundNumber(num: number, dec: number = DECIMALS): number {
  return Math.round(num * Math.pow(10, dec)) / Math.pow(10, dec);
}

export const blankQ = (query: string = "", regexQ: boolean = true): Query => {
  return { name: "", query, flags: "", regexQ };
};
