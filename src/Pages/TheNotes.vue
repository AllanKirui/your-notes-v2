<template>
  <section class="content-wrapper">
    <div class="content-intro-wrapper" v-if="!numOfNotes">
      <div class="bg-images"></div>
      <div class="text">
        <h3 class="intro-title">{{ greeting }}</h3>
        <p class="intro-message-1">
          Please click on the <b>Create New Note</b> button on the sidebar to
          create a new note
        </p>
      </div>
    </div>

    <section class="content-items" v-if="numOfNotes">
      <h3 class="items-title">All Notes</h3>
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
        <base-card @click.stop>
          <div class="modal-container">
            <h3 class="modal-title">Add a New Note</h3>

            <form class="modal-form" @submit.prevent="addNewNote">
              <div class="input-wrapper">
                <input
                  type="text"
                  name="title"
                  placeholder="Title"
                  ref="title"
                />
              </div>

              <div class="input-wrapper">
                <textarea
                  type="text"
                  name="content"
                  placeholder="Enter note"
                  ref="newNote"
                ></textarea>
                <!-- @input="$nextTick(autoResizeCreateField)" -->
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
  props: ["isModal", "activeSide"],
  emits: ["close-modal", "show-notification"],
  components: {
    NotesList,
    NotesDetails,
  },
  computed: {
    numOfNotes() {
      return this.$store.getters["notes/numOfNotes"];
    },
    greeting() {
      return this.$store.getters.greeting;
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
    cancelNewNote() {
      this.closeModal();
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
};
</script>