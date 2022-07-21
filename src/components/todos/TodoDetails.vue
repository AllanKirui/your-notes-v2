<template>
  <div v-if="hasTodo" class="details-wrapper">
    <h3 class="items-title">{{ selectedTodo.title }}</h3>
    <ul class="items">
      <li v-for="(item, index) of selectedTodo.contents" :key="index">
        <div class="item flex">
          <div class="item-checkbox">
            <input type="checkbox" />
          </div>

          <div class="item-text-wrapper">
            <div class="item-text" v-if="selectedItem !== index">
              <span class="item-details" @click="editText(index)">{{
                item
              }}</span>
            </div>
            <!-- only show for the clicked todo item -->
            <div
              class="item-edit-field"
              v-if="isEditText && selectedItem === index"
            >
              <textarea
                class="field"
                type="text"
                :value="item"
                ref="textarea"
              ></textarea>
              <div class="edit-controls">
                <button>Save</button>
                <button>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      hasTodo: false,
      isEditText: false,
      selectedItem: null,
    };
  },
  computed: {
    ...mapGetters("todos", ["selectedTodo"]),
  },
  methods: {
    editText(index) {
      this.selectedItem = index;
      this.isEditText = true;

      // resize the textarea after it has been rendered
      this.$nextTick(() => {
        this.autoResizeField();
      });
    },
    autoResizeField() {
      let textarea = this.$refs.textarea[0];
      textarea.style.height = textarea.scrollHeight + "px";

      // focus on the textare and highlight its contents
      textarea.focus();
      textarea.select();
    },
  },
  watch: {
    selectedTodo(newValue) {
      if (newValue) {
        this.selectedItem = null; // reset the selectedItem prop
        this.hasTodo = true;
      }
    },
  },
};
</script>