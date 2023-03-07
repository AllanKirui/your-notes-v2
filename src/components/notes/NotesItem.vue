<template>
  <li :class="noteClasses" :title="hoverTitle" @click="setSelectedNote(id)">
    <div class="bg-image"></div>

    <div class="indicator">
      <span class="active"></span>
    </div>

    <div class="text-wrapper">
      <div class="title-wrapper">
        <h3 class="item-title">{{ title }}</h3>
      </div>
      <div class="text-wrapper-notes">
        <p class="text-contents">{{ setTextBasedOnFontSize(content) }}</p>
      </div>
    </div>
  </li>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "NotesItem",
  props: ["id", "title", "content", "isDefault"],
  inject: ["setTextLength"],
  computed: {
    ...mapGetters(["globalFontSize"]),
    ...mapGetters("notes", ["openNoteId", "notesList"]),
    hoverTitle() {
      return "View " + this.title;
    },
    noteClasses() {
      let classes = "";

      // add a default class for the default note item
      if (this.isDefault) {
        classes = "item-wrapper flex default-item";
      } else {
        classes = "item-wrapper flex";
      }

      // add the 'active' class for the opened note item
      if (this.openNoteId === this.id) {
        classes += " active";
      }

      return classes;
    },
  },
  methods: {
    setSelectedNote(id) {
      // dispatch an action to set the id of the selected notes item
      this.$store.dispatch({
        type: "notes/setSelectedNote",
        noteId: id,
      });

      // get the selected note element
      let [selectedNote] = this.notesList.filter((note) => note.id === id);
      let index = this.notesList.indexOf(selectedNote) + 1; // plus 1 since :nth-child() is not zero indexed
      let noteEl = document.querySelector(`.item-wrapper:nth-child(${index})`);

      // for the first 3 elements, scroll the parent's title element into view
      if (index < 4) {
        let notesWrapperEl = document.querySelector(".notes-wrapper");
        let parentEl = notesWrapperEl.parentElement;
        let titleEl = parentEl.querySelector(".items-title");
        titleEl.scrollIntoView();
        return;
      }

      // for other elements, scroll selected note item into view
      noteEl.scrollIntoView();
    },
    setTextBasedOnFontSize(text) {
      let trimmedText = "";

      switch (this.globalFontSize) {
        case 14: // for 14px set a 200 character length limit
          trimmedText = this.setTextLength(text, 200);
          break;
        case 16: // 16px set a 175 character length limit
          trimmedText = this.setTextLength(text, 175);
          break;
        case 18: // 18px set a 150 character length limit
          trimmedText = this.setTextLength(text, 150);
          break;
        default:
          trimmedText = this.setTextLength(text, 200);
          break;
      }

      return trimmedText;
    },
  },
};
</script>