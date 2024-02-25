<script lang="ts" setup>
import { useAuthStore } from '@/stores/AuthStore';
import { useCharacterStore } from '@/stores/CharacterStore';
import { useGameStore } from '@/stores/GameStore';
import { useCharacterMoveStore } from '@/stores/CharacterMoveStore';
import { useComboStore } from '@/stores/ComboStore';
import Note from './Note.vue';
import MagnifyingGlass from './icons/MagnifyingGlass.vue';
import AddIcon from './icons/AddIcon.vue';
import CheckmarkIcon from './icons/CheckmarkIcon.vue';
import CloseIcon from './icons/CloseIcon.vue';
import EditNoteIcon from './icons/EditNoteIcon.vue';
import DOMPurify from 'dompurify';
import { ref, computed } from 'vue';
import { getGameId, getCharacterId, showToast } from '@/common/helpers';

const props = defineProps({
    model: String,
    viewCondition: Boolean,
    noteTitle: String,
    noteBody: String,
    noteId: Number,
    mode: String
});
const emit = defineEmits(['triggerNoteWasUpdated', 'triggerCloseNoteModal']);


const authStore = useAuthStore();
const characterStore = useCharacterStore();
const gameStore = useGameStore();
const characterMoveStore = useCharacterMoveStore();
const comboStore = useComboStore();


const createNoteActive = ref(false);
const createNoteTitle = ref(null);
const createNoteBody = ref(null);

const viewNoteActive = ref(false);
const viewNoteTitle = ref('');
const viewNoteBody = ref('');
const formattedNoteBody = computed(() => {
    const cleanHTML = DOMPurify.sanitize(props.noteBody?.replace(/\n/g, '<br>'));
    return cleanHTML;
});

const editNoteActive = ref(false);
const editNoteTitle = ref(null);
const editNoteBody = ref(null);


const updateCreateNoteTitle = (noteTitle: string) => {
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

const saveNote = (modelName: 'game' | 'character' | 'move' | 'combo') => {

    const gameId = getGameId();
    const characterId = getCharacterId();
    const characterMoveId = characterMoveStore.characterMove.id;
    const comboId = comboStore.combo.id;

    const note = {
        'title': createNoteTitle.value,
        'body': createNoteBody.value
    }

    if(
        note['title']?.length === 0 || note['body']?.length === 0
        || note['title'] === null || note['body'] === null
    ) {
        showToast('Please enter a title and body for your note.', 3000, 'error');
        return
    }

    const createNoteStoreActions = {
        'game': function () {
            return gameStore.saveGameNote(gameId, note);
        },
        'character': function () {
            return characterStore.saveCharacterNote(gameId, characterId, note)
        },
        'move': function () {
            return characterMoveStore.saveCharacterMoveNote(gameId, characterId, characterMoveId, note)
        },
        'combo': function () {
            return comboStore.saveCharacterComboNote(gameId, characterId, comboId, note)
        }
    };
    createNoteStoreActions[modelName]()
    .then(() => {
        createNoteActive.value = !createNoteActive.value
        createNoteTitle.value = null;
        createNoteBody.value = null;
        emit('triggerCloseNoteModal');
    });
};
const updateNote = (modelName: 'game' | 'character' | 'move' | 'combo') => {

    const gameId = getGameId();
    const characterId = getCharacterId();
    const characterMoveId = characterMoveStore.characterMove.id;
    const comboId = comboStore.combo.id;

    // These ternary statements handle when a User doesn't make any changes but still hits "Save" when editing.
    const note = {
        'title': editNoteTitle.value === null ? props.noteTitle : editNoteTitle.value,
        'body': editNoteBody.value === null ? props.noteBody : editNoteBody.value,
        'id': props.noteId
    }

    if(
        note['title']?.length === 0 || note['body']?.length === 0
        || note['title'] === null || note['body'] === null
    ) {
        showToast('Please enter a title and body for your note.', 3000, 'error');
        return
    }

    const updateNoteStoreActions = {
        'game': function () {
            return gameStore.updateGameNote(gameId, note);
        },
        'character': function () {
            return characterStore.updateCharacterNote(gameId, characterId, note)
        },
        'move': function () {
            return characterMoveStore.updateCharacterMoveNote(gameId, characterId, characterMoveId, note)
        },
        'combo': function () {
            return comboStore.updateCharacterComboNote(gameId, characterId, comboId, note)
        }
    };
    updateNoteStoreActions[modelName]()
    .then(() => {
        emit('triggerNoteWasUpdated', { newTitle: note.title, newBody: note.body, noteId: note.id });
        editNoteActive.value = !editNoteActive.value
        editNoteTitle.value = null;
        editNoteBody.value = null;
        emit('triggerCloseNoteModal');
    });
};

</script>
<template lang="">
    <div>
        <div id="view-note-overlay" class="bg-black opacity-[.95] fixed h-screen w-full top-0 left-0 right-0 bottom-0" :class="{ 'hidden': viewCondition === false }"></div>
        <div class="">
            <div class="absolute flex flex-col justify-between h-screen top-0 bottom-0 right-0 left-0 border-2 border-white rounded p-8 bg-apex-blue md:mx-[20rem] xl:mx-[30rem]" :class="{'hidden': viewCondition === false }">
                <div class="overflow-y-auto">
                    <div v-if="mode === 'create'" class="flex flex-col">
                        <input type="text" :value="noteTitle" @input="updateCreateNoteTitle($event.target.value)" class="bg-white text-black" placeholder="Enter note title...">
                        <textarea name="" :value="noteBody" @input="updateCreateNoteBody($event.target.value)" id="" class="bg-white text-black p-2" cols="30" rows="10"></textarea>
                    </div>
                    <div v-if="mode === 'edit'" class="flex flex-col">
                        <input type="text" :value="noteTitle" @input="updateEditNoteTitle($event.target.value)" class="bg-white text-black" placeholder="Enter note title...">
                        <textarea name="" :value="noteBody" @input="updateEditNoteBody($event.target.value)" id="" class="bg-white text-black p-2" cols="30" rows="10"></textarea>
                    </div>
                    <div v-if="mode === 'view'" class="flex flex-col text-white space-y-2">
                        <h3 class="text-3xl text-apex-yellow">{{ noteTitle }}</h3>
                        <p v-html="formattedNoteBody" class="p-1"></p>
                    </div>
                </div>
                <div class="flex flex-row justify-end">
                    <div class="flex flex-col items-center cursor-pointer" v-if="mode === 'view'">
                        <EditNoteIcon 
                            class="h-12 w-12 fill-green"
                            :class="{ 'hidden': viewCondition === false }"
                            @click="$emit('triggerOpenEditNoteModal', ({id: props.noteId, title: props.noteTitle , body: props.noteBody}))"
                        />
                        <p class="">Edit</p>
                    </div>
                    <div class="flex flex-col items-center cursor-pointer" v-if="mode === 'create'">
                        <CheckmarkIcon 
                            class="h-12 w-12 fill-green"
                            :class="{ 'hidden': viewCondition === false }"
                            @click="saveNote(props.model)"
                        />
                        <p>Save</p>
                    </div>
                    <div class="flex flex-col items-center cursor-pointer" v-if="mode === 'edit'">
                        <CheckmarkIcon
                            class="h-12 w-12 fill-green"
                            :class="{ 'hidden': viewCondition === false }"
                            @click="updateNote(props.model)"
                        />
                        <p>Save</p>
                    </div>
                    <div class="flex flex-col items-center cursor-pointer">
                        <CloseIcon
                            class="h-12 w-12 text-red"
                            :class="{ 'hidden': viewCondition === false }"
                            @click="$emit('triggerCloseNoteModal')"
                        />
                        <p>Close</p>
                    </div>
                </div>  
            </div>
        </div> 
    </div>
</template>
<style lang="">
    
</style>