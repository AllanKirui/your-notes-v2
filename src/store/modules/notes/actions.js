export default {
  setSelectedNote(context, payload) {
    // commit a mutation to set the id of the selected notes item
    context.commit("setSelectedNote", payload);
  },
  setOpenNoteId(context, payload) {
    // commit a mutation to set the open note id
    context.commit("setOpenNoteId", payload);
  },
  resetSelectedNote(context) {
    // commit a mutation to reset the 'selectedNote' state prop
    context.commit("resetSelectedNote");
  },
};
