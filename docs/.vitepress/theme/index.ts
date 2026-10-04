import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import CustomLayout from './components/CustomLayout.vue'
import NumberTrader from './components/NumberTrader.vue'
import PaTable from './components/PaTable.vue'
import './custom.css'

export default {
  extends: DefaultTheme,
  Layout: CustomLayout,
  enhanceApp({ app }) {
    app.component('NumberTrader', NumberTrader)
    app.component('PaTable', PaTable)
  }
} satisfies Theme