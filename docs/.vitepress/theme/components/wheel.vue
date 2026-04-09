<template>
  <div class="wheel-app">
    <div class="meal-tabs">
      <button 
        v-for="tab in mealPresets" 
        :key="tab.type"
        :class="['tab-item', { active: currentMealType === tab.type }]"
        @click="switchMeal(tab.type)"
      >
        <span class="tab-icon">{{ tab.icon }}</span>
        {{ tab.label }}
        <span v-if="currentMealType === tab.type" class="time-tag">现在</span>
      </button>
    </div>

    <div class="main-content">
      <h2 class="title">🤔 {{ currentMealLabel }}吃什么？</h2>

      <div class="wheel-wrapper">
        <div class="pointer"></div>
        <div
          class="wheel"
          :style="{ 
            transform: `rotate(${deg}deg)`, 
            background: wheelBackground,
            transition: transitionActive ? 'transform 4s cubic-bezier(0.1, 0, 0.1, 1)' : 'none'
          }"
          @transitionend="onTransitionEnd"
        >
          <div
            v-for="(slice, index) in wheelSlices"
            :key="index"
            :class="['slice-container', { 'is-active': activeIndex === index }]"
            :style="getSliceStyle(slice)"
            @click.stop="handleSliceClick(index, slice)"
          >
            <span class="text" :style="getTextStyle(slice)">
              {{ slice.name }}
            </span>
          </div>
        </div>
      </div>

      <button 
        :class="['spin-btn', { spinning: isSpinning }]" 
        :disabled="isSpinning || currentFoods.length === 0" 
        @click="spin"
      >
        {{ isSpinning ? '命运抉择中...' : '开始抽取 🎡' }}
      </button>
      
      <div class="result-box">
        <transition name="fade">
          <p v-if="result && !isSpinning" class="result">
            🎉 建议去吃：<span>{{ result }}</span> 🎉
          </p>
        </transition>
      </div>
    </div>

    <button class="config-toggle" @click="showDrawer = true">⚙️</button>

    <div :class="['drawer-mask', { active: showDrawer }]" @click.self="showDrawer = false">
      <div :class="['drawer-content', { open: showDrawer }]">
        <div class="drawer-header">
          <h3>⚙️ 清单管理</h3>
          <button @click="showDrawer = false">✕</button>
        </div>
        <div class="drawer-body">
          <div class="add-form">
            <input v-model="newItemName" type="text" placeholder="食物" @keyup.enter="addItem" />
            <input v-model.number="newItemWeight" type="number" placeholder="权重" @keyup.enter="addItem" />
            <button @click="addItem">添加</button>
          </div>
          <div class="list-container">
            <div v-for="(item, index) in currentFoods" :key="index" class="list-item">
              <span class="color-dot" :style="{ backgroundColor: getSliceColor(index) }"></span>
              <input v-model="item.name" class="edit-name" />
              <input v-model.number="item.weight" type="number" class="edit-weight" />
              <button @click="removeItem(index)">❌</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'

const mealPresets = [
  { type: 'breakfast', label: '早餐', icon: '🥟', default: [{ name: '包子豆浆', weight: 10 }, { name: '油条', weight: 8 }, { name: '煎饼', weight: 8 }, { name: '糊辣汤', weight: 5 }]},
  { type: 'lunch', label: '午餐', icon: '🍚', default: [{ name: '黄焖鸡', weight: 10 }, { name: '麻辣烫', weight: 10 }, { name: '拉面', weight: 8 }, { name: '麦当劳', weight: 6 }, { name: '猪脚饭', weight: 8 }]},
  { type: 'dinner', label: '晚餐', icon: '🥘', default: [{ name: '火锅', weight: 8 }, { name: '烧烤', weight: 8 }, { name: '自煮', weight: 12 }, { name: '减肥', weight: 1 }]}
]

const currentMealType = ref('lunch')
const allMealData = ref(Object.fromEntries(mealPresets.map(m => [m.type, m.default])))
const deg = ref(0)
const transitionActive = ref(true)
const result = ref('')
const isSpinning = ref(false)
const showDrawer = ref(false)
const newItemName = ref('')
const newItemWeight = ref(5)
const activeIndex = ref(-1)

onMounted(() => {
  const hour = new Date().getHours()
  if (hour >= 6 && hour < 11) currentMealType.value = 'breakfast'
  else if (hour >= 11 && hour < 17) currentMealType.value = 'lunch'
  else currentMealType.value = 'dinner'
  
  document.addEventListener('click', () => { activeIndex.value = -1 })
})

const currentFoods = computed(() => allMealData.value[currentMealType.value])
const currentMealLabel = computed(() => mealPresets.find(m => m.type === currentMealType.value).label)

const wheelSlices = computed(() => {
  const foods = currentFoods.value
  const totalW = foods.reduce((sum, item) => sum + (Number(item.weight) || 0), 0)
  let currentAngle = 0
  return foods.map((item, index) => {
    const weight = Number(item.weight) || 0
    const sliceAngle = (weight / (totalW || 1)) * 360
    const hue = (index * (360 / Math.max(foods.length, 1))) % 360
    const res = { ...item, color: `hsl(${hue}, 75%, 85%)`, sliceAngle, startAngle: currentAngle, midAngle: currentAngle + sliceAngle / 2, endAngle: currentAngle + sliceAngle }
    currentAngle += sliceAngle
    return res
  })
})

const wheelBackground = computed(() => {
  const gradients = wheelSlices.value.map(s => `${s.color} ${s.startAngle}deg ${s.endAngle}deg`)
  return `conic-gradient(${gradients.join(', ')})`
})

async function switchMeal(type) {
  if (isSpinning.value) return
  transitionActive.value = false
  deg.value = deg.value % 360
  await nextTick()
  currentMealType.value = type
  deg.value = 0
  result.value = ''
  activeIndex.value = -1
  setTimeout(() => { transitionActive.value = true }, 50)
}

function spin() {
  if (isSpinning.value || !currentFoods.value.length) return
  isSpinning.value = true; result.value = ''; activeIndex.value = -1
  const totalW = currentFoods.value.reduce((sum, item) => sum + (Number(item.weight) || 0), 0)
  const randomNum = Math.random() * totalW
  let currentSum = 0, winningSlice = null
  for (const s of wheelSlices.value) {
    currentSum += s.weight
    if (randomNum <= currentSum) { winningSlice = s; break }
  }
  const baseSpins = 6 * 360
  const targetAngle = 360 - (winningSlice.midAngle % 360)
  deg.value = deg.value + baseSpins + ((targetAngle - (deg.value % 360) + 360) % 360)
  window.__pending = winningSlice.name
}

const onTransitionEnd = () => { isSpinning.value = false; result.value = window.__pending }

// 修复：位移由百分比改为基于转盘半径的计算值
function getSliceStyle(s) {
  return { 
    transform: `translate(-50%, -50%) rotate(${s.midAngle}deg)` 
  }
}

function getTextStyle(s) { 
  // 基础半径 210px，文字放在 140px 处左右
  return { 
    fontSize: `${Math.max(12, Math.min(16, s.sliceAngle / 2.2))}px`, 
    opacity: s.sliceAngle < 10 ? 0 : 1,
    top: '-140px' 
  } 
}

function handleSliceClick(index, s) {
  activeIndex.value = index
  if (s.sliceAngle < 10) {
    result.value = `选中了：${s.name}`
  }
}

function getSliceColor(i) { return `hsl(${(i * (360 / currentFoods.value.length)) % 360}, 75%, 85%)` }
function addItem() { if (newItemName.value.trim()) { currentFoods.value.push({ name: newItemName.value, weight: newItemWeight.value || 1 }); newItemName.value = ''; newItemWeight.value = 5 } }
function removeItem(i) { currentFoods.value.splice(i, 1) }
</script>

<style scoped>
.wheel-app {
  display: flex; flex-direction: column; align-items: center;
  padding: 20px; background: #fdfdfd; min-height: 100vh;
  font-family: -apple-system, sans-serif;
}

.meal-tabs { display: flex; background: #f1f1f1; padding: 4px; border-radius: 12px; margin: 10px 0 25px; }
.tab-item { border: none; padding: 10px 20px; border-radius: 10px; cursor: pointer; background: transparent; color: #666; font-weight: bold; position: relative; font-size: 14px;}
.tab-item.active { background: #fff; color: #ff4757; box-shadow: 0 4px 10px rgba(0,0,0,0.05); }

.main-content { display: flex; flex-direction: column; align-items: center; width: 100%; }
.title { color: #2f3542; margin-bottom: 25px; font-size: 1.4rem; }

.wheel-wrapper { 
  position: relative; 
  width: 420px; height: 420px; 
  max-width: 85vw; max-height: 85vw;
  margin-bottom: 30px; 
}

.pointer { 
  position: absolute; top: -15px; left: 50%; transform: translateX(-50%); 
  width: 0; height: 0; border-left: 15px solid transparent; 
  border-right: 15px solid transparent; border-top: 28px solid #ff4757; 
  z-index: 10; 
}

.wheel { 
  width: 100%; height: 100%; border-radius: 50%; border: 6px solid #fff; 
  box-shadow: 0 10px 40px rgba(0,0,0,0.1); position: relative; overflow: hidden; 
}

/* 修复后的扇形文字容器 */
.slice-container { 
  position: absolute; 
  top: 50%; 
  left: 50%; 
  width: 2px; /* 给一个极小的宽度，确保子元素渲染 */
  height: 2px;
  display: flex;
  justify-content: center;
  z-index: 2;
}

.text { 
  position: absolute;
  font-weight: 800; 
  color: #333; 
  white-space: nowrap; 
  transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.2s; 
  max-width: 120px; 
  overflow: hidden; 
  text-overflow: ellipsis; 
  transform: translateY(-50%); /* 确保在轨道线上垂直居中 */
  pointer-events: auto;
}

/* 激活状态/悬停状态放大 */
.slice-container.is-active .text,
.slice-container:hover .text { 
  opacity: 1 !important;
  transform: translateY(-50%) scale(1.7) !important;
  text-shadow: 0 2px 5px rgba(0,0,0,0.2);
  color: #000;
  z-index: 100;
}

.spin-btn { background: #ff4757; color: #fff; border: none; padding: 14px 70px; font-size: 1.2rem; border-radius: 50px; cursor: pointer; font-weight: bold; box-shadow: 0 8px 20px rgba(255,71,87,0.3); }
.result-box { height: 60px; margin-top: 20px; text-align: center; }
.result { font-size: 20px; font-weight: bold; }
.result span { color: #ff4757; font-size: 26px; }

.config-toggle {
  position: fixed; right: 20px; bottom: 20px; width: 55px; height: 55px;
  border-radius: 50%; background: #fff; border: none; font-size: 24px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1); z-index: 99; 
}

/* 抽屉样式保持原有逻辑 */
.drawer-mask { position: fixed; inset: 0; background: rgba(0,0,0,0.4); opacity: 0; visibility: hidden; transition: 0.3s; z-index: 1000; }
.drawer-mask.active { opacity: 1; visibility: visible; }
.drawer-content { position: absolute; right: -320px; top: 0; bottom: 0; width: 300px; background: #fff; padding: 25px; transition: 0.3s; display: flex; flex-direction: column; }
.drawer-content.open { right: 0; }
.drawer-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
.add-form { display: flex; gap: 5px; margin-bottom: 15px; }
.add-form input { padding: 8px; border: 1px solid #ddd; border-radius: 6px; flex: 1; min-width: 0; }
.add-form button { background: #2f3542; color: #fff; border: none; padding: 0 12px; border-radius: 6px; }
.list-container { flex: 1; overflow-y: auto; }
.list-item { display: flex; align-items: center; gap: 8px; padding: 10px; background: #f9f9f9; margin-bottom: 8px; border-radius: 8px; }
.color-dot { width: 8px; height: 8px; border-radius: 50%; }
.edit-name { border: none; background: transparent; flex: 1; font-size: 14px; }
.edit-weight { width: 35px; border: 1px solid #eee; text-align: center; }

@media (max-width: 600px) {
  .drawer-content { right: 0; bottom: -70vh; top: auto; width: 100%; height: 70vh; border-radius: 20px 20px 0 0; }
  .drawer-content.open { bottom: 0; }
  /* 移动端减小文字轨道偏移量以匹配较小的转盘 */
  .text { top: -30vw !important; } 
}
</style>