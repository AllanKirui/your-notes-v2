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
  isCloseOpenFields(state) {
    return state.isCloseOpenFields;
  },
  openNoteId(state) {
    return state.openNoteId;
  },
};
