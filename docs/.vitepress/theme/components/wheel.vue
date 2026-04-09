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
        <span class="tab-label">{{ tab.label }}</span>
        <span v-if="tab.type === recommendedType" class="time-tag">现在</span>
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
const recommendedType = ref('') // 记录系统时间推荐的类型
const allMealData = ref(Object.fromEntries(mealPresets.map(m => [m.type, m.default])))
const deg = ref(0)
const transitionActive = ref(true)
const result = ref('')
const isSpinning = ref(false)
const showDrawer = ref(false)
const newItemName = ref('')
const newItemWeight = ref(5)
const activeIndex = ref(-1)

// 获取当前时间应该吃什么的逻辑
const getRecommendedMeal = () => {
  const hour = new Date().getHours()
  if (hour >= 6 && hour < 11) return 'breakfast'
  if (hour >= 11 && hour < 17) return 'lunch'
  return 'dinner'
}

onMounted(() => {
  recommendedType.value = getRecommendedMeal()
  currentMealType.value = recommendedType.value // 初始化进入对应的 Tab
  
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

function getSliceStyle(s) { return { transform: `translate(-50%, -50%) rotate(${s.midAngle}deg)` } }

function getTextStyle(s) { 
  return { 
    fontSize: `${Math.max(12, Math.min(16, s.sliceAngle / 2.2))}px`, 
    opacity: s.sliceAngle < 10 ? 0 : 1,
    top: '-140px' 
  } 
}

function handleSliceClick(index, s) {
  activeIndex.value = index
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

/* 修复：恢复最初版本的 Tab 样式 */
.meal-tabs { 
  display: flex; 
  background: #f1f1f1; 
  padding: 5px; 
  border-radius: 15px; 
  margin: 10px 0 30px;
  box-shadow: inset 0 2px 4px rgba(0,0,0,0.05);
}
.tab-item { 
  border: none; 
  padding: 10px 24px; 
  border-radius: 12px; 
  cursor: pointer; 
  background: transparent; 
  color: #777; 
  font-weight: bold; 
  position: relative; 
  font-size: 15px;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.3s ease;
}
.tab-item.active { 
  background: #fff; 
  color: #ff4757; 
  box-shadow: 0 4px 12px rgba(0,0,0,0.08); 
}
.time-tag { 
  position: absolute; 
  top: -8px; 
  right: -5px; 
  background: #2ed573; 
  color: #fff; 
  font-size: 10px; 
  padding: 2px 6px; 
  border-radius: 6px;
  box-shadow: 0 2px 4px rgba(46, 213, 115, 0.3);
  font-weight: normal;
}

.main-content { display: flex; flex-direction: column; align-items: center; width: 100%; }
.title { color: #2f3542; margin-bottom: 25px; font-size: 1.5rem; font-weight: 800; }

.wheel-wrapper { 
  position: relative; 
  width: 420px; height: 420px; 
  max-width: 85vw; max-height: 85vw;
  margin-bottom: 40px; 
}

.pointer { 
  position: absolute; top: -15px; left: 50%; transform: translateX(-50%); 
  width: 0; height: 0; border-left: 16px solid transparent; 
  border-right: 16px solid transparent; border-top: 30px solid #ff4757; 
  z-index: 10; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2));
}

.wheel { 
  width: 100%; height: 100%; border-radius: 50%; border: 8px solid #fff; 
  box-shadow: 0 12px 50px rgba(0,0,0,0.12); position: relative; overflow: hidden; 
}

.slice-container { 
  position: absolute; 
  top: 50%; 
  left: 50%; 
  width: 4px; height: 4px;
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
  transform: translateY(-50%);
}

.slice-container.is-active .text,
.slice-container:hover .text { 
  opacity: 1 !important;
  transform: translateY(-50%) scale(1.75) !important;
  text-shadow: 0 2px 8px rgba(0,0,0,0.2);
  color: #000;
  z-index: 100;
}

.spin-btn { 
  background: #ff4757; color: #fff; border: none; padding: 16px 80px; 
  font-size: 1.25rem; border-radius: 50px; cursor: pointer; font-weight: bold; 
  box-shadow: 0 10px 25px rgba(255,71,87,0.35); transition: 0.3s;
}
.spin-btn:active { transform: scale(0.96); }

.result-box { height: 70px; margin-top: 25px; text-align: center; }
.result { font-size: 22px; font-weight: bold; color: #2f3542; }
.result span { color: #ff4757; font-size: 28px; border-bottom: 3px solid #ff4757; }

.config-toggle {
  position: fixed; right: 25px; bottom: 25px; width: 60px; height: 60px;
  border-radius: 50%; background: #fff; border: none; font-size: 26px;
  box-shadow: 0 6px 20px rgba(0,0,0,0.1); z-index: 99; cursor: pointer;
}

.drawer-mask { position: fixed; inset: 0; background: rgba(0,0,0,0.4); opacity: 0; visibility: hidden; transition: 0.3s; z-index: 1000; }
.drawer-mask.active { opacity: 1; visibility: visible; }
.drawer-content { position: absolute; right: -320px; top: 0; bottom: 0; width: 310px; background: #fff; padding: 25px; transition: 0.3s; display: flex; flex-direction: column; }
.drawer-content.open { right: 0; }
.drawer-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; border-bottom: 1px solid #eee; padding-bottom: 10px; }

@media (max-width: 600px) {
  .drawer-content { right: 0; bottom: -70vh; top: auto; width: 100%; height: 70vh; border-radius: 25px 25px 0 0; }
  .drawer-content.open { bottom: 0; }
  .text { top: -30vw !important; } /* 适配移动端轨道 */
  .tab-item { padding: 10px 15px; font-size: 13px; }
}
</style>