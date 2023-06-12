import { useAuthStore } from "@/stores/AuthStore";
import { useCharacterMoveStore } from "@/stores/CharacterMoveStore";
import { useCharacterStore } from "@/stores/CharacterStore";
import { useGameStore } from "@/stores/GameStore";
import { useNavigationStore } from "@/stores/NavigationStore";
import { useComboStore } from "@/stores/ComboStore";

const authStore = useAuthStore();
const characterMoveStore = useCharacterMoveStore();
const characterStore = useCharacterStore();
const gameStore = useGameStore();
const navigationStore = useNavigationStore();
const comboStore = useComboStore();

export const renderComboInput = (input: string) => {
    comboStore.addComboInputToDisplay(input);
};

export const renderNotationInput = (notation: object) => {
    comboStore.addNotationToDisplay(notation);
}

export const addNotationToNotationDisplay = (notation: string) => {
    comboStore.notationsDisplay.push(notation);

}

// export const clearPiniaState = () => {
//     authStore.$reset();
//     characterMoveStore.$reset();
//     characterStore.$reset();
//     gameStore.$reset();
//     navigationStore.$reset();
//     comboStore.$reset(); 
// }