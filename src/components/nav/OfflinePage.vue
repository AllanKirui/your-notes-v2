<template>
  <h1>You are offline</h1>
</template>

<script>
export default {
  name: "OfflinePage",
  methods: {
    setOnlineListener() {
      window.addEventListener("online", this.onlineListener);
    },
    onlineListener() {
      this.$store.commit("app/updateOnlineStatus", true);

      const targetPath = window.location.href.replace(
        window.location.origin,
        ""
      );
      const currentPath = this.$route.fullPath;

      if (targetPath !== currentPath) this.$router.replace(targetPath);
    },
  },
  beforeMount() {
    this.setOnlineListener();
  },
  beforeUnmount() {
    window.removeEventListener("online", this.onlineListener);
  },
};
</script>