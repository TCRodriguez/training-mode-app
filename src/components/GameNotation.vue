<script lang="ts">
import FollowedByIcon from './icons/FollowedByIcon.vue';
import AddIconOutline from './icons/AddIconOutline.vue';
export default {
    props: {
        notation: String,
        iconFileName: String,
        isFullScreen: Boolean
    },
    components: {
        FollowedByIcon,
        AddIconOutline,
    }
}
</script>
<template lang="">
    <div class="flex justify-center items-center h-full w-full">
        <div  v-if="iconFileName === ''">
            <p>{{notation}}</p>
        </div>
        <FollowedByIcon
            v-else 
            :class="{ 'h-40 w-40': isFullScreen, 'h-5 w-5': !isFullScreen }" 
        />
    </div>
</template>
<style lang="">
    
</style>