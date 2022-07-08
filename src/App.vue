<template>
  <WelcomeHeader />
  <router-view name="authn"></router-view>
</template>

<script>
import WelcomeHeader from "./components/nav/WelcomeHeader.vue";

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
  --color-pantone-green: hsl(136, 100%, 33%);
  --color-dark-pastel-green: hsl(136, 100%, 38%);
  --color-cultured: hsl(0, 0%, 97%);
  --color-eerie-black: hsl(0, 0%, 10%);
  --color-traffic-grey: hsl(0, 0%, 32%);
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
  overflow-x: hidden;
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

/* Flex box styles */
.flex {
  display: flex;
}

.flex-fd-c {
  flex-direction: column;
}

.flex-jc-c {
  justify-content: center;
}

.flex-jc-sb {
  justify-content: space-between;
}

.flex-ai-c {
  align-items: center;
}

.flex-ai-fe {
  align-items: flex-end;
}

.flex-fw-w {
  flex-wrap: wrap;
}
</style>