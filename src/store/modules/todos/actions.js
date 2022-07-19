export default {
  setSelectedTodo(context, payload) {
    // commit a mutation to set the id of the selected todo item
    context.commit("setSelectedTodo", payload);
  },
};
