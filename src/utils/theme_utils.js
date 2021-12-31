const theme = {
  chalk: {
    // 背景颜色
    backgroundColor: '#161522',
    // 标题的文字颜色
    titleColor: '#ffffff',
    // 左上角logo的图标路径
    // logoSrc: 'logo_dark.png',
    // 切换主题按钮的图片路径
    themeSrc: 'qiehuan_dark.png',
    // 页面顶部的边框图片
    headerBorderSrc: 'https://s2.loli.net/2021/12/31/DJZSqdRcfa4oQye.png',
    selectColor: '#222733'
  },
  vintage: {
    // 背景颜色
    backgroundColor: '#eeeeee',
    // 标题的文字颜色
    titleColor: '#000000',
    // 左上角logo的图标路径
    // logoSrc: 'logo_light2.png',
    // 切换主题按钮的图片路径
    themeSrc: 'qiehuan_light.png',
    // 页面顶部的边框图片
    headerBorderSrc: 'https://s2.loli.net/2021/12/31/aGeLmPsn7vQ9M53.png',
    selectColor: '#FFFFFF'
  }
}

export function getThemeValue(themeName) {
  return theme[themeName]
}
