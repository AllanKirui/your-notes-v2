<template>
  <section class="intro">
    <div class="intro-text">
      <h2 class="title">Welcome to Your Notes!</h2>
      <p class="tagline">
        Free up your mental space by putting those thoughts on digital paper.
      </p>
    </div>

    <div class="intro-images"></div>

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
          <button type="submit">
            Create an account for free <span></span><span></span><span></span
            ><span></span><span></span>
          </button>
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
            >There are no Terms and Conditions for this application. I just
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
  </section>
</template>