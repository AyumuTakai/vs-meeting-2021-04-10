module.exports = {
  title: 'Vivliostyle-cliへの新機能の提案',
  author: 'Ayumu Takai',
  language: 'ja',
  size: 'A4 landscape',
  theme: [
      '@vivliostyle/theme-slide',
      'custom-theme'
  ],
  entry: [
    'manuscript.md',
    // 'manu2.md',
  ],
  output: 'slide.pdf',
  workspaceDir: ".vivliostyle",
  // toc:true,
};
