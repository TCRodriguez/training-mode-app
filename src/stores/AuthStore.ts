import { defineStore } from 'pinia';
import trainingModeApi from '../axios-http';
import { useCharacterMoveStore } from "@/stores/CharacterMoveStore";
import { useCharacterStore } from "@/stores/CharacterStore";
import { useGameStore } from "@/stores/GameStore";
import { useNavigationStore } from "@/stores/NavigationStore";
import { useComboStore } from "@/stores/ComboStore";
import { getGameId, getCharacterId, getCharacterMoveId, getCharacterComboId } from '@/common/helpers';
import { showToast } from '@/common/helpers';

export const useAuthStore = defineStore('AuthStore', {
    state: () => ({
        token: '',
        loggedInUser: null,
        loginFormActive: false,
        loginFormMessage: '',
        loginFailedMessage: '',
        credentialsCorrect: false,
        emailVerificationMessage: null,
        requestPasswordResetFormActive: false,
        passwordResetFormActive: false,
        betaTermsAndConditionsActive: false,
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
        async login(username: string, password: string) {
            const navigationStore = useNavigationStore();
            const gameStore = useGameStore();
            const characterStore = useCharacterStore();
            const characterMoveStore = useCharacterMoveStore();
            const comboStore = useComboStore();
            let apiResponse = null;
            try {
                await trainingModeApi.post('/login', {
                    username: username,
                    password: password,
                })
                .then(response => {
                    localStorage.setItem('authToken', response.data.token);
                    trainingModeApi.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
                    this.closeLoginForm();
                    this.token = response.data.token;
                    this.loggedInUser = response.data.user;
                    navigationStore.closeMenuModalContainer();

                    const gameId = getGameId();
                    const characterId = characterStore.character.id === undefined ? getCharacterId() : characterStore.character.id;
                    const characterMoveId = getCharacterMoveId();
                    const characterComboId = getCharacterComboId();
                    
                    gameStore.fetchGameNotes(gameId);
                    characterStore.fetchCharacters(gameId);
                    characterStore.fetchCharacterNotes(gameId, characterId);
                    characterMoveStore.fetchCharacterMoves(gameId, characterId);
                    characterMoveStore.fetchCharacterMoveNotes(gameId, characterId, characterMoveId);
                    comboStore.fetchCharacterCombos(gameId, characterId);
                    comboStore.fetchCharacterComboNotes(gameId, characterId, characterComboId);
                    gameStore.fetchGames(false)
                    .then(() => {
                        gameStore.setGame(gameId);
                    })
                    apiResponse = response;

                    showToast('Login successful!', 3000, 'success');
                    return response;
                });
            } catch (error) {
                console.log(error);
                apiResponse = error;
                return error;
            }

            return apiResponse;
        },
        async validateTokenAndFetchUser(token: string) {
            // Sets the default authorization header to get checked by the backend
            trainingModeApi.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            trainingModeApi.get('/validate-token')
            .then(response => {
                this.fetchUser()
                .then(() => {
                    this.token = token;
                });
            })
            .catch(error => {
                console.log(error);
            })

        },
        async fetchUser() {
            trainingModeApi.get('/user')
            .then(response => {
                this.loggedInUser = response.data;
                return response;
            });
        },
        async logout() {
            const gameStore = useGameStore();
            const characterStore = useCharacterStore();
            const characterMoveStore = useCharacterMoveStore();
            const comboStore = useComboStore();
            trainingModeApi.post('/logout')
            .then(response => {
                const gameId = getGameId();
                const characterId = characterStore.character.id === undefined ? getCharacterId() : characterStore.character.id;
                localStorage.removeItem('authToken');
                trainingModeApi.defaults.headers.common['Authorization'] = '';
                this.clearPiniaState();
                gameStore.fetchGames(true);
                characterStore.fetchCharacters(gameId);
                characterMoveStore.fetchCharacterMoves(gameId, characterId);
                comboStore.fetchCharacterCombos(gameId, characterId);

                return response;
            });
        },
        async oAuthLogin(provider: 'discord') {
            const redirectURL = window.location.href;
            window.location.href = `${import.meta.env.VITE_API_BASE_URL}/oauth/login/${provider}?redirectURL=${redirectURL}`;
        },
        async handleOAuthCallback(access_token: string, token_type: string) {
            if(token_type === 'Bearer') {
                trainingModeApi.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
                localStorage.setItem('authToken', access_token);
                this.token = access_token;
            }

            this.fetchUser()
        },
        async updateLoginFailedMessage(message: string) {
            this.loginFailedMessage = message;
            setTimeout(() => {
                this.loginFailedMessage = '';
            }, 5000);
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
                    showToast('Please check your email for your verification link. If you don\'t see it in your inbox please check your spam folder.', 5000, 'info');

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
        async openRequestPasswordResetForm() {
            this.requestPasswordResetFormActive = true;
        },
        async closeRequestPasswordResetForm() {
            this.requestPasswordResetFormActive = false;
        },
        async requestPasswordReset(email: string, returnURL: string) {
            let apiResponse = null;
            try {
                await trainingModeApi.post('/password/email-reset-link', {
                    email: email,
                    returnURL: returnURL,
                })
                .then(response => {
                    apiResponse = response;

                    // this.updateLoginFormMessage(response.data.message);
                    // this.loginFormMessage = response.data.message;
                    // setTimeout(() => {
                    //     this.updateLoginFormMessage('');
                    // }, 3000);

                    return response;
                });
            } catch (error) {
                console.log(error);
                apiResponse = error;
                return error;
            }

            return apiResponse;
        },
        async resetPassword(email: string, password: string, token: string) {
            let apiResponse = null;
            try {
                await trainingModeApi.post('/password/reset', {
                    email: email,
                    password: password,
                    token: token,
                })
                .then(response => {
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
        async openResetPasswordForm() {
            this.passwordResetFormActive = true;
        },
        async closeResetPasswordForm() {
            this.passwordResetFormActive = false;
        },
        async toggleBetaTermsAndConditions() {
            this.betaTermsAndConditionsActive = !this.betaTermsAndConditionsActive;
        }

    }
});