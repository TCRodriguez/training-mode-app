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
      <div id="main" class="bg-apex-blue text-white w-full xs:h-screen sm:h-full lg:h-screen relative">
        <div id="#overlay" class="absolute z-0 bg-apex-blue w-full h-full opacity-[.98]"></div>
        <div class="z-50 absolute">
          <NavBar></NavBar>
          <RouterView />
        </div>
      </div>
    </main>
  <!-- <header>
    <img
      alt="Vue logo"
      class="logo"
      src="@/assets/logo.svg"
      width="125"
      height="125"
    />

    <div class="wrapper">
      <HelloWorld msg="You did it!" />

      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>
      </nav>
    </div>
  </header> -->
</template>

<style scoped>
#main {
  background-image: url('src/assets/art_bg_001.png');
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
}

/* header {
  line-height: 1.5;
  max-height: 100vh;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
} */
</style>
