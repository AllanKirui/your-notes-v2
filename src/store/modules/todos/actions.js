export default {
  setSelectedTodo(context, payload) {
    // commit a mutation to set the id of the selected todo item
    context.commit("setSelectedTodo", payload);
  },
  updateCompletionStatus(context, payload) {
    // commit a mutation to set completed status of a checked todo item
    context.commit("updateCompletionStatus", payload);
  },
  saveChanges(context, payload) {
    // commit a mutation to save changes made on a todo item
    context.commit("saveChanges", payload);
  },
  addNewTodo(context, payload) {
    // commit a mutation to add a new todo to the list of todos
    context.commit("addNewTodo", payload);
  },
  addNewTodoTask(context, payload) {
    // commit a mutation to add a new todo task
    context.commit("addNewTodoTask", payload);
  },
  resetSelectedTodo(context) {
    // commit a mutation to reset the 'selectedTodo' state prop
    context.commit("resetSelectedTodo");
  },
  updateHiddenStatus(context, payload) {
    // commit a mutation to set hidden status of completed tasks in a todo
    context.commit("updateHiddenStatus", payload);
  },
  deleteTodo(context, payload) {
    let data = { ...payload };

    // add new data
    data.theme = context.rootState.theme;
    data.fontSize = context.rootState.globalFontSize;
    data.hasDeletedDefaultNote = context.rootState.hasDeletedDefaultNote;

    // commit a mutation to delete a todo from the list of todos
    context.commit("deleteTodo", data);
  },
  deleteTodoTask(context, payload) {
    // commit a mutation to delete a task from a todo
    context.commit("deleteTodoTask", payload);
  },
  closeOpenFields(context, payload) {
    // commit a mutation to close any open fields in TodoDetails
    context.commit("closeOpenFields", payload);
  },
  setOpenTodoId(context, payload) {
    // commit a mutation to set the open todo id
    context.commit("setOpenTodoId", payload);
  },
  restoreWelcomeTodo(context, payload) {
    let userPreferences = {
      theme: context.rootState.theme,
      fontSize: context.rootState.globalFontSize,
      hasDeletedDefaultTodo: context.rootState.hasDeletedDefaultTodo,
      hasDeletedDefaultNote: context.rootState.hasDeletedDefaultNote,
    };

    payload.userPreferences = userPreferences;

    // commit a mutation to restore the Welcome Todo
    context.commit("restoreWelcomeTodo", payload);
  },
  addRealtimeData(context, payload) {
    // commit a mutation to get the todo data
    context.commit("addRealtimeData", payload);
  },
  clearTodosList(context) {
    // commit a mutation to clear the todos list
    context.commit("clearTodosList");
  },
  addWelcomeTodo(context) {
    // commit a mutation to include the Welcome Todo along with the new data
    context.commit("addWelcomeTodo");
  },
  createListOfTodoIds(context) {
    // commit a mutation to create a list of todo ids
    context.commit("createListOfTodoIds");
  },
};
