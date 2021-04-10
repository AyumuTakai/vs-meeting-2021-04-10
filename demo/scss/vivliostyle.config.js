module.exports = {
  title: '寺田寅彦全集',
  author: '寺田寅彦',
  language: 'ja',
  size: 'A4',
  //theme: './theme',
  vars: {
    //layoutcheck: true,
  },
  entry: [
    {
      path:'frontpage.md',
      theme: './theme',
      vars: {
        frontpage: true,
        frontpageImage:"url(../../../frontpage.jpeg)",
      }
    },
    {
      path:'gengoto_dogu.md',
      theme: './theme',
      vars:{
        layoutGuide: true,
        page: 1,
        fontSize: 15,
        lineHeight: 25,
      }
    },
    {
      path:'sugakuto_gogaku.md',
      theme: './theme',
    }
  ],
  output: 'book.pdf',
  workspaceDir: '.vivliostyle',
};
