<template>
    <section
        class="v-index"
    >
        studio guez

        site en maintenance

        studio@guez.ch ?
    </section>
</template>





<script setup lang="ts">
import { defineProps } from 'vue'

const props = defineProps<{
    message?: string
}>()
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
}
</style>
