import getters from "./getters";

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
            "The Markdown Guide by Mark Cone",
            "Heaven is For Real by Todd Burpo",
          ],
        },
      ],
    };
  },
  getters,
};
