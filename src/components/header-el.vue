<template>
    <div class="header">
        <div class="header__content">
            <div class="header__sub-logo">
                WK
            </div>
            <h1 class="header__title">Word<br>Keeper</h1>
            <div class="header__logo">
                <star-icon />
                <h1>Starred Words</h1>
            </div>
        </div>
    </div>
</template>

<script>
import StarIcon from './icons/star-icon.vue';

export default {
  name: 'HeaderEl',
  components: {
    StarIcon,
  },
};
</script>

<style lang="scss">
.header {
    border-radius: 6px;
    background: $blue-color;
    color: white;
    margin-top: 5px;
    margin-bottom: 18px;
    &__title {
        font-size: 18px;
    }
    &__content {
        padding: 0 15px 0 15px;
        display: flex;
        align-items: center;
    }
    &__sub-logo {
        margin-right: 30px;
        font-weight: 900;
        font-size: 46px;
        letter-spacing: -13px;
    }
    &__logo {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        flex-grow: 1;
        h1 {
            font-size: 18px;
            margin-left: 12px;
        }
    }
}
</style>
