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
        <p class="text-contents">{{ setTextBasedOnFontSize(content) }}</p>
      </div>
    </div>
  </li>
</template>

<script>
export default {
  props: ["id", "title", "content", "isDefault"],
  inject: ["setTextLength", "globalFontSize"],
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