import { defineStore } from 'pinia';

export const useAuthStore = defineStore('AuthStore', {
    state: () => ({
        // navItems: [],
        token: null,
        loggedInUser: null,

    }),
    getters: {

    },
    actions: {
        async login() {

        }
    }
});