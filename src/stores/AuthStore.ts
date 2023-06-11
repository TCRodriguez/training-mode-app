import { defineStore } from 'pinia';
// import { clearPiniaState } from '@/common/helpers';
import trainingModeApi from '../axios-http';
import { useCharacterMoveStore } from "@/stores/CharacterMoveStore";
import { useCharacterStore } from "@/stores/CharacterStore";
import { useGameStore } from "@/stores/GameStore";
import { useNavigationStore } from "@/stores/NavigationStore";
import { useComboStore } from "@/stores/ComboStore";


export const useAuthStore = defineStore('AuthStore', {
    state: () => ({
        // navItems: [],
        token: null,
        loggedInUser: null,
        loginFormActive: false,
        notLoggedInMessage: 'Must be logged in to that!'

    }),
    getters: {

    },
    actions: {
        async toggleLoginModal() {
            this.loginFormActive = !this.loginFormActive;
        },
        async login(email: string, password: string) {
            try {
                await trainingModeApi.post('/login', {
                    email: email,
                    password: password,
                })
                .then(response => {
                    console.log(response);
                    this.token = response.data.token;
                    this.loggedInUser = response.data.user
                    
                })
            } catch (error) {
                console.log(error);
            }
        },
        async logout() {
            // this.loggedInUser = null;
            this.clearPiniaState();

            // ? do we need to make a new token or is it preferable to use the one that was already created if it hasn't expired?
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