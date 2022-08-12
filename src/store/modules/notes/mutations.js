export default {
  setSelectedNote(state, payload) {
    // get the todo whose id matches the payload id
    state.selectedNote = state.notes.filter(
      (note) => note.id === payload.noteId
    )[0];
  },
  setOpenNoteId(state, payload) {
    state.openNoteId = payload;
  },
  resetSelectedNote(state) {
    state.selectedNote = null;
    state.openNoteId = null;
  },
  saveChanges(state, payload) {
    let parentIdx = payload.noteId;

    // update the 'text' prop
    state.notes[parentIdx].content = payload.newText;
  },
};
