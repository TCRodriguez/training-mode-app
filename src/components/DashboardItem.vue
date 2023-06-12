<script lang=ts>
import GameControllerIcon from '@/components/icons/GameControllerIcon.vue'
export default {
    props: {
        name: String,
        icon: String,
    },
    components: {
        GameControllerIcon
    }
}
</script>
<template lang="">
    <div>
        <div class=" flex flex-col items-center justify-center">
            <component :is="icon" class="w-24 h-24 p-2"></component>
            <p>{{ name }}</p>
        </div>
    </div>
</template>
<style lang="">
    
</style>