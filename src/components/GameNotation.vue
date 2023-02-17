<script lang="ts">
import FollowedByIcon from './icons/FollowedByIcon.vue'
export default {
    props: {
        notation: String,
        iconFileName: String,
        isFullScreen: Boolean
    },
    components: {
        FollowedByIcon
    }
}
</script>
<template lang="">
    <div class="flex justify-center items-center h-full w-full">
        <span
            v-if="iconFileName === ''"
        
        >{{notation}}</span>

        <FollowedByIcon v-else :class="{ 'h-40 w-40': isFullScreen, 'h-5 w-5': !isFullScreen }" />
    </div>


    <!-- <img v-else class="h-11 w-11 stroke-white" :class="strokeColor" :src="`https://training-mode-assets.sfo3.cdn.digitaloceanspaces.com/misc%2F${iconFileName}`" alt=""> -->
    <!-- <div v-else>
    </div> -->
</template>
<style lang="">
    
</style>