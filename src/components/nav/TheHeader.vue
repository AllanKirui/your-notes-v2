<template>
  <header class="header">
    <nav class="nav flex flex-ai-c flex-jc-sb">
      <div class="nav-left flex">
        <div class="nav-logo">
          <router-link to="/todos">
            <img
              class="logo"
              src="@/assets/img/logo.min.svg"
              alt="your notes v2 logo"
              width="168"
              height="27.6"
            />
            <h3 class="logo-text">Your Notes <i>v2</i></h3>
          </router-link>
        </div>
        <div class="nav-search flex flex-jc-c">
          <img
            class="search"
            src="@/assets/img/search.min.svg"
            alt="search icon"
            width="20"
          />
          <input type="text" :placeholder="routeName" />
        </div>
      </div>

      <div class="nav-right flex flex-ai-c">
        <div class="nav-avatar flex flex-ai-c flex-jc-c">
          <div class="image-wrapper">
            <img class="avatar" :src="user.photoURL" alt=" " />
            <span class="initials">{{ setInitials(user.displayName) }}</span>
          </div>
          <p class="username">{{ user.displayName }}</p>
        </div>
        <div class="nav-menu">
          <button class="menu-btn" title="show menu">
            <img src="@/assets/img/dropdown.min.svg" alt=" " />
          </button>
          <!-- TODO: menu goes here-->
        </div>
      </div>
    </nav>
  </header>
</template>

<script>
export default {
  computed: {
    routeName() {
      return "Search " + this.$route.name;
    },
    user() {
      return this.$store.getters["auth/user"];
    },
  },
  methods: {
    setInitials(name) {
      if (!name) {
        return "You";
      }

      let initials = "";
      let wordsInName = name.split(" ");

      // check if the username is multi-worded
      if (wordsInName.length > 1) {
        let firstWord = wordsInName[0];
        let secondWord = wordsInName[1];

        // return the first letter of the first two words
        initials = firstWord.split("")[0] + secondWord.split("")[0];
        return initials;
      }
      // return the first letter of the only available word
      return wordsInName[0].split("")[0];
    },
  },
};
</script>

<style scoped>
.header {
  width: 100%;
  height: 5rem;
  background-color: var(--color-eerie-black);
}

.nav {
  padding: 0 1.875rem;
  width: 100%;
  height: 100%;
  color: var(--color-platinum);
}

.nav-logo {
  position: relative;
  margin-right: 3.125rem;
  width: 10.5rem;
}

.logo {
  position: relative;
  max-width: 100%;
  z-index: 2;
}

.logo-text {
  position: absolute;
  top: 50%;
  left: 10%;
  transform: translateY(-50%);
  color: var(--color-cultured);
  text-align: center;
  z-index: 1;
}

.nav-search {
  border-left: 2px solid var(--color-pantone-green);
  font-weight: 400;
  font-size: 0.875rem;
  width: 25rem;
}

.nav-search img {
  margin-left: 0.75rem;
}

.nav-search input {
  padding: 0 5px;
  margin-left: 0.625rem;
  width: 100%;
  height: 100%;
  border: none;
  outline: none;
  background: transparent;
  font-family: inherit;
  font-size: inherit;
}

.nav-search input,
.nav-search input::placeholder {
  color: var(--color-platinum);
  letter-spacing: 0.2px;
}

.nav-right {
  gap: 20px;
}

.nav-avatar .image-wrapper {
  position: relative;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  background-color: var(--color-traffic-grey);
  overflow: hidden;
}

.nav-avatar .image-wrapper .avatar {
  position: relative;
  max-width: 100%;
  z-index: 2;
}

.nav-avatar .image-wrapper .initials {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 1.125rem;
  font-weight: 500;
  text-transform: uppercase;
  z-index: 1;
}

.nav-avatar .username {
  margin-left: 1.125rem;
  font-size: 0.875rem;
}

.nav-menu {
  width: 1.25rem;
  height: 1.25rem;
}

.nav-menu .menu-btn {
  background: transparent;
  border: none;
  outline: none;
  cursor: pointer;
}

.nav-menu .menu-btn:hover {
  outline: 1px solid var(--color-traffic-grey);
}
</style>