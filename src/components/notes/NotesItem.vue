<template>
  <li :class="noteClasses" :title="hoverTitle" @click="setSelectedNote(id)">
    <div class="bg-image"></div>

    <div class="indicator">
      <span class="active"></span>
    </div>

    <div class="text-wrapper">
      <div class="title-wrapper">
        <h4 class="item-title">{{ title }}</h4>
      </div>
      <div class="text-wrapper-notes">
        <p class="text-contents">{{ setTextLength(content, 200) }}</p>
      </div>
    </div>
  </li>
</template>

<script>
export default {
  props: ["id", "title", "content", "isDefault"],
  inject: ["setTextLength"],
  computed: {
    hoverTitle() {
      return "View " + this.title;
    },
    openNoteId() {
      return this.$store.getters["notes/openNoteId"];
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
    },
  },
};
</script>