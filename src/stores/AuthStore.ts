import { defineStore } from 'pinia';
import trainingModeApi from '../axios-http';
import { useCharacterMoveStore } from "@/stores/CharacterMoveStore";
import { useCharacterStore } from "@/stores/CharacterStore";
import { useGameStore } from "@/stores/GameStore";
import { useNavigationStore } from "@/stores/NavigationStore";
import { useComboStore } from "@/stores/ComboStore";
import { getGameId, getCharacterId, getCharacterMoveId, getCharacterComboId } from '@/common/helpers';

export const useAuthStore = defineStore('AuthStore', {
    state: () => ({
        token: null,
        loggedInUser: null,
        loginFormActive: false,
        loginFormMessage: '',
        loginFailedMessage: '',
        credentialsCorrect: false,
        emailVerificationMessage: null,
    }),
    getters: {

    },
    actions: {
        async toggleLoginModal() {
            this.loginFormActive = !this.loginFormActive;
        },
        async openLoginForm() {
            this.loginFormActive = true;
        },
        async closeLoginForm() {
            this.loginFormActive = false;
        },
        async login(email: string, password: string) {
            const navigationStore = useNavigationStore();
            const gameStore = useGameStore();
            const characterStore = useCharacterStore();
            const characterMoveStore = useCharacterMoveStore();
            const comboStore = useComboStore();
            let apiResponse = null;
            try {
                await trainingModeApi.post('/login', {
                    email: email,
                    password: password,
                })
                .then(response => {
                    this.toggleLoginModal();
                    this.token = response.data.token;
                    this.loggedInUser = response.data.user;
                    navigationStore.toggleMenuModalContainer();

                    const gameId = getGameId();
                    const characterId = characterStore.character.id === undefined ? getCharacterId() : characterStore.character.id;
                    const characterMoveId = getCharacterMoveId();
                    const characterComboId = getCharacterComboId();
                    
                    gameStore.fetchGames()
                    .then(() => {
                        gameStore.setGame(gameId);
                    })
                    gameStore.fetchGameNotes(gameId);
                    characterStore.fetchCharacters(gameId);
                    characterStore.fetchCharacterNotes(gameId, characterId);
                    characterMoveStore.fetchCharacterMoves(gameId, characterId);
                    characterMoveStore.fetchCharacterMoveNotes(gameId, characterId, characterMoveId);
                    comboStore.fetchCharacterCombos(gameId, characterId);
                    comboStore.fetchCharacterComboNotes(gameId, characterId, characterComboId);
                    apiResponse = response;
                    return response;
                });
            } catch (error) {
                console.log(error);
                apiResponse = error;
                return error;
            }

            return apiResponse;
        },
        async logout() {
            this.clearPiniaState();
        },
        async updateLoginFailedMessage(message: string) {
            this.loginFailedMessage = message;
            setTimeout(() => {
                this.loginFailedMessage = '';
            }, 3000);
        },
        async resendVerificationLink(email: string) {
            let apiResponse = null;
            try {
                await trainingModeApi.post(`/email/resend-verification-email`, {
                    email: email,
                })
                .then(response => {
                    apiResponse = response;
                    this.updateLoginFailedMessage('');
                    this.updateLoginFormMessage(response.data.message);
                    this.loginFormMessage = response.data.message;
                    setTimeout(() => {
                        this.updateLoginFormMessage('');
                    }, 3000);

                    return response;
                });
            } catch (error) {
                console.log(error);
                apiResponse = error;
                return error;
            }

            return apiResponse;
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
        },
        async registerUser(username: string, email: string, password: string, returnURL: string) {
            let apiResponse = null;
            try {
                await trainingModeApi.post('/users/register', {
                    username: username,
                    email: email,
                    password: password,
                    returnURL: returnURL,
                })
                .then(response => {
                    apiResponse = response;
                    this.updateLoginFormMessage(response.data.message);
                    this.loginFormMessage = response.data.message;
                    setTimeout(() => {
                        this.updateLoginFormMessage('');
                    }, 3000);

                    return response;
                });
            } catch (error) {
                console.log(error);
                apiResponse = error;
                return error;
            }

            return apiResponse;
        },
        async updateLoginFormMessage(message: string) {
            this.loginFormMessage = message;
        },

        async updateCredentialsCorrect(credentialsCorrect: boolean) {
            this.credentialsCorrect = credentialsCorrect;
        },
    }
});