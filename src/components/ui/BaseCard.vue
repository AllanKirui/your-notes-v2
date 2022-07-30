<template>
  <div class="card">
    <slot></slot>
  </div>
</template>

<style scoped>
.card {
  padding: 0.75rem;
  margin: 0 2rem;
  width: 100%;
  max-width: 35rem;
  border-radius: 8px;
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
  background-color: var(--color-white);
}
</style>