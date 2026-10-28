<!-- src/components/ChipTable.vue -->
<template>
	<div class="chip-container">
		<div class="search-box">
			<input 
				type="text" 
				v-model="searchQuery" 
				placeholder="搜尋編號、名稱、屬性、代碼或說明..." 
				class="search-input" 
			/>
		</div>

		<div class="table-scroll-wrapper">
			<div class="table-scroll-inner">
				<table class="chip-table">
					<thead>
						<tr>
							<th>編號</th>
							<th>名稱</th>
							<th>威力</th>
							<th>屬性</th>
							<th v-if="hasMemory">容量</th>
							<th v-if="hasRarity">稀有度</th>
							<th>說明</th>
							<th>代碼</th>
						</tr>
					</thead>
					<tbody>
						<template v-for="chip in filteredChips" :key="chip.no">
							<tr>
								<td>No.{{ String(chip.no).padStart(3, '0') }}</td>
								<td>
									<span class="name-zh">{{ chip.nameZh }}</span>
								</td>
								<td>{{ chip.damage }}</td>
								<td>
									<span :class="['element-badge', `element-${getElementMeta(chip.element).key}`]">
										<span class="element-icon">{{ getElementMeta(chip.element).icon }}</span>
										{{ chip.element }}
									</span>
								</td>
								<!-- Memory 內容 -->
								<td v-if="hasMemory">
									{{ 'memory' in chip && chip.memory !== undefined ? chip.memory : '-' }}
								</td>
								<!-- 稀有度內容 -->
								<td v-if="hasRarity" class="rarity-cell">
									<span class="stars" v-if="'rarity' in chip && chip.rarity" :title="`稀有度: ${chip.rarity}`">
										{{ '★'.repeat(Number(chip.rarity) || 0) }}
									</span>
									<span v-else>-</span>
								</td>
								<!-- 說明內容 -->
								<td class="description-cell">
									{{ chip.description || '-' }}
								</td>
								<td>
									<div v-if="chip.codes && chip.codes.length > 0" class="codes-cell">
										<span v-for="code in chip.codes" :key="code" class="code-tag">{{ code }}</span>
									</div>
									<span v-else class="no-code">-</span>
								</td>
							</tr>
						</template>
						<tr v-if="filteredChips.length === 0">
							<!-- 根據顯示的總 Column 數量動態計算 colspan -->
							<td :colspan="totalColumns" class="no-result">沒有找到符合的晶片</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { ChipItem } from '../types/chip'

const props = defineProps<{
	chips: ChipItem[]
}>()

const searchQuery = ref('')

const getElementMeta = (element?: string) => {
	const val = element?.trim().toLowerCase();
    switch (val) {
        case '水':
        case 'Aqua':
            return { key: 'aqua', icon: '💧', label: element };
        case '火':
        case 'Heat':
            return { key: 'heat', icon: '🔥', label: element };
        case '木':
        case 'Wood':
            return { key: 'wood', icon: '🌿', label: element };
        case '電':
        case 'Elec':
            return { key: 'elec', icon: '⚡', label: element };
        case '無':
        case 'Null':
        default:
            return { key: 'null', icon: '⚪', label: element || '-' };
    }
}

// 安全自動偵測是否有 memory 欄位
const hasMemory = computed(() => {
	return props.chips.some(chip => 'memory' in chip && chip.memory !== undefined)
})

// 安全自動偵測是否有 rarity 欄位
const hasRarity = computed(() => {
	// return props.chips?.some(chip => 'rarity' in chip && chip.rarity !== undefined) ?? false
	return props.chips.some(chip => 'rarity' in chip && chip.rarity !== undefined)
})

// 計算表格的動態總欄數（確保無結果時的 colspan 樣式正確）
const totalColumns = computed(() => {
	let count = 6 // 基本 5 欄: 編號, 名稱, 威力, 屬性, 說明, 代碼 (基礎 6 欄)
	if (hasMemory.value) count++
	if (hasRarity.value) count++
	return count;
})

// 計算過濾後的晶片列表 (包含防護空值的搜尋邏輯)
const filteredChips = computed(() => {
	if (!props.chips) return []
	
	const query = searchQuery.value.toLowerCase().trim()
	if (!query) return props.chips

	return props.chips.filter(chip => {
		const noStr = String(chip.no ?? '')
		const paddedNoStr = String(chip.no ?? '').padStart(3, '0')
		
		// 比對代碼陣列 (例: ["A", "B", "*"])
		const matchesCode = chip.codes?.some(code => code.toLowerCase().includes(query)) ?? false

		return (
			noStr.includes(query) ||
			paddedNoStr.includes(query) ||
			(chip.nameZh?.toLowerCase().includes(query) ?? false) ||
			(chip.nameEn?.toLowerCase().includes(query) ?? false) ||
			(chip.nameJp?.toLowerCase().includes(query) ?? false) ||
			(chip.element?.toLowerCase().includes(query) ?? false) ||
			(chip.description?.toLowerCase().includes(query) ?? false) ||
			('rarity' in chip && String(chip.rarity ?? '').includes(query)) ||
			('memory' in chip && String(chip.memory ?? '').toLowerCase().includes(query)) ||
			matchesCode
		)
	})
})
</script>

<style scoped>
.chip-container {
	/* overflow-x: auto; */
	margin: 1rem 0;
}
.search-box {
	margin-bottom: 1rem;
}
.search-input {
	width: 100%;
	padding: 8px 12px;
	font-size: 0.95rem;
	border: 1px solid var(--vp-c-divider);
	border-radius: 6px;
	background-color: var(--vp-c-bg-alt);
	color: var(--vp-c-text-1);
	outline: none;
	transition: border-color 0.2s;
}

.table-scroll-wrapper {
	position: relative;
	overflow: hidden;
}
@media (max-width: 767px) {
	.table-scroll-wrapper::before {
		content: "";
		position: absolute;
		top: 0;
		right: 0;
		width: 20px;
		height: 100%;
		pointer-events: none;
		z-index: 2;
		box-shadow: inset -15px 0 15px -10px rgba(176, 161, 161, 0.15); 
	}
}
.table-scroll-inner {
	overflow-x: auto;
}
.chip-table {
	width: 100%;
	border-collapse: collapse;
	font-size: 0.95rem;
	white-space: nowrap;
	margin-top: 0px !important;
}
.chip-table th,
.chip-table td {
	padding: 10px 14px;
	border-bottom: 1px solid var(--vp-c-divider);
	text-align: left;
}
.chip-table th {
	background-color: var(--vp-c-bg-alt);
	font-weight: 600;
}
.name-zh {
	font-weight: bold;
}
.rarity-cell {
	white-space: nowrap;
}
.description-cell {
	/* max-width: 250px; */
	font-size: 0.9rem;
	color: var(--vp-c-text-2);
}
.stars {
	color: #f59e0b;
	letter-spacing: 1px;
}
.codes-cell {
	display: flex;
	flex-wrap: nowrap;
	gap: 4px;
}
.code-tag {
	display: inline-block;
	padding: 2px 6px;
	background: var(--vp-c-brand-soft);
	color: var(--vp-c-brand);
	border-radius: 4px;
	font-weight: bold;
	font-size: 0.85rem;
}
.no-code, .no-result {
	color: var(--vp-c-text-2);
}
.no-result {
	text-align: center;
	font-style: italic;
	padding: 20px;
}

.element-badge {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 2px 8px;
    border-radius: 4px;
    font-size: 0.85rem;
    font-weight: bold;
}

/* 依照不同屬性給予不同的顏色主題 */
.element-elec {
    background-color: rgba(234, 179, 8, 0.15);
    color: #eab308; /* 黃色系 */
}

.element-wood {
    background-color: rgba(34, 197, 94, 0.15);
    color: #22c55e; /* 綠色系 */
}

.element-heat {
    background-color: rgba(239, 68, 68, 0.15);
    color: #ef4444; /* 紅色系 */
}

.element-aqua {
    background-color: rgba(59, 130, 246, 0.15);
    color: #3b82f6; /* 藍色系 */
}

.element-null {
    background-color: var(--vp-c-bg-alt);
    color: var(--vp-c-text-2); /* 中性灰色 */
}
</style>