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

export const getCharacterMoveId = () => {
    return localStorage.getItem('characterMoveId');
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
                    gameStore.updateGameNoteListDisplay('text');
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

export const updateSearchNoteByTagsCriteria = (modelName: 'game' | 'character' | 'move' | 'combo', searchValue: string) => {
    const gameStore = useGameStore();
    const characterStore = useCharacterStore();
    const characterMoveStore = useCharacterMoveStore();
    const comboStore = useComboStore();

    
    console.log(modelName);
    const updateNoteSearch = () => {
        const updateNoteListDisplay = {
            'game': function () {
                return gameStore.updateSearchGameNoteByTagsCriteria(searchValue)
                .then(() => {
                    gameStore.updateGameNoteTagsListDisplay();
                    // gameStore.updateGameNoteListDisplay('tags');
                });
            },
            'character': function () {
                return characterStore.updateSearchCharacterNoteByTagsCriteria(searchValue)
                .then(() => {
                    characterStore.updateCharacterNoteTagsListDisplay();
                });
            },
            'move': function () {
                return characterMoveStore.updateSearchCharacterMoveNoteByTagsCriteria(searchValue)
                .then(() => {
                    characterMoveStore.updateCharacterMoveNoteTagsListDisplay();
                })
            },
            // 'combo': function () {
            //     return comboStore.updateCharacterComboNoteSearchCriteria(searchValue)
            //     .then(() => {
            //         comboStore.updateCharacterComboNoteListDisplay();
            //     })
            // }
        };
        updateNoteListDisplay[modelName]();
    }
    updateNoteSearch();

}

export const callAddTagToNote = (modelName: 'game' | 'character' | 'move' | 'combo', resourceId: number, noteId: number, newTag: string) => {
    const gameStore = useGameStore();
    const characterStore = useCharacterStore();
    const characterMoveStore = useCharacterMoveStore();
    const comboStore = useComboStore();

    const addNoteTag = () => {
        const addNoteTagActions = {
            'game': function () {
                return gameStore.addTagToGameNote(resourceId, noteId, newTag)
            },
            'character': function () {
                return characterStore.addTagToCharacterNote(gameStore.game.id, resourceId, noteId, newTag)
            },
            'move': function () {
                return characterMoveStore.addTagToCharacterMoveNote(gameStore.game.id, resourceId, noteId, newTag)
            },
            // 'combo': function () {
            //     return comboStore.updateCharacterComboNoteSearchCriteria(searchValue)
            //     .then(() => {
            //         comboStore.updateCharacterComboNoteListDisplay();
            //     })
            // }
        };
        addNoteTagActions[modelName]();
    }
    return addNoteTag();
}

export const callRemoveTagFromNote = (modelName: 'game' | 'character' | 'move' | 'combo', resourceId: number, noteId: number, tagId: number) => {
    const gameStore = useGameStore();
    const characterStore = useCharacterStore();
    const characterMoveStore = useCharacterMoveStore();
    const comboStore = useComboStore();
    const gameId = getGameId();

    const removeNoteTag = () => {
        const removeTagFromNoteActions = {
            'game': function () {
                return gameStore.removeTagFromGameNote(gameId, noteId, tagId)
            },
            'character': function () {
                return characterStore.removeTagFromCharacterNote(gameId, noteId, tagId)

            },
            'move': function () {
                return characterMoveStore.removeTagFromCharacterMoveNote(gameId, noteId, tagId);
            },
            // 'combo': function () {
            //     return comboStore.updateCharacterComboNoteSearchCriteria(searchValue)
            //     .then(() => {
            //         comboStore.updateCharacterComboNoteListDisplay();
            //     })
            // }
        };
        removeTagFromNoteActions[modelName]();
    }
    return removeNoteTag();
}