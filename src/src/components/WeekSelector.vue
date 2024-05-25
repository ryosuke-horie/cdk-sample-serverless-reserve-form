<script setup lang="ts">
// PropsとEmitsの定義
defineProps({
  weekDisplay: {
    type: String,
    required: true,
  },
});
const emit = defineEmits(["advanceWeek"]);

const advanceWeek = (days: number) => {
  emit("advanceWeek", days);
};
</script>

<template>
  <div class="week-selector">
    <button
      class="week-button"
      @click="advanceWeek(-7)"
    >
      &lt;
    </button>
    <span class="week-display">{{ weekDisplay }}</span>
    <button
      class="week-button"
      @click="advanceWeek(7)"
    >
      &gt;
    </button>
  </div>
</template>

<style scoped>
.week-selector {
  display: flex;
  justify-content: space-between;
  background-color: #f9f9f9;
}

.week-button {
  padding: 10px 20px;
  cursor: pointer;
}

.week-display {
  font-weight: bold;
  display: flex;
  align-items: center;
}
</style>
