<template>
  <header>
    <div class="logo flex flex-jc-c flex-ai-c">
      <img
        src="@/assets/img/logo.min.svg"
        alt="your notes v2 logo"
        class="logo-image"
        width="305"
        height="52"
      />
    </div>
  </header>
</template>

<style scoped>
.logo {
  width: 100vw;
  height: 120px;
  background-color: var(--color-eerie-black);
  position: relative;
}

.logo::before {
  content: "";
  position: absolute;
  top: 0;
  width: 100%;
  height: 5px;
  background-color: var(--color-pantone-green);
}
</style>