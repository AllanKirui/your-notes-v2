import getters from "./getters";
import actions from "./actions";
import mutations from "./mutations";

export default {
  namespaced: true,
  state() {
    return {
      notes: [
        {
          id: 0,
          title: "Welcome to Notes",
          content:
            "Here are some 'notable' tips for you.\n\n" +
            "Pressing Enter while creating or editing a note will create a new line hence you can have notes with multiple paragraphs.\n\n" +
            'To add a new note, simply click the "New Note" button on the Sidebar. You can also delete an existing note by clicking the "Delete" button at the top right of an open notes window, and all you have to do to edit an existing note is to click the "Edit" button below to bring up the edit field.\n\n' +
            "If you choose to delete or edit this note, you can restore it from the Settings page.\n\n\n\n\n" +
            "Marking my spot in the world of web development,\n" +
            "Allan Kirui.",
          isDefault: true,
        },
        {
          id: 1,
          title: "Lorem Text",
          content: `Lorem ipsum, dolor sit amet consectetur adipisicing elit. Cumque aut officia
          distinctio libero modi, debitis consectetur aliquid nobis aspernatur optio
          quisquam minus aliquam magnam ratione suscipit culpa repudiandae, asperiores
          quaerat magni minima sint, iste soluta praesentium. Quam recusandae nostrum,
          sit sunt esse sed magni, laudantium optio assumenda quae cumque enim odit
          eveniet provident inventore, excepturi earum eaque? Tempora modi reiciendis
          saepe ab eligendi eos quibusdam commodi soluta iusto labore architecto optio
          provident pariatur ut error doloribus illo debitis numquam ullam reprehenderit
          nisi, quaerat cumque. Distinctio corporis eum corrupti error, dolores atque
          quibusdam consectetur possimus fuga excepturi fugiat ullam magni nulla debitis
          suscipit nostrum cupiditate. Vel eligendi corporis ipsa et repellat quis,
          assumenda voluptate laborum, at hic labore. Illo assumenda vero id labore quod
          voluptatem molestias nemo autem, obcaecati recusandae atque doloribus magnam
          vel ut quidem quas. Aliquid vitae exercitationem, omnis officiis cupiditate
          consequatur adipisci, a voluptas, quia pariatur nemo. Numquam!`,
        },
        {
          id: 2,
          title: "My Thoughts",
          content: `Thoughts be mine. Mine be the thoughts. Lorem ipsum, dolor sit amet consectetur adipisicing elit. Cumque aut officia
          distinctio libero modi, debitis consectetur aliquid nobis aspernatur optio
          quisquam minus aliquam magnam ratione suscipit culpa repudiandae, asperiores
          quaerat magni minima sint, iste soluta praesentium. Quam recusandae nostrum,
          sit sunt esse sed magni, laudantium optio assumenda quae cumque enim odit
          eveniet provident inventore, excepturi earum eaque?`,
        },
        {
          id: 3,
          title: "The Progressive JavaScript Framework",
          content: `
          VueJS An approachable, performant and versatile framework for building web user interfaces.`,
        },
      ],
      selectedNote: null,
      isCloseOpenFields: false,
      openNoteId: null,
    };
  },
  getters,
  mutations,
  actions,
};
