import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import CustomLayout from './components/CustomLayout.vue'
import NumberTrader from './components/NumberTrader.vue'
import PaTable from './components/PaTable.vue'
import NaviLocation from './components/NaviLocation.vue'
import ShopTable from './components/ShopTable.vue'
import PowerUpCycle from './components/PowerUpCycle.vue'
import ReferenceList from './components/ReferenceList.vue'
import StarChecklist from './components/StarChecklist.vue'
import SideQuest from './components/SideQuest.vue'
import './custom.css'

export default {
  extends: DefaultTheme,
  Layout: CustomLayout,
  enhanceApp({ app }) {
    app.component('NumberTrader', NumberTrader)
    app.component('PaTable', PaTable)
    app.component('NaviLocation', NaviLocation)
    app.component('ShopTable', ShopTable)
    app.component('PowerUpCycle', PowerUpCycle)
    app.component('ReferenceList', ReferenceList)
    app.component('StarChecklist', StarChecklist)
    app.component('SideQuest', SideQuest)
  }
} satisfies Theme