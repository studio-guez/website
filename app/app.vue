<template>
  <head>
    <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
    <link rel="manifest" href="/site.webmanifest">
  </head>
  <main class="v-app"
  >
    <img alt="cursor"
         src="/cursor-compress-small.png" role="none"
         class="v-app__header__cursor"
         ref="appCursor"
    >
    <header class="v-app__header">
      <h1 class="v-app-header__title">studio  guez</h1>
    </header>

    <div class="v-app__content">
    <h1>vous adresse ses meilleurs vœux pour 2026</h1>
    <HtmlContentWithObfuscatedEmail
      :textHtmlContent="`<p>studio guez est un bureau de graphisme basé
        à Genève. Nous réalisons des projets dans la conception d’identités visuelles, de sites web, de projets éditoriaux et de signalétique.
        <br><a target='_blank' href='mailto:hello@studio-guez.ch' >Contactez-nous&nbsp;!</a></p>`"
    />
    </div>

    <div class="v-app__background-wrapper">
      <img class="v-app__background-wrapper__img"
           alt="image d'arrière plan avec des verres à cocktail" src="/background-compress.jpg" role="none">
      <img class="v-app__background-wrapper__img"
           alt="image d'arrière plan avec des verres à cocktail" src="/background-compress.jpg" role="none">
    </div>
  </main>
</template>


<script setup lang="ts">

const appCursor = ref<HTMLElement>()

onMounted(() => {
  const cursorGap = -50

  addEventListener('mousemove', (evt: MouseEvent) => {
    appCursor.value!.style.transform = `translate(${evt.clientX + cursorGap}px, ${evt.clientY + cursorGap}px)`
  })
})

</script>


<style lang="scss" scoped>
.v-app__header {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 10;
}

.v-app__header__cursor {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 100;
  width: 75px;
  user-select: none;
  pointer-events: none;
  -webkit-user-drag: none;
  cursor: none !important;
  transform: translate3d(1rem, 2rem, 0);
}

.v-app-header__title {
  padding: var(--app-gap);
}

.v-app__content {
  position: fixed;
  top: 0;
  right: 0;
  padding: var(--app-gap);
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: flex-end;

  @media (max-width: 1200px) {
    position: relative;
    padding-top: calc(100vh - 5rem);
    align-items: flex-start;
  }
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
  user-select: none;
  pointer-events: none;
  -webkit-user-drag: none;
}

.v-app__background-wrapper__img {
  height: 100%;
  width: auto;
  user-select: none;
  pointer-events: none;
  -webkit-user-drag: none;
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
