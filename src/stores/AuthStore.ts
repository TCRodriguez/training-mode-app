import { defineStore } from 'pinia';
import trainingModeApi from '../axios-http';
import { useCharacterMoveStore } from "@/stores/CharacterMoveStore";
import { useCharacterStore } from "@/stores/CharacterStore";
import { useGameStore } from "@/stores/GameStore";
import { useNavigationStore } from "@/stores/NavigationStore";
import { useComboStore } from "@/stores/ComboStore";
import { getGameId, getCharacterId } from '@/common/helpers';

export const useAuthStore = defineStore('AuthStore', {
    state: () => ({
        token: null,
        loggedInUser: null,
        loginFormActive: false,
    }),
    getters: {

    },
    actions: {
        async toggleLoginModal() {
            this.loginFormActive = !this.loginFormActive;
        },
        async login(email: string, password: string) {
            const gameStore = useGameStore();
            const characterStore = useCharacterStore();
            const characterMoveStore = useCharacterMoveStore();
            const comboStore = useComboStore();
            try {
                await trainingModeApi.post('/login', {
                    email: email,
                    password: password,
                })
                .then(response => {
                    console.log(response);
                    this.toggleLoginModal();
                    this.token = response.data.token;
                    this.loggedInUser = response.data.user

                    const gameId = getGameId();
                    const characterId = characterStore.character.id === undefined ? getCharacterId() : characterStore.character.id;
                    
                    gameStore.fetchGames()
                    .then(() => {

                        gameStore.setGame(gameId);
                    })
                    gameStore.fetchGameNotes(gameId);
                    characterStore.fetchCharacters(gameId);
                    characterStore.fetchCharacterNotes(gameId, characterId);
                    characterMoveStore.fetchCharacterMoves(gameId, characterId);
                    comboStore.fetchCharacterCombos(gameId, characterId);
                    return response;
                });
            } catch (error) {
                console.log(error);
                return error;
            }
        },
        async logout() {
            this.clearPiniaState();
        },
        async clearPiniaState () {
            const characterMoveStore = useCharacterMoveStore();
            const characterStore = useCharacterStore();
            const gameStore = useGameStore();
            const navigationStore = useNavigationStore();
            const comboStore = useComboStore();

            const authStore = useAuthStore();

            authStore.$reset();
            characterMoveStore.$reset();
            characterStore.$reset();
            gameStore.$reset();
            navigationStore.$reset();
            comboStore.$reset(); 
        }
    }
});