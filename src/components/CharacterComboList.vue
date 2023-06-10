<script lang="ts">
import AddIcon from './icons/AddIcon.vue';
import CheckmarkIcon from './icons/CheckmarkIcon.vue';
import CloseIcon from './icons/CloseIcon.vue';
import EllipsisIcon from './icons/EllipsisIcon.vue';
import MagnifyingGlass from './icons/MagnifyingGlass.vue';
import DirectionalInputSwitcher from './DirectionalInputSwitcher.vue';
import AttackButtonSwitcher from './AttackButtonSwitcher.vue';
import ComboInputDisplay from './ComboInputDisplay.vue';
import GameNotationGroup from './GameNotationGroup.vue';
import CharacterCombo from './CharacterCombo.vue';
import { useComboStore } from '@/stores/ComboStore';
import { useCharacterStore } from '@/stores/CharacterStore';
import { useGameStore } from '@/stores/GameStore';
import { ref, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
export default {
    setup(params) {
        const route = useRoute();
        const router = useRouter();
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
            console.log(characterStore.character);
            if(comboStore.comboInputsDisplay.length === 0 ) {
                alert('Please input a combo.')
                return;
            }
            if(Object.keys(characterStore.character).length === 0) {
                console.log('character not set');
                alert('Please select a character first.')
                return;
            }
            console.log(comboStore.comboInputsDisplay);

            const game = gameStore.getGame;
            const character = characterStore.getCharacter;
            console.log(game?.id);
            console.log(character?.id);
            console.log(characterStore.character);
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

            // editCharacterComboId.value = comboId;
            editCharacterComboModeActive.value = !editCharacterComboModeActive.value;
            // inputsForEditCharacterCombo.value.push(comboInputs);
            if(comboInputs.length !== 0) {
                comboStore.populateComboInputsDisplay(comboInputs);
            }
            console.log(comboStore.comboInputsDisplay);
            
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
                console.log(event.target.__vueParentComponent.attrs['aria-labelledby']);
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
            // console.log(characterMoveEditTagsActive.value);
            // characterMoveEditTagsActive.value !== moveId 
            //     ? characterMoveEditTagsActive.value = moveId 
            //     : characterMoveEditTagsActive.value = 0;
            // console.log("characterMoveEditTagsActive is " + characterMoveEditTagsActive.value);
            if(!characterComboEditTagsActive.value.includes(comboId)) {
                characterComboEditTagsActive.value.push(comboId);
            } else if(characterComboEditTagsActive.value.includes(comboId)) {
                characterComboEditTagsActive.value.splice(characterComboEditTagsActive.value.indexOf(comboId), 1);
            }

            console.log(characterComboOptionsActive.value);
        }

        const addTagToCharacterCombo = (newTag, comboId) => {
            // alert(moveId);

            comboStore.addTagToCharacterCombo(route.params.game, route.params.character, comboId, newTag)
            .then(() => {
                // alert('yes?');
                // addTagActive.value = !addTagActive.value


            })
        }

        const removeTagFromCharacterCombo = (tagId: string, comboId: string) => {
            console.log(tagId);
            console.log(comboId);
            // console.log(route.params.game);
            comboStore.removeTagFromCharacterCombo(route.params.game, route.params.character, comboId, tagId);
        }

        const addTagToSearchList = (event) => {
            /**
             * ! Here's where we can add a check to see if the tag actually exists
             * ! and if it doesn't then do something like automatically choosing
             * ! the first tag that appears.
             */

            console.log(event);
            if(event.target.tagName === 'SPAN') {
                comboStore.addCharacterComboTagToSearchList(event.target.textContent);
                comboStore.updateCharacterComboListDisplay();
                searchByTagsInput.value = '';
                return;
            }
            console.log(searchByTagsInput);
            comboStore.addCharacterComboTagToSearchList(searchByTagsInput.value);
            // alert('add tag to search list');
        }

        const removeTagFromSearchList = (tag) => {
            comboStore.removeCharacterComboTagFromSearchList(tag);
            comboStore.updateCharacterComboListDisplay();
        }

        watch(searchByTagsInput, () => {
            // console.log(searchByTagsInput);
            gameStore.updateTagSearchCriteria(searchByTagsInput.value)
            .then(() => {
                gameStore.updateTagsListDisplay();
            })
        });

        return {
            route,
            router,
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
            editCharacterCombo
        }
    },
    components: {
        AddIcon,
        CheckmarkIcon,
        CloseIcon,
        EllipsisIcon,
        MagnifyingGlass,
        GameNotationGroup,
        DirectionalInputSwitcher,
        AttackButtonSwitcher,
        ComboInputDisplay,
        CharacterCombo
    }
}
</script>
<template lang="">
    <div class="mt-8">
        <div class="flex flex-col space-y-2">
            <div v-if="comboList.length !== 0" class="flex flex-row items-center">
                <MagnifyingGlass class="h-10 w-10" />
                <!-- <input type="text" placeholder="Enter tag" v-model="searchByTagsInput" @keyup.enter="addTagToSearchList($event)"> -->
                <input type="text" placeholder="Enter tag" v-model="searchByTagsInput">
            </div>
            <div class="flex flex-row space-x-2 flex-wrap">
                <div v-if="searchByTagsInput.length !== 0" v-for="(tag, index) in gameStore.tagsListDisplay" class="border rounded p-1">
                    <div class="" @click="addTagToSearchList($event)">
                        <span>{{tag.name}}</span>
                    </div>
                </div>
                <div v-for="(tag, index) in comboStore.searchByTagsList" :key="index" class="">
                    <div
                        class="flex flex-row items-center bg-blue text-white rounded p-1 space-x-1"
                        
                    >
                        <span>{{tag}}</span>
                        <CloseIcon class="h-5 w-5" @click="removeTagFromSearchList(tag)" />
                    </div>
                </div>
            </div>
            <p v-if="comboStore.combos.length === 0" class="flex justify-center font-bold text-2xl">Add your combos!</p>
            <ul class="space-y-2 overflow-y-auto xs:h-[18.5rem] lg:h-96">
                <li v-for="(combo, index) in comboList" 
                    :key="index"
                    class="flex flex-row"
                >
                    <!-- <div class="flex items-center">
                        <p class="font-bold text-xl mr-2">{{index + 1}}</p>
                    </div> -->
                    <div class="flex flex-col w-full">
                        <div class="flex flex-row items-center space-x-2">
                            <p class="font-bold text-xl">{{ index + 1 }}</p>
                            <CharacterCombo
                                class="border rounded p-2 overflow-x-auto w-full"
                                @save-tag="addTagToCharacterCombo"
                                @trigger-remove-tag="removeTagFromCharacterCombo"
                                :inputs="combo.inputs"
                                :comboId="combo.id"
                                :editTagsActive="characterComboEditTagsActive"
                            />
                        </div>
                        <div class="flex flex-row justify-end space-x-2">
                            <!-- <div v-if="comboOptionsActive"> -->
                            <button v-if="characterComboOptionsActive.includes(combo.id)" @click="deleteCharacterCombo(combo.id)">
                                <span class="border border-red rounded p-2 bg-red font-bold text-white">Delete</span>
                            </button>
                            <!-- </div> -->
                            <button v-if="characterComboOptionsActive.includes(combo.id)" @click="toggleEditTagsMode(combo.id)">
                                <span v-if="characterComboEditTagsActive.includes(combo.id)" class="border border-yellow rounded p-2 bg-yellow font-bold text-black">Done</span>
                                <span v-else class="border border-yellow rounded p-2 bg-yellow font-bold text-black">Edit Tags</span>
                            </button>
                            <button v-if="characterComboOptionsActive.includes(combo.id)" @click="toggleEditComboMode(combo.id, combo.inputs)">
                                <span v-if="editCharacterComboModeActive === combo.id" class="border border-yellow rounded p-2 bg-yellow font-bold text-black">Done</span>
                                <span v-else class="border border-blue rounded p-2 bg-blue font-bold text-white">Edit</span>
                            </button>
                            <CloseIcon v-if="characterComboOptionsActive.includes(combo.id)" class="h-10 w-10" aria-labelledby="Close move options" @click="toggleComboOptions(combo.id, $event)"/>
                            <EllipsisIcon v-else class="h-10 w-10" aria-labelledby="Open move options" @click="toggleComboOptions(combo.id, $event)" />
                        </div>
                    </div>
                
                </li>
                
            </ul>
        </div>
        <div class="bg-black opacity-[.99] fixed h-screen w-full top-0 left-0 right-0 bottom-0" :class="{ 'hidden': createComboActive === false }"></div>
        <div class="bg-black opacity-[.99] fixed h-screen w-full top-0 left-0 right-0 bottom-0" :class="{ 'hidden': editCharacterComboModeActive === false }"></div>
        <!-- Create Combo -->
        <div>
            <div class="absolute h-screen top-0 bottom-0 right-0 left-0 pt-2 flex flex-col justify-between" :class="{'hidden': createComboActive === false }">
                <div class="my-2">
                    <ComboInputDisplay
                        @trigger-close-create-combo-modal="closeCreateComboModal()" 
                        @trigger-save-character-combo="saveCharacterCombo()"
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
                    <button class="bg-red p-2 rounded text-white" @click="closeCreateComboModal()">Cancel</button>
                    <button class="bg-green p-2 rounded text-white" @click="saveCharacterCombo()">Save</button>
                    <button class="bg-red text-white p-2 rounded" @click="comboStore.clearComboInputsDisplay">Clear</button>
                    <button class="bg-yellow p-2 rounded" @click="comboStore.eraseComboInput">Erase</button>
                    <!-- <button class="bg-green" @click="enterFullScreen()">Go Fullscreen</button>
                    <button class="bg-green" @click="splitComboSections()">Split combo sections</button>
                    <button class="bg-cyan-500" @click="presentComboVertically()">Present combo vertically</button>
                    <button class="bg-cyan-500" @click="saveCharacterCombo()">Save Combo</button> -->
                </div>
            </div>
            <div class="">
                <AddIcon
                    class="h-20 w-20 absolute bottom-4 right-4"
                    :class="{ 'hidden': createComboActive === true }" 
                    @click="openCreateComboModal()" 
                />
                <!-- <CheckmarkIcon 
                    class="h-20 w-20 fill-green absolute bottom-4 right-4"
                    :class="{ 'hidden': createComboActive === false }"
                    @click="saveCharacterCombo()"
                />
                <CloseIcon
                    class="h-20 w-20 text-red absolute bottom-4 left-4"
                    :class="{ 'hidden': createComboActive === false }"
                    @click="closeCreateComboModal()"
                /> -->
            </div>
        </div>

        <!-- Edit Combo -->
        <div>
            <div class="absolute h-screen top-0 bottom-0 right-0 left-0 pt-2" :class="{'hidden': editCharacterComboModeActive === false }">
                <!-- <div class="">
                    <ComboInputDisplay :inputs="inputsForEditCharacterCombo" />
                </div>
                <div>

                </div>
                <div class="flex flex-row items-center">
                    <DirectionalInputSwitcher />
                    <AttackButtonSwitcher />
                </div> -->
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
                    <!-- <button class="bg-green" @click="enterFullScreen()">Go Fullscreen</button>
                    <button class="bg-green" @click="splitComboSections()">Split combo sections</button>
                    <button class="bg-cyan-500" @click="presentComboVertically()">Present combo vertically</button>
                    <button class="bg-cyan-500" @click="saveCharacterCombo()">Save Combo</button> -->
                </div>

            </div>
            <div class="">
                <!-- <AddIcon
                    class="h-20 w-20 absolute bottom-4 right-4"
                    :class="{ 'hidden': editCharacterComboModeActive === true }" 
                    @click="openCreateComboModal()" 
                /> -->
                <!-- <CheckmarkIcon 
                    class="h-20 w-20 fill-green absolute bottom-4 right-4"
                    :class="{ 'hidden': editCharacterComboModeActive === false }"
                    @click="editCharacterCombo()"
                />
                <CloseIcon
                    class="h-20 w-20 text-red absolute bottom-4 left-4"
                    :class="{ 'hidden': editCharacterComboModeActive === false }"
                    @click="closeEditCharacterComboModal()"
                /> -->
            </div>
        </div>
    </div>
</template>
<style lang="">
    
</style>