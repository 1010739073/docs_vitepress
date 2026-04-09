<template>
  <div class="wheel-app">
    <div class="main-content">
      <h2 class="title">🤔 今天吃什么？</h2>

      <div class="wheel-wrapper">
        <div class="pointer"></div>
        <div
          class="wheel"
          :style="{ transform: `rotate(${deg}deg)`, background: wheelBackground }"
          @transitionend="onTransitionEnd"
        >
          <div
            v-for="slice in wheelSlices"
            :key="slice.id"
            class="slice"
            :style="getSliceStyle(slice)"
          >
            <span class="text">{{ slice.name }}</span>
          </div>
        </div>
      </div>

      <button 
        :class="['spin-btn', { spinning: isSpinning }]" 
        :disabled="isSpinning || totalWeight === 0" 
        @click="spin"
      >
        {{ isSpinning ? '命运抉择中...' : '转一转 🎡' }}
      </button>
      
      <div class="result-box">
        <transition name="fade">
          <p v-if="result && !isSpinning" class="result">
            🎉 去吃：<span>{{ result }}</span> 🎉
          </p>
        </transition>
      </div>

      <button class="config-toggle" @click="showDrawer = true" title="配置选项">
        ⚙️
      </button>
    </div>

    <div :class="['drawer-mask', { active: showDrawer }]" @click.self="showDrawer = false">
      <div :class="['drawer-content', { open: showDrawer }]">
        <div class="drawer-header">
          <h3>⚙️ 选项设置</h3>
          <button class="close-btn" @click="showDrawer = false">✕</button>
        </div>

        <div class="drawer-body">
          <div class="add-form">
            <input v-model="newItemName" type="text" placeholder="食物名称" @keyup.enter="addItem" />
            <input v-model.number="newItemWeight" type="number" placeholder="权重" @keyup.enter="addItem" />
            <button class="add-btn" @click="addItem">添加</button>
          </div>

          <div class="list-container">
            <div v-for="(item, index) in foods" :key="item.id" class="list-item">
              <span class="color-dot" :style="{ backgroundColor: item.color }"></span>
              <input v-model="item.name" class="edit-name" />
              <div class="weight-control">
                <input v-model.number="item.weight" type="number" class="edit-weight" />
              </div>
              <button class="delete-btn" @click="removeItem(index)">❌</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const colorPool = ['#FFB5A7', '#FCD5CE', '#F8EDEB', '#F9DCC4', '#FEC89A', '#FFD7BA', '#E2F0CB', '#B5EAD7', '#C7CEEA', '#FF9AA2']
const foods = ref([
  { id: 1, name: '火锅', weight: 10, color: colorPool[0] },
  { id: 2, name: '寿司', weight: 8, color: colorPool[1] },
  { id: 3, name: '炸鸡', weight: 8, color: colorPool[2] },
  { id: 4, name: '沙拉', weight: 1, color: colorPool[3] }
])

const deg = ref(0)
const result = ref('')
const isSpinning = ref(false)
const showDrawer = ref(false) // 控制抽屉显隐

const newItemName = ref('')
const newItemWeight = ref(5)

const totalWeight = computed(() => foods.value.reduce((sum, item) => sum + (item.weight || 0), 0))

const wheelSlices = computed(() => {
  let currentAngle = 0
  const total = totalWeight.value
  return foods.value.map(item => {
    const sliceAngle = ((item.weight || 0) / total) * 360
    const res = { ...item, startAngle: currentAngle, midAngle: currentAngle + sliceAngle / 2, endAngle: currentAngle + sliceAngle }
    currentAngle += sliceAngle
    return res
  })
})

const wheelBackground = computed(() => {
  const gradients = wheelSlices.value.map(s => `${s.color} ${s.startAngle}deg ${s.endAngle}deg`)
  return `conic-gradient(${gradients.join(', ')})`
})

function addItem() {
  if (!newItemName.value.trim()) return
  foods.value.push({
    id: Date.now(),
    name: newItemName.value,
    weight: newItemWeight.value || 1,
    color: colorPool[foods.value.length % colorPool.length]
  })
  newItemName.value = ''; newItemWeight.value = 5
}

function removeItem(i) { foods.value.splice(i, 1) }

function spin() {
  if (isSpinning.value || totalWeight.value === 0) return
  isSpinning.value = true
  result.value = ''
  
  const randomNum = Math.random() * totalWeight.value
  let currentSum = 0, winningSlice = null
  for (const s of wheelSlices.value) {
    currentSum += s.weight
    if (randomNum <= currentSum) { winningSlice = s; break }
  }

  const baseSpins = 5 * 360
  const targetAngle = 360 - winningSlice.midAngle
  const rotateDelta = baseSpins + ((targetAngle - (deg.value % 360) + 360) % 360)
  deg.value += rotateDelta
  window.__pending = winningSlice.name
}

function onTransitionEnd() {
  isSpinning.value = false
  result.value = window.__pending
}

function getSliceStyle(s) {
  return { transform: `translate(-50%, -50%) rotate(${s.midAngle}deg) translateY(-85px)` }
}
</script>

<style scoped>
/* 核心布局 */
.wheel-app {
  display: flex;
  justify-content: center;
  align-items: center;
  background: #fdfdfd;
  overflow: hidden;
  position: relative;
}

.main-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 1;
}

/* 轮盘样式保持不变，增强精细度 */
.wheel-wrapper {
  position: relative;
  width: 300px;
  height: 300px;
  margin-bottom: 30px;
}
.pointer {
  position: absolute;
  top: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: 0; height: 0;
  border-left: 12px solid transparent;
  border-right: 12px solid transparent;
  border-top: 20px solid #ff4757;
  z-index: 10;
}
.wheel {
  width: 100%; height: 100%;
  border-radius: 50%;
  border: 6px solid #fff;
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
  transition: transform 4s cubic-bezier(0.15, 0, 0.15, 1);
  position: relative;
}
.slice {
  position: absolute; top: 50%; left: 50%;
  font-weight: bold; font-size: 14px; color: #444;
  white-space: nowrap;
}

/* 悬浮配置按钮 */
.config-toggle {
  position: fixed;
  right: 20px;
  bottom: 20px;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: #fff;
  border: none;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  font-size: 24px;
  cursor: pointer;
  z-index: 100;
  transition: transform 0.3s;
}
.config-toggle:hover { transform: rotate(45deg) scale(1.1); }

/* 抽屉式配置面板 */
.drawer-mask {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.3);
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s;
  z-index: 200;
}
.drawer-mask.active {
  opacity: 1;
  visibility: visible;
}

.drawer-content {
  position: absolute;
  right: -350px; /* 初始隐藏在右侧 */
  top: 0; bottom: 0;
  width: 320px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  box-shadow: -5px 0 15px rgba(0,0,0,0.1);
  transition: right 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  padding: 20px;
  display: flex;
  flex-direction: column;
}
.drawer-content.open { right: 0; }

.drawer-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  border-bottom: 1px solid #eee;
  padding-bottom: 10px;
}
.close-btn { background: none; border: none; font-size: 20px; cursor: pointer; color: #999; }

.add-form { display: flex; gap: 5px; margin-bottom: 20px; }
.add-form input { padding: 8px; border: 1px solid #ddd; border-radius: 4px; }
.add-form input[type="text"] { flex: 2; width: 0; }
.add-form input[type="number"] { width: 60px; }
.add-btn { background: #57606f; color: white; border: none; padding: 0 10px; border-radius: 4px; cursor: pointer; }

.list-container { flex: 1; overflow-y: auto; }
.list-item {
  display: flex; align-items: center; gap: 8px;
  padding: 10px; background: #fff; margin-bottom: 8px;
  border-radius: 6px; box-shadow: 0 1px 3px rgba(0,0,0,0.05);
}
.color-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
.edit-name { border: none; flex: 1; width: 0; font-size: 14px; }
.edit-weight { width: 40px; border: 1px solid #eee; text-align: center; border-radius: 3px; }
.delete-btn { background: none; border: none; cursor: pointer; font-size: 12px; }

/* 响应式：小屏幕变底部抽屉 */
@media (max-width: 600px) {
  .drawer-content {
    right: 0; bottom: -60vh; top: auto;
    width: 100%; height: 60vh;
    transition: bottom 0.3s ease;
  }
  .drawer-content.open { bottom: 0; }
}

/* 按钮效果 */
.spin-btn {
  background: #ff4757; color: white; border: none;
  padding: 15px 40px; font-size: 1.2rem; border-radius: 50px;
  cursor: pointer; box-shadow: 0 5px 15px rgba(255,71,87,0.3);
}
.spin-btn:disabled { background: #ccc; box-shadow: none; }

.result-box { height: 60px; margin-top: 20px; }
.result { font-size: 24px; font-weight: bold; }
.result span { color: #ff4757; }
</style>