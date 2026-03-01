/**
 * 现代化高级感卡片主题配色
 */
const themes = {
  light: {
    bg: '#ffffff',
    bgFrame: '#f7f9fa',
    border: '#ebedf0',
    title: '#1b1f23',
    text: '#57606a',
    textSecondary: '#8c959f',

    // 主色调：高级明快橘色、紫色、青色
    learnMain: '#ff7b00',
    learnLight: '#fff0e5',
    reviewMain: '#9e5ce6',
    reviewLight: '#f6efff',
    durationMain: '#e52e71',
    durationLight: '#fdeef2',

    // 大卡片专属极光渐变
    gradStart: '#ff8a00',
    gradEnd: '#e52e71',

    gridLine: '#f0f2f5',
    shadow: 'rgba(0,0,0,0.04)',
    chartShadow: 'rgba(0,0,0,0.02)',
    dotBg: '#ffffff'
  },
  dark: {
    bg: '#0d1117',
    bgFrame: '#161b22',
    border: '#30363d',
    title: '#c9d1d9',
    text: '#8b949e',
    textSecondary: '#6e7681',

    learnMain: '#ff9c2a',
    learnLight: '#3a2107',
    reviewMain: '#bb80ff',
    reviewLight: '#2c1e40',
    durationMain: '#ff629a',
    durationLight: '#3d1624',

    gradStart: '#ff8a00',
    gradEnd: '#e52e71',

    gridLine: '#21262d',
    shadow: 'transparent',
    chartShadow: 'transparent',
    dotBg: '#0d1117'
  },
};

function getTheme(name) {
  return themes[name] || themes.light;
}

module.exports = { themes, getTheme };
