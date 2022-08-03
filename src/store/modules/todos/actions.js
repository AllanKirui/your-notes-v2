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
    // commit a mutation to delete a todo from the list of todos
    context.commit("deleteTodo", payload);
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
};
