<script lang="ts">
import { RouterLink, RouterView } from "vue-router";
import NavBar from './components/NavBar.vue';
import { useAuthStore } from "./stores/AuthStore";
import { useGameStore } from "./stores/GameStore";
import { useCharacterStore } from "./stores/CharacterStore";
import { getCharacterId, getGameId } from "./common/helpers";

export default {
  setup() {
    const loginStore = useAuthStore();
    const gameStore = useGameStore();
    const characterStore = useCharacterStore();

    return {
      gameStore,
      characterStore,
      getGameId
    }
  },
  components: {
    NavBar,
    RouterView
  },
  created() {
    const gameId = getGameId();
    const characterId = getCharacterId();

    this.gameStore.fetchGames()
    .then(() => {
      this.gameStore.setGame(gameId);
    })
    this.gameStore.fetchDirectionalInputs();
    this.gameStore.fetchAttackButtons(gameId);
    this.gameStore.fetchGameNotations(gameId);
    this.characterStore.fetchCharacters(gameId)
    .then(() => {
      this.characterStore.setCharacter(characterId);
    });
  }
}
</script>

<template>
    <main class="flex justify-center">
      <div id="main" class="bg-apex-blue text-white w-full xs:h-screen relative">
        <div id="#overlay" class="absolute z-0 bg-apex-blue w-full h-full opacity-[.98]"></div>
        <div class="z-50 absolute">
          <NavBar></NavBar>
          <RouterView />
        </div>
      </div>
    </main>
</template>

<style scoped>
#main {
  background-image: url('@/assets/art_bg_001.png');
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
}
</style>
