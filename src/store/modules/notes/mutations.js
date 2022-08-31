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
  addNewNote(state, payload) {
    // add a new note to the list of notes
    state.notes.push(payload);
  },
  deleteNote(state, payload) {
    let parentId = payload.id;

    // if note is the default welcome note, make a copy of it
    // allowing user to restore it later
    if (payload.isDefault) {
      state.defaultNote = state.notes[parentId];
    }

    // filter out the note whose id matches the parent id
    state.notes = state.notes.filter((note) => note.id !== parentId);
  },
  closeOpenFields(state, payload) {
    state.isCloseOpenFields = payload;
  },
};
