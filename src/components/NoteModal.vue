<script lang="ts" setup>
import { useAuthStore } from '@/stores/AuthStore';
import { useCharacterStore } from '@/stores/CharacterStore';
import { useGameStore } from '@/stores/GameStore';
import { useComboStore } from '@/stores/ComboStore';
import Note from './Note.vue';
import MagnifyingGlass from './icons/MagnifyingGlass.vue';
import AddIcon from './icons/AddIcon.vue';
import CheckmarkIcon from './icons/CheckmarkIcon.vue';
import CloseIcon from './icons/CloseIcon.vue';
import { ref } from 'vue';
import { getGameId, getCharacterId } from '@/common/helpers';

const props = defineProps({
    model: String,
    viewCondition: Boolean,
    noteTitle: String,
    noteBody: String,
    noteId: Number,
    mode: String
});


const authStore = useAuthStore();
const characterStore = useCharacterStore();
const gameStore = useGameStore();
const comboStore = useComboStore();


const createNoteActive = ref(false);
const createNoteTitle = ref(null);
const createNoteBody = ref(null);

const viewNoteActive = ref(false);
const viewNoteTitle = ref(null);
const viewNoteBody = ref(null);


const editNoteActive = ref(false);
const editNoteTitle = ref(null);
const editNoteBody = ref(null);

const updateCreateNoteTitle = (noteTitle: string) => {
    console.log(noteTitle);
    createNoteTitle.value = noteTitle;
};
const updateCreateNoteBody = (noteBody: string) => {
    createNoteBody.value = noteBody;
};

const updateEditNoteTitle = (noteTitle: string) => {
    editNoteTitle.value = noteTitle;
};
const updateEditNoteBody = (noteBody: string) => {
    editNoteBody.value = noteBody;
};

const saveNote = (modelName: 'game' | 'character' | 'combo') => {

    const gameId = getGameId();
    const characterId = getCharacterId();
    const comboId = comboStore.combo.id;

    const note = {
        'title': createNoteTitle.value,
        'body': createNoteBody.value
    }
    console.log(modelName);

    const createNoteStoreActions = {
        'game': function () {
            return gameStore.saveGameNote(gameId, note);
        },
        'character': function () {
            return characterStore.saveCharacterNote(gameId, characterId, note)
        },
        'combo': function () {
            return comboStore.saveCharacterComboNote(gameId, characterId, comboId, note)
        }
    };
    createNoteStoreActions[modelName]();


    // TODO This was after saving a character note
    // .then(() => {
    //     createNoteActive.value = !createNoteActive.value
    //     createNoteTitle.value = null;
    //     createNoteBody.value = null;
    // });
};
const updateNote = (modelName: 'game' | 'character' | 'combo') => {

    const gameId = getGameId();
    const characterId = getCharacterId();
    const comboId = comboStore.combo.id;

    // These ternary statements handle when a User doesn't make any changes but still hits "Save" when editing.
    const note = {
        'title': editNoteTitle.value === null ? props.noteTitle : editNoteTitle.value,
        'body': editNoteBody.value === null ? props.noteBody : editNoteBody.value,
        'id': props.noteId
    }
    console.log(modelName);
    console.log(note);

    const updateNoteStoreActions = {
        'game': function () {
            return gameStore.saveGameNote(gameId, note);
        },
        'character': function () {
            return characterStore.updateCharacterNote(gameId, characterId, note)
        },
        'combo': function () {
            return comboStore.updateCharacterComboNote(gameId, characterId, comboId, note)
        }
    };
    updateNoteStoreActions[modelName]();
};



</script>
<template lang="">
    <div>
        <div class="bg-black opacity-[.99] fixed h-screen w-full top-0 left-0 right-0 bottom-0" :class="{ 'hidden': viewCondition === false }"></div>
        <div class="">
            <div class="absolute h-screen top-0 bottom-0 right-0 left-0 pt-16 px-4" :class="{'hidden': viewCondition === false }">
                <div v-if="mode === 'create'" class="flex flex-col">
                    <input type="text" :value="noteTitle" @input="updateCreateNoteTitle($event.target.value)" class="bg-white" placeholder="Enter note title...">
                    <textarea name="" :value="noteBody" @input="updateCreateNoteBody($event.target.value)" id="" class="bg-white" cols="30" rows="10"></textarea>
                </div>
                <div v-if="mode === 'edit'" class="flex flex-col">
                    <input type="text" :value="noteTitle" @input="updateEditNoteTitle($event.target.value)" class="bg-white" placeholder="Enter note title...">
                    <textarea name="" :value="noteBody" @input="updateEditNoteBody($event.target.value)" id="" class="bg-white" cols="30" rows="10"></textarea>
                </div>
                <div v-if="mode === 'view'" class="flex flex-col text-white space-y-2">
                    <h3 class="text-3xl">{{ noteTitle }}</h3>
                    <p>{{ noteBody }}</p>
                </div>
            </div>
            <div class="">
                <CheckmarkIcon 
                    v-if="mode === 'create'"
                    class="h-20 w-20 fill-green absolute bottom-4 right-4"
                    :class="{ 'hidden': viewCondition === false }"
                    @click="saveNote(props.model), $emit('triggerCloseNoteModal')"
                />
                <CheckmarkIcon
                    v-if="mode === 'edit'"
                    class="h-20 w-20 fill-green absolute bottom-4 right-4"
                    :class="{ 'hidden': viewCondition === false }"
                    @click="updateNote(props.model), $emit('triggerCloseNoteModal')"
                />
                <CloseIcon
                    class="h-20 w-20 text-red absolute bottom-4 left-4"
                    :class="{ 'hidden': viewCondition === false }"
                    @click="$emit('triggerCloseNoteModal')"
                />
            </div>    
        </div> 
    </div>
</template>
<style lang="">
    
</style>