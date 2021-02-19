<template>
  <div id="app">
    <header-el />
    <main-page />
  </div>
</template>

<script>
import MainPage from './page/MainPage.vue';
import HeaderEl from './components/header-el.vue';

export default {
  name: 'App',
  components: {
    MainPage,
    HeaderEl,
  },
};
</script>

<style lang="scss">
#app {
  font-family: -apple-system,system-ui,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
  box-sizing: border-box;
  background: #f8f4f4;
  min-height: 100vh;
  padding: 10px 15px 0 15px;
}
</style>
