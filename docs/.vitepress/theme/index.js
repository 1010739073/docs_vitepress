import DefaultTheme from 'vitepress/theme';
import wheel from './components/wheel.vue'
import './custom.css';
// import './style.css' // 导入自定义 CSS

// export default DefaultTheme;
export default {
  ...DefaultTheme,
  enhanceApp({ app }) {
    app.component('wheel', wheel)
  }
}