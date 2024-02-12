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
import { checkIfTagExists } from '@/common/helpers';

export default {
    setup(params) {
        const route = useRoute();
        const router = useRouter();
        const authStore = useAuthStore();
        const comboStore = useComboStore();
        const characterStore = useCharacterStore();
        const gameStore = useGameStore();
        const comboList = computed(() => comboStore.characterComboListDisplay);

        let createComboActive = ref(false);
        const createComboName = ref('');
        const editComboName = ref('');
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

        const handleCreateComboNameInputChange = (newComboName: string) => {
            createComboName.value = newComboName;
        };

        const handleEditComboNameInputChange = (editComboNameValue: string) => {
            editComboName.value = editComboNameValue;
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
            comboStore.saveCharacterCombo(createComboName.value, gameStore.game.id, characterStore.character.id, comboStore.comboInputsDisplay)
            .then(() => {
                createComboName.value = '';
                comboStore.clearComboInputsDisplay();
                closeCreateComboModal();
            });
        };

        const editCharacterCombo = () => {
            const comboId = editCharacterComboId.value;
            
            comboStore.updateCharacterCombo(editComboName.value, gameStore.game.id, characterStore.character.id, comboId, comboStore.comboInputsDisplay)
            .then(() => {
                editComboName.value = '';
                toggleEditComboMode(comboId);
                toggleComboOptions(comboId, undefined);
            });
        }

        const toggleEditComboMode = (comboId: number, comboInputs: object[] = []) => {
            if(editCharacterComboId.value !== comboId) {
                editCharacterComboId.value = comboId;
            }

            editCharacterComboModeActive.value = !editCharacterComboModeActive.value;
            editComboName.value = comboStore.combos.find(combo => combo.id === comboId)?.name;
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
            if(event === undefined) {
                characterComboOptionsActive.value.splice(characterComboOptionsActive.value.indexOf(comboId), 1);
                if(characterComboEditTagsActive.value.includes(comboId)) {
                    toggleEditTagsMode(comboId);
                }
                return;
            }
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
            if(!checkIfTagExists(searchByTagsInput.value)) {
                return;
            }
            if(event.target.tagName === 'SPAN') {
                comboStore.addCharacterComboTagToSearchList(event.target.textContent);
                comboStore.updateCharacterComboListDisplay('tags');
                searchByTagsInput.value = '';
                return;
            }

            comboStore.addCharacterComboTagToSearchList(searchByTagsInput.value);
            comboStore.updateCharacterComboListDisplay('tags');
            searchByTagsInput.value = '';
        }

        const removeTagFromSearchList = (tag) => {
            comboStore.removeCharacterComboTagFromSearchList(tag);
            comboStore.updateCharacterComboListDisplay('tags');
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
        const searchNoteByTagsInput = ref('');
        const switchSearchByOption = (option: string) => {
            comboStore.clearCharacterComboTagSearchList();
            searchByOptionSelection.value = option;
        }
        const updateCharacterComboSearchByTextValue = (searchValue: string) => {
            comboStore.updateCharacterComboSearchByTextCriteria(searchValue)
            .then(() => {
                comboStore.updateCharacterComboListDisplay('text');
            });
        }
        const updateSearchByTagsInput = (searchValue: string) => {
            searchByTagsInput.value = searchValue;
        }

        watch(searchByTagsInput, () => {
            gameStore.updateTagSearchCriteria(searchByTagsInput.value)
            .then(() => {
                gameStore.updateTagsListDisplay();
            })
        });

        const searchByOptionSelection = ref('text');

        return {
            route,
            router,

            authStore,
            comboStore,
            characterStore,
            gameStore,

            comboList,
            createComboActive,
            createComboName,
            editComboName,
            handleCreateComboNameInputChange,
            handleEditComboNameInputChange,
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

            updateSearchByTagsInput,
            searchByOptionSelection,
            switchSearchByOption,
            updateCharacterComboSearchByTextValue
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
    <div class="">
        <div class="flex flex-col px-2 xl:px-[19rem]">
            <div v-if="authStore.loggedInUser !== null" class="flex flex-row items-center space-x-2 justify-between my-2" :class="{ 'hidden': comboStore.combos.length === 0 }">
                <div class="flex flex-row items-center space-x-2">
                    <p>Search by:</p>
                    <button
                        class="text-white p-1" 
                        :class="{ 'border rounded': searchByOptionSelection === 'text'}"
                        @click="switchSearchByOption('text')"
                    >
                        <span>Text</span>
                    </button>
                    <button
    
                        class="text-white p-1" 
                        :class="{ 'border rounded': searchByOptionSelection === 'tags', 'opacity-50': authStore.loggedInUser === null}"
                        @click="switchSearchByOption('tags')"
                    >
                        <span>Tags</span>
                    </button>
                </div>
            </div>
            <div v-if="authStore.loggedInUser !== null" class="flex flex-row items-center">
                <SearchBar
                    v-if="searchByOptionSelection === 'text'"
                    :placeholder="'Enter title'" 
                    :searchType="'title'"
                    @trigger-update-search-input="updateCharacterComboSearchByTextValue"
                    :class="{'hidden': comboStore.combos.length === 0}"
                />
                <SearchBar 
                    v-if="searchByOptionSelection === 'tags'"
                    :placeholder="'Enter tag'" 
                    :searchType="'tags'"
                    :value="searchByTagsInput"
                    @trigger-update-search-by-tags-input="updateSearchByTagsInput" 
                    @trigger-add-tag-to-search-list="addTagToSearchList" 
                />
            </div>
            <div class="flex flex-row space-x-2 flex-wrap">
                <div v-for="(tag, index) in gameStore.tagsListDisplay" class="border rounded p-1">
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
            <div v-if="comboStore.searchByTagsList.length !== 0 && comboStore.characterComboListDisplay.length === 0" class="flex flex-row justify-center text-2xl mt-10">
                <div>No combos have that tag!</div>
            </div>
            <div v-if="comboStore.characterComboSearchByTextValue !== '' && comboStore.characterComboListDisplay.length === 0" class="flex flex-row justify-center text-2xl mt-10">
                <div>None of your combos have that title!</div>
            </div>
            <div v-if="authStore.loggedInUser === null" class="flex flex-row justify-center mt-[8rem]">
                <p class="font-bold text-xl text-center">Must be logged in to view character combos!</p>
            </div>
            <div v-if="comboStore.combos.length === 0 && authStore.loggedInUser !== null && authStore.loggedInUser !== undefined">
                <p class="flex justify-center font-bold text-2xl pt-[4rem]">Add your combos!</p>
            </div>
            <ul class="overflow-y-auto h-[14rem] xs:h-[14rem] lg:h-96 xs:pb-[3rem] lg:pb-[7rem]">
                <li v-for="(combo, index) in comboList" 
                    :key="combo.id"
                    class="flex flex-col"
                >
                    <div class="flex flex-col w-full">
                        <div class="flex flex-row items-center space-x-2 w-full">
                            <p class="font-bold text-xl">{{ index + 1 }}</p>
                            <CharacterCombo
                                class="border rounded p-2 xs:w-[22.5rem] w-[20rem] md:w-[61.75rem] lg:w-full overflow-x-auto bg-white text-black"
                                @save-tag="addTagToCharacterCombo"
                                @trigger-remove-tag="removeTagFromCharacterCombo"
                                :name="combo.name"
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
                            :name="combo.name"
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
            <div class="absolute h-screen top-0 bottom-0 right-0 left-0 flex flex-col justify-between" :class="{'hidden': createComboActive === false }">
                <div class="fixed top-0 right-0 w-full">
                    <div class="bg-black">
                        <input type="text" class="p-1 bg-black border-none" @input="handleCreateComboNameInputChange($event.target.value)" placeholder="Enter combo name...">
                    </div>
                    <ComboInputDisplay />
                </div>
                <div class="xs:px-2 md:px-[20rem] mt-[8rem] sm:mb-4">
                    <GameNotationGroup />
                </div>
                <div class="flex flex-col items-center justify-center sm:justify-between">
                    <LegendOverlay
                        :showLegendOverlay="showAttackButtonLegendOverlay === true"
                        :showGameNotations="false"
                        :showAttackButtons="true"
                        :closeIconStyles="['text-white', 'h-20', 'w-20', 'fill-white']"
                        :descriptionsStyles="['text-yellow', 'text-xl']"
                        :descriptionsContainerStyles="['space-y-4', 'overflow-y-auto', 'xs:h-[42rem]', 'pb-[5rem]']"
                        @trigger-close-legend-overlay="closeAttackButtonLegendOverlay()"
                    />
                    <div class="flex flex-row h-[16rem] xs:h-[16rem]">
                        <DirectionalInputSwitcher class=""/>
                        <div class="w-0.5 h-full border rounded border-gray mx-2"></div>
                        <AttackButtonSwitcher @trigger-open-attack-button-legend-overlay="openAttackButtonLegendOverlay()" />
                    </div>
                </div>
                <div class="flex flex-row justify-between xs:justify-between lg:justify-center lg:space-x-4 lg:text-3xl text-xl mb-2 w-full px-2">
                    <button class="bg-red p-2 rounded text-white" @click="closeCreateComboModal()">Cancel</button>
                    <button class="bg-green p-2 rounded text-white" @click="saveCharacterCombo()">Save</button>
                    <button class="bg-red text-white p-2 rounded" @click="comboStore.clearComboInputsDisplay">Clear</button>
                    <button class="bg-yellow p-2 rounded" @click="comboStore.eraseComboInput">Erase</button>
                </div>
            </div>
            <div v-if="authStore.loggedInUser !== null">
                <AddIcon
                    class="h-20 w-20 absolute xs:bottom-[-3rem] lg:bottom-4 right-4 md:right-[1rem] lg:right-[1rem] xl:right-[19rem] fill-green"
                    :class="{ 
                        'hidden': createComboActive === true || showCharacterComboModal === true || editCharacterComboModeActive === true,
                        'xs:bottom-[1.5rem] bottom-[1.5rem]': comboStore.characterComboSearchByTextValue !== ''
                    }" 
                    @click="openCreateComboModal()" 
                />
            </div>
        </div>

        <!-- Edit Combo -->
        <div>
            <div class="absolute h-screen top-0 bottom-0 right-0 left-0 pt-2" :class="{'hidden': editCharacterComboModeActive === false }">
                <div class="fixed top-0 right-0 w-full">
                    <div class="bg-black">
                        <input type="text" :value="editComboName" class="p-1 bg-black border-none" @input="handleEditComboNameInputChange($event.target.value)" placeholder="Enter combo name...">
                    </div>
                    <ComboInputDisplay
                        :inputs="inputsForEditCharacterCombo"
                    />
                </div>
                <div class="xs:px-2 md:px-[20rem] mt-[8rem] sm:mb-4">
                    <GameNotationGroup />
                </div>

                <div class="flex flex-col items-center justify-center">
                    <LegendOverlay
                        :showLegendOverlay="showAttackButtonLegendOverlay === true"
                        :showGameNotations="false"
                        :showAttackButtons="true"
                        :closeIconStyles="['text-white', 'h-20', 'w-20', 'fill-white']"
                        :descriptionsStyles="['text-yellow', 'text-xl']"
                        :descriptionsContainerStyles="['space-y-4', 'overflow-y-auto', 'xs:h-[42rem]', 'pb-[5rem]']"
                        @trigger-close-legend-overlay="closeAttackButtonLegendOverlay()"
                    />
                    <div class="flex flex-row items-start justify-center h-[16rem] xs:h-[16rem]">
                        <DirectionalInputSwitcher />
                        <div class="w-0.5 h-full border rounded border-gray"></div>
                        <AttackButtonSwitcher @trigger-open-attack-button-legend-overlay="openAttackButtonLegendOverlay()" />
                    </div>
                </div>
                <div class="flex flex-row justify-between xs:justify-between lg:justify-center lg:space-x-4 lg:text-3xl text-xl mb-2 w-full px-2">
                    <button class="bg-red p-2 rounded text-white" @click="closeEditCharacterComboModal()">Cancel</button>
                    <button class="bg-green p-2 rounded text-white" @click="editCharacterCombo()">Save</button>
                    <button class="bg-red text-white p-2 rounded" @click="comboStore.clearComboInputsDisplay">Clear</button>
                    <button class="bg-yellow p-2 rounded" @click="comboStore.eraseComboInput">Erase</button>
                </div>
            </div>
        </div>
    </div>
</template>