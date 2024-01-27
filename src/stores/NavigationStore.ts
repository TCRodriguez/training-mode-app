import { defineStore } from 'pinia';

export const useNavigationStore = defineStore('NavigationStore', {
    state: () => ({
        navItems: [],
        dashboardItems: [
            {
                name: 'Game Data',
                icon: 'GameControllerIcon',
                link: '/games'
            },
        ],
        menuModalContainerActive: false,
        menuModalItemsActive: false,
        registrationFormActive: false,
    }),
    getters: {

    },
    actions: {
        async addNavigationItem(navItem: { name: string; link: string; type: string; }) {
            this.navItems.push(navItem);
        },
        async clearNavItems() {
            this.navItems = [];
        },
        async popCharacterNavItem() {
            this.navItems.pop();
        },
        async toggleMenuModalContainer() {
            this.menuModalContainerActive = !this.menuModalContainerActive;
        },
        async toggleMenuModalItems() {
            this.menuModalItemsActive = !this.menuModalItemsActive;
        },

        async openMenuModalItems() {
            this.menuModalItemsActive = true;
        },

        async closeMenuModalItems() {
            this.menuModalItemsActive = false;
        },
        async toggleRegistrationModal() {
            this.registrationFormActive = !this.registrationFormActive;
        },
        
        async openMenuModalContainer() {
            this.menuModalContainerActive = true;
        },

        async closeMenuModalContainer() {
            this.menuModalContainerActive = false;
        },

        async openRegistrationForm() {
            this.registrationFormActive = true;
        },
        async closeRegistrationForm() {
            this.registrationFormActive = false;
        },
    }
});