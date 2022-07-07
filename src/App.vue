<template>
  <WelcomeHeader />
</template>

<script>
import WelcomeHeader from "@/components/nav/WelcomeHeader.vue";

export default {
  name: "App",
  components: {
    WelcomeHeader,
  },
};
</script>


<style>
@import url("https://fonts.googleapis.com/css2?family=Rubik:ital,wght@0,400;0,500;0,600;1,400&display=swap");

:root {
  /* Colors */
  --color-pantone-green: #00a82e;
  --color-cultured: #f7f7f7;
  --color-eerie-black: #1a1a1a;
}

html {
  font-size: 100%;
  box-sizing: border-box;
  scroll-behavior: smooth;
}

*,
*::before,
*::after {
  box-sizing: inherit;
}

body {
  margin: 0;
  padding: 0;
  font-family: "Rubik", sans-serif;
  background-color: var(--color-cultured);
}

h1,
h2,
h3,
p {
  margin: 0;
}

a {
  text-decoration: none;
}

ul {
  list-style: none;
  padding: 0;
  margin: 0;
}
</style>