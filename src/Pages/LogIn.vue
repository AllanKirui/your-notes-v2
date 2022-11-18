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
      <h2 class="title">Log In</h2>
      <p class="tagline">Pick up where you left off!</p>

      <form @submit.prevent="submitForm" novalidate>
        <div :class="[email.isValid ? '' : 'invalid', 'form-control']">
          <input
            type="email"
            name="email"
            placeholder=" "
            required
            v-model.trim="email.val"
            @blur="clearErrors('email')"
          />
          <label for="email">Email</label>
          <small class="error" v-if="!email.isValid"
            ><img
              src="@/assets/img/warning.svg"
              alt="warning icon"
              width="14"
            />{{ email.errorMessage }}</small
          >
        </div>
        <div :class="[password.isValid ? '' : 'invalid', 'form-control']">
          <input
            :type="isPwdVisible ? 'text' : 'password'"
            name="password"
            placeholder=" "
            required
            v-model.trim="password.val"
            @blur="clearErrors('password')"
          />
          <label for="password">Password</label>
          <span
            class="password-toggle"
            v-if="password.val.length > 0"
            @click="togglePassword"
            :title="isPwdVisible ? 'hide password' : 'show password'"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 64 64"
              stroke-width="3.5"
              :stroke="isPwdVisible ? '#c20024' : '#1a1a1a'"
              fill="none"
              width="25"
            >
              <rect x="12.34" y="25.5" width="39.32" height="30.95" rx="1.5" />
              <path
                d="M32,7.55h0A11.29,11.29,0,0,1,43.29,18.84V25.5a0,0,0,0,1,0,0H20.71a0,0,0,0,1,0,0V18.84A11.29,11.29,0,0,1,32,7.55Z"
              />
              <circle cx="32" cy="42.83" r="3.76" />
              <line x1="32" y1="46.6" x2="32" y2="51.83" />
            </svg>
          </span>
          <small class="error" v-if="!password.isValid"
            ><img
              src="@/assets/img/warning.svg"
              alt="warning icon"
              width="14"
            />{{ password.errorMessage }}</small
          >
        </div>
        <div class="submit-button">
          <button type="submit">
            Continue <span></span><span></span><span></span><span></span
            ><span></span>
          </button>
        </div>
      </form>

      <div class="meta">
        <div class="meta-google">
          <p class="flex flex-ai-c flex-jc-c">
            Or log in with:
            <img src="@/assets/img/google.svg" alt="google logo" width="20" />
            <button @click="logInWithGoogle">Google</button>
          </p>
        </div>
        <div class="meta-login">
          <router-link to="/signup">Sign up for an account</router-link>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: "LogIn",
  data() {
    return {
      email: {
        isValid: true,
        val: "",
        errorMessage: "",
      },
      password: {
        isValid: true,
        val: "",
        errorMessage: "",
      },
      formIsValid: true,
      isPwdVisible: false,
    };
  },
  computed: {
    error() {
      return this.$store.getters["auth/error"];
    },
  },
  methods: {
    submitForm() {
      this.validateInputs();

      if (!this.formIsValid) {
        return;
      }

      this.login();
      this.resetPasswordVisibility();
    },
    validateInputs() {
      this.formIsValid = true;

      if (this.email.val === "") {
        this.email.errorMessage = "Please provide an email address";
        this.setErrorState("email");
      } else if (!this.isEmail(this.email.val)) {
        this.email.errorMessage = "Email is not properly formatted";
        this.setErrorState("email");
      }

      if (this.password.val === "") {
        this.password.errorMessage = "Please provide a password";
        this.setErrorState("password");
      } else if (!this.isPassword(this.password.val)) {
        this.password.errorMessage =
          "Please provide at least 1 number and 1 letter";
        this.setErrorState("password");
      } else if (this.password.val.length < 8) {
        this.password.errorMessage =
          "Password should be at least 8 characters long";
        this.setErrorState("password");
      }
    },
    setErrorState(field) {
      this.formIsValid = false;
      switch (field) {
        case "email":
          this.email.isValid = false;
          break;
        case "password":
          this.password.isValid = false;
          break;
      }
    },
    clearErrors(field) {
      this[field].isValid = true;
    },
    isEmail(email) {
      return /[a-z0-9]+@[a-z]+\.[a-z]{2,3}/.test(email);
    },
    isPassword(password) {
      // check if it has at least 1 letter and 1 number
      return /^(?=.*[a-zA-Z])(?=.*[0-9])/.test(password);
    },
    togglePassword() {
      this.isPwdVisible = !this.isPwdVisible;
    },
    resetPasswordVisibility() {
      this.isPwdVisible = false;
    },
    login() {
      // dispatch an action to sign in an existing user
      this.$store.dispatch({
        type: "auth/signIn",
        email: this.email.val,
        password: this.password.val,
      });
    },
    logInWithGoogle() {
      // dispatch an action to register a user with their existing Google account
      this.$store.dispatch("auth/signInWithGoogle");
    },
  },
  watch: {
    error(newValue) {
      // handle errors from Firebase
      if (newValue) {
        switch (newValue.field) {
          case "password":
            this.password.errorMessage = newValue.message;
            this.setErrorState("password");
            break;
          case "email":
            this.email.errorMessage = newValue.message;
            this.setErrorState("email");
            break;
        }
      }
    },
  },
};
</script>