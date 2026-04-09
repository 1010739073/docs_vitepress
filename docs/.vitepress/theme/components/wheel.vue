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
            transition: transitionActive
              ? 'transform 4s cubic-bezier(0.1, 0, 0.1, 1)'
              : 'none',
          }"
          @transitionend="onTransitionEnd"
        >
          <div
            v-for="(slice, index) in wheelSlices"
            :key="index"
            class="slice"
            :style="getSliceStyle(slice)"
            @click.stop="handleSliceClick(slice)"
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
        {{ isSpinning ? "命运抉择中..." : "开始抽取 🎡" }}
      </button>

      <div class="result-box">
        <transition name="fade">
          <p v-if="result && !isSpinning" class="result">
            🎉 建议去吃：<span>{{ result }}</span> 🎉
          </p>
        </transition>
      </div>
    </div>

    <button
      class="config-toggle"
      @click="showDrawer = true"
      aria-label="打开设置"
    >
      ⚙️
    </button>

    <div
      :class="['drawer-mask', { active: showDrawer }]"
      @click.self="showDrawer = false"
    >
      <div :class="['drawer-content', { open: showDrawer }]">
        <div class="drawer-header">
          <h3>⚙️ {{ currentMealLabel }}清单</h3>
          <button class="close-btn" @click="showDrawer = false">✕</button>
        </div>
        <div class="drawer-body">
          <div class="add-form">
            <input
              v-model="newItemName"
              type="text"
              placeholder="食物名称"
              @keyup.enter="addItem"
            />
            <input
              v-model.number="newItemWeight"
              type="number"
              placeholder="权重"
              @keyup.enter="addItem"
            />
            <button class="add-btn" @click="addItem">添加</button>
          </div>
          <div class="list-container">
            <div
              v-for="(item, index) in currentFoods"
              :key="index"
              class="list-item"
            >
              <span
                class="color-dot"
                :style="{ backgroundColor: getSliceColor(index) }"
              ></span>
              <input v-model="item.name" class="edit-name" />
              <input
                v-model.number="item.weight"
                type="number"
                class="edit-weight"
              />
              <button class="delete-btn" @click="removeItem(index)">❌</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from "vue";

const mealPresets = [
  {
    type: "breakfast",
    label: "早餐",
    icon: "🥟",
    default: [
      { name: "包子豆浆", weight: 10 },
      { name: "油条", weight: 8 },
      { name: "煎饼", weight: 8 },
      { name: "糊辣汤", weight: 5 },
    ],
  },
  {
    type: "lunch",
    label: "午餐",
    icon: "🍚",
    default: [
      { name: "黄焖鸡", weight: 10 },
      { name: "麻辣烫", weight: 10 },
      { name: "拉面", weight: 8 },
      { name: "麦当劳/肯德基", weight: 6 },
      { name: "猪脚饭", weight: 8 },
      { name: "火锅", weight: 2 },
    ],
  },
  {
    type: "dinner",
    label: "晚餐",
    icon: "🥘",
    default: [
      { name: "烧烤", weight: 3 },
      { name: "减肥", weight: 12 },
      { name: "豆角闷面", weight: 5 },
      { name: "面条", weight: 5 },
      { name: "豆角炒肉", weight: 5 },
      { name: "蘑菇炒肉", weight: 5 },
    ],
  },
];

const currentMealType = ref("lunch");
const allMealData = ref(
  Object.fromEntries(mealPresets.map((m) => [m.type, m.default]))
);
const deg = ref(0);
const transitionActive = ref(true);
const result = ref("");
const isSpinning = ref(false);
const showDrawer = ref(false);
const newItemName = ref("");
const newItemWeight = ref(5);

onMounted(() => {
  const hour = new Date().getHours();
  if (hour >= 6 && hour < 11) currentMealType.value = "breakfast";
  else if (hour >= 11 && hour < 17) currentMealType.value = "lunch";
  else currentMealType.value = "dinner";
});

const currentFoods = computed(() => allMealData.value[currentMealType.value]);
const currentMealLabel = computed(
  () => mealPresets.find((m) => m.type === currentMealType.value).label
);

const wheelSlices = computed(() => {
  const foods = currentFoods.value;
  const totalW = foods.reduce(
    (sum, item) => sum + (Number(item.weight) || 0),
    0
  );
  let currentAngle = 0;
  return foods.map((item, index) => {
    const weight = Number(item.weight) || 0;
    const sliceAngle = (weight / (totalW || 1)) * 360;
    const hue = (index * (360 / Math.max(foods.length, 1))) % 360;
    const res = {
      ...item,
      color: `hsl(${hue}, 75%, 85%)`,
      sliceAngle,
      startAngle: currentAngle,
      midAngle: currentAngle + sliceAngle / 2,
      endAngle: currentAngle + sliceAngle,
    };
    currentAngle += sliceAngle;
    return res;
  });
});

const wheelBackground = computed(() => {
  const gradients = wheelSlices.value.map(
    (s) => `${s.color} ${s.startAngle}deg ${s.endAngle}deg`
  );
  return `conic-gradient(${gradients.join(", ")})`;
});

async function switchMeal(type) {
  if (isSpinning.value) return;
  transitionActive.value = false;
  deg.value = deg.value % 360;
  await nextTick();
  currentMealType.value = type;
  deg.value = 0;
  result.value = "";
  setTimeout(() => {
    transitionActive.value = true;
  }, 50);
}

function spin() {
  if (isSpinning.value || !currentFoods.value.length) return;
  isSpinning.value = true;
  result.value = "";
  const totalW = currentFoods.value.reduce(
    (sum, item) => sum + (Number(item.weight) || 0),
    0
  );
  const randomNum = Math.random() * totalW;
  let currentSum = 0,
    winningSlice = null;
  for (const s of wheelSlices.value) {
    currentSum += s.weight;
    if (randomNum <= currentSum) {
      winningSlice = s;
      break;
    }
  }
  const baseSpins = 6 * 360;
  const targetAngle = 360 - (winningSlice.midAngle % 360);
  deg.value =
    deg.value + baseSpins + ((targetAngle - (deg.value % 360) + 360) % 360);
  window.__pending = winningSlice.name;
}

const onTransitionEnd = () => {
  isSpinning.value = false;
  result.value = window.__pending;
};

// 动态计算偏移位置
function getSliceStyle(s) {
  return {
    transform: `translate(-50%, -50%) rotate(${s.midAngle}deg) translateY(-145px)`,
  };
}

function getTextStyle(s) {
  // 放大版转盘字体也稍微调大一点点
  return {
    fontSize: `${Math.max(12, Math.min(16, s.sliceAngle / 2))}px`,
    opacity: s.sliceAngle < 10 ? 0 : 1,
  };
}

function getSliceColor(i) {
  return `hsl(${(i * (360 / currentFoods.value.length)) % 360}, 75%, 85%)`;
}
function handleSliceClick(s) {
  if (s.sliceAngle < 10) alert(`此选项是：${s.name}`);
}
function addItem() {
  if (newItemName.value.trim()) {
    currentFoods.value.push({
      name: newItemName.value,
      weight: newItemWeight.value || 1,
    });
    newItemName.value = "";
    newItemWeight.value = 5;
  }
}
function removeItem(i) {
  currentFoods.value.splice(i, 1);
}
</script>

<style scoped>
.wheel-app {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  background: #fdfdfd;
  min-height: 100vh;
  font-family: -apple-system, "PingFang SC", sans-serif;
}

.meal-tabs {
  display: flex;
  background: #f1f1f1;
  padding: 4px;
  border-radius: 12px;
  margin: 10px 0 25px;
}
.tab-item {
  border: none;
  padding: 10px 22px;
  border-radius: 10px;
  cursor: pointer;
  background: transparent;
  color: #666;
  font-weight: bold;
  position: relative;
  transition: 0.2s;
}
.tab-item.active {
  background: #fff;
  color: #ff4757;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
}
.time-tag {
  position: absolute;
  top: -5px;
  right: -5px;
  background: #2ed573;
  color: #fff;
  font-size: 9px;
  padding: 1px 4px;
  border-radius: 4px;
}

.main-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: -10px;
  z-index: 1;
  width: 100%;
}
.title {
  color: #2f3542;
  margin-bottom: 25px;
  font-size: 1.6rem;
}

/* 转盘容器放大核心代码 */
.wheel-wrapper {
  position: relative;
  width: 420px; /* 从 310px 增加到 420px */
  height: 420px;
  margin-bottom: 40px;
}

.pointer {
  position: absolute;
  top: -20px;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 18px solid transparent;
  border-right: 18px solid transparent;
  border-top: 32px solid #ff4757;
  z-index: 10;
  filter: drop-shadow(0 3px 6px rgba(0, 0, 0, 0.15));
}

.wheel {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 8px solid #fff;
  box-shadow: 0 15px 45px rgba(0, 0, 0, 0.12);
  position: relative;
  overflow: hidden;
}

.slice {
  position: absolute;
  top: 50%;
  left: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  z-index: 2;
  transition: z-index 0.2s;
}

/* 鼠标移入文字放大逻辑 */
.slice:hover {
  z-index: 100;
}
.slice:hover .text {
  opacity: 1 !important;
  transform: scale(1.8); /* 配合大转盘，缩放也稍微调大 */
  text-shadow: 0 2px 6px rgba(0, 0, 0, 0.25);
  color: #000;
}

.text {
  font-weight: 800;
  color: #333;
  white-space: nowrap;
  transition: transform 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275),
    opacity 0.2s;
  max-width: 120px;
  overflow: hidden;
  text-overflow: ellipsis;
  transform-origin: center;
  display: inline-block;
}

.spin-btn {
  background: #ff4757;
  color: #fff;
  border: none;
  padding: 16px 85px;
  font-size: 1.3rem;
  border-radius: 50px;
  cursor: pointer;
  font-weight: bold;
  box-shadow: 0 8px 20px rgba(255, 71, 87, 0.3);
  transition: 0.2s;
  margin-top: 10px;
}
.spin-btn:active {
  transform: scale(0.95);
}
.spin-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
  box-shadow: none;
}

.result-box {
  height: 75px;
  margin-top: 25px;
  text-align: center;
}
.result {
  font-size: 24px;
  font-weight: bold;
  color: #2f3542;
}
.result span {
  color: #ff4757;
  font-size: 30px;
  border-bottom: 3px solid #ff4757;
  padding-bottom: 2px;
}

.config-toggle {
  position: fixed;
  right: 25px;
  bottom: 25px;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: #fff;
  border: none;
  font-size: 26px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.12);
  cursor: pointer;
  z-index: 999;
  display: flex;
  align-items: center;
  justify-content: center;
}

.drawer-mask {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  opacity: 0;
  visibility: hidden;
  transition: 0.3s;
  z-index: 1000;
}
.drawer-mask.active {
  opacity: 1;
  visibility: visible;
}
.drawer-content {
  position: absolute;
  right: -320px;
  top: 0;
  bottom: 0;
  width: 300px;
  background: #fff;
  padding: 25px;
  transition: 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  flex-direction: column;
}
.drawer-content.open {
  right: 0;
}

.drawer-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}
.add-form {
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
}
.add-form input {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
  flex: 1;
  min-width: 0;
  outline: none;
}
.add-btn {
  background: #2f3542;
  color: #fff;
  border: none;
  padding: 0 15px;
  border-radius: 8px;
  cursor: pointer;
}
.list-container {
  flex: 1;
  overflow-y: auto;
}
.list-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px;
  background: #f9f9f9;
  margin-bottom: 10px;
  border-radius: 10px;
}
.color-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}
.edit-name {
  border: none;
  background: transparent;
  flex: 1;
  outline: none;
  font-size: 14px;
}
.edit-weight {
  width: 40px;
  border: 1px solid #eee;
  text-align: center;
  border-radius: 4px;
  padding: 2px;
}
.delete-btn {
  background: none;
  border: none;
  cursor: pointer;
  opacity: 0.5;
}

/* 移动端适配：防止大转盘溢出 */
@media (max-width: 600px) {
  .wheel-wrapper {
    width: 85vw; /* 手机端宽度占屏幕的 85% */
    height: 85vw;
  }
  .slice {
    transform: translate(-50%, -50%) rotate(0deg) translateY(-30vw); /* 动态调整手机端文字轨道 */
  }
  /* 这里由于 getSliceStyle 是内联样式，我们需要通过 JS 计算或在 CSS 中重新定义偏移 */
  .drawer-content {
    right: 0;
    bottom: -70vh;
    top: auto;
    width: 100%;
    height: 70vh;
    border-radius: 20px 20px 0 0;
  }
  .drawer-content.open {
    bottom: 0;
  }
}
</style>