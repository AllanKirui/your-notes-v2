<template>
  <section class="intro">
    <div class="intro-text">
      <h2 class="title">Welcome to Your Notes!</h2>
      <p class="tagline">
        Free up your mental space by putting those thoughts on digital paper.
      </p>
    </div>

    <div class="intro-bg-1"></div>

    <div class="form-wrapper">
      <h2 class="title">Sign Up</h2>
      <p class="tagline">Looks like you're new! Please create an account.</p>
      <form @submit.prevent="register" novalidate>
        <div class="form-control">
          <input type="text" name="username" required />
          <label for="username">Username</label>
          <!-- <small>Email or username is invalid</small> -->
        </div>
        <div class="form-control">
          <input type="email" name="email" required />
          <label for="email">Email</label>
          <!-- <small>Email or username is invalid</small> -->
        </div>
        <div class="form-control">
          <input type="password" name="password" required />
          <label for="password">Password</label>
          <!-- <small>Email or username is invalid</small> -->
        </div>
        <div class="form-control">
          <input type="password" name="confirm-password" required />
          <label for="confirm-password">Confirm password</label>
          <!-- <small>Email or username is invalid</small> -->
        </div>
        <div class="submit-button">
          <button type="submit">Create an account for free</button>
        </div>
      </form>
      <div class="meta">
        <div class="meta-google">
          <p class="flex flex-ai-c flex-jc-c">
            Or sign up with:
            <img
              src="@/assets/img/google.min.svg"
              alt="google logo"
              width="20"
            />
            <a href="https://google.com" class="link">Google</a>
          </p>
        </div>
        <div class="meta-terms">
          <small
            >There are no Term and Conditions for this application. I just
            created it to get some coding practice. Feel free to share and/or
            clone the project from GitHub. Your credentials and data are secured
            by the authentication service offered by Firebase.<br />Built with
            Firebase.</small
          >
        </div>
        <div class="meta-login">
          <a href="https://google.com" class="link">Already have an account?</a>
        </div>
      </div>
    </div>

    <div class="intro-bg-2"></div>
  </section>
</template>

<style scoped>
.intro {
  display: grid;
  grid-template-columns: repeat (3, 1fr);
  grid-template-rows: repeat (2, 1fr);
  gap: 2.5rem;
  padding: 0 1.25rem;
  margin-bottom: 1.125rem;
  color: var(--color-eerie-black);
}

.intro-text {
  grid-row: 1;
  grid-column: 1 / span 3;
  text-align: center;
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
  position: relative;

  grid-column: 2;
  grid-row: 2;
  max-width: 20.625rem;
  margin: 0 auto;
  text-align: center;
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
  max-width: 20.625rem;
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
  font-style: italic;
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
}

.submit-button button:hover {
  background-color: var(--color-dark-pastel-green);
  color: var(--color-eerie-black);
}

.meta {
  margin-top: 1.875rem;
  font-size: 0.875rem;
}

.meta-terms {
  margin-top: 1.125rem;

  color: var(--color-traffic-grey);
}

.meta-login .link,
.meta-google .link {
  color: inherit;
}

.meta-login .link:hover,
.meta-google .link:hover {
  text-decoration: underline;
}

.meta-google img,
.meta-google .link {
  margin-left: 0.3125rem;
}

.meta-login {
  margin-top: 1.125rem;
}
</style>