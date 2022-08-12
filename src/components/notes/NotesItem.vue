<template>
  <li
    :class="[openNoteId === id ? 'active' : '', 'item-wrapper flex']"
    :title="hoverTitle"
    @click="setSelectedNote(id)"
  >
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
  props: ["id", "title", "content"],
  inject: ["setTextLength"],
  computed: {
    hoverTitle() {
      return "View " + this.title;
    },
    openNoteId() {
      return this.$store.getters["notes/openNoteId"];
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