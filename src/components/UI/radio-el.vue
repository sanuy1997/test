<template>
  <div class="radio" @click="$emit('change', $refs.radio.value)">
    <input
      type="radio"
      class="radio__radio"
      ref="radio"
      :value="value"
      :checked="modelValue === value"
      @change="$emit('change', $event.target.value)"
    />
    <label class="radio__label">{{ label }}</label>
  </div>
</template>

<script>
export default {
  name: 'RadioEl',
  model: {
    prop: 'modelValue',
    event: 'change',
  },
  props: {
    value: {
      type: String,
      default: '',
    },
    modelValue: {
      type: String,
      default: '',
    },
    label: {
      type: String,
      default: '',
    },
  },
};
</script>

<style lang="scss" scoped>
.radio {
  display: flex;
  align-items: center;
  user-select: none;
  cursor: pointer;
  &__radio {
    margin: 0 10px 0 0;
    cursor: pointer;
  }
  &__label {
    cursor: pointer;
    text-transform: capitalize;
    user-select: text;
  }
}
</style>
