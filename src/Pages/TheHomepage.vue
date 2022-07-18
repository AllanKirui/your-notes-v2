<template>
  <the-header></the-header>

  <div class="container">
    <the-sidebar></the-sidebar>
  </div>
</template>

<script>
import TheHeader from "@/components/nav/TheHeader.vue";
import TheSidebar from "@/components/ui/TheSidebar.vue";

export default {
  components: {
    TheHeader,
    TheSidebar,
  },
};
</script>