import getters from "./getters";
import actions from "./actions";
import mutations from "./mutations";

export default {
  namespaced: true,
  state() {
    return {
      todos: [],
      defaultTodo: null,
      selectedTodo: null,
      isCloseOpenFields: false,
      openTodoId: null,
      hasUpdatedTodoTask: false,
      welcomeTodo: {
        id: 0,
        title: "Welcome to Todos",
        contents: [
          {
            text: 'Add a new todo task by clicking the "Add new task" button below',
            isCompleted: false,
          },
          {
            text: "Edit a todo task by clicking on it to open the edit field",
            isCompleted: false,
          },
          {
            text: 'Delete a todo task by clicking the "X" (cross) at the end of the task',
            isCompleted: false,
          },
          {
            text: 'Create a new todo by clicking the "New Todo" button on the sidebar',
            isCompleted: false,
          },
          {
            text: 'Delete a todo by clicking the "Delete" button on top',
            isCompleted: false,
          },
          {
            text: "Please note: If you choose to delete or edit this Welcome todo or any task in it, you can restore it at any time from the Settings page",
            isCompleted: false,
          },
        ],
        isHideCompleted: false,
        isDefault: true,
        isHidden: false,
      },
    };
  },
  getters,
  mutations,
  actions,
};

// TODO: remove this
// todos: [
//   {
//     id: 0,
//     title: "Welcome to Todos",
//     contents: [
//       {
//         text: 'Add a new todo task by clicking the "Add new task" button below',
//         isCompleted: false,
//       },
//       {
//         text: "Edit a todo task by clicking on it to open the edit field",
//         isCompleted: false,
//       },
//       {
//         text: 'Delete a todo task by clicking the "X" (cross) at the end of the task',
//         isCompleted: false,
//       },
//       {
//         text: 'Create a new todo by clicking the "New Todo" button on the sidebar',
//         isCompleted: false,
//       },
//       {
//         text: 'Delete a todo by clicking the "Delete" button on top',
//         isCompleted: false,
//       },
//       {
//         text: "Please note: If you choose to delete or edit this Welcome todo or any task in it, you can restore it at any time from the Settings page",
//         isCompleted: false,
//       },
//     ],
//     isHideCompleted: false,
//     isDefault: true,
//     isHidden: false,
//   },
//   {
//     id: 1,
//     title: "Shopping list",
//     contents: [
//       { text: "Milk", isCompleted: false },
//       { text: "Sugar", isCompleted: false },
//       { text: "Salt", isCompleted: false },
//       { text: "Butter", isCompleted: false },
//       { text: "Bread", isCompleted: false },
//     ],
//     isHideCompleted: false,
//   },
//   {
//     id: 2,
//     title: "Book reading list",
//     contents: [
//       { text: "Atomic Habits by James Clear", isCompleted: false },
//       { text: "Deep Work by Cal Newport", isCompleted: false },
//       {
//         text: "The Power of Habit by Charles Duhigg",
//         isCompleted: false,
//       },
//       { text: "The Talent Code by Daniel Coyle", isCompleted: false },
//       { text: "CSS Secrets by Lea Verou", isCompleted: false },
//       {
//         text: "Cracking the Coding Interview by Gayle Laakman",
//         isCompleted: false,
//       },
//       {
//         text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Exercitationem excepturi illum sint optio nostrum distinctio voluptas, perspiciatis in esse eos possimus! Enim eius quasi laudantium, harum dolor esse quo, atque quos quisquam officia ipsam eum exercitationem magnam minima? Dicta architecto cumque hic quod et eius nulla itaque ducimus quos sint nobis veniam aut rerum, sequi explicabo, quisquam ullam. Id, sint?",
//         isCompleted: false,
//       },
//       { text: "The Markdown Guide by Mark Cone", isCompleted: false },
//       { text: "Heaven is For Real by Todd Burpo", isCompleted: false },
//     ],
//     isHideCompleted: false,
//   },
// ],
