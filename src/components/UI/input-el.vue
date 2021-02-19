<template>
    <div class="input">
        <input
            :class="[$slots.default ? 'input__input--icon' : '', 'input__input']"
            :value="value"
            type="text"
            @input="$emit('input', $event.target.value)"
        />
        <div v-if="$slots.default" class="input__icon">
            <slot />
        </div>
    </div>
</template>

<script>
export default {
  name: 'InputEl',
  props: ['value'],
};
</script>

<style lang="scss">
.input {
    position: relative;
    display: flex;
    &__input {
        height: 50px;
        padding: 0 20px;
        width: 100%;
        border-radius: 6px;
        border: none;
        font-size: 20px;
    }
    &__input--icon {
        padding-right: 40px;
    }
    &__icon {
        position: absolute;
        bottom: 25%;
        right: 10px;
        width: 25px;
        height: 25px;
    }
}
</style>
