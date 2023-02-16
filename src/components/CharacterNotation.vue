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
    <!-- <div>
       <span
            v-for="notation in character.notations"
            :key="notation.id"
            class="border bg-red-500 p-2"
            @click="renderNotationInput(notation)"
       ></span> 
    </div> -->
    <span
        class="bg-red-500 p-2"
    
    >{{notation}}</span>
</template>
<style lang="">
    
</style>