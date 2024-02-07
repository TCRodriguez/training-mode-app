import { createPinia } from "pinia";
import { useAuthStore } from "@/stores/AuthStore";
import { useCharacterMoveStore } from "@/stores/CharacterMoveStore";
import { useCharacterStore } from "@/stores/CharacterStore";
import { useGameStore } from "@/stores/GameStore";
import { useNavigationStore } from "@/stores/NavigationStore";
import { useComboStore } from "@/stores/ComboStore";
import { toast, type ToastOptions } from "vue3-toastify";

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
    const gameStore = useGameStore();
    
    if(localStorage.getItem('game') === null) {
        return gameStore.game.abbreviation;
    }
    return localStorage.getItem('game');
}

export const getInputImgFilename = (inputName: string) => {
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

export const getCharacterComboId = () => {
    return localStorage.getItem('characterComboId');
}

export const updateSearchNoteByTextCriteria = (modelName: 'game' | 'character' | 'move' | 'combo', searchValue: string) => {
    const gameStore = useGameStore();
    const characterStore = useCharacterStore();
    const characterMoveStore = useCharacterMoveStore();
    const comboStore = useComboStore();
    
    const updateNoteSearch = () => {
        const updateNoteListDisplay = {
            'game': function () {
                return gameStore.updateSearchGameNoteByTextCriteria(searchValue)
                .then(() => {
                    gameStore.updateGameNoteListDisplay('text');
                });
            },
            'character': function () {
                return characterStore.updateCharacterNoteSearchByTextCriteria(searchValue)
                .then(() => {
                    characterStore.updateCharacterNoteListDisplay();
                });
            },
            'move': function () {
                return characterMoveStore.updateCharacterMoveNoteSearchByTextCriteria(searchValue)
                .then(() => {
                    characterMoveStore.updateCharacterMoveNoteListDisplay();
                })
            },
            'combo': function () {
                return comboStore.updateCharacterComboNoteSearchByTextCriteria(searchValue)
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
            'combo': function () {
                return comboStore.updateSearchCharacterComboNoteByTagsCriteria(searchValue)
                .then(() => {
                    comboStore.updateCharacterComboNoteTagsListDisplay();
                })
            }
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
    const characterId = getCharacterId();

    const gameId = getGameId();

    const addNoteTag = () => {
        const addNoteTagActions = {
            'game': function () {
                gameStore.updateNewGameNoteTagLoadingState();
                return gameStore.addTagToGameNote(resourceId, noteId, newTag)
            },
            'character': function () {
                characterStore.updateNewCharacterNoteTagLoadingState();
                return characterStore.addTagToCharacterNote(gameStore.game.id, resourceId, noteId, newTag)
            },
            'move': function () {
                characterMoveStore.updateNewCharacterMoveNoteTagLoadingState();
                return characterMoveStore.addTagToCharacterMoveNote(gameStore.game.id, noteId, newTag)
            },
            'combo': function () {
                comboStore.updateNewComboNoteTagLoadingState();
                return comboStore.addTagToCharacterComboNote(gameId, characterId, noteId, newTag)
            }
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
            'combo': function () {
                return comboStore.removeTagFromCharacterComboNote(gameId, noteId, tagId)
            }
        };
        removeTagFromNoteActions[modelName]();
    }
    return removeNoteTag();
}

export const showToast = (message: string, timeout: number, type: 'success' | 'error' | 'warn' | 'info') => {
    switch(type) {
        case 'success':
            return toast.success(message, {
                autoClose: timeout,
                position: toast.POSITION.TOP_CENTER,
            } as ToastOptions );
        case 'error':
            return toast.error(message, {
                autoClose: timeout,
                position: toast.POSITION.TOP_CENTER,
            } as ToastOptions );
        case 'warn':
            return toast.warn(message, {
                autoClose: timeout,
                position: toast.POSITION.TOP_CENTER,
            } as ToastOptions );
        case 'info':
            return toast.info(message, {
                autoClose: timeout,
                position: toast.POSITION.TOP_CENTER,
            } as ToastOptions );
    }
};

export const closeMenu = () => {
    const navigationStore = useNavigationStore();
    const authStore = useAuthStore();
    navigationStore.closeMenuModalContainer();
    navigationStore.closeMenuModalItems();
    navigationStore.closeRegistrationForm();
    authStore.closeLoginForm();
    authStore.updateCredentialsCorrect(false);
    authStore.updateLoginFailedMessage('');
    authStore.closeRequestPasswordResetForm();
    authStore.closeResetPasswordForm();
};

export const getQueryParam = (param: string) => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
};

export const sortList = (list: any[], sortType: 'asc' | 'desc', sortProperty: 'title' | 'updated_at') => {
    if(sortProperty === 'updated_at') {
        list.forEach(item => {
            item.updated_at = new Date(item.updated_at);
        });
    }
    
    const sortList = {
        'desc': function () {
            return list.sort((a, b) => {
                if (a[sortProperty] > b[sortProperty]) {
                    return -1;
                }
                if (a[sortProperty] < b[sortProperty]) {
                    return 1;
                }
                return 0;
            });
        },
        'asc': function () {
            return list.sort((a, b) => {
                if (a[sortProperty] > b[sortProperty]) {
                    return 1;
                }
                if (a[sortProperty] < b[sortProperty]) {
                    return -1;
                }
                return 0;
            });
        }
    };
    return sortList[sortType]();
};

export const checkIfTagExists = (tagToCheck: string) => {
    const gameStore = useGameStore();
    const tagExists = gameStore.tags.some(tag => tag.name.toLowerCase() === tagToCheck.toLowerCase());

    return tagExists;
}