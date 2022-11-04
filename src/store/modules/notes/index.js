import getters from "./getters";
import actions from "./actions";
import mutations from "./mutations";

export default {
  namespaced: true,
  state() {
    return {
      notes: [],
      selectedNote: null,
      isCloseOpenFields: false,
      openNoteId: null,
      welcomeNote: {
        id: 0,
        title: "Welcome to Notes",
        content:
          "Here are some 'notable' tips for you.\n\n" +
          "Pressing Enter while creating or editing a note will create a new line hence you can have notes with multiple paragraphs.\n\n" +
          'To add a new note, simply click the "New Note" button on the Sidebar. You can also delete an existing note by clicking the "Delete" button at the top right of an open notes window, and all you have to do to edit an existing note is to click the "Edit" button below to bring up the edit field.\n\n' +
          "Please note: If you choose to delete this Welcome Note, you can restore it at any time from the Settings page.\n\n\n\n" +
          "Marking my spot in the world of web development,\n" +
          "Allan Kirui.",
        isDefault: true,
      },
    };
  },
  getters,
  mutations,
  actions,
};
