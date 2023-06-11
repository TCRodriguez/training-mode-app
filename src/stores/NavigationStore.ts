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
            // {
            //     name: 'Articles',
            //     icon:''
            // }
        ]

    }),
    getters: {

    },
    actions: {
        async addNavigationItem(navItem: { name: string; link: string; type: string; }) {
            this.navItems.push(navItem);
            console.log(this.navItems);
        },
        async clearNavItems() {
            this.navItems = [];
        },
        async popCharacterNavItem() {
            this.navItems.pop();
            console.log(this.navItems);
        }
    }
});