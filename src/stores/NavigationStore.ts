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
            console.log(this.navItems);
        },
        async toggleMenuModalContainer() {
            this.menuModalContainerActive = !this.menuModalContainerActive;
        },
        async toggleMenuModalItems() {
            this.menuModalItemsActive = !this.menuModalItemsActive;
        }
    }
});