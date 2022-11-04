<template>
  <ul class="notes-wrapper">
    <notes-item
      v-for="note of notesList"
      :key="note.id"
      :id="note.id"
      :title="note.title"
      :content="note.content"
      :is-default="note.isDefault"
    ></notes-item>
  </ul>
</template>

<script>
import { mapGetters } from "vuex";

import NotesItem from "@/components/notes/NotesItem.vue";

export default {
  name: "NotesList",
  components: { NotesItem },
  computed: {
    // tap into the 'notes' module and get the 'notesList' from the store
    ...mapGetters("notes", ["notesList"]),
  },
};
</script>