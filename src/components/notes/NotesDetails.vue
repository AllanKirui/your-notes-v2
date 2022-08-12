<template>
  <div v-if="!hasNote" class="intro-wrapper">
    <h3 class="intro-title">{{ greeting }}</h3>
    <p class="intro-message-1">
      Please select a note from the <b>All Notes</b> panel to continue working
      on an existing note
    </p>
    <p class="intro-message-2">
      Or click the <b>Create New Note</b> button on the sidebar to create a new
      note
    </p>
  </div>

  <!-- Notes title -->
  <div v-if="hasNote" class="heading-wrapper">
    <div class="heading-top flex">
      <h3 class="items-title">{{ selectedNote.title }}</h3>
    </div>
  </div>

  <!-- Notes content -->
  <div v-if="hasNote" class="details-wrapper">
    <div class="item-text-wrapper">
      <div v-if="!isEditText" class="item-text">
        <span class="item-details">{{ selectedNote.content }}</span>
      </div>

      <div v-if="isEditText" class="item-edit-field">
        <textarea
          class="field"
          :value="selectedNote.content"
          style="max-height: calc(100vh - 250px)"
          ref="editNote"
        ></textarea>
      </div>
    </div>
  </div>

  <!-- edit controls -->
  <div v-if="hasNote" class="edit-controls flex flex-jc-sb">
    <!-- use the transition component to animate the switching of buttons -->
    <transition name="buttons" mode="out-in">
      <button
        v-if="!isEditText"
        class="btn btn-edit"
        title="Edit note"
        @click="editText"
      >
        Edit
      </button>
      <div v-else-if="isEditText">
        <button class="btn btn-save" title="Save edits" @click="cancelEdits">
          Save
        </button>
        <button
          class="btn btn-cancel"
          title="Cancel edits"
          @click="cancelEdits"
        >
          Cancel
        </button>
      </div>
    </transition>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  emits: ["show-notification"],
  data() {
    return {
      hasNote: false,
      isEditText: false,
      isHighlighted: false,
    };
  },
  computed: {
    ...mapGetters("notes", ["selectedNote"]),
    ...mapGetters(["greeting"]),
  },
  methods: {
    editText() {
      // TODO: reset props as in TodoDetails
      this.isHighlighted = false;

      this.isEditText = true;

      // resize the textarea after it has been rendered
      this.$nextTick(() => {
        this.autoResizeEditField();
      });
    },
    cancelEdits() {
      this.isEditText = false;
    },
    autoResizeEditField() {
      let textarea = this.$refs.editNote;
      textarea.style.height = textarea.scrollHeight + "px";

      // if the textarea is already focused and selected, return
      if (this.isHighlighted) return;

      // focus on the textarea and highlight its contents
      textarea.focus();
      textarea.select();
      this.isHighlighted = true;
    },
  },
  watch: {
    selectedNote(newNote) {
      if (newNote) {
        // TODO: add similar steps as in TodoDetails
        this.hasNote = true;

        // reset props
        this.cancelEdits();
      }
    },
    isEditText(newValue) {
      if (!newValue) {
        this.isHighlighted = false;
      }
    },
  },
  mounted() {
    // dispatch an action to reset the 'selectedNote' state prop
    this.$store.dispatch("notes/resetSelectedNote");
  },
  beforeUpdate() {
    const note = this.$store.getters["notes/selectedNote"];

    // dispatch an action to set the open note id
    this.$store.dispatch("notes/setOpenNoteId", note.id);
  },
};
</script>

<style scoped>
.item-text-wrapper {
  line-height: 1.4;
}

.details-wrapper {
  margin: 0 auto;
  height: calc(100vh - 230px);
  overflow-y: auto;
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
  background: transparent;
  overflow-y: auto;
  overflow-wrap: break-word;
  resize: none;
}

.edit-controls {
  position: relative;
  margin: 0.625rem 2.5rem 0;
  z-index: 2;
}

.btn.btn-cancel {
  margin-left: 0.3125rem;
}

.btn.btn-edit,
.btn.btn-save {
  background-color: var(--color-malachite);
}

.btn.btn-edit:hover,
.btn.btn-save:hover {
  background-color: var(--color-light-green);
}

.btn.btn-cancel:hover {
  background-color: var(--color-platinum);
}

.buttons-enter-active {
  animation: fadePop 0.15s ease-out;
}

.buttons-leave-active {
  animation: fadePop 0.15s ease-in reverse;
}

@keyframes fadePop {
  0% {
    opacity: 0;
    transform: scale(0.8);
  }
  75% {
    opacity: 1;
    transform: scale(1.1);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}
</style>