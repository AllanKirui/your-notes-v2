<template>
  <header>
    <div class="logo flex flex-jc-c flex-ai-c">
      <div class="wrapper">
        <img
          src="@/assets/img/logo-default.svg"
          alt="your notes v2 logo"
          class="logo-image"
          width="305"
          height="52"
        />
        <h1 class="logo-text">Your Notes <i>v2</i></h1>
      </div>
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

.logo .wrapper {
  position: relative;
  width: 250px;
}

.logo-image {
  position: relative;
  max-width: 100%;
  z-index: 2;
}

.logo-text {
  position: absolute;
  top: 50%;
  left: 10%;
  transform: translateY(-50%);
  color: var(--color-cultured);
  text-align: center;
  z-index: 1;
}
</style>