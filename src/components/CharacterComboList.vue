<script lang="ts">
import AddIcon from './icons/AddIcon.vue';
import CheckmarkIcon from './icons/CheckmarkIcon.vue';
import CloseIcon from './icons/CloseIcon.vue';
import EllipsisIcon from './icons/EllipsisIcon.vue';
import MagnifyingGlass from './icons/MagnifyingGlass.vue';
import HelpCircleOutlineIcon from './icons/HelpCircleOutlineIcon.vue';
import OpenOutlineIcon from './icons/OpenOutlineIcon.vue';

import DirectionalInputSwitcher from './DirectionalInputSwitcher.vue';
import AttackButtonSwitcher from './AttackButtonSwitcher.vue';
import ComboInputDisplay from './ComboInputDisplay.vue';
import GameNotationGroup from './GameNotationGroup.vue';
import CharacterCombo from './CharacterCombo.vue';
import LegendOverlay from './LegendOverlay.vue';
import CharacterComboShowModal from './CharacterComboShowModal.vue';
import SearchBar from './SearchBar.vue';

import { useAuthStore } from '@/stores/AuthStore';
import { useComboStore } from '@/stores/ComboStore';
import { useCharacterStore } from '@/stores/CharacterStore';
import { useGameStore } from '@/stores/GameStore';
import { ref, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

export default {
    setup(params) {
        const route = useRoute();
        const router = useRouter();
        const authStore = useAuthStore();
        const comboStore = useComboStore();
        const characterStore = useCharacterStore();
        const gameStore = useGameStore();
        const comboList = computed(() => comboStore.characterComboListDisplay)

        let createComboActive = ref(false);
        const editCharacterComboModeActive = ref(false);
        const editCharacterComboId = ref(0);
        const inputsForEditCharacterCombo = ref([]);
        let searchByTagsInput = ref('');

        const characterComboOptionsActive = ref([]);
        const characterComboEditTagsActive = ref([]);

        const showAttackButtonLegendOverlay = ref(false);
        const openAttackButtonLegendOverlay = () => {
            showAttackButtonLegendOverlay.value = true;
        }
        const closeAttackButtonLegendOverlay = () => {
            showAttackButtonLegendOverlay.value = false;
        }

        const openCreateComboModal = () => {
            createComboActive.value = !createComboActive.value;
        };
        const closeCreateComboModal = () => {
            createComboActive.value = false;
        };

        const closeEditCharacterComboModal = () => {
            editCharacterComboModeActive.value = false;
            comboStore.clearComboInputsDisplay();
        };

        const saveCharacterCombo = () => {
            if(comboStore.comboInputsDisplay.length === 0 ) {
                alert('Please input a combo.')
                return;
            }
            if(Object.keys(characterStore.character).length === 0) {
                alert('Please select a character first.')
                return;
            }

            const game = gameStore.getGame;
            const character = characterStore.getCharacter;
            comboStore.saveCharacterCombo(gameStore.game.id, characterStore.character.id, comboStore.comboInputsDisplay)
            .then(() => {
                comboStore.clearComboInputsDisplay();
                closeCreateComboModal();
            });
        };

        const editCharacterCombo = () => {
            const comboId = editCharacterComboId.value;
            comboStore.updateCharacterCombo(gameStore.game.id, characterStore.character.id, comboId, comboStore.comboInputsDisplay)
            .then(() => toggleEditComboMode(comboId));
        }

        const toggleEditComboMode = (comboId: number, comboInputs: object[] = []) => {
            editCharacterComboId.value === comboId ?
                editCharacterComboId.value = 0
                : editCharacterComboId.value = comboId;

            editCharacterComboModeActive.value = !editCharacterComboModeActive.value;
            if(comboInputs.length !== 0) {
                comboStore.populateComboInputsDisplay(comboInputs);
            }
            
        }

        const deleteCharacterCombo = (comboId: number) => {
            // ! May need to rework this if it doesn't work in mobile app
            if(window.confirm("Are you sure you want to delete this combo?")) {
                comboStore.deleteCharacterCombo(route.params.game, route.params.character, comboId);
            }
        }

        let comboOptionsActive = ref(0);

        const toggleComboOptions = (comboId: number, event) => {
            if(event.target.__vueParentComponent !== undefined) {
                if(event.target.__vueParentComponent.attrs['aria-labelledby'] === 'Close move options') {
                    characterComboOptionsActive.value.splice(characterComboOptionsActive.value.indexOf(comboId), 1);
                    if(characterComboEditTagsActive.value.includes(comboId)) {
                        toggleEditTagsMode(comboId);
                    }
                }
                return;
            }

            if(!characterComboOptionsActive.value.includes(comboId)) {
                characterComboOptionsActive.value.push(comboId);
            } else if(characterComboOptionsActive.value.includes(comboId)) {
                characterComboOptionsActive.value.splice(characterComboOptionsActive.value.indexOf(comboId), 1);
            }
        };

        const toggleEditTagsMode = (comboId: number) => {
            if(!characterComboEditTagsActive.value.includes(comboId)) {
                characterComboEditTagsActive.value.push(comboId);
            } else if(characterComboEditTagsActive.value.includes(comboId)) {
                characterComboEditTagsActive.value.splice(characterComboEditTagsActive.value.indexOf(comboId), 1);
            }

        }

        const addTagToCharacterCombo = (newTag, comboId) => {
            comboStore.addTagToCharacterCombo(route.params.game, route.params.character, comboId, newTag);
        }

        const removeTagFromCharacterCombo = (tagId: string, comboId: string) => {
            comboStore.removeTagFromCharacterCombo(route.params.game, route.params.character, comboId, tagId);
        }

        const addTagToSearchList = (event) => {
            if(event.target.tagName === 'SPAN') {
                comboStore.addCharacterComboTagToSearchList(event.target.textContent);
                comboStore.updateCharacterComboListDisplay();
                searchByTagsInput.value = '';
                return;
            }
            comboStore.addCharacterComboTagToSearchList(searchByTagsInput.value);
            comboStore.updateCharacterComboListDisplay();
            searchByTagsInput.value = '';
        }

        const removeTagFromSearchList = (tag) => {
            comboStore.removeCharacterComboTagFromSearchList(tag);
            comboStore.updateCharacterComboListDisplay();
        }

        const openCharacterComboModal = (comboId: number, comboInputs: object[]) => {
            comboStore.setCharacterCombo(comboId)
            .then(() => {
                showCharacterComboModal.value = true;
                selectedCharacterComboId.value = comboId;
            })
        }

        const closeCharacterComboModal = (comboId: number) => {
            showCharacterComboModal.value = false;
            selectedCharacterComboId.value = null;
        }

        const showCharacterComboModal = ref(false);

        const selectedCharacterComboId = ref(null);

        const updateSearchByTagsInput = (searchValue: string) => {
            searchByTagsInput.value = searchValue;
        }
        watch(searchByTagsInput, () => {
            gameStore.updateTagSearchCriteria(searchByTagsInput.value)
            .then(() => {
                gameStore.updateTagsListDisplay();
            })
        });

        return {
            route,
            router,

            authStore,
            comboStore,
            characterStore,
            gameStore,

            comboList,
            createComboActive,
            searchByTagsInput,
            openCreateComboModal,
            closeCreateComboModal,
            closeEditCharacterComboModal,
            saveCharacterCombo,
            deleteCharacterCombo,
            comboOptionsActive,
            toggleComboOptions,
            toggleEditTagsMode,
            addTagToSearchList,
            characterComboEditTagsActive,
            characterComboOptionsActive,
            addTagToCharacterCombo,
            removeTagFromCharacterCombo,
            removeTagFromSearchList,
            toggleEditComboMode,
            editCharacterComboModeActive,
            inputsForEditCharacterCombo,
            editCharacterCombo,

            showAttackButtonLegendOverlay,
            openAttackButtonLegendOverlay,
            closeAttackButtonLegendOverlay,

            openCharacterComboModal,
            closeCharacterComboModal,
            showCharacterComboModal,
            selectedCharacterComboId,

            updateSearchByTagsInput
        }
    },
    components: {
        AddIcon,
        CheckmarkIcon,
        CloseIcon,
        EllipsisIcon,
        MagnifyingGlass,
        OpenOutlineIcon,
        GameNotationGroup,
        DirectionalInputSwitcher,
        AttackButtonSwitcher,
        ComboInputDisplay,
        CharacterCombo,
        HelpCircleOutlineIcon,
        LegendOverlay,
        CharacterComboShowModal,
        SearchBar
    }
}
</script>
<template lang="">
    <div class="mt-8">
        <div class="flex flex-col space-y-2 px-2 xl:px-[19rem]">
            <div v-if="comboList.length !== 0" class="flex flex-row items-center ml-5">
                <SearchBar 
                    :placeholder="'Enter tag'" 
                    :searchType="'tags'" 
                    @trigger-update-search-by-tags-input="updateSearchByTagsInput" 
                    @trigger-add-tag-to-search-list="addTagToSearchList" 
                />
            </div>
            <div class="flex flex-row space-x-2 flex-wrap">
                <div v-if="searchByTagsInput.length !== 0" v-for="(tag, index) in gameStore.tagsListDisplay" class="border rounded p-1">
                    <div class="" @click="addTagToSearchList($event)">
                        <span>{{tag.name}}</span>
                    </div>
                </div>
                <div v-for="(tag, index) in comboStore.searchByTagsList" :key="index" class="">
                    <div
                        class="flex flex-row items-center bg-apex-yellow text-black rounded p-1 space-x-1"
                        
                    >
                        <span>{{tag}}</span>
                        <CloseIcon class="h-5 w-5" @click="removeTagFromSearchList(tag)" />
                    </div>
                </div>
            </div>
            <div v-if="authStore.loggedInUser === null" class="flex flex-row justify-center">
                <p class="font-bold text-xl text-center">Must be logged in to view character combos!</p>
            </div>
            <div v-if="authStore.loggedInUser !== null">
                <p v-if="comboStore.combos.length === 0" class="flex justify-center font-bold text-2xl">Add your combos!</p>
            </div>
            <ul class="space-y-2 overflow-y-auto h-[14rem] xs:h-[14rem] lg:h-96 pb-[3rem]">
                <li v-for="(combo, index) in comboList" 
                    :key="combo.id"
                    class="flex flex-col"
                >
                    <div class="flex flex-col w-full">
                        <div class="flex flex-row items-center space-x-2 w-full">
                            <p class="font-bold text-xl">{{ index + 1 }}</p>
                            <CharacterCombo
                                class="border rounded p-2 xs:w-[22.5rem] w-[20rem] md:w-[61.75rem] lg:w-[67rem] overflow-x-auto bg-white text-black"
                                @save-tag="addTagToCharacterCombo"
                                @trigger-remove-tag="removeTagFromCharacterCombo"
                                :inputs="combo.inputs"
                                :comboId="combo.id"
                                :editTagsActive="characterComboEditTagsActive"
                            />
                        </div>
                        <div class="flex flex-row justify-end space-x-2">
                            <button v-if="characterComboOptionsActive.includes(combo.id)" @click="deleteCharacterCombo(combo.id)">
                                <span class="border border-red rounded p-2 bg-red font-bold text-white">Delete</span>
                            </button>
                            <button v-if="characterComboOptionsActive.includes(combo.id)" @click="toggleEditComboMode(combo.id, combo.inputs)">
                                <span v-if="editCharacterComboModeActive === combo.id" class="border border-yellow rounded p-2 bg-yellow font-bold text-black">Done</span>
                                <span v-else class="border border-blue rounded p-2 bg-blue font-bold text-white">Edit</span>
                            </button>
                            <button v-if="characterComboOptionsActive.includes(combo.id)" @click="toggleEditTagsMode(combo.id)">
                                <span v-if="characterComboEditTagsActive.includes(combo.id)" class="border border-yellow rounded p-2 bg-yellow font-bold text-black">Done</span>
                                <span v-else class="border border-yellow rounded p-2 bg-yellow font-bold text-black">Add Tags</span>
                            </button>
                            <CloseIcon v-if="characterComboOptionsActive.includes(combo.id)" class="h-10 w-10" aria-labelledby="Close move options" @click="toggleComboOptions(combo.id, $event)"/>
                            <EllipsisIcon v-else class="h-10 w-10 fill-white" aria-labelledby="Open move options" @click="toggleComboOptions(combo.id, $event)" />
                            <div class="flex justify-center items-center">
                                <OpenOutlineIcon class="h-10 w-10" @click="openCharacterComboModal(combo.id, combo.inputs)" />
                            </div>
                        </div>
                    </div>
                    <div v-if="selectedCharacterComboId === combo.id">
                        <CharacterComboShowModal
                            @trigger-close-character-combo-modal="closeCharacterComboModal(combo.id)"
                            :comboId="combo.id" 
                            :inputs="combo.inputs" 
                            :comboNotes="combo.notes"
                            :showCharacterComboModal="showCharacterComboModal"
                        />
                    </div>
                </li>
                
            </ul>
        </div>
        <div class="bg-black opacity-[.99] fixed h-screen w-full top-0 left-0 right-0 bottom-0" :class="{ 'hidden': createComboActive === false }"></div>
        <div class="bg-black opacity-[.99] fixed h-screen w-full top-0 left-0 right-0 bottom-0" :class="{ 'hidden': editCharacterComboModeActive === false }"></div>
        <!-- Create Combo -->
        <div>
            <div class="absolute h-screen top-0 bottom-0 right-0 left-0 pt-2 flex flex-col justify-between" :class="{'hidden': createComboActive === false }">
                <div class="fixed top-0 right-0 w-full">
                    <ComboInputDisplay />
                </div>
                <div class="px-2 mt-20 sm:mb-4">
                    <GameNotationGroup />
                </div>
                <div class="flex flex-col items-center justify-center sm:justify-between">
                    <div class="flex justify-end w-full">
                        <HelpCircleOutlineIcon class="h-8 w-8 text-white fill-white" @click="openAttackButtonLegendOverlay()" />
                    </div>
                    <LegendOverlay
                        :showLegendOverlay="showAttackButtonLegendOverlay === true"
                        :showGameNotations="false"
                        :showAttackButtons="true"
                        :closeIconStyles="['text-white', 'h-20', 'w-20', 'fill-white']"
                        :descriptionsStyles="['text-yellow', 'text-xl']"
                        :descriptionsContainerStyles="['space-y-4', 'xs:h-[49rem]']"
                        @trigger-close-legend-overlay="closeAttackButtonLegendOverlay()"
                    />
                    <div class="flex flex-row">
                        <DirectionalInputSwitcher class=""/>
                        <div class="w-0.5 h-full border rounded border-gray"></div>
                        <AttackButtonSwitcher class="" />
                    </div>
                </div>
                <div class="flex flex-row justify-between text-xl mb-2 w-full px-2">
                    <button class="bg-red p-2 rounded text-white" @click="closeCreateComboModal()">Cancel</button>
                    <button class="bg-green p-2 rounded text-white" @click="saveCharacterCombo()">Save</button>
                    <button class="bg-red text-white p-2 rounded" @click="comboStore.clearComboInputsDisplay">Clear</button>
                    <button class="bg-yellow p-2 rounded" @click="comboStore.eraseComboInput">Erase</button>
                </div>
            </div>
            <div v-if="authStore.loggedInUser !== null">
                <AddIcon
                    class="h-20 w-20 absolute bottom-[-3rem] xs:bottom-[-3rem] lg:bottom-4 right-4 fill-green"
                    :class="{ 'hidden': createComboActive === true || showCharacterComboModal === true }" 
                    @click="openCreateComboModal()" 
                />
            </div>
        </div>

        <!-- Edit Combo -->
        <div>
            <div class="absolute h-screen top-0 bottom-0 right-0 left-0 pt-2" :class="{'hidden': editCharacterComboModeActive === false }">
                <div class="my-2">
                    <ComboInputDisplay
                        :inputs="inputsForEditCharacterCombo"
                    />
                </div>
                <div class="px-2">
                    <GameNotationGroup />
                </div>
                <div class="flex flex-row items-center justify-center">
                    <DirectionalInputSwitcher class=""/>
                    <div class="w-0.5 h-full border rounded border-gray"></div>
                    <AttackButtonSwitcher class="" />
                </div>
                <div class="flex flex-row justify-between text-xl mb-2 w-full px-2">
                    <button class="bg-red p-2 rounded text-white" @click="closeEditCharacterComboModal()">Cancel</button>
                    <button class="bg-green p-2 rounded text-white" @click="editCharacterCombo()">Save</button>
                    <button class="bg-red text-white p-2 rounded" @click="comboStore.clearComboInputsDisplay">Clear</button>
                    <button class="bg-yellow p-2 rounded" @click="comboStore.eraseComboInput">Erase</button>
                </div>
            </div>
        </div>
    </div>
</template>
<style scoped>
    button > span {
        @apply text-sm;
    }
</style>