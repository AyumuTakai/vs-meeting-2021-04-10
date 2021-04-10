module.exports = {
  title: 'preprocess demo',
  author: 'John Doe',
  language: 'ja',
  size: 'A5',
  entry: [
    {
      path:'bunko.md',
      theme: [
        '@vivliostyle/theme-bunko',
        // '@vivliostyle/extends-openjtalk',
        // '@vivliostyle/extends-textlint',
      ]
    },
    {
      path: './chart.md',
      theme: [
        '@vivliostyle/theme-bunko',
        '@vivliostyle/extends-chart',
      ]
    }
  ],
  output: 'bunko.pdf',
  workspaceDir: ".vivliostyle",
};
