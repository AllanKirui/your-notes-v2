<template>
  <div v-if="!hasNote" class="intro-wrapper">
    <h3 class="intro-title">{{ greeting }}</h3>
    <p class="intro-message-1">
      Please select a note from the <b>All Notes</b> panel to continue working
      on an existing note
    </p>
    <p class="intro-message-2">
      Or click the <b>Create New Note</b> button on the sidebar to create a new
      note
    </p>
  </div>

  <!-- Notes title -->
  <div v-if="hasNote" class="heading-wrapper">
    <div class="heading-top flex">
      <h3 class="items-title">{{ selectedNote.title }}</h3>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  emits: ["show-notification"],
  data() {
    return {
      hasNote: false,
    };
  },
  computed: {
    ...mapGetters("notes", ["selectedNote"]),
    ...mapGetters(["greeting"]),
  },
  watch: {
    selectedNote(newNote) {
      if (newNote) {
        this.hasNote = true;
      }
    },
  },
  beforeUpdate() {
    const note = this.$store.getters["notes/selectedNote"];

    // dispatch an action to set the open note id
    this.$store.dispatch("notes/setOpenNoteId", note.id);
  },
};
</script>