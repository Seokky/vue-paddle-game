<template>
  <div
    class="info-panel"
    :style="styles"
  >
    <div class="score">
      <span
        class="info-panel__label"
        v-text="'Score:'"
      />
      <span
        class="info-panel__value"
        v-text="score"
      />
    </div>

    <div class="record">
      <span
        class="info-panel__label"
        v-text="'Record:'"
      />
      <span
        class="info-panel__value"
        v-text="record"
      />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { canvas } from '@/classes/Canvas';
import { score } from '@/classes/Score';

export default Vue.extend({
  computed: {
    styles() {
      return {
        top: `${canvas.el.offsetTop}px`,
        width: `${canvas.width}px`,
      };
    },

    score() {
      return score.amount;
    },

    record() {
      return score.record;
    },
  },
});
</script>

<style lang="scss" scoped>
.info-panel {
  margin: 0 auto;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  padding: 10px;
  text-align: center;
  font-family: Helvetica;
  font-size: 24px;
  color: white;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;

  @media screen and (min-width: 768px) {
    font-size: 30px;
    padding: 15px;
  }

  &__label {
    text-transform: uppercase;
  }

  &__value {
    margin-left: 6px;
    font-weight: bold;
    color: orange;
  }
}
</style>
