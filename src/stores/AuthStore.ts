import { defineStore } from 'pinia';
import trainingModeApi from '../axios-http';
import { useCharacterMoveStore } from "@/stores/CharacterMoveStore";
import { useCharacterStore } from "@/stores/CharacterStore";
import { useGameStore } from "@/stores/GameStore";
import { useNavigationStore } from "@/stores/NavigationStore";
import { useComboStore } from "@/stores/ComboStore";

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
                    this.token = response.data.token;
                    this.loggedInUser = response.data.user
                    
                    gameStore.fetchGames();
                    gameStore.fetchGameNotes(gameStore.game.id);
                    characterStore.fetchCharacterNotes(gameStore.game.id, characterStore.character.id);
                    characterMoveStore.fetchCharacterMoves(gameStore.game.id, characterStore.character.id);
                    comboStore.fetchCharacterCombos(gameStore.game.id, characterStore.character.id);
                });
            } catch (error) {
                console.log(error);
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