import { createPinia } from "pinia";
import { useAuthStore } from "@/stores/AuthStore";
import { useCharacterMoveStore } from "@/stores/CharacterMoveStore";
import { useCharacterStore } from "@/stores/CharacterStore";
import { useGameStore } from "@/stores/GameStore";
import { useNavigationStore } from "@/stores/NavigationStore";
import { useComboStore } from "@/stores/ComboStore";

// const authStore = useAuthStore();
// const characterMoveStore = useCharacterMoveStore();
// const characterStore = useCharacterStore();
// const gameStore = useGameStore();
// const navigationStore = useNavigationStore();

export const renderComboInput = (input: string) => {
    const comboStore = useComboStore();
    comboStore.addComboInputToDisplay(input);
};

export const renderNotationInput = (notation: object) => {
    const comboStore = useComboStore();
    comboStore.addNotationToDisplay(notation);
}

export const addNotationToNotationDisplay = (notation: string) => {
    const comboStore = useComboStore();
    comboStore.notationsDisplay.push(notation);
}

export const getGameAbbreviation = () => {
    
    return localStorage.getItem('game');
}

export const getInputImgFilename = (inputName: string) => {
    // console.log(inputName);
    return localStorage.getItem(inputName);
}

export const getCharacterName = () => {
    return localStorage.getItem('character');
}

export const getGameId = () => {
    return localStorage.getItem('gameId');
}

export const getCharacterId = () => {
    return localStorage.getItem('characterId');
}

export const updateSearchNoteByTextCriteria = (modelName: 'game' | 'character' | 'move' | 'combo', searchValue: string) => {
    const gameStore = useGameStore();
    const characterStore = useCharacterStore();
    const characterMoveStore = useCharacterMoveStore();
    const comboStore = useComboStore();

    
    console.log(modelName);
    const updateNoteSearch = () => {
        const updateNoteListDisplay = {
            'game': function () {
                return gameStore.updateSearchGameNoteByTextCriteria(searchValue)
                .then(() => {
                    gameStore.updateGameNoteListDisplay();
                });
            },
            'character': function () {
                return characterStore.updateCharacterNoteSearchCriteria(searchValue)
                .then(() => {
                    characterStore.updateCharacterNoteListDisplay();
                });
            },
            'move': function () {
                return characterMoveStore.updateCharacterMoveNoteSearchCriteria(searchValue)
                .then(() => {
                    characterMoveStore.updateCharacterMoveNoteListDisplay();
                })
            },
            'combo': function () {
                return comboStore.updateCharacterComboNoteSearchCriteria(searchValue)
                .then(() => {
                    comboStore.updateCharacterComboNoteListDisplay();
                })
            }
        };
        updateNoteListDisplay[modelName]();
    }
    return updateNoteSearch();
}

// export const updateSearchNoteByTagCriteria

