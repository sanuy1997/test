<template>
    <div class="header">
        <div class="header__content">
            <h1>Word Keeper</h1>
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
    border-radius: 10px;
    background: #6ec0fb;
    color: white;
    margin-top: 5px;
    margin-bottom: 50px;
    &__content {
        padding: 0 15px 0 70px;
        display: flex;
        justify-content: space-between;
    }
    &__logo {
        display: flex;
        align-items: center;
        h1 {
            margin-left: 15px;
        }
    }
}
</style>
