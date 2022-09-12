<template>
  <section class="settings-wrapper flex flex-jc-c">
    <base-card mode="default-theme">
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
          <div class="content" v-if="activeSide === 'appearance'">
            <h3 class="content-title">Choose Your Theme</h3>
            <p class="content-meta">Select how Your Notes looks to you.</p>
            <div class="themes-wrapper flex flex-jc-c flex-fw-w">
              <div class="wrapper">
                <div class="theme theme-1"></div>
                <div class="theme-options flex flex-ai-c flex-jc-c">
                  <span class="dot"></span>
                  <span class="text">Default theme</span>
                </div>
              </div>

              <div class="wrapper">
                <div class="theme theme-2"></div>
                <div class="theme-options flex flex-ai-c flex-jc-c">
                  <span class="dot"></span>
                  <span class="text">Purplish theme</span>
                </div>
              </div>
            </div>
          </div>
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
  methods: {
    setActiveSide(side) {
      this.activeSide = side;
    },
  },
};
</script>

<style scoped>
.settings-wrapper {
  padding-top: 60px;
  /* width: 100%; */
}

.settings-wrapper .card {
  /* max-width: calc(100% - 64px); */
  max-width: 50rem;
  /* margin: 0; */
  height: fit-content;
  padding: 0;
}

.title {
  /* background-color: tomato; */
  padding: 15px 20px 15px;
}

.options {
  display: grid;
  grid-template-columns: 200px 1fr;
  grid-row: 1fr;
  min-height: 360px;
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
  padding: 10px 16px;
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

.options-contents {
  grid-column: 2;
  grid-row: 1;
}

.default-theme .options-contents {
  background-color: var(--color-white);
}

.content {
  text-align: center;
}

.content .content-title {
  margin-top: 30px;
}

.content .content-meta {
  margin-top: 10px;
}

.content .themes-wrapper {
  gap: 20px;
  flex-wrap: wrap;
  margin-top: 30px;
  width: 100%;
}

.content .themes-wrapper .wrapper .theme {
  width: 228px;
  height: 120px;
  border-radius: 5px;
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
  background-repeat: no-repeat;
  background-size: contain;
  background-position: center center;
}

.default-theme .content .themes-wrapper .wrapper .theme {
  background-color: var(--color-clouds);
}

.content .themes-wrapper .wrapper .theme.theme-1 {
  background-image: url("@/assets/img/default-theme.svg");
}

.content .themes-wrapper .wrapper .theme.theme-2 {
  background-image: url("@/assets/img/purplish-theme.svg");
}

.theme-options {
  margin-top: 10px;
}

.theme-options input,
.theme-options label {
  cursor: pointer;
}

.theme-options label {
  margin-left: 3px;
}
</style>