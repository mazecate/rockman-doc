<template>
	<div class="chip-container">
		<div class="search-box">
			<input type="text" v-model="searchQuery" placeholder="搜尋編號、名稱、屬性 或 稀有度..." class="search-input" />
		</div>

		<table class="chip-table">
			<thead>
				<tr>
					<th>編號</th>
					<th>名稱</th>
					<th>威力</th>
					<th>屬性</th>
					<th>稀有度</th>
					<th>代碼</th>
				</tr>
			</thead>
			<tbody>
				<template v-for="chip in filteredChips" :key="chip.no">
					<tr>
						<td>No.{{ String(chip.no).padStart(3, '0') }}</td>
						<td>
							<span class="name-zh">{{ chip.nameZh }}</span>
							<!-- <span class="name-sub">({{ chip.nameJp }} / {{ chip.nameEn }})</span> -->
						</td>
						<td>{{ chip.damage }}</td>
						<td>
							<span :class="['element-badge', `element-${chip.element}`]">
								{{ chip.element }}
							</span>
						</td>
						<td class="rarity-cell">
							<span class="stars" :title="`稀有度: ${chip.rarity}`">
								{{ '★'.repeat(Number(chip.rarity) || 0) }}
							</span>
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
					<td colspan="6" class="no-result">沒有找到符合的晶片</td>
				</tr>
			</tbody>
		</table>
	</div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { ChipItem } from '../types/chip'

const props = defineProps<{
	chips: ChipItem[]
}>()

// 搜尋關鍵字
const searchQuery = ref('')

// 計算過濾後的晶片列表
const filteredChips = computed(() => {
	if (!searchQuery.value.trim()) {
		return props.chips
	}
	const query = searchQuery.value.toLowerCase().trim()
	return props.chips.filter(chip => {
		const noStr = String(chip.no)
		const paddedNoStr = String(chip.no).padStart(3, '0')
		return (
			noStr.includes(query) ||
			paddedNoStr.includes(query) ||
			chip.nameZh.toLowerCase().includes(query) ||
			chip.nameEn.toLowerCase().includes(query) ||
			chip.nameJp.toLowerCase().includes(query) ||
			chip.element.toLowerCase().includes(query) ||
			String(chip.rarity).includes(query)
		)
	})
})
</script>

<style scoped>
.chip-container {
	overflow-x: auto;
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

.search-input:focus {
	border-color: var(--vp-c-brand);
}

.chip-table {
	width: 100%;
	border-collapse: collapse;
	font-size: 0.95rem;
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

.name-sub {
	font-size: 0.85rem;
	color: var(--vp-c-text-2);
	margin-left: 4px;
}

.rarity-cell {
	white-space: nowrap;
}

.stars {
	color: #f59e0b; /* 金黃色星星 */
	letter-spacing: 1px;
}

.codes-cell {
	display: flex;
	flex-wrap: wrap;
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

.no-code {
	color: var(--vp-c-text-2);
}

.no-result {
	text-align: center;
	color: var(--vp-c-text-2);
	font-style: italic;
	padding: 20px;
}
</style>