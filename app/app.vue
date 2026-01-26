<template>
  <main class="v-app"
  >
    <header class="v-app__header">
      <h1 class="v-app-header__title">studio  guez</h1>
    </header>
    <div class="v-app__background-wrapper">
      <img class="v-app__background-wrapper__img"
           alt="image d'arrière plan avec des verres à cocktail" src="/background-compress.jpg" role="none">
      <img class="v-app__background-wrapper__img"
           alt="image d'arrière plan avec des verres à cocktail" src="/background-compress.jpg" role="none">
    </div>
  </main>
</template>


<script setup lang="ts">

</script>


<style lang="scss" scoped>
.v-app__header {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 10;
}

.v-app-header__title {
  padding: var(--app-gap);
  margin: 0;
  color: var(--app-color-main);
  font-size: 4rem;
  line-height: 4rem;
}

.v-app__background-wrapper {
  box-sizing: border-box;
  position: fixed;
  height: 100vh;
  animation: 20s bg-animation linear infinite;
  top: 0;
  left: 0;
  display: flex;
  flex-wrap: nowrap;
  z-index: 0;
  padding-top: var(--app-header-height);
}

.v-app__background-wrapper__img {
  height: 100%;
  width: auto;
}

@keyframes bg-animation {
  0% {
    transform: translate3d(0, 0, 0);
  }

  100% {
    transform: translate3d(-50%, 0, 0);
  }
}
</style>
