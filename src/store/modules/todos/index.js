import getters from "./getters";
import actions from "./actions";
import mutations from "./mutations";

export default {
  namespaced: true,
  state() {
    return {
      todos: [
        {
          id: 0,
          title: "Shopping list",
          contents: [
            { text: "Milk", isCompleted: false },
            { text: "Sugar", isCompleted: false },
            { text: "Salt", isCompleted: false },
            { text: "Butter", isCompleted: false },
            { text: "Bread", isCompleted: false },
          ],
          isHideCompleted: false,
        },
        {
          id: 1,
          title: "Book reading list",
          contents: [
            { text: "Atomic Habits by James Clear", isCompleted: false },
            { text: "Deep Work by Cal Newport", isCompleted: false },
            {
              text: "The Power of Habit by Charles Duhigg",
              isCompleted: false,
            },
            { text: "The Talent Code by Daniel Coyle", isCompleted: false },
            { text: "CSS Secrets by Lea Verou", isCompleted: false },
            {
              text: "Cracking the Coding Interview by Gayle Laakman",
              isCompleted: false,
            },
            {
              text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Exercitationem excepturi illum sint optio nostrum distinctio voluptas, perspiciatis in esse eos possimus! Enim eius quasi laudantium, harum dolor esse quo, atque quos quisquam officia ipsam eum exercitationem magnam minima? Dicta architecto cumque hic quod et eius nulla itaque ducimus quos sint nobis veniam aut rerum, sequi explicabo, quisquam ullam. Id, sint?",
              isCompleted: false,
            },
            { text: "The Markdown Guide by Mark Cone", isCompleted: false },
            { text: "Heaven is For Real by Todd Burpo", isCompleted: false },
          ],
          isHideCompleted: false,
        },
      ],
      selectedTodo: null,
    };
  },
  getters,
  mutations,
  actions,
};
