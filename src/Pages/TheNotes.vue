<template>
  <section class="content-wrapper">
    <div class="content-intro-wrapper" v-if="!numOfNotes">
      <div class="bg-images"></div>
      <div class="text">
        <h3 class="intro-title">{{ greeting }}</h3>
        <p class="intro-message-1">
          Please click the <b>New Note</b> button on the sidebar to create a new
          note
        </p>
      </div>
    </div>

    <section class="content-items" v-if="numOfNotes">
      <h3 v-if="!isSearching" class="items-title">Notes</h3>
      <h4 v-if="isSearching" class="items-title">{{ searchMessage }}</h4>
      <notes-list></notes-list>
    </section>

    <section class="content-items-details" v-if="numOfNotes">
      <div class="bg-images"></div>
      <notes-details @show-notification="showNotification"></notes-details>
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
  </section>
</template>

<script>
import NotesList from "@/components/notes/NotesList.vue";
import NotesDetails from "@/components/notes/NotesDetails.vue";

export default {
  props: ["isModal", "activeSide", "isSearching", "searchMessage"],
  emits: ["close-modal", "show-notification"],
  inject: ["globalFontSize"],
  components: {
    NotesList,
    NotesDetails,
  },
  data() {
    return {
      isCreated: false,
    };
  },
  computed: {
    notesList() {
      return this.$store.getters["notes/notesList"];
    },
    numOfNotes() {
      return this.$store.getters["notes/numOfNotes"];
    },
    greeting() {
      return this.$store.getters.greeting;
    },
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
        let message = "Please provide a title and content for the note";
        this.showNotification(message);
        return;
      }

      let newNote = {
        id: this.setId(),
        title: noteTitle,
        content: noteContent,
      };

      // dispatch an action to add the new note to the notes list
      this.$store.dispatch("notes/addNewNote", newNote);

      this.isCreated = true;

      // close new note modal
      this.closeModal();

      // open the newly created note
      this.openNewNote(newNote.id);

      // show success notification
      let message = "Added note successfully";
      this.showNotification(message);
    },
    setId() {
      // set id to be the current length of the notes list
      let newId = this.numOfNotes;

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
  },
  updated() {
    // scroll a newly created note into view
    if (this.isCreated) {
      let newNoteEl = document.querySelector(".content-items li:last-child");

      newNoteEl.scrollIntoView();

      // reset props
      this.isCreated = false;
    }
  },
};
</script>