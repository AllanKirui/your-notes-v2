<template>
  <div class="card" :class="mode">
    <slot></slot>
  </div>
</template>

<script>
export default {
  props: ["mode"],
};
</script>

<style scoped>
.card {
  padding: 0.75rem;
  margin: 0 2rem;
  width: 100%;
  max-width: 35rem;
  border-radius: 8px;
  overflow: hidden;
}

.default-theme {
  background-color: var(--color-white);
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
}

.purplish-theme {
  background-color: var(--color-black-blue);
  box-shadow: rgba(255, 122, 175, 0.3) 0px 3px 8px;
}

.bluetiful-theme {
  background-color: var(--color-steel-blue);
  box-shadow: rgba(0, 0, 0, 0.35) 0px 3px 8px;
}
</style>