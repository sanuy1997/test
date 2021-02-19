<template>
  <div class="checkbox">
    <input
      type="checkbox"
      class="checkbox__checkbox"
      ref="checkbox"
      :value="value"
      :checked="shouldBeChecked"
      @change="updateInput()"
    />
    <label
      class="checkbox__label"
      @click="($refs.checkbox.checked = !$refs.checkbox.checked), updateInput()"
      >{{ label }}</label
    >
  </div>
</template>

<script>
export default {
  name: 'CheckboxEl',
  model: {
    prop: 'modelValue',
    event: 'change',
  },
  props: {
    value: {
      type: String,
    },
    modelValue: {
      default: false,
    },
    label: {
      type: String,
    },
    trueValue: {
      type: Boolean,
      default: true,
    },
    falseValue: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    shouldBeChecked() {
      if (this.modelValue instanceof Array) {
        return this.modelValue.includes(this.value);
      }
      return this.modelValue === this.trueValue;
    },
  },
  methods: {
    updateInput() {
      const isChecked = this.$refs.checkbox.checked;
      if (this.modelValue instanceof Array) {
        const newValue = [...this.modelValue];

        if (isChecked) {
          newValue.push(this.value);
        } else {
          newValue.splice(newValue.indexOf(this.value), 1);
        }

        this.$emit('change', newValue);
      } else {
        this.$emit('change', isChecked ? this.trueValue : this.falseValue);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.checkbox {
  display: flex;
  align-items: center;
  cursor: pointer;
  user-select: none;
  &__checkbox {
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
