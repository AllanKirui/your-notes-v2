<template>
  <section class="content-wrapper">
    <div class="content-intro-wrapper" v-if="!numOfNotes">
      <div class="bg-images"></div>
      <div class="text">
        <h3 class="intro-title">{{ greeting }}</h3>
        <p v-if="screenSize >= 769" class="intro-message-1">
          Please click the <b>New Note</b> button on the sidebar to create a new
          note
        </p>
        <p v-else class="intro-message-1">
          Please click the <b>New Note</b> button on the sidebar or the
          <b>Plus +</b> below to create a new note
        </p>
      </div>
    </div>

    <!-- Loading spinner -->
    <div
      v-if="!numOfNotes && storedNumOfNotes > 0"
      class="spinner-wrapper spinner-overlay flex flex-jc-c flex-ai-c flex-fd-c"
    >
      <div class="spinner">
        <div class="outer-ring"></div>
        <div class="inner-ring"></div>
      </div>

      <div class="spinner-text">
        <p>Fetching Your Notes</p>
      </div>
    </div>

    <section class="content-items" v-if="numOfNotes">
      <!-- section title with notes counter -->
      <div
        v-if="!isSearching && isShowMobileCounter"
        class="flex flex-ai-c flex-jc-sb"
      >
        <h2 class="items-title">Notes</h2>
        <div class="counter-wrapper">
          <span class="items-title-counter"> {{ numOfNotes }} </span>
        </div>
      </div>

      <!-- section title without notes counter -->
      <h2 v-if="!isSearching && !isShowMobileCounter" class="items-title">
        Notes
      </h2>

      <!-- search window -->
      <div class="results-wrapper flex flex-ai-c flex-jc-sb" v-if="isSearching">
        <h4 class="items-title">{{ searchMessage }}</h4>
        <button
          class="btn cancel-search-btn flex flex-ai-c flex-jc-c"
          title="Cancel search"
          @click="cancelSearch"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 64 64"
            stroke-width="5"
            stroke="currentColor"
            fill="none"
            class="duration-300 transform transition-all"
            style="width: 14px; height: 14px"
          >
            <path d="M8.06 8.06l47.35 47.88M55.94 8.06L8.59 55.94"></path>
          </svg>
        </button>
      </div>
      <p class="no-results">Nothing found ¯\_(ツ)_/¯</p>

      <!-- list of notes -->
      <notes-list></notes-list>
    </section>

    <section
      class="content-items-details"
      v-if="numOfNotes"
      :style="mobileFlowStyle"
    >
      <div class="bg-images"></div>
      <notes-details
        :screenSize="screenSize"
        @show-notification="showNotification"
        @selectednote-id="setSelectedNote"
      ></notes-details>
    </section>

    <!-- use the transition component to animate the modal -->
    <transition name="modal">
      <div
        class="modal-wrapper"
        v-if="isModal && activeSide === 'New Note'"
        @click="closeModal"
      >
        <!-- stop the event propagation from clicking on the modal backdrop -->
        <base-card :mode="cardStyle" @click.stop>
          <div class="modal-container">
            <h3 class="modal-title">Add a New Note</h3>

            <form class="modal-form" @submit.prevent="addNewNote">
              <div class="input-wrapper">
                <input
                  type="text"
                  name="title"
                  placeholder="Title"
                  ref="title"
                  :style="{ 'font-size': setFontSize() }"
                />
              </div>

              <div class="input-wrapper">
                <textarea
                  type="text"
                  name="content"
                  placeholder="Enter note"
                  ref="newNote"
                  @input="$nextTick(autoResizeCreateField)"
                ></textarea>
              </div>

              <div class="create-controls">
                <button class="btn btn-add" title="Add new note" type="submit">
                  Add new note
                </button>
                <button
                  class="btn btn-cancel"
                  title="Cancel"
                  @click="cancelNewNote"
                  type="button"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </base-card>
      </div>
    </transition>

    <!-- add new note button -->
    <div class="btn-wrapper" v-if="screenSize <= 768 && !selectedNote">
      <button
        class="add-new-btn btn flex flex-ai-c flex-jc-c"
        title="Create New Note"
        @click="$emit('show-modal', 'New Note')"
      >
        <img
          class="btn-img"
          src="@/assets/img/add-icon.svg"
          alt="create new icon"
          width="18"
        />
      </button>
    </div>
  </section>
</template>

<script>
import { mapGetters } from "vuex";

import NotesList from "@/components/notes/NotesList.vue";
import NotesDetails from "@/components/notes/NotesDetails.vue";
import { getAuth } from "firebase/auth";
import { notesColRef, _onSnapshot, _query, _where, _orderBy } from "@/main.js";

export default {
  name: "TheNotes",
  props: ["isModal", "activeSide", "isSearching", "searchMessage"],
  emits: [
    "close-modal",
    "show-notification",
    "cancel-search",
    "close-sidebar",
    "show-modal",
  ],
  components: {
    NotesList,
    NotesDetails,
  },
  data() {
    return {
      isCreated: false,
      screenSize: null,
      isShowMobileCounter: false,
      isShowMobileFlow: false,
      newNoteId: null,
      unsubscribeFromSnapshotListener: null,
      storedNumOfNotes: 0,
    };
  },
  computed: {
    ...mapGetters("notes", ["notesList", "numOfNotes", "selectedNote"]),
    ...mapGetters([
      "greeting",
      "theme",
      "globalFontSize",
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
    mobileFlowStyle() {
      let style = "";

      if (this.selectedNote && this.isShowMobileFlow) {
        style = "display: initial";
      }

      if (!this.selectedNote && this.isShowMobileFlow) {
        style = "display: none";
      }

      return style;
    },
  },
  methods: {
    closeModal() {
      this.$emit("close-modal");

      // dispatch an action to reset the isCloseOpenField state prop
      this.$store.dispatch("notes/closeOpenFields", false);
    },
    showNotification(message) {
      this.$emit("show-notification", message);
    },
    addNewNote() {
      // reset props
      this.isCreated = false;

      let noteTitle = this.$refs.title.value.trim();
      let noteContent = this.$refs.newNote.value.trim();

      // show notification if the title or task field is empty
      if (!noteTitle || !noteContent) {
        let message = "Please provide a title and content for the note ◉_◉";
        this.showNotification(message);
        return;
      }

      let newNote = {
        id: this.setId(),
        title: noteTitle,
        content: noteContent,
        authorId: getAuth().currentUser.uid,
      };

      // dispatch an action to add the new note to the notes list
      this.$store.dispatch("notes/addNewNote", newNote);

      this.newNoteId = newNote.id;
      this.isCreated = true;

      // close new note modal
      this.closeModal();

      // show success notification
      let message = "Added note successfully \\ (•◡•) /";
      this.showNotification(message);
    },
    setId() {
      // set id to be the current length of the notes list
      let newId = this.numOfNotes;

      // if there are no notes and the default note has been deleted,
      // set the newId for a newly created note to be 1
      if (newId === 0 && this.hasDeletedDefaultNote) {
        newId = 1;
      }

      // loop through each note item and check for duplicate IDs
      this.notesList.forEach((note) => {
        if (note.id === newId) {
          newId++;
        }
      });

      return newId;
    },
    cancelNewNote() {
      this.closeModal();
    },
    openNewNote(id) {
      // dispatch an action to set the newly created note as the selected note
      this.$store.dispatch({
        type: "notes/setSelectedNote",
        noteId: id,
      });
    },
    autoResizeCreateField() {
      let textarea = this.$refs.newNote;
      textarea.style.height = textarea.scrollHeight + "px";
    },
    setFontSize() {
      let size;

      switch (this.globalFontSize) {
        case 14: // for 14px set title font size to 16px
          size = 16;
          break;
        case 16: // 16px set title font size to 18px
          size = 18;
          break;
        case 18: // 18px set title font size to 20px
          size = 20;
          break;
        default:
          size = 16;
          break;
      }

      return size / 16 + "rem";
    },
    checkWindowSize() {
      // listen to the resize event
      window.addEventListener("resize", () => {
        this.screenSize = window.innerWidth;
      });
    },
    cancelSearch() {
      this.$emit("cancel-search");
    },
    getRealtimeNotesData() {
      const uid = getAuth().currentUser.uid;

      // perform a query to get the current user's notes
      const queryRef = _query(
        notesColRef,
        _where("authorId", "==", uid),
        _orderBy("id")
      );

      // get collection data using onSnapshot (REALTIME)
      // it takes in two arguments; the collection reference and a function that fires
      // every time a snapshot changes and runs once initially to get data
      this.unsubscribeFromSnapshotListener = _onSnapshot(
        queryRef,
        (snapshot) => {
          // dispatch an action to clear the current notes list before adding new data
          this.$store.dispatch("notes/clearNotesList");

          if (!this.hasDeletedDefaultNote) {
            // dispatch an action to add the Welcome Note along with the new data
            this.$store.dispatch("notes/addWelcomeNote");
          }

          snapshot.docs.forEach((note) => {
            // dispatch an action to set the note data
            this.$store.dispatch("notes/addRealtimeData", note);
          });

          // open the newly created note
          if (this.notesList.length > 0) this.openNewNote(this.newNoteId);
        }
      );
    },
    setSelectedNote(id) {
      this.newNoteId = id;
    },
  },
  watch: {
    isModal(newValue) {
      if (newValue) {
        // focus on the input field after the modal has been rendered
        this.$nextTick(() => {
          this.$refs.title.focus();
        });
        // dispatch an action to close any open edit/create menus in NotesDetails
        this.$store.dispatch("notes/closeOpenFields", true);
      }
    },
    screenSize(newSize) {
      if (newSize && newSize >= 1025) {
        this.isShowMobileCounter = false;
      }

      if (newSize && newSize <= 1024) {
        this.isShowMobileCounter = true;
      }

      if (newSize && newSize >= 769) {
        this.isShowMobileFlow = false;
        // close the sidebar for large screens
        this.$emit("close-sidebar");
      }

      if (newSize && newSize <= 768) {
        this.isShowMobileFlow = true;
      }
    },
    numOfNotes(newValue) {
      if (newValue) {
        // dispatch an action to update the user data stored locally
        this.$store.dispatch("updateLocalStorageData", {
          numOfNotes: newValue,
        });
      }
    },
  },
  beforeMount() {
    this.screenSize = window.innerWidth;
  },
  mounted() {
    this.checkWindowSize();
    this.getRealtimeNotesData();

    // read user data from localStorage, if any
    let storedData = JSON.parse(localStorage.getItem("yourNotesPreferences"));

    if (storedData) {
      this.storedNumOfNotes = storedData.numOfNotes;
    }
  },
  updated() {
    // scroll a newly created note into view
    if (this.isCreated && this.notesList.length > 0) {
      // after 100ms when the new element has been rendered in the DOM
      setTimeout(() => {
        let newNoteEl = document.querySelector(".content-items li:last-child");
        newNoteEl.scrollIntoView();
      }, 100);

      // reset props
      this.isCreated = false;
    }
  },
  unmounted() {
    // unsubscribe from the real time listener
    this.unsubscribeFromSnapshotListener();
  },
};
</script>