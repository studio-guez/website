<template>
    <section
        class="v-index"
    >
        <h1
            style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); cursor: pointer"
            @mouseover="playAnimation"
            @click="playAnimation"
        >{{name}}</h1>

        <a target="_blank" href="mailto:contact+website@studio-guez.ch ">contact@studio-guez.ch</a>
    </section>
</template>





<script setup lang="ts">

const name = ref('guez')

let animationState: 'playing' | 'stopped' = 'stopped'
let frameCounter = 0

const studioNamesList: string[][] = [
    [
        'ggez',
        'gggz',
        'gggg',
        'gugg',
        'gueg',
        'guez',

        'uuez',
        'uuuz',
        'uuuu',
        'guuu',
        'gueu',
        'guez',

        'euez',
        'eeez',
        'eeee',
        'geee',
        'guee',
        'guez',

        'zuez',
        'zzez',
        'zzzz',
        'gzzz',
        'guzz',
        'guez',
    ],
    [
        'ggez',
        'gggz',
        'gggg',

        'zggg',
        'gzgg',
        'ggzg',
        'gggz',

        'eggz',
        'ggez',

        'ugez',
        'guez',



        'guez',
    ],
    [
        'ggez',
        'gggz',
        'gggg',

        'zggg',
        'zzgg',
        'zzzg',
        'zzzz',

        'ezzz',
        'eezz',
        'eeez',
        'eeee',

        'ueee',
        'uuee',
        'uuue',
        'uuuu',

        'guuu',
        'gguu',
        'gggu',
        'gggg',

        'gugg',
        'gueg',
        'guez',

        // 'ngueza',
        // 'niguezia',
        // 'nicgueznia',
        // 'nicoguezonia',
        // 'nico guezsonia',
        // 'nico  guez sonia',
    ]

]


function playAnimation() {
    if (animationState === 'playing') return
    animationState = 'playing'
    loop()
}

function stopAnimation() {
    if(animationState === 'stopped') return
    animationState = 'stopped'

    frameCounter = 0
}

interface nameAnimationState {index: number, index_0_Counter: number, listIndex: number}
let stateOfAnimation: nameAnimationState = {
    index: 0,
    index_0_Counter: 0,
    listIndex: 0,
}
function loop() {
    if(animationState === 'stopped') return
    stateOfAnimation = updateName(stateOfAnimation)
    window.requestAnimationFrame(loop)
    frameCounter++
}

function updateName(nameAnimationState: nameAnimationState): nameAnimationState {
    if(nameAnimationState.index >= studioNamesList[nameAnimationState.listIndex].length) {
        stopAnimation()
        return {
            index: 0,
            index_0_Counter: 0,
            listIndex: getRandomInt(0, studioNamesList.length - 1)
        }
    }

    if(nameAnimationState.index === 0) {
        if (nameAnimationState.index_0_Counter % 360 === 0) {
            name.value = studioNamesList[nameAnimationState.listIndex][nameAnimationState.index]
            nameAnimationState.index++
        }
        nameAnimationState.index_0_Counter++
    }
    else {
        if (frameCounter % 5 === 0) {
            name.value = studioNamesList[nameAnimationState.listIndex][nameAnimationState.index]
            nameAnimationState.index++
        }
    }

    return {
        index_0_Counter: nameAnimationState.index_0_Counter,
        index: nameAnimationState.index,
        listIndex: nameAnimationState.listIndex,
    }
}

function getRandomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1) ) + min
}

</script>





<style lang="scss" scoped >
.v-index {
    font-family: Arial, sans-serif;
    color: white;
    position: fixed;
    top: 0;
    left: 0;
    background: black;
    width: 100%;
    height: 100%;
    font-size: 2rem;
    line-height: 1em;
    font-weight: 500;
    box-sizing: border-box;
    padding: 2rem;
}

h1 {
    font-size: 2rem;
    line-height: 1em;
    font-weight: 500;
    text-align: center;
}

a {
    color: white;
    text-decoration: none;
}
</style>
