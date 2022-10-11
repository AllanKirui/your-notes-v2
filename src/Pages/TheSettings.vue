<template>
  <section class="settings-wrapper flex flex-jc-c">
    <base-card :mode="cardStyle">
      <div class="title flex flex-ai-c flex-jc-sb">
        <h2 class="title-text">Settings</h2>
        <div class="back-btn-wrapper">
          <button
            class="back-btn"
            title="All settings"
            v-if="screenSize <= 768 && isMobileView && activeSide"
            @click="removeActiveSide"
          >
            <span class="head"></span>
          </button>
        </div>
      </div>

      <div class="options">
        <div class="options-links-wrapper">
          <ul class="options-links">
            <li
              :class="[activeSide === 'appearance' ? 'active' : '', 'link']"
              title="Change appearance"
              @click="setActiveSide('appearance')"
            >
              <div class="flex flex-ai-c">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 64 64"
                  stroke-width="3"
                  stroke="currentColor"
                  fill="none"
                  width="25"
                >
                  <path
                    d="M34.07,50.93S53.86,44.38,45.68,26.6c0,0-4.8-11.46-19.31-13.27S8.3,20.8,8.3,20.8,1.81,33.68,13.1,35c1.62.19,5-.56,6.4,1.33s.29,4.2,0,8.8C19.34,47.69,21.27,53.87,34.07,50.93Z"
                    stroke-linecap="round"
                  />
                  <circle
                    cx="17.2"
                    cy="24.01"
                    r="3.59"
                    stroke-linecap="round"
                  />
                  <circle
                    cx="38.02"
                    cy="28.02"
                    r="2.43"
                    stroke-linecap="round"
                  />
                  <circle
                    cx="38.02"
                    cy="39.04"
                    r="2.43"
                    stroke-linecap="round"
                  />
                  <circle
                    cx="28.14"
                    cy="44.38"
                    r="2.43"
                    stroke-linecap="round"
                  />
                  <path
                    d="M54,12.62c-.69,3.31-2.07,10.9-2.18,27a.41.41,0,0,0,.41.41h4.91a.41.41,0,0,0,.41-.42c-.1-2.82-.74-18.12-2.75-27A.41.41,0,0,0,54,12.62Z"
                    stroke-linecap="round"
                  />
                  <path
                    d="M57.48,43.8c0,1.53-1.92,7.37-2.78,7.37s-2.78-5.84-2.78-7.37a2.78,2.78,0,1,1,5.56,0Z"
                    stroke-linecap="round"
                  />
                </svg>
                <span class="link-text">Appearance</span>
              </div>
            </li>
            <li
              :class="[activeSide === 'passwords' ? 'active' : '', 'link']"
              title="Change password"
              @click="setActiveSide('passwords')"
            >
              <div class="flex flex-ai-c">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 64 64"
                  stroke-width="3"
                  stroke="currentColor"
                  fill="none"
                  width="25"
                >
                  <rect
                    x="12.34"
                    y="25.5"
                    width="39.32"
                    height="30.95"
                    rx="1.5"
                  />
                  <path
                    d="M32,7.55h0A11.29,11.29,0,0,1,43.29,18.84V25.5a0,0,0,0,1,0,0H20.71a0,0,0,0,1,0,0V18.84A11.29,11.29,0,0,1,32,7.55Z"
                  />
                  <circle cx="32" cy="42.83" r="3.76" />
                  <line x1="32" y1="46.6" x2="32" y2="51.83" />
                </svg>
                <span class="link-text">Passwords</span>
              </div>
            </li>
          </ul>
        </div>

        <div
          class="options-contents"
          :style="{ display: activeSide ? 'initial' : 'none' }"
        >
          <!-- appearance settings -->
          <div class="content" v-if="activeSide === 'appearance'">
            <h3 class="content-title">Choose Your Theme</h3>
            <p class="content-meta">Select how Your Notes looks to you.</p>
            <div class="themes-wrapper flex flex-jc-c flex-fw-w">
              <div
                :class="[!theme ? 'active' : '', 'wrapper']"
                @click="setTheme('default')"
              >
                <div class="theme theme-1"></div>
                <div class="theme-options flex flex-ai-c flex-jc-c">
                  <span class="dot"></span>
                  <span class="text">Default theme</span>
                </div>
              </div>

              <div
                :class="[theme === 'purplish' ? 'active' : '', 'wrapper']"
                @click="setTheme('purplish')"
              >
                <div class="theme theme-2"></div>
                <div class="theme-options flex flex-ai-c flex-jc-c">
                  <span class="dot"></span>
                  <span class="text">Purplish theme</span>
                </div>
              </div>
            </div>
          </div>

          <!-- password settings -->
          <div class="content" v-else-if="activeSide === 'passwords'">
            <h3 class="content-title">Change Your Password</h3>
          </div>
        </div>
      </div>
    </base-card>
  </section>
</template>

<script>
export default {
  data() {
    return {
      activeSide: "appearance",
      screenSize: null,
      isMobileView: false,
    };
  },
  computed: {
    theme() {
      return this.$store.getters.theme;
    },
    cardStyle() {
      let mode = "";

      // for default theme
      if (!this.theme) {
        mode = "default-theme";
      }

      // for purplish theme
      if (this.theme === "purplish") {
        mode = "purplish-theme";
      }

      return mode;
    },
  },
  methods: {
    setActiveSide(side) {
      this.activeSide = side;
    },
    setTheme(theme) {
      if (theme === "default") {
        // dispatch an action to set the default theme
        this.$store.dispatch("setTheme", null);
        return;
      }

      // dispatch an action to set any other selected theme
      this.$store.dispatch("setTheme", theme);
    },
    checkWindowSize() {
      // listen to the resize event
      window.addEventListener("resize", () => {
        this.screenSize = window.innerWidth;
      });
    },
    removeActiveSide() {
      this.activeSide = null;
    },
  },
  watch: {
    screenSize(newSize) {
      if (newSize && newSize >= 769) {
        this.isMobileView = false;

        if (!this.activeSide) this.activeSide = "appearance";
      }

      if (newSize && newSize <= 768) {
        this.isMobileView = true;
      }
    },
  },
  beforeMount() {
    this.screenSize = window.innerWidth;
  },
  mounted() {
    this.checkWindowSize();

    if (this.screenSize <= 768) {
      this.isMobileView = true;
      this.activeSide = null;
    }
  },
};
</script>

<style scoped>
.settings-wrapper {
  padding-top: 1.875rem;
}

.settings-wrapper .card {
  padding: 0;
  max-width: 50rem;
  height: fit-content;
}

.purplish-theme .settings-wrapper {
  background-color: var(--color-spanish-pink);
}

.title {
  padding: 1rem 1.25rem;
}

.options {
  display: grid;
  grid-template-columns: 12.5rem 1fr;
  grid-row: 1fr;
  min-height: 22.5rem;
}

.options-links-wrapper {
  grid-column: 1;
  grid-row: 1;
}

.default-theme .title,
.default-theme .options-links-wrapper {
  background-color: var(--color-eerie-black);
  color: var(--color-clouds);
}

.options-links .link {
  font-weight: 500;
  padding: 0.625rem 1rem;
  cursor: pointer;
  transition: all 0.15s ease-in-out;
}

.default-theme .options-links .link.active:hover,
.default-theme .options-links .link:hover {
  background-color: var(--color-platinum);
  color: var(--color-eerie-black);
}

.default-theme .options-links .link.active {
  background-color: var(--color-graphite-black);
}

.purplish-theme .options-links .link.active:hover,
.purplish-theme .options-links .link:hover {
  background-color: var(--color-spanish-pink);
  color: var(--color-black-blue);
}

.purplish-theme .options-links .link.active {
  background-color: var(--color-russian-violet);
}

.options-links .link div {
  gap: 0.675rem;
}

.options-contents {
  grid-column: 2;
  grid-row: 1;
  max-height: 470px;
  overflow-y: scroll;
}

@media (max-width: 768px) {
  .settings-wrapper {
    padding-top: 0;
  }

  .settings-wrapper .card {
    margin: 0;
    border-radius: 0;
    height: calc(100vh - 80px);
  }

  .options {
    min-height: 100%;
    grid-template-columns: 1fr;
  }

  .options-links-wrapper {
    grid-column: 1;
  }

  .options-contents {
    grid-column: 1;
    display: none;
    max-height: calc(100vh - 57px - 80px);
  }
}

.default-theme .options-contents {
  background-color: var(--color-white);
}

.purplish-theme .options-contents {
  background-color: var(--color-russian-violet);
}

.content {
  text-align: center;
  margin-bottom: 1.875rem;
}

.content .content-title {
  margin-top: 1.875rem;
}

.content .content-meta {
  margin-top: 0.625rem;
}

.content .themes-wrapper {
  gap: 1.25rem;
  margin-top: 1.875rem;
  padding: 0.625rem;
  width: 100%;
}

.content .themes-wrapper .wrapper {
  cursor: pointer;
}

.content .themes-wrapper .wrapper .theme {
  width: 14.25rem;
  height: 7.5rem;
  border-radius: 5px;
  background-repeat: no-repeat;
  background-size: contain;
  background-position: center center;
}

.default-theme .content .themes-wrapper .wrapper .theme {
  background-color: var(--color-clouds);
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
}

.purplish-theme .content .themes-wrapper .wrapper .theme {
  box-shadow: rgba(255, 122, 175, 0.3) 0px 3px 8px;
}

.content .themes-wrapper .wrapper .theme.theme-1 {
  background-image: url("@/assets/img/default-theme.svg");
}

.content .themes-wrapper .wrapper .theme.theme-2 {
  background-image: url("@/assets/img/purplish-theme.svg");
}

.content .themes-wrapper .wrapper .theme-options {
  margin-top: 1rem;
}

.content .themes-wrapper .wrapper .theme-options .dot {
  width: 0.75rem;
  height: 0.75rem;
  margin-right: 0.625rem;
  border-radius: 50px;
  outline-offset: 2px;
}

.default-theme .wrapper .theme-options .dot {
  outline: 2px solid var(--color-eerie-black);
}

.default-theme .wrapper.active .theme-options .dot {
  outline: 2px solid var(--color-eerie-black);
  background-color: var(--color-eerie-black);
}

.purplish-theme .wrapper .theme-options .dot {
  outline: 2px solid var(--color-tickle-me-pink);
}

.purplish-theme .wrapper.active .theme-options .dot {
  outline: 2px solid var(--color-tickle-me-pink);
  background-color: var(--color-tickle-me-pink);
}
</style>