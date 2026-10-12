import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import CustomLayout from './components/CustomLayout.vue'
import NumberTrader from './components/NumberTrader.vue'
import PaTable from './components/PaTable.vue'
import NaviLocation from './components/NaviLocation.vue'
import './custom.css'

export default {
  extends: DefaultTheme,
  Layout: CustomLayout,
  enhanceApp({ app }) {
    app.component('NumberTrader', NumberTrader)
    app.component('PaTable', PaTable)
    app.component('NaviLocation', NaviLocation)
  }
} satisfies Theme