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
};
