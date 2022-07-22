<template>
  <div v-if="hasTodo" class="details-wrapper">
    <h3 class="items-title">{{ selectedTodo.title }}</h3>
    <ul class="items">
      <li v-for="(item, index) of selectedTodo.contents" :key="index">
        <div class="item flex">
          <div class="item-checkbox">
            <input
              type="checkbox"
              v-model="item.isCompleted"
              @change="checkHandler(index, item.isCompleted)"
            />
          </div>

          <div class="item-text-wrapper">
            <div class="item-text" v-if="selectedItem !== index">
              <span
                class="item-details"
                :class="{ completed: item.isCompleted }"
                @click="editText(index)"
                >{{ item.text }}</span
              >
            </div>
            <!-- only show for the clicked todo item -->
            <div
              class="item-edit-field"
              v-if="isEditText && selectedItem === index"
            >
              <textarea
                class="field"
                type="text"
                :value="item.text"
                ref="textarea"
              ></textarea>
              <div class="edit-controls">
                <button class="btn btn-save" title="Save edits">Save</button>
                <button
                  class="btn btn-cancel"
                  title="Cancel edits"
                  @click="cancelEdits"
                >
                  Cancel
                </button>
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
      isChecked: false,
      parentTodoId: null,
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
    cancelEdits() {
      // reset props
      this.selectedItem = null;
      this.isEditText = false;
    },
    checkHandler(index, isCompleted) {
      this.isChecked = isCompleted;

      // dispatch an action to set completed status of a checked todo item
      this.$store.dispatch({
        type: "todos/updateCompletionStatus",
        status: this.isChecked,
        parentTodoId: this.parentTodoId,
        childTodoId: index,
      });

      // reset prop
      this.isChecked = false;
    },
  },
  watch: {
    selectedTodo(newTodo) {
      if (newTodo) {
        this.hasTodo = true;
        this.parentTodoId = newTodo.id;

        // reset prop
        this.selectedItem = null;
      }
    },
  },
};
</script>

<style scoped>
.details-wrapper {
  width: 90%;
  margin: 2.5rem auto 0;
  font-size: 0.875rem;
  position: relative;
  z-index: 2;
}

.items {
  margin-top: 1.125rem;
}

.items .item {
  margin-bottom: 0.5rem;
  width: 100%;
}

.items .item:hover {
  background-color: var(--color-honeydew);
}

.items .item .item-checkbox input[type="checkbox"] {
  display: grid;
  place-content: center;
  margin: 0;
  width: 1.1em;
  height: 1.1em;
  border: 0.15em solid currentColor;
  border-radius: 0.15em;
  /* Add if not using autoprefixer */
  -webkit-appearance: none;
  appearance: none;
  background-color: #fff;
  font: inherit;
  color: currentColor;
  transform: translateY(-0.075em);
}

.items .item .item-checkbox input[type="checkbox"]::before {
  content: "";
  width: 0.65em;
  height: 0.65em;
  transform: scale(0);
  transition: 120ms transform ease-in-out;
  box-shadow: inset 1em 1em var(--color-eerie-black);
  transform-origin: bottom left;
  clip-path: polygon(14% 44%, 0 65%, 50% 100%, 100% 16%, 80% 0%, 43% 62%);
}

.items .item .item-checkbox input[type="checkbox"]:checked::before {
  transform: scale(1);
}

.item-text-wrapper {
  width: 100%;
  margin-left: 0.75rem;
}

.item-text .item-details {
  display: inline-block;
  width: 100%;
  height: 100%;
  cursor: pointer;
  padding-bottom: 0.375rem;
  line-height: 1.2;
}

.item-text .item-details.completed {
  text-decoration: line-through;
}

.item-edit-field {
  width: 100%;
}

.item-edit-field .field {
  padding: 0.5rem;
  width: 100%;
  height: auto;
  min-height: 3.125rem;
  border-radius: 5px;
  border: 2px solid var(--color-dark-pastel-green);
  outline-color: var(--color-dark-pastel-green);
  font-family: inherit;
  font-size: inherit;
  background-color: var(--color-honeydew);
  overflow: hidden;
  overflow-wrap: break-word;
  resize: none;
}

.item-edit-field .edit-controls {
  margin-top: 0.375rem;
}

.item-edit-field .edit-controls .btn {
  padding: 0.375rem 0.5rem;
  background: transparent;
  border: none;
  outline: none;
  border-radius: 4px;
  cursor: pointer;
  font-family: inherit;
  font-size: inherit;
}

.item-edit-field .edit-controls .btn.btn-save {
  background-color: var(--color-malachite);
}

.item-edit-field .edit-controls .btn.btn-cancel {
  margin-left: 0.3125px;
}

.item-edit-field .edit-controls .btn.btn-cancel:hover {
  background-color: var(--color-platinum);
}
</style>