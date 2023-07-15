<script lang="ts" setup>
import CharacterCombo from './CharacterCombo.vue';
import CharacterComboNoteList from './CharacterComboNoteList.vue';
import CloseIcon from './icons/CloseIcon.vue';

const props = defineProps({
    comboId: Number,
    inputs: Array,
    comboNotes: Array,
    showCharacterComboActive: Boolean,
    characterComboEditTagsActive: Boolean
})
</script>
<template lang="">
    <div>
        <div class="bg-black opacity-[.75] fixed h-screen w-full top-0 left-0 right-0 bottom-0"></div>
        <div class="absolute bg-gray h-screen top-0 bottom-0 right-0 left-0 mx-4 p-2 flex flex-col">
            <div>
                <CharacterCombo
                    class="border rounded p-2 overflow-x-auto w-full"
                    :inputs="inputs"
                    :comboId="comboId"
                />
            </div>
            <div class="mt-8">
                <h3 class="font-bold text-2xl">Notes</h3>
                <CharacterComboNoteList :comboId="comboId" :comboNotes="comboNotes" class="mt-2" />
            </div>
        </div>
        <div>
            <CloseIcon class="h-20 w-20 absolute bottom-4 right-4" @click="$emit('triggerCloseCharacterComboModal')" />
        </div>
    </div>
</template>
<style lang="">
    
</style>