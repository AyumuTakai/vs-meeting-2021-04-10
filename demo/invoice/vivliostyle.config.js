module.exports = {
    title: '請求書発行サンプル',
    author: '森の切り株式会社',
    language: 'ja',
    size: 'A4',
    theme: [
        './theme',
    ],
    entry: [
        '202102.md',
        //'template.md',
    ],
    output: 'invoice.pdf',
    workspaceDir: ".workspace",
};