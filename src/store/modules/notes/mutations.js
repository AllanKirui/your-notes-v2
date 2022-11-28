import {
  db,
  _doc,
  notesColRef,
  _addDoc,
  _setDoc,
  _deleteDoc,
  _updateDoc,
} from "@/main.js";

import { throwException } from "@/store/index.js";

export default {
  setSelectedNote(state, payload) {
    // get the note whose id matches the payload id
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
  async saveChanges(_, payload) {
    let newNote = payload.newText;

    const docRef = _doc(db, "notes", payload.firestoreDocId);

    try {
      // if newNote is empty, don't add it
      if (!newNote) return;

      // update the value of the 'content' key in the firestore document
      // and update the timestamp
      await _updateDoc(docRef, {
        content: newNote,
        edited: payload.dateEdited,
      });
    } catch (error) {
      throwException(
        error,
        "saveChanges( ) fn in store/modules/notes/mutations"
      );
    }
  },
  async addNewNote(_, payload) {
    try {
      // add a new note as a document to the firebase 'notes' collection
      await _addDoc(notesColRef, payload);
    } catch (error) {
      throwException(
        error,
        "addNewNote( ) fn in store/modules/notes/mutations"
      );
    }
  },
  async deleteNote(state, data) {
    // if the state contains a selectedNote, use that.
    // Otherwise, use the prop thats part of the 'data' object
    let selectedNote = state.selectedNote || data.selectedNote;

    // if note is the default welcome note, delete it and update
    // the user preferences
    if (selectedNote.isDefault) {
      state.notes = state.notes.filter((note) => note.id !== selectedNote.id);

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
        throwException(
          error,
          "deleteNote( ) fn in store/modules/notes/mutations"
        );
      }
      return;
    }

    // delete a note with a matching firestore document id from the 'notes' collection
    try {
      await _deleteDoc(_doc(db, "notes", data.firestoreDocId));
    } catch (error) {
      throwException(
        error,
        "deleteNote( ) fn in store/modules/notes/mutations"
      );
    }
  },
  closeOpenFields(state, payload) {
    state.isCloseOpenFields = payload;
  },
  async restoreWelcomeNote(state, payload) {
    state.notes.unshift(state.welcomeNote);

    // get the new preferences
    let newPreferences = { ...payload.userPreferences };
    newPreferences.hasDeletedDefaultNote = false;

    // update the 'preferences' collection in firestore
    try {
      // add a new collection to Firestore called 'preferences', overwrite existing ones
      await _setDoc(
        _doc(db, "preferences", payload.firestoreDocId),
        newPreferences
      );
    } catch (error) {
      throwException(
        error,
        "restoreWelcomeNote( ) fn in store/modules/notes/mutations"
      );
    }
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
