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
  --color-venetian-red: hsl(349, 100%, 38%);
}

html {
  font-size: 100%;
  font-family: "Rubik", sans-serif;
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

/* start of sign up, login page styles */
.intro {
  display: flex;
  flex-direction: column;
  position: relative;
  color: var(--color-eerie-black);
  min-height: calc(100vh - 120px);
}

.intro-text {
  padding: 0 0.875rem;
  text-align: center;
  z-index: 2;
}

.intro-text .title {
  margin-top: 2.5rem;
  font-size: 1.125rem;
  font-weight: 600;
}

.intro-text .tagline {
  margin-top: 0.625rem;
  font-size: 0.875rem;
}

.form-wrapper {
  width: 20.625rem;
  margin: 2.5rem auto 0;
  text-align: center;
  z-index: 2;
}

.form-wrapper .title {
  font-size: 1.125rem;
  font-weight: 500;
}

.form-wrapper .tagline {
  margin-top: 0.5rem;
  font-size: 0.875rem;
}

.form-wrapper form {
  margin-top: 1.875rem;
}

.form-wrapper small {
  font-size: 0.75rem;
}

.form-control {
  position: relative;
  width: 100%;
  margin-bottom: 1.5rem;
}

.form-control label {
  position: absolute;
  top: 50%;
  left: 1rem;
  transform: translateY(-50%);
  color: var(--color-traffic-grey);
  font-size: 0.875rem;
  transition: 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  pointer-events: none;
}

.form-control input {
  font-size: 1rem;
  width: 100%;
  padding: 0.625rem 1rem;
  background: transparent;
  border: 1px solid var(--color-traffic-grey);
  border-radius: 4px;
  outline: none;
  color: var(--color-eerie-black);
  font-family: inherit;
}

.form-control input:focus {
  outline: 1px solid var(--color-eerie-black);
}

.form-control input:not(:placeholder-shown) + label,
.form-control input:focus + label,
.form-control input:valid + label {
  font-size: 0.75rem;
  transform: translateY(-28px);
  background-color: var(--color-cultured);
  color: var(--color-eerie-black);
  padding: 0 3px;
}

.form-control input:-webkit-autofill,
.form-control input:-webkit-autofill:hover,
.form-control input:-webkit-autofill:focus,
.form-control input:-webkit-autofill:active {
  box-shadow: 0 0 0 1.875rem var(--color-cultured) inset !important;
  -webkit-box-shadow: 0 0 0 1.875rem var(--color-cultured) inset !important;
}

.form-control small {
  position: absolute;
  left: 16px;
  bottom: -1.125rem;
  display: flex;
  justify-content: center;
  font-style: italic;
}

.form-control small img {
  margin-right: 5px;
}

.form-control .password-toggle {
  position: absolute;
  top: 50%;
  right: 16px;
  transform: translateY(-50%);
  cursor: pointer;
}

.invalid label,
.form-control .error {
  color: var(--color-venetian-red);
}

.invalid input {
  outline: 1px solid var(--color-venetian-red);
}

.submit-button button {
  width: 100%;
  padding: 0.625rem 1rem;
  border: none;
  outline: none;
  border-radius: 5px;
  background-color: var(--color-eerie-black);
  color: var(--color-cultured);
  font-family: inherit;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px;
  position: relative;
  overflow: hidden;
  z-index: 1;
}

.submit-button button span {
  position: absolute;
  left: calc((var(--n) - 1) * 20%);
  width: 20%;
  height: 100%;
  background-color: var(--color-cultured);
  border-radius: 50%;
  transform: translateY(150%);
  transition: 0.5s;
  transition-delay: calc((var(--n) - 1) * 0.1s);
  z-index: -1;
}

/* Give each span element it's own value of "n" */
.submit-button button span:nth-child(1) {
  --n: 1;
}

.submit-button button span:nth-child(2) {
  --n: 2;
}

.submit-button button span:nth-child(3) {
  --n: 3;
}

.submit-button button span:nth-child(4) {
  --n: 4;
}

.submit-button button span:nth-child(5) {
  --n: 5;
}

.submit-button button:hover span {
  transform: translateY(0) scale(2);
}

.submit-button button:hover {
  transition-delay: 0.35s;
  color: var(--color-eerie-black);
}

.meta {
  margin-top: 1.875rem;
  margin-bottom: 2.5rem;
  font-size: 0.875rem;
}

.meta-terms {
  margin-top: 1.125rem;
  color: var(--color-traffic-grey);
}

.meta-google img,
.meta-google button {
  margin-left: 0.3125rem;
}

.meta-google button {
  padding: 3px;
  border: none;
  outline: none;
  background-color: var(--color-cultured);
  border-bottom: 1px solid var(--color-cultured);
  font-family: inherit;
  cursor: pointer;
}

.meta-google button:hover {
  border-bottom: 1px solid var(--color-eerie-black);
}

.meta-login {
  margin-top: 1.125rem;
}

.meta-login a {
  color: inherit;
}

.meta-login a:hover {
  text-decoration: underline;
}

.intro-images {
  position: absolute;
  width: 100%;
  height: 100%;
  background-image: url("./assets/img/bg-left.min.svg"),
    url("./assets/img/bg-right.min.svg");
  background-repeat: no-repeat, no-repeat;
  background-attachment: fixed, fixed;
  background-size: 368px, 368px;
  background-position: left bottom, right bottom;
  z-index: 1;
}
/* end of sign up, login page styles */

/* media queries */
@media (max-width: 1200px) {
  .intro-images {
    background-size: calc(((100vw - 400px) / 2) - 32px),
      calc(((100vw - 400px) / 2) - 32px), cover;
  }
}

@media (max-width: 704px) {
  .intro-images {
    background: var(--color-clouds);
  }
}
</style>