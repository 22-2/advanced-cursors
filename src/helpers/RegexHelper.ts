import type { Query } from "src/interfaces";

/**
 * 正規表現の作成と表示を行うヘルパー関数
 */

/**
 * クエリから正規表現を作成
 */
export function createRegex(q: Query): RegExp {
  if (q.regexQ) {
    let useFlags = q.flags.slice();
    if (!useFlags.includes("g")) {
      useFlags += "g";
    }
    return new RegExp(q.query, useFlags);
  } else {
    return new RegExp(q.query.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&"), "g");
  }
}

/**
 * 正規表現を文字列表現で表示
 */
export function displayRegex(q: Query): string {
  let { source, flags } = createRegex(q);
  flags = flags.replace("g", "");
  return `/${source}/${flags}`;
}

/**
 * クエリを表示用に整形
 */
export function displayQ(q: Query): string {
  return `${q.name} → ${displayRegex(q)}`;
}
