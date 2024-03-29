<script lang="ts" setup>
import { useGameStore } from '@/stores/GameStore';
import { useCharacterStore } from '@/stores/CharacterStore';
import HelpCircleOutlineIcon from './icons/HelpCircleOutlineIcon.vue';
import FollowedByIcon from './icons/FollowedByIcon.vue';
import GameNotation from './GameNotation.vue';
import CloseIcon from './icons/CloseIcon.vue';
import AttackButton from './AttackButton.vue';
import { ref, computed } from 'vue';

const gameStore = useGameStore();
const characterStore = useCharacterStore();
const characterNotations = computed(() => characterStore.character.notations);

const props = defineProps({
    closeIconStyles: Array,
    descriptionsStyles: Array,
    showLegendOverlay: Boolean,
    showGameNotations: Boolean,
    showAttackButtons: Boolean,
    descriptionsContainerStyles: Array
})

</script>
<template lang="">
    <div>
        <div class="bg-black opacity-[.99] fixed h-screen w-full top-0 left-0 right-0 bottom-0" :class="{ 'hidden': showLegendOverlay === false}"></div>
        <div class="absolute h-screen top-0 bottom-0 right-0 left-0 p-2" :class="{ 'hidden': showLegendOverlay === false}">
            <div v-if="showLegendOverlay === true">
                <div v-if="showGameNotations" :class="descriptionsContainerStyles">
                    <div v-for="characterNotation in characterNotations"
                        class=""
                    >
                        <div class="flex flex-row space-x-2">
                            <div>
                                <p class="font-bold bg-apex-blue p-2">
                                    "<span class="text-white">{{ `${characterNotation.notation}` }}</span>":
                                </p>
                            </div>
                            <div class="flex flex-row items-center">
                                <p>
                                    {{ characterNotation.description }}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div v-for="notation in gameStore.gameNotations" :key="notation.id" :class="descriptionsStyles">
                        <div class="flex flex-row space-x-2">
                            <div v-if="notation.notation === '>'" class="flex flex-row items-center space-x-2">
                                "
                                <FollowedByIcon
                                    class="h-5 w-5 fill-apex-yellow"
                                />
                                ": 
                                <p>
                                    {{ notation.description }}
                                </p>
                            </div>
                            <div v-else class="flex flex-row items-center space-x-2">
                                <p class="font-bold">
                                    "<span class="text-apex-yellow">{{ `${notation.notation}` }}</span>":
                                </p>
                                <p>
                                    {{ notation.description }}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <div v-if="showAttackButtons" :class="descriptionsContainerStyles">
                    <div v-for="attackButton in gameStore.attackButtons" :key="attackButton.id" :class="descriptionsStyles">
                        <div class="flex flex-row text-white space-x-2 items-center">
                            <div class="flex flex-row items-center">
                                <AttackButton
                                    :iconFileName="attackButton.icon_file_name" 
                                    :game="gameStore.game.abbreviation" 
                                    :attack="attackButton"
                                    class="h-10 w-10" 
                                />
                                <span>:</span>
                            </div>
                            <p>{{attackButton.name}}</p>
                        </div>
                    </div>
                </div>
            </div>       
            <div class="absolute bottom-4 right-4">
                <CloseIcon :class="props.closeIconStyles" @click="$emit('triggerCloseLegendOverlay')" />
            </div> 
        </div>
    </div>
</template>
<style lang="">
    
</style>