<script lang="ts">
import { useCharacterStore } from '@/stores/CharacterStore';
import { computed } from 'vue';

export default {
    setup() {
        const characterStore = useCharacterStore();
        const character = computed(() => characterStore.character)

        return {
            characterStore,
            character,
        }
    },
    props: {
        notation: String
    }
}
</script>
<template lang="">
    <span
        class="bg-red p-2"
    >{{notation}}</span>
</template>
<style lang="">
    
</style>