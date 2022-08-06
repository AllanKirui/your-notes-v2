<template>
  <section class="content-wrapper">
    <div class="content-intro-wrapper" v-if="!numOfNotes">
      <div class="bg-images"></div>
      <div class="text">
        <h3 class="intro-title">{{ greeting }}</h3>
        <p class="intro-message-1">
          Please click on the <b>Create New Note</b> button on the sidebar to
          create a new note
        </p>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  computed: {
    numOfNotes() {
      return this.$store.getters["notes/numOfNotes"];
    },
    greeting() {
      return this.$store.getters.greeting;
    },
  },
};
</script>

<style scoped>
</style>