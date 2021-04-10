/**
 * リプレイス機能
 * @type {{test: RegExp, match: (function([], *): *)}[]}
 */
exports.replaces = [
  {
    test: /猫/g,
    match: ([], h) => {
      return h("span","🐈");
    }
  },
  {
    test: /掌/g,
    match: ([], h) => {
      return h("span","🖐");
    }
  },
];
