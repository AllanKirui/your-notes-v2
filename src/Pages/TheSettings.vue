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
            <!-- appearance link -->
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
            <!-- settings link -->
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
            <!-- restore link -->
            <li
              :class="[activeSide === 'restoration' ? 'active' : '', 'link']"
              title="Restore welcome note and todo"
              @click="setActiveSide('restoration')"
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
                  <path d="M53.72,36.61A21.91,21.91,0,1,1,50.37,20.1" />
                  <polyline points="51.72 7.85 50.85 20.78 37.92 19.9" />
                  <path d="M53.72,36.61A21.91,21.91,0,1,1,50.37,20.1" />
                  <polyline points="51.72 7.85 50.85 20.78 37.92 19.9" />
                </svg>
                <span class="link-text">Restore</span>
              </div>
            </li>
            <!-- feedback link -->
            <li
              :class="[activeSide === 'feedback' ? 'active' : '', 'link']"
              title="Give some feedback"
              @click="setActiveSide('feedback')"
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
                  <circle cx="32" cy="32" r="25.74" stroke-linecap="round" />
                  <path
                    d="M43.38 38.63a13.54 13.54 0 0 1-11.46 6.61 13.51 13.51 0 0 1-11.3-6.34"
                    stroke-linecap="round"
                  />
                  <circle
                    cx="23.62"
                    cy="25.5"
                    r="1.12"
                    stroke-linecap="round"
                  />
                  <circle
                    cx="40.36"
                    cy="25.5"
                    r="1.12"
                    stroke-linecap="round"
                  />
                </svg>
                <span class="link-text">Feedback</span>
              </div>
            </li>
            <!-- about link -->
            <li
              :class="[activeSide === 'about' ? 'active' : '', 'link']"
              title="About Your Notes"
              @click="setActiveSide('about')"
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
                  <line
                    x1="32.06"
                    y1="17.55"
                    x2="32.06"
                    y2="16.88"
                    stroke-linecap="round"
                  />
                  <line
                    x1="32.06"
                    y1="45.3"
                    x2="32.06"
                    y2="24.87"
                    stroke-linecap="round"
                  />
                  <circle cx="32" cy="32" r="24.25" stroke-linecap="round" />
                </svg>
                <span class="link-text">About</span>
              </div>
            </li>
          </ul>
        </div>

        <div
          class="options-contents"
          :style="{ display: activeSide ? 'initial' : 'none' }"
        >
          <!-- appearance options -->
          <div class="content" v-if="activeSide === 'appearance'">
            <div class="font-settings">
              <h3 class="content-title">Choose Your Font</h3>
              <p class="content-meta">Select how text looks to you.</p>
              <div class="font-wrapper flex flex-ai-c flex-jc-c">
                <div
                  class="font flex flex-ai-c flex-jc-c"
                  :class="[globalFontSize === 14 ? 'active' : '']"
                  @click="setFont('small')"
                  title="Small"
                >
                  <span class="dot"></span>
                  <span class="text small">Aa</span>
                </div>
                <div
                  class="font flex flex-ai-c flex-jc-c"
                  :class="[globalFontSize === 16 ? 'active' : '']"
                  @click="setFont('medium')"
                  title="Medium"
                >
                  <span class="dot"></span>
                  <span class="text medium">Aa</span>
                </div>
                <div
                  class="font flex flex-ai-c flex-jc-c"
                  :class="[globalFontSize === 18 ? 'active' : '']"
                  @click="setFont('large')"
                  title="Large"
                >
                  <span class="dot"></span>
                  <span class="text large">Aa</span>
                </div>
              </div>
            </div>

            <hr :style="hrStyle" />

            <div class="themes-settings">
              <h3 class="content-title">Choose Your Theme</h3>
              <p class="content-meta">Select how Your Notes looks to you.</p>
              <div class="themes-wrapper flex flex-jc-c flex-fw-w">
                <div
                  :class="[!theme ? 'active' : '', 'wrapper']"
                  ref="defaultWrapper"
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
                  ref="purplishWrapper"
                  @click="setTheme('purplish')"
                >
                  <div class="theme theme-2"></div>
                  <div class="theme-options flex flex-ai-c flex-jc-c">
                    <span class="dot"></span>
                    <span class="text">Purplish theme</span>
                  </div>
                </div>

                <div
                  :class="[theme === 'bluetiful' ? 'active' : '', 'wrapper']"
                  ref="bluetifulWrapper"
                  @click="setTheme('bluetiful')"
                >
                  <div class="theme theme-3"></div>
                  <div class="theme-options flex flex-ai-c flex-jc-c">
                    <span class="dot"></span>
                    <span class="text">Bluetiful theme</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- password options -->
          <div class="content" v-else-if="activeSide === 'passwords'">
            <h3 class="content-title">Change Your Password</h3>
          </div>

          <!-- restoration options -->
          <div class="content" v-else-if="activeSide === 'restoration'">
            <h3 class="content-title">Restore Welcome Todo/Note</h3>
            <p class="content-meta">
              Here you can restore the <b>Welcome Todo</b> or
              <b>Welcome Note</b> in case you chose to delete either or both of
              them
            </p>
            <div class="content-btns-wrapper flex flex-ai-c flex-jc-c">
              <button
                :class="[
                  hasDeletedDefaultTodo ? '' : 'disabled',
                  'btn btn-restore-todo',
                ]"
                title="Restore deleted todo"
                @click="restoreDefaults('todos')"
              >
                Restore Todo
              </button>
              <button
                :class="[
                  hasDeletedDefaultNote ? '' : 'disabled',
                  'btn btn-restore-note',
                ]"
                title="Restore deleted note"
                @click="restoreDefaults('notes')"
              >
                Restore Note
              </button>
            </div>
          </div>

          <!-- feedback options -->
          <div class="content" v-else-if="activeSide === 'feedback'">
            <h3 class="content-title">Your Feedback</h3>
            <p class="content-meta">Hello 👋</p>
            <p class="content-meta">
              You are welcome to submit any feedback about the app. Feel free to
              share your thoughts about what you liked or disliked about your
              experience with the app. If you discover any bugs 🐞, please let
              me know 😊
            </p>
            <div class="feedback-form-wrapper">
              <form @submit.prevent="sendFeedback" ref="feedbackForm">
                <div class="form-control">
                  <label for="name">Name</label>
                  <input
                    id="name"
                    class="name-field"
                    type="text"
                    name="user_name"
                    placeholder="Your name"
                    ref="name"
                    :value="user.displayName"
                  />
                </div>
                <div class="form-control">
                  <label for="email">Email</label>
                  <input
                    id="email"
                    class="name-field"
                    type="email"
                    name="reply_to"
                    placeholder="Your email"
                    ref="email"
                  />
                </div>
                <div class="form-control">
                  <textarea
                    class="feedback-field"
                    type="text"
                    placeholder="Your thoughts..."
                    ref="feedback"
                    name="message"
                  ></textarea>
                </div>
                <div class="submit-btn-wrapper">
                  <button
                    class="btn btn-submit"
                    type="submit"
                    title="Send feedback"
                  >
                    Send
                  </button>
                </div>
              </form>
            </div>
          </div>

          <!-- about options -->
          <div class="content grid" v-else-if="activeSide === 'about'">
            <div class="content-top">
              <h3 class="content-title">About Your Notes</h3>
              <p class="content-meta">
                <b>Your Notes v2</b> is an updated version of <b>Your Notes</b>,
                an app I had created when I was just starting out coding.
              </p>
              <p class="content-meta">
                Version 2 of the app features a better UI/UX experience, better
                code architecture, Firebase integration and everything I've
                learnt since building the first version of the app.
              </p>
            </div>
            <div class="content-bottom flex flex-jc-sb flex-ai-c">
              <div class="left">
                <a
                  href="https://firebase.google.com"
                  title="Firebase"
                  target="_blank"
                >
                  <img
                    v-if="!theme"
                    class="logo"
                    src="@/assets/img/firebase-logo-default.svg"
                    alt="Firebase logo"
                    width="100"
                    height="44.6"
                  />
                  <img
                    v-else-if="theme === 'purplish'"
                    class="logo"
                    src="@/assets/img/firebase-logo-purplish.svg"
                    alt="Firebase logo"
                    width="100"
                    height="44.6"
                  />
                  <img
                    v-else-if="theme === 'bluetiful'"
                    class="logo"
                    src="@/assets/img/firebase-logo-bluetiful.svg"
                    alt="Firebase logo"
                    width="100"
                    height="44.6"
                  />
                </a>
              </div>
              <div class="right flex flex-ai-c">
                <!-- vuejs link -->
                <a href="https://vuejs.org" title="Vue.js" target="_blank">
                  <img
                    v-if="!theme"
                    class="logo"
                    src="@/assets/img/vue-logo-default.svg"
                    alt="Vue.js logo"
                    width="28"
                    height="24"
                  />
                  <img
                    v-else-if="theme === 'purplish'"
                    class="logo"
                    src="@/assets/img/vue-logo-purplish.svg"
                    alt="Vue.js logo"
                    width="28"
                    height="24"
                  />
                  <img
                    v-else-if="theme === 'bluetiful'"
                    class="logo"
                    src="@/assets/img/vue-logo-bluetiful.svg"
                    alt="Vue.js logo"
                    width="28"
                    height="24"
                  />
                </a>
                <!-- github link -->
                <a
                  href="https://github.com/AllanKirui"
                  title="View project repo"
                  target="_blank"
                >
                  <img
                    v-if="!theme"
                    class="logo"
                    src="@/assets/img/github-logo-default.svg"
                    alt="GitHub logo"
                    width="28"
                    height="28"
                  />
                  <img
                    v-else-if="theme === 'purplish'"
                    class="logo"
                    src="@/assets/img/github-logo-purplish.svg"
                    alt="GitHub logo"
                    width="28"
                    height="28"
                  />
                  <img
                    v-else-if="theme === 'bluetiful'"
                    class="logo"
                    src="@/assets/img/github-logo-bluetiful.svg"
                    alt="GitHub logo"
                    width="28"
                    height="28"
                  />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </base-card>
  </section>
</template>

<script>
import { mapGetters } from "vuex";
import { getAuth } from "firebase/auth";
import emailjs from "@emailjs/browser";
import * as emailConfig from "../../email-config.js";

export default {
  name: "TheSettings",
  emits: ["show-notification"],
  data() {
    return {
      activeSide: "appearance",
      screenSize: null,
      isMobileView: false,
    };
  },
  computed: {
    ...mapGetters("auth", ["user"]),
    ...mapGetters("todos", ["numOfTodos"]),
    ...mapGetters("notes", ["numOfNotes"]),
    ...mapGetters([
      "theme",
      "globalFontSize",
      "hasDeletedDefaultTodo",
      "hasDeletedDefaultNote",
    ]),
    cardStyle() {
      let mode = "";

      switch (this.theme) {
        case "purplish":
          mode = "purplish-theme";
          break;
        case "bluetiful":
          mode = "bluetiful-theme";
          break;
        default:
          mode = "default-theme";
          break;
      }

      return mode;
    },
    hrStyle() {
      let style = "";

      switch (this.theme) {
        case "purplish":
          style = "border-color: #ff7aaf";
          break;
        case "bluetiful":
          style = "border-color: #545e69";
          break;
        default:
          style = "border-color: #1a1a1a";
          break;
      }

      return style;
    },
  },
  methods: {
    setActiveSide(side) {
      this.activeSide = side;
    },
    setTheme(theme) {
      let selectedTheme = "";

      switch (theme) {
        case "default":
          selectedTheme = null;
          break;
        case "purplish":
          selectedTheme = "purplish";
          break;
        case "bluetiful":
          selectedTheme = "bluetiful";
          break;
        default:
          selectedTheme = null;
          break;
      }

      // dispatch an action to set the selected theme
      this.$store.dispatch({
        type: "updateUserPreferences",
        theme: selectedTheme,
        firestoreDocId: getAuth().currentUser.uid,
      });
    },
    setFont(size) {
      let fontSize = null;

      switch (size) {
        // dispatch an action to set the selected font size
        case "small":
          fontSize = 14; // 14px
          break;
        case "medium":
          fontSize = 16; // 16px
          break;
        case "large":
          fontSize = 18; // 18px
          break;
        default:
          fontSize = 14; // 14px
          break;
      }

      // dispatch an action to set the selected fontSize
      this.$store.dispatch({
        type: "updateUserPreferences",
        fontSize: fontSize,
        firestoreDocId: getAuth().currentUser.uid,
      });
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
    restoreDefaults(item) {
      if (item === "notes") {
        if (!this.hasDeletedDefaultNote) return;
        this.restoreWelcomeNote();

        // dispatch an action to update the user data stored locally
        this.$store.dispatch("updateLocalStorageData", {
          numOfNotes: this.numOfNotes,
        });
      }
      if (item === "todos") {
        if (!this.hasDeletedDefaultTodo) return;
        this.restoreWelcomeTodo();

        // dispatch an action to update the user data stored locally
        this.$store.dispatch("updateLocalStorageData", {
          numOfTodos: this.numOfTodos,
        });
      }
    },
    restoreWelcomeNote() {
      // dispatch an action to restore the Welcome Note
      this.$store.dispatch({
        type: "notes/restoreWelcomeNote",
        firestoreDocId: getAuth().currentUser.uid,
      });

      // dispatch an action to update the 'hasDeletedDefaultNote' state prop
      this.$store.dispatch({
        type: "updateUserPreferences",
        hasDeletedDefaultNote: false,
        firestoreDocId: getAuth().currentUser.uid,
      });

      // show a notification message
      let message = "Welcome Note successfully restored ~(˘▾˘~)";
      this.$emit("show-notification", message);
    },
    restoreWelcomeTodo() {
      // dispatch an action to restore the Welcome Todo
      this.$store.dispatch({
        type: "todos/restoreWelcomeTodo",
        firestoreDocId: getAuth().currentUser.uid,
      });

      // dispatch an action to update the 'hasDeletedDefaultTodo' state prop
      this.$store.dispatch({
        type: "updateUserPreferences",
        hasDeletedDefaultTodo: false,
        firestoreDocId: getAuth().currentUser.uid,
      });

      // show a notification message
      let message = "Welcome Todo successfully restored ~(˘▾˘~)";
      this.$emit("show-notification", message);
    },
    async sendFeedback() {
      let feedback = this.$refs.feedback.value.trim();
      let username = this.$refs.name.value.trim();
      let email = this.$refs.email.value.trim();
      let feedbackForm = this.$refs.feedbackForm;

      // validate user inputs
      if (username && feedback && this.isEmail(email)) {
        try {
          await emailjs.sendForm(
            emailConfig.serviceId,
            emailConfig.templateId,
            feedbackForm,
            emailConfig.publicKey
          );
        } catch (error) {
          alert("Oops! Something went wrong ◔ ⌣ ◔\nTry refreshing the page");
        }
        // show success notification
        let message =
          "Thank you for your feedback. I'll get back to you as soon as possible ~(˘▾˘~)";
        this.$emit("show-notification", message);

        // clear fields
        this.$refs.email.value = "";
        this.$refs.feedback.value = "";

        return;
      }

      // show error notifcation
      let message;
      if (!this.isEmail(email)) {
        message = "Please provide a valid email address (ง°ل͜°)ง";
        this.$emit("show-notification", message);
      } else if (!username) {
        message = "Please provide a username (ง°ل͜°)ง";
        this.$emit("show-notification", message);
      } else if (!feedback) {
        message = "There's no point in sending a blank message (ง°ل͜°)ง";
        this.$emit("show-notification", message);
      }
    },
    isEmail(email) {
      return /[a-z0-9]+@[a-z]+\.[a-z]{2,3}/.test(email);
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
  max-height: calc(100vh - 140px);
}

.purplish-theme .settings-wrapper {
  background-color: var(--color-spanish-pink);
}

.bluetiful-theme .settings-wrapper {
  background-color: var(--color-midnight-blue);
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

.bluetiful-theme .options-links .link.active:hover,
.bluetiful-theme .options-links .link:hover {
  background-color: var(--color-lavender-gray);
  color: var(--color-steel-blue);
}

.bluetiful-theme .options-links .link.active {
  background-color: var(--color-midnight-blue);
}

.options-links .link div {
  gap: 0.675rem;
}

.options-contents {
  grid-column: 2;
  grid-row: 1;
  max-height: calc(100vh - 202px);
  overflow-y: scroll;
}

.options-contents .content {
  padding: 0 0.625rem;
}

@media (max-width: 768px) {
  .settings-wrapper {
    padding-top: 0;
  }

  .settings-wrapper .card {
    margin: 0;
    border-radius: 0;
    height: calc(100vh - 80px);
    max-height: 100%;
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

.bluetiful-theme .options-contents {
  background-color: var(--color-midnight-blue);
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
  line-height: 1.4;
}

.content.grid {
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 1fr 60px;
  height: 90%;
}

.content .content-top {
  grid-column: 1;
  grid-row: 1;
}

.content .content-bottom {
  grid-column: 1;
  grid-row: 2;
}

.content .content-bottom .right {
  gap: 10px;
}

.content .content-bottom a {
  color: inherit;
}

.content .content-btns-wrapper {
  gap: 2rem;
  margin-top: 2rem;
}

.default-theme .content .content-btns-wrapper .btn-restore-note.disabled,
.default-theme .content .content-btns-wrapper .btn-restore-todo.disabled {
  background-color: var(--color-platinum);
  cursor: not-allowed;
}

.default-theme .content .content-btns-wrapper .btn-restore-note,
.default-theme .content .content-btns-wrapper .btn-restore-todo {
  background-color: var(--color-malachite);
}

.default-theme .content .content-btns-wrapper .btn-restore-note:hover,
.default-theme .content .content-btns-wrapper .btn-restore-todo:hover {
  background-color: var(--color-platinum);
}

.purplish-theme .content .content-btns-wrapper .btn-restore-note.disabled,
.purplish-theme .content .content-btns-wrapper .btn-restore-todo.disabled {
  background-color: var(--color-black-blue);
  color: var(--color-spanish-pink);
  cursor: not-allowed;
}

.purplish-theme .content .content-btns-wrapper .btn-restore-note,
.purplish-theme .content .content-btns-wrapper .btn-restore-todo {
  background-color: var(--color-tickle-me-pink);
  color: var(--color-black-blue);
}

.purplish-theme .content .content-btns-wrapper .btn-restore-note:hover,
.purplish-theme .content .content-btns-wrapper .btn-restore-todo:hover {
  background-color: var(--color-spanish-pink);
  color: var(--color-black-blue);
}

.purplish-theme .content .content-btns-wrapper .btn-restore-note.disabled:hover,
.purplish-theme
  .content
  .content-btns-wrapper
  .btn-restore-todo.disabled:hover {
  background-color: var(--color-black-blue);
  color: var(--color-spanish-pink);
}

.bluetiful-theme .content .content-btns-wrapper .btn-restore-note.disabled,
.bluetiful-theme .content .content-btns-wrapper .btn-restore-todo.disabled {
  background-color: var(--color-steel-blue);
  color: var(--color-lavender-gray);
  cursor: not-allowed;
}

.bluetiful-theme .content .content-btns-wrapper .btn-restore-note,
.bluetiful-theme .content .content-btns-wrapper .btn-restore-todo {
  background-color: var(--color-maximum-blue-green);
  color: var(--color-eerie-black);
}

.bluetiful-theme .content .content-btns-wrapper .btn-restore-note:hover,
.bluetiful-theme .content .content-btns-wrapper .btn-restore-todo:hover {
  background-color: var(--color-lavender-gray);
}

.bluetiful-theme
  .content
  .content-btns-wrapper
  .btn-restore-note.disabled:hover,
.bluetiful-theme
  .content
  .content-btns-wrapper
  .btn-restore-todo.disabled:hover {
  background-color: var(--color-steel-blue);
}

.content .themes-wrapper {
  gap: 1.25rem;
  margin-top: 1.875rem;
  padding: 0.625rem;
  width: 100%;
}

.content .font-wrapper .font,
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

.bluetiful-theme .content .themes-wrapper .wrapper .theme {
  box-shadow: rgba(0, 0, 0, 0.35) 0px 3px 8px;
}

.content .themes-wrapper .wrapper .theme.theme-1 {
  background-image: url("@/assets/img/default-theme.svg");
}

.content .themes-wrapper .wrapper .theme.theme-2 {
  background-image: url("@/assets/img/purplish-theme.svg");
}

.content .themes-wrapper .wrapper .theme.theme-3 {
  background-image: url("@/assets/img/bluetiful-theme.svg");
}

.content .font-wrapper {
  gap: 1.25rem;
  margin: 1rem 0;
}

.content .themes-wrapper .wrapper .theme-options {
  margin-top: 1rem;
}

.content .font-wrapper .font .text.small {
  font-size: 0.875rem !important;
}

.content .font-wrapper .font .text.medium {
  font-size: 1rem !important;
}

.content .font-wrapper .font .text.large {
  font-size: 1.125rem !important;
}

.content .font-wrapper .font .dot,
.content .themes-wrapper .wrapper .theme-options .dot {
  width: 0.6rem;
  height: 0.6rem;
  margin-right: 0.625rem;
  border-radius: 50px;
  outline-offset: 2px;
}

.default-theme .content .font-wrapper .font .dot,
.default-theme .wrapper .theme-options .dot {
  outline: 2px solid var(--color-eerie-black);
}

.default-theme .content .font-wrapper .font.active .dot,
.default-theme .wrapper.active .theme-options .dot {
  outline: 2px solid var(--color-eerie-black);
  background-color: var(--color-eerie-black);
}

.purplish-theme .content .font-wrapper .font .dot,
.purplish-theme .wrapper .theme-options .dot {
  outline: 2px solid var(--color-tickle-me-pink);
}

.purplish-theme .content .font-wrapper .font.active .dot,
.purplish-theme .wrapper.active .theme-options .dot {
  outline: 2px solid var(--color-tickle-me-pink);
  background-color: var(--color-tickle-me-pink);
}

.bluetiful-theme .content .font-wrapper .font .dot,
.bluetiful-theme .wrapper .theme-options .dot {
  outline: 2px solid var(--color-maximum-blue-green);
}

.bluetiful-theme .content .font-wrapper .font.active .dot,
.bluetiful-theme .wrapper.active .theme-options .dot {
  outline: 2px solid var(--color-maximum-blue-green);
  background-color: var(--color-maximum-blue-green);
}

/* feedback form styles */
.feedback-form-wrapper {
  margin-top: 2rem;
}

.submit-btn-wrapper,
.form-control {
  margin-left: auto;
  margin-right: auto;
  width: 90%;
}

.feedback-field {
  padding: 0.5rem;
  width: 100%;
  height: auto;
  min-height: 5rem;
  border-radius: 5px;
  font-family: inherit;
  font-size: inherit;
  overflow-y: auto;
  overflow-wrap: break-word;
  resize: none;
}

label {
  display: none;
}

.name-field {
  padding-left: 0.5rem;
  padding-right: 0.5rem;
}

.name-field,
.feedback-field {
  font-size: inherit;
}

.default-theme .name-field,
.default-theme .feedback-field {
  border: 2px solid var(--color-eerie-black);
  background-color: var(--color-white);
  color: var(--color-eerie-black);
}

.default-theme .name-field:focus,
.default-theme .feedback-field:focus {
  outline: 1px solid var(--color-eerie-black);
}

.default-theme .name-field::placeholder,
.default-theme .feedback-field::placeholder {
  color: var(--color-traffic-grey);
}

.purplish-theme .name-field,
.purplish-theme .feedback-field {
  border: 2px solid var(--color-tickle-me-pink);
  background-color: var(--color-russian-violet);
  color: var(--color-spanish-pink);
}

.purplish-theme .name-field:focus,
.purplish-theme .feedback-field:focus {
  outline: 1px solid var(--color-tickle-me-pink);
}

.purplish-theme .name-field::placeholder,
.purplish-theme .feedback-field::placeholder {
  color: rgba(253, 199, 189, 0.6);
}

.bluetiful-theme .name-field,
.bluetiful-theme .feedback-field {
  border: 2px solid var(--color-maximum-blue-green);
  background-color: var(--color-midnight-blue);
  color: var(--color-lavender-gray);
}

.bluetiful-theme .name-field:focus,
.bluetiful-theme .feedback-field:focus {
  outline: 1px solid var(--color-maximum-blue-green);
}

.bluetiful-theme .name-field::placeholder,
.bluetiful-theme .feedback-field::placeholder {
  color: rgba(198, 201, 205, 0.5);
}

.btn-submit {
  width: 100%;
  padding: 0.5rem;
}

.default-theme .btn-submit {
  background-color: var(--color-eerie-black);
  color: var(--color-clouds);
}

.default-theme .btn-submit:hover {
  background-color: var(--color-dark-pastel-green);
  color: var(--color-eerie-black);
}

.default-theme .btn-submit:focus {
  outline: 2px solid var(--color-dark-pastel-green);
  outline-offset: 2px;
  background-color: var(--color-dark-pastel-green);
  color: var(--color-eerie-black);
}

.purplish-theme .btn-submit {
  background-color: var(--color-black-blue);
  color: var(--color-spanish-pink);
}

.purplish-theme .btn-submit:hover {
  background-color: var(--color-tickle-me-pink);
  color: var(--color-black-blue);
}

.purplish-theme .btn-submit:focus {
  outline: 2px solid var(--color-tickle-me-pink);
  outline-offset: 2px;
  background-color: var(--color-tickle-me-pink);
  color: var(--color-black-blue);
}

.bluetiful-theme .btn-submit {
  background-color: var(--color-steel-blue);
  color: var(--color-lavender-gray);
}

.bluetiful-theme .btn-submit:hover {
  background-color: var(--color-maximum-blue-green);
  color: var(--color-eerie-black);
}

.bluetiful-theme .btn-submit:focus {
  outline: 2px solid var(--color-maximum-blue-green);
  outline-offset: 2px;
  background-color: var(--color-maximum-blue-green);
  color: var(--color-eerie-black);
}
</style>