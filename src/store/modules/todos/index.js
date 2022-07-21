import getters from "./getters";
import actions from "./actions";
import mutations from "./mutations";

export default {
  namespaced: true,
  state() {
    return {
      todos: [
        {
          id: 1,
          title: "Shopping list",
          contents: ["Milk", "Sugar", "Salt", "Butter", "Bread"],
        },
        {
          id: 2,
          title: "Book reading list",
          contents: [
            "Atomic Habits by James Clear",
            "Deep Work by Cal Newport",
            "The Power of Habit by Charles Duhigg",
            "The Talent Code by Daniel Coyle",
            "CSS Secrets by Lea Verou",
            "Cracking the Coding Interview by Gayle Laakman",
            "Lorem ipsum dolor sit amet consectetur adipisicing elit. Exercitationem excepturi illum sint optio nostrum distinctio voluptas, perspiciatis in esse eos possimus! Enim eius quasi laudantium, harum dolor esse quo, atque quos quisquam officia ipsam eum exercitationem magnam minima? Dicta architecto cumque hic quod et eius nulla itaque ducimus quos sint nobis veniam aut rerum, sequi explicabo, quisquam ullam. Id, sint?",
            "The Markdown Guide by Mark Cone",
            "Heaven is For Real by Todd Burpo",
          ],
        },
      ],
      selectedTodo: null,
    };
  },
  getters,
  mutations,
  actions,
};
