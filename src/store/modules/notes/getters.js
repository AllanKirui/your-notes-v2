export default {
  notesList(state) {
    return state.notes;
  },
  numOfNotes(state) {
    return state.notes.length;
  },
  selectedNote(state) {
    return state.selectedNote;
  },
  openNoteId(state) {
    return state.openNoteId;
  },
};
