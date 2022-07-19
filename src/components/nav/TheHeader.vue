<template>
  <header class="header">
    <nav class="nav flex flex-ai-c flex-jc-sb">
      <div class="nav-left flex">
        <div class="nav-logo">
          <router-link to="/todos">
            <img
              class="logo"
              src="@/assets/img/logo.min.svg"
              alt="your notes v2 logo"
              width="168"
              height="27.6"
            />
            <h3 class="logo-text">Your Notes <i>v2</i></h3>
          </router-link>
        </div>
        <div class="nav-search flex flex-jc-c">
          <img
            class="search"
            src="@/assets/img/search.min.svg"
            alt="search icon"
            width="20"
          />
          <input type="text" placeholder="Search notes" />
        </div>
      </div>

      <div class="nav-right flex flex-ai-c">
        <div class="nav-avatar flex flex-ai-c flex-jc-c">
          <div class="image-wrapper">
            <img class="avatar" src="@/assets/img/avatar.png" alt=" " />
          </div>
          <p class="username">John Doe</p>
        </div>
        <div class="nav-menu">
          <button class="menu-btn" title="show menu">
            <img src="@/assets/img/dropdown.min.svg" alt=" " />
          </button>
          <!-- TODO: menu goes here-->
        </div>
      </div>
    </nav>
  </header>
</template>

<style scoped>
.header {
  width: 100%;
  height: 5rem;
  background-color: var(--color-eerie-black);
}

.nav {
  padding: 0 1.875rem;
  width: 100%;
  height: 100%;
  color: var(--color-platinum);
}

.nav-logo {
  position: relative;
  margin-right: 3.125rem;
  width: 10.5rem;
}

.logo {
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

.nav-search {
  border-left: 2px solid var(--color-pantone-green);
  font-weight: 400;
  font-size: 0.875rem;
  width: 25rem;
}

.nav-search img {
  margin-left: 0.75rem;
}

.nav-search input {
  padding: 0 5px;
  margin-left: 0.625rem;
  width: 100%;
  height: 100%;
  border: none;
  outline: none;
  background: transparent;
  font-family: inherit;
  font-size: inherit;
}

.nav-search input,
.nav-search input::placeholder {
  color: var(--color-platinum);
  letter-spacing: 0.2px;
}

.nav-right {
  gap: 20px;
}

.nav-avatar .image-wrapper {
  position: relative;
  width: 2.5rem;
  height: 2.5rem;
}

.nav-avatar .image-wrapper .avatar {
  max-width: 100%;
  border-radius: 50%;
  z-index: 2;
}

.nav-avatar .username {
  margin-left: 1.125rem;
  font-size: 0.875rem;
}

.nav-menu {
  width: 1.25rem;
  height: 1.25rem;
}

.nav-menu .menu-btn {
  background: transparent;
  border: none;
  outline: none;
  cursor: pointer;
}

.nav-menu .menu-btn:hover {
  outline: 1px solid var(--color-traffic-grey);
}
</style>