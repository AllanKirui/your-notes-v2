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
                <button class="btn btn-save" title="Save edits">Save</button>
                <button class="btn btn-cancel" title="Cancel edits">
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

<style scoped>
.details-wrapper {
  width: 90%;
  margin: 2.5rem auto 0;
  font-size: 0.875rem;
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