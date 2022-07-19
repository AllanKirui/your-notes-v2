<template>
  <aside class="wrapper">
    <div class="sidebar flex flex-fd-c flex-jc-sb">
      <div class="sidebar-top">
        <div class="btn-wrapper">
          <button class="create-btn" title="Create new todo">
            <div class="flex flex-ai-c">
              <img
                class="btn-img"
                src="@/assets/img/add-icon.svg"
                alt="create new icon"
                width="18"
              />
              <!-- TODO: use dynamic text and title -->
              <span class="btn-text">New Todo</span>
            </div>
          </button>
        </div>
        <ul class="links">
          <li class="link">
            <router-link to="/todos" title="Todos">
              <div class="flex flex-ai-c">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 64 64"
                  stroke-width="3"
                  stroke="currentColor"
                  fill="none"
                  width="20"
                >
                  <path
                    d="M55.5,23.9V53.5a2,2,0,0,1-2,2h-43a2,2,0,0,1-2-2v-43a2,2,0,0,1,2-2H41.64"
                  />
                  <path
                    d="M19.48,38.77l-.64,5.59a.84.84,0,0,0,.92.93l5.56-.64a.87.87,0,0,0,.5-.24L54.9,15.22a1.66,1.66,0,0,0,0-2.35L51.15,9.1a1.67,1.67,0,0,0-2.36,0L19.71,38.28A.83.83,0,0,0,19.48,38.77Z"
                  />
                  <line x1="44.87" y1="13.04" x2="50.9" y2="19.24" />
                </svg>
                <div class="text-wrapper flex flex-jc-sb">
                  <span class="link-text">Todos</span>
                  <span class="link-counter">{{ numOfTodos }}</span>
                </div>
              </div>
            </router-link>
          </li>
          <li class="link">
            <router-link to="/notes" title="Notes">
              <div class="flex flex-ai-c">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 64 64"
                  stroke-width="3"
                  stroke="currentColor"
                  fill="none"
                  width="20"
                >
                  <polyline
                    points="34.48 54.28 11.06 54.28 11.06 18.61 23.02 5.75 48.67 5.75 48.67 39.42"
                  />
                  <polyline points="23.04 5.75 23.02 18.61 11.06 18.61" />
                  <line x1="16.21" y1="45.68" x2="28.22" y2="45.68" />
                  <line x1="16.21" y1="39.15" x2="31.22" y2="39.15" />
                  <line x1="16.21" y1="33.05" x2="43.22" y2="33.05" />
                  <line x1="16.21" y1="26.95" x2="43.22" y2="26.95" />
                  <circle
                    cx="42.92"
                    cy="48.24"
                    r="10.01"
                    stroke-linecap="round"
                  />
                  <line x1="42.92" y1="42.76" x2="42.92" y2="53.72" />
                  <line x1="37.45" y1="48.24" x2="48.4" y2="48.24" />
                </svg>
                <!-- TODO: make the counter dynamic -->
                <div class="text-wrapper flex flex-jc-sb">
                  <span class="link-text">Notes</span>
                  <span class="link-counter">5</span>
                </div>
              </div>
            </router-link>
          </li>
        </ul>
      </div>

      <div class="sidebar-bottom">
        <ul class="links">
          <li class="link">
            <router-link to="/settings" title="Settings">
              <div class="flex flex-ai-c">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 64 64"
                  stroke-width="3"
                  stroke="currentColor"
                  fill="none"
                  width="20"
                >
                  <path
                    d="M45,14.67l-2.76,2a1,1,0,0,1-1,.11L37.65,15.3a1,1,0,0,1-.61-.76l-.66-3.77a1,1,0,0,0-1-.84H30.52a1,1,0,0,0-1,.77l-.93,3.72a1,1,0,0,1-.53.65l-3.3,1.66a1,1,0,0,1-1-.08l-3-2.13a1,1,0,0,0-1.31.12l-3.65,3.74a1,1,0,0,0-.13,1.26l1.87,2.88a1,1,0,0,1,.1.89L16.34,27a1,1,0,0,1-.68.63l-3.85,1.06a1,1,0,0,0-.74,1v4.74a1,1,0,0,0,.8,1l3.9.8a1,1,0,0,1,.72.57l1.42,3.15a1,1,0,0,1-.05.92l-2.13,3.63a1,1,0,0,0,.17,1.24L19.32,49a1,1,0,0,0,1.29.09L23.49,47a1,1,0,0,1,1-.1l3.74,1.67a1,1,0,0,1,.59.75l.66,3.79a1,1,0,0,0,1,.84h4.89a1,1,0,0,0,1-.86l.58-4a1,1,0,0,1,.58-.77l3.58-1.62a1,1,0,0,1,1,.09l3.14,2.12a1,1,0,0,0,1.3-.15L50,45.06a1,1,0,0,0,.09-1.27l-2.08-3a1,1,0,0,1-.09-1l1.48-3.43a1,1,0,0,1,.71-.59L53.77,35a1,1,0,0,0,.8-1V29.42a1,1,0,0,0-.8-1l-3.72-.78a1,1,0,0,1-.73-.62l-1.45-3.65a1,1,0,0,1,.11-.94l2.15-3.14A1,1,0,0,0,50,18l-3.71-3.25A1,1,0,0,0,45,14.67Z"
                  />
                  <circle cx="32.82" cy="31.94" r="9.94" />
                </svg>
                <div class="text-wrapper">
                  <span class="link-text">Settings</span>
                </div>
              </div>
            </router-link>
          </li>
          <li class="link">
            <a href="https://google.com" title="Logout">
              <div class="flex flex-ai-c">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 64 64"
                  stroke-width="3"
                  stroke="currentColor"
                  fill="none"
                  width="20"
                >
                  <polyline points="46.02 21.95 55.93 31.86 46.02 41.77" />
                  <line x1="55.93" y1="31.86" x2="19.59" y2="31.86" />
                  <path
                    d="M40,38.18V52a2.8,2.8,0,0,1-2.81,2.8H12A2.8,2.8,0,0,1,9.16,52V11.77A2.8,2.8,0,0,1,12,9H37.19A2.8,2.8,0,0,1,40,11.77V25"
                  />
                </svg>
                <div class="text-wrapper">
                  <span class="link-text">Logout</span>
                </div>
              </div>
            </a>
          </li>
        </ul>
      </div>
    </div>
  </aside>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  computed: {
    ...mapGetters("todos", ["numOfTodos"]),
  },
};
</script>

.<style scoped>
.wrapper {
  position: sticky;
  top: 0;
  left: 0;
  grid-column: 1;
  width: 100%;
  height: calc(100vh - 80px);
  background-color: var(--color-eerie-black);
}

.sidebar {
  width: 100%;
  height: 100%;
}

.btn-wrapper {
  text-align: center;
  position: relative;
}

.btn-wrapper .create-btn {
  margin: 0.625rem 0;
  padding: 0.75rem;
  width: 12.5rem;
  border: none;
  outline: none;
  border-radius: 5px;
  background-color: var(--color-dark-pastel-green);
  text-align: left;
  font-family: inherit;
  font-size: 0.875rem;
  color: var(--color-eerie-black);
  cursor: pointer;
  transition: all 0.15s ease-in-out;
}

.btn-wrapper .create-btn:hover {
  background: var(--color-platinum);
}

.btn-wrapper .create-btn .btn-text {
  margin-left: 0.625rem;
}

.links .link {
  font-size: 0.875rem;
}

.links .link a {
  display: inline-block;
  padding: 1.125rem 1.875rem;
  width: 100%;
  height: 100%;
  color: var(--color-cultured);
  transition: all 0.15s ease-in-out;
}

.links .link a .text-wrapper {
  margin-left: 0.625rem;
  width: 100%;
}

.links .link a .link-counter {
  color: var(--color-dark-pastel-green);
}

.links .link a:hover {
  background-color: var(--color-platinum);
  color: var(--color-eerie-black);
}

.links .link a:hover .link-counter {
  color: var(--color-eerie-black);
}
</style>