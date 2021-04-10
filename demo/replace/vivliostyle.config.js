module.exports = {
  title: 'preprocess demo',
  author: 'John Doe',
  language: 'ja',
  size: 'A4',
  entry: [
    {
      path:'bunko.md',
      theme: [
        '@vivliostyle/extends-emoji-replace'
      ]
    },
    {
      path:'030_firststep.md',
      theme: [
          './vivliostyle-theme-textbook',
      ]
    }
  ],
  output: 'replace_sample.pdf',
  workspaceDir: ".vivliostyle",
};
