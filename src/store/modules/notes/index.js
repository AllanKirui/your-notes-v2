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
          id: 1,
          title: "My Thoughts",
          content: `Thoughts be mine. Mine be the thoughts. Lorem ipsum, dolor sit amet consectetur adipisicing elit. Cumque aut officia
          distinctio libero modi, debitis consectetur aliquid nobis aspernatur optio
          quisquam minus aliquam magnam ratione suscipit culpa repudiandae, asperiores
          quaerat magni minima sint, iste soluta praesentium. Quam recusandae nostrum,
          sit sunt esse sed magni, laudantium optio assumenda quae cumque enim odit
          eveniet provident inventore, excepturi earum eaque?`,
        },
        {
          id: 2,
          title: "The Progressive JavaScript Framework",
          content: `
          VueJS An approachable, performant and versatile framework for building web user interfaces.`,
        },
      ],
      selectedNote: null,
      openNoteId: null,
    };
  },
  getters,
  mutations,
  actions,
};
