<template>
  <section class="settings-wrapper flex flex-jc-c">
    <base-card :mode="cardStyle">
      <div class="title">
        <h2 class="title-text">Settings</h2>
      </div>

      <div class="options">
        <div class="options-links-wrapper">
          <ul class="options-links">
            <li
              :class="[activeSide === 'appearance' ? 'active' : '', 'link']"
              title="Change appearance"
              @click="setActiveSide('appearance')"
            >
              Appearance
            </li>
            <li
              :class="[activeSide === 'passwords' ? 'active' : '', 'link']"
              title="Change password"
              @click="setActiveSide('passwords')"
            >
              Passwords
            </li>
          </ul>
        </div>

        <div class="options-contents">
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
  },
};
</script>

<style scoped>
.settings-wrapper {
  padding-top: 3.75rem;
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

.options-contents {
  grid-column: 2;
  grid-row: 1;
}

.default-theme .options-contents {
  background-color: var(--color-white);
}

.purplish-theme .options-contents {
  background-color: var(--color-russian-violet);
}

.content {
  text-align: center;
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