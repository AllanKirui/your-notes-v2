<template>
  <div v-if="!hasNote" class="intro-wrapper">
    <h3 class="intro-title">{{ greeting }}</h3>
    <p class="intro-message-1">
      Please select a note from the <b>Notes</b> panel to continue working on an
      existing note
    </p>
    <p class="intro-message-2">
      Or click the <b>New Note</b> button on the sidebar to create a new note
    </p>
  </div>

  <!-- Notes title -->
  <div v-if="hasNote" class="heading-wrapper">
    <div class="heading-top flex flex-ai-c">
      <div class="back-btn-wrapper">
        <button
          class="back-btn"
          title="Back to list of notes"
          v-if="screenSize <= 768"
          @click="resetSelectedNote"
        >
          <span class="head"></span>
        </button>
      </div>
      <h3 class="items-title">{{ selectedNote.title }}</h3>
      <div class="top-controls">
        <button
          class="btn delete-note-btn"
          title="Delete note"
          @click="showDeleteWindow"
        >
          Delete
        </button>
      </div>
    </div>

    <!-- use the transition component to animate the delete window-->
    <transition name="delete">
      <div class="confirm-delete" v-if="isShowDeleteWindow">
        <base-card :mode="cardStyle">
          <div class="confirm-delete-title flex flex-ai-c flex-jc-sb">
            <span class="title"
              >Delete {{ setTextLength(selectedNote.title, 20) }}</span
            >
            <button
              class="btn close-btn"
              title="Close"
              @click="hideDeleteWindow"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 64 64"
                stroke-width="4.5"
                stroke="currentColor"
                fill="none"
                class="duration-300 transform transition-all"
                style="width: 14px; height: 14px"
              >
                <path d="M8.06 8.06l47.35 47.88M55.94 8.06L8.59 55.94"></path>
              </svg>
            </button>
          </div>
          <div class="confirm-delete-contents">
            <p class="message">
              Deleting a note is a permanent action which cannot be undone.
            </p>
            <button
              class="btn delete-btn"
              title="Delete note"
              @click="deleteNote"
            >
              Delete note
            </button>
          </div>
        </base-card>
      </div>
    </transition>
  </div>

  <!-- Notes content -->
  <div v-if="hasNote" class="details-wrapper">
    <div class="item-text-wrapper">
      <div v-if="!isEditText" class="item-text">
        <span class="item-details" ref="noteContent"></span>
      </div>

      <div v-if="isEditText" class="item-edit-field">
        <textarea
          class="field"
          :value="selectedNote.content"
          style="max-height: calc(100vh - 250px)"
          ref="editNote"
          @input="$nextTick(autoResizeEditField)"
        ></textarea>
      </div>
    </div>
  </div>

  <!-- edit controls -->
  <div v-if="hasNote" class="edit-controls flex flex-jc-sb">
    <!-- use the transition component to animate the switching of buttons -->
    <transition name="buttons" mode="out-in">
      <button
        v-if="!isEditText"
        class="btn btn-edit"
        title="Edit note"
        @click="editText"
      >
        Edit
      </button>
      <div v-else-if="isEditText">
        <button class="btn btn-save" title="Save edits" @click="saveEdits">
          Save
        </button>
        <button
          class="btn btn-cancel"
          title="Cancel edits"
          @click="cancelEdits"
        >
          Cancel
        </button>
      </div>
    </transition>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { getAuth } from "firebase/auth";

export default {
  name: "NotesDetails",
  props: ["screenSize"],
  emits: ["show-notification", "selectednote-id"],
  inject: ["setTextLength"],
  data() {
    return {
      hasNote: false,
      isEditText: false,
      isHighlighted: false,
      noteId: null,
      isShowDeleteWindow: false,
      firestoreDocId: null,
      isMobileView: false,
    };
  },
  computed: {
    ...mapGetters("notes", ["selectedNote", "isCloseOpenFields"]),
    ...mapGetters(["greeting", "theme"]),
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

      // for bluetiful theme
      if (this.theme === "bluetiful") {
        mode = "bluetiful-theme";
      }

      return mode;
    },
  },
  methods: {
    editText() {
      // TODO: reset props as in TodoDetails
      this.isHighlighted = false;
      this.isShowDeleteWindow = false;

      this.isEditText = true;

      // resize the textarea after it has been rendered
      this.$nextTick(() => {
        this.autoResizeEditField();
      });
    },
    saveEdits() {
      // prevent the user from editing the default Welcome Note
      if (this.selectedNote.isDefault) {
        let message = "Sorry! We don't allow that on this Welcome Note (ง°ل͜°)ง";
        this.$emit("show-notification", message);

        this.cancelEdits();
        return;
      }

      let updatedText = this.$refs.editNote.value.trim();

      // dispatch an action to save changes made on a note
      this.$store.dispatch({
        type: "notes/saveChanges",
        noteId: this.noteId,
        newText: updatedText,
        firestoreDocId: this.firestoreDocId,
      });

      // close the editing window by resetting props
      this.cancelEdits();
    },
    cancelEdits() {
      this.isEditText = false;
      this.preserveLineBreaks();
    },
    showDeleteWindow() {
      this.cancelEdits();
      this.isShowDeleteWindow = true;
    },
    hideDeleteWindow() {
      this.isShowDeleteWindow = false;
    },
    deleteNote() {
      // check if current screen size is for small devices
      if (this.screenSize <= 768) {
        this.isMobileView = true;
      }

      // dispatch an action to delete a note from the list of notes
      this.$store.dispatch("notes/deleteNote", {
        id: this.noteId,
        isDefault: this.selectedNote.isDefault,
        firestoreDocId: this.firestoreDocId || getAuth().currentUser.uid,
        isMobileView: this.isMobileView,
      });

      // emit an event to show notification message
      let message = "Note deleted successfully （╯°□°）╯︵";
      this.$emit("show-notification", message);

      // reset props
      this.hasNote = false;
    },
    autoResizeEditField() {
      let textarea = this.$refs.editNote;
      textarea.style.height = textarea.scrollHeight + "px";

      // if the textarea is already focused and selected, return
      if (this.isHighlighted) return;

      // focus on the textarea and highlight its contents
      textarea.focus();
      textarea.select();
      this.isHighlighted = true;
    },
    async preserveLineBreaks() {
      // set the innerText value of the 'noteContent' ref in order
      // to preserve any line breaks entered in the textarea field
      await this.$nextTick();
      if (this.selectedNote) {
        this.$refs.noteContent.innerText = this.selectedNote.content;
      }
    },
    resetSelectedNote() {
      // dispatch an action to reset the 'selectedNote' state prop
      this.$store.dispatch("notes/resetSelectedNote");
    },
  },
  watch: {
    selectedNote(newNote) {
      if (newNote) {
        this.hasNote = true;
        this.noteId = newNote.id;
        this.firestoreDocId = newNote.fireId;

        // emit the id of the selectedNote
        this.$emit("selectednote-id", this.noteId);

        // reset props
        this.cancelEdits();
        this.hideDeleteWindow();
      } else {
        this.hasNote = false;
      }
    },
    isEditText(newValue) {
      if (!newValue) {
        this.isHighlighted = false;
      }
    },
    isCloseOpenFields(newValue) {
      if (newValue) {
        this.cancelEdits();
      }
    },
  },
  beforeMount() {
    // dispatch an action to set the greeting
    this.$store.dispatch("setGreeting");
  },
  mounted() {
    // dispatch an action to reset the 'selectedNote' state prop
    this.$store.dispatch("notes/resetSelectedNote");
  },
  beforeUpdate() {
    const note = this.$store.getters["notes/selectedNote"];

    if (note) {
      // dispatch an action to set the open note id
      this.$store.dispatch("notes/setOpenNoteId", note.id);
    }
  },
};
</script>

<style scoped>
.item-text-wrapper {
  line-height: 1.4;
}

.details-wrapper {
  padding-top: 0.625rem;
  height: calc(100vh - 250px);
}

@media (max-width: 640px) {
  .details-wrapper {
    padding-top: 0;
  }
}

.item-edit-field .field {
  padding: 0.5rem;
  width: 100%;
  height: auto;
  min-height: 3.125rem;
  border-radius: 5px;
  font-family: inherit;
  font-size: inherit;
  background: transparent;
  overflow-y: auto;
  overflow-wrap: break-word;
  resize: none;
}

.default-theme .item-edit-field .field {
  border: 2px solid var(--color-dark-pastel-green);
  outline-color: var(--color-dark-pastel-green);
}

.purplish-theme .item-edit-field .field {
  border: 2px solid var(--color-tickle-me-pink);
  outline-color: var(--color-tickle-me-pink);
  color: var(--color-spanish-pink);
}

.bluetiful-theme .item-edit-field .field {
  border: 2px solid var(--color-maximum-blue-green);
  outline-color: var(--color-maximum-blue-green);
  color: var(--color-lavender-gray);
}

.edit-controls {
  position: relative;
  margin: 0.875rem auto 0;
  width: 90%;
  z-index: 2;
}

.btn.btn-cancel {
  margin-left: 0.3125rem;
}

.default-theme .btn.btn-edit,
.default-theme .btn.btn-save {
  background-color: var(--color-malachite);
}

.default-theme .btn.btn-edit:hover,
.default-theme .btn.btn-save:hover {
  background-color: var(--color-light-green);
}

.default-theme .btn.btn-cancel:hover {
  background-color: var(--color-platinum);
}

.purplish-theme .btn.btn-edit,
.purplish-theme .btn.btn-save {
  background-color: var(--color-tickle-me-pink);
  color: var(--color-black-blue);
}

.purplish-theme .btn.btn-edit:hover,
.purplish-theme .btn.btn-save:hover {
  background-color: var(--color-spanish-pink);
}

.purplish-theme .btn.btn-cancel:hover {
  background-color: var(--color-russian-violet);
}

.bluetiful-theme .btn.btn-edit,
.bluetiful-theme .btn.btn-save {
  background-color: var(--color-maximum-blue-green);
  color: var(--color-eerie-black);
}

.bluetiful-theme .btn.btn-edit:hover,
.bluetiful-theme .btn.btn-save:hover {
  background-color: var(--color-lavender-gray);
}

.bluetiful-theme .btn.btn-cancel:hover {
  background-color: var(--color-midnight-blue);
}

.buttons-enter-active {
  animation: fadePop 0.15s ease-out;
}

.buttons-leave-active {
  animation: fadePop 0.15s ease-in reverse;
}

@keyframes fadePop {
  0% {
    opacity: 0;
    transform: scale(0.8);
  }
  75% {
    opacity: 1;
    transform: scale(1.1);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}
</style>