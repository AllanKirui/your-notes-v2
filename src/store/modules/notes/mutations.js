import { db, _doc, notesColRef, _addDoc, _setDoc, _deleteDoc } from "@/main.js";

// a function that handles firebase errors
const throwException = (error, location) => {
  let message = "";

  if (error.code && error.message) {
    message = `Oops! It appears you've discovered an Epic Bug ◔ ⌣ ◔\n\nLocation: ${location}\n\nError Code: ${error.code}\n\nReasons: ${error.message}`;
  } else {
    message = `Oops! It appears you've discovered an Epic Bug ◔ ⌣ ◔\n\nLocation: ${location}\n\n${error}"`;
  }
  alert(message);
};

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
    if (state.defaultNote) {
      state.notes[parentIdx - 1].content = payload.newText;
      return;
    }
    state.notes[parentIdx].content = payload.newText;
  },
  async addNewNote(_, payload) {
    try {
      // add a new todo as a document to the firebase 'todos' collection
      await _addDoc(notesColRef, payload);
    } catch (error) {
      throwException(error, "addNewNote( ) fn");
    }
  },
  async deleteNote(state, data) {
    let parentId = data.id;

    // if note is the default welcome note, delete it and update
    // the user preferences
    if (data.isDefault) {
      state.notes = state.notes.filter((note) => note.id !== parentId);

      let newPreferences = {
        theme: data.theme,
        fontSize: data.fontSize,
        hasDeletedDefaultTodo: data.hasDeletedDefaultTodo,
        hasDeletedDefaultNote: true,
      };

      try {
        // add a new collection to Firestore called 'preferences', overwrite existing ones
        await _setDoc(
          _doc(db, "preferences", data.firestoreDocId),
          newPreferences
        );
      } catch (error) {
        throwException(error, "deleteNote( ) fn");
      }
      return;
    }

    // delete a note with a matching firestore document id from the 'notes' collection
    try {
      await _deleteDoc(_doc(db, "notes", data.firestoreDocId));
    } catch (error) {
      throwException(error, "deleteNote( ) fn");
    }
  },
  closeOpenFields(state, payload) {
    state.isCloseOpenFields = payload;
  },
  restoreWelcomeNote(state, payload) {
    state.notes.unshift(payload);
  },
  addRealtimeData(state, payload) {
    // spread the data to the new object and add the unique firestore id as well
    state.notes.push({ ...payload.data(), fireId: payload.id });
  },
  clearNotesList(state) {
    // clear the notes list before updating it with new data
    state.notes = [];
  },
  addWelcomeNote(state) {
    // include the Welcome Note along with new data
    state.notes.push(state.welcomeNote);
  },
};
