<script lang="ts">
import { useCharacterStore } from '@/stores/CharacterStore';
import { computed } from 'vue';
import { renderNotationInput } from '@/common/helpers';
export default {
    setup() {
        const characterStore = useCharacterStore();
        const character = computed(() => characterStore.character);


        return {
            characterStore,
            character,
            renderNotationInput
        }
    }
}
</script>
<template lang="">
    <div class="flex flex-col">
       <button
            v-for="notation in character.notations"
            :key="notation.id"
            class="border bg-red p-2"
            @click="renderNotationInput(notation)"
       >{{notation.notation}}</button> 
    </div>
</template>
<style lang="">
    
</style>