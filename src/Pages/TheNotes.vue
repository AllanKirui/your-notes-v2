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
  </section>

  <section class="content-items" v-if="numOfNotes">
    <h3 class="items-title">All Notes</h3>
    <notes-list></notes-list>
  </section>

  <section class="content-items-details" v-if="numOfNotes">
    <div class="bg-images"></div>
    <notes-details @show-notification="showNotification"></notes-details>
  </section>
</template>

<script>
import NotesList from "@/components/notes/NotesList.vue";
import NotesDetails from "@/components/notes/NotesDetails.vue";

export default {
  props: ["isModal"],
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
      this.$store.dispatch("todos/closeOpenFields", false);
    },
    showNotification(message) {
      this.$emit("show-notification", message);
    },
  },
};
</script>

<style scoped>
</style>