<template>
  <div class="signup">
    <div class="signup-connect">
      <h1>Registration</h1>
      <!--<a href="#" class="btn btn-social btn-facebook"> <i class="fab fa-facebook"></i> Sign up with Facebook</a>
      <a href="#" class="btn btn-social btn-twitter"> <i class="fab fa-twitter"></i> Sign up with Twitter</a>-->
      <a href="http://variety.in.net:8086/oauth2/authorization/google" class="btn btn-social btn-google"> <i class="fab fa-google"></i> Sign up with Google</a>
    </div>
    <div class="signup-classic">
      <h1 id="LoginField">Registration</h1>
      <form class="form" @submit.prevent="registration">

        <fieldset class="username">
          <input type="text" placeholder="Username" v-model="username" autocomplete="username"/>
        </fieldset>
        <fieldset class="email">
          <input type="text" placeholder="Email" v-model="email" autocomplete="email"/>
        </fieldset>
        <div v-if="email_error" class="error-message">{{ email_error }}</div>
        
        <fieldset class="password">
          <input type="password" placeholder="Password" v-model="password" @input="handlePasswordChange" autocomplete="current-password"/>
        </fieldset>

        <div id="displayInfoInputPassPanel">
          <div class="password-criteria">
            Password length should be more than 8 characters
            <span v-if="HasLengthLessThan8">
              <i class="bi bi-x-circle x-icon"></i>
            </span>
            <span v-else>
              <i class="bi bi-check-circle check-icon"></i>
            </span>
          </div>
          <div class="password-criteria">
            Password should contain special characters
            <span v-if="ContainsSpecials">
              <i class="bi bi-check-circle check-icon"></i>
            </span>
            <span v-else>
              <i class="bi bi-x-circle x-icon"></i>
            </span>
          </div>
          <div class="password-criteria">
            Password should contain uppercase letters
            <span v-if="ContainsCapital">
              <i class="bi bi-check-circle check-icon"></i>
            </span>
            <span v-else>
              <i class="bi bi-x-circle x-icon"></i>
            </span>
          </div>
          <div class="password-criteria">
            Password should contain only Latin characters
            <span v-if="ContainsCyrillic">
              <i class="bi bi-x-circle x-icon"></i>
            </span>
            <span v-else>
              <i class="bi bi-check-circle check-icon"></i>
            </span>
          </div>
        </div>

        <div v-if="input_error" class="error-message">{{ input_error }}</div>
        <div v-if="reg_error" class="error-message">{{ reg_error }}</div>
        <button type="submit" class="btn">Sign up</button>
      </form>
    </div>
  </div>
</template>

<script>
import store from "../../../store/index.js";

export default {
  data() {
    return {
      username: '',
      email: '',
      password: '',
      input_error: '',
      email_error: '',
      reg_error: '',
      HasLengthLessThan8: true,
      ContainsSpecials: null,
      ContainsCapital: null,
      ContainsCyrillic: true,
    };
  },
  methods: {
    async registration() {
      this.email_error = '';
      this.input_error = '';
      this.reg_error = '';

      if (!this.username || !this.username.trim() || !this.email || !this.email.trim() || !this.password || !this.password.trim()) {
        this.input_error = 'Fields cannot be empty';
        return;
      }

      if (this.HasLengthLessThan8 || !this.ContainsSpecials || !this.ContainsCapital || this.ContainsCyrillic) {
        this.input_error = 'Password has not passed validation';
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(this.email)) {
        this.email_error = 'Invalid email format';
        return;
      }

      try {
        const success = await store.dispatch('register', { username: this.username, email: this.email, password: this.password });
        if (success) {
          this.$router.push(`/confirm-email/${this.email}`);
        } else {
          this.reg_error = store.getters.regError || 'Registration failed';
        }
      } catch (error) {
        console.error('Registration error:', error);
      }

      if (store.getters.regError) {
        this.reg_error = store.getters.regError;
        return;
      }
    },

    handlePasswordChange() {
      this.HasLengthLessThan8 = this.password.length < 8;
      const specialCharactersRegex = /[!@#$%^&*(),.?":{}|<>]/;
      this.ContainsSpecials = specialCharactersRegex.test(this.password);
      const capitalLettersRegex = /[A-Z]/;
      this.ContainsCapital = capitalLettersRegex.test(this.password);

      const cyrillicLettersRegex = /[а-яА-Я]/;
      this.ContainsCyrillic = cyrillicLettersRegex.test(this.password);
    }
  }
};
</script>

<style scoped>
@import '@fortawesome/fontawesome-free/css/all.css';

.signup {
  position: absolute;
  top: 40%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1;
  width: 800px;
  background: hsl(0, 0, 100);
  border-radius: 10px;
  box-shadow: 0 3px 25px hsla(0, 0, 0, 0.2);
  overflow: hidden;
  display: flex;
}

.signup-connect,
.signup-classic {
  width: 50%;
  padding: 30px 50px;
}

.signup-connect {
  background: linear-gradient(134deg, hsl(44, 96%, 65%), hsl(34, 95%, 45%));
  color: hsl(0, 0, 100);
}

.signup-classic {
  background: hsl(86, 76%, 71%);
  color: hsl(0, 0, 100);
}

h1 {
  font-size: 30px;
  margin-bottom: 20px;
  text-shadow: 0 2px 3px hsla(0, 0, 0, 0.1);
}

.form {
  margin-top: 20px;
}

fieldset {
  position: relative;
  margin-bottom: 20px;
}

input {
  width: 100%;
  height: 48px;
  padding: 15px;
  border-radius: 5px;
  font-size: 14px;
  outline: none;
  border: 1px solid hsla(0, 0, 0, 0.3);
  box-shadow: inset 0 1px 4px hsla(0, 0, 0, 0.2);
}

button {
  width: 100%;
  height: 48px;
  margin-top: 10px;
  background: linear-gradient(-5deg, hsl(200, 80%, 60%), hsl(200, 90%, 70%));
  border: none;
  color: hsl(0, 0, 100);
  font-weight: bold;
  text-transform: uppercase;
  border-radius: 5px;
  box-shadow: 0 3px 0px hsla(200, 80%, 50%, 0.2);
  text-shadow: 0 2px 3px hsla(200, 50%, 40%, 0.2);
  cursor: pointer;
}

.btn-social {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding-left: 20px;
  margin-bottom: 10px;
  color: hsl(0, 0, 100);
  text-decoration: none;
}

.btn-social i {
  margin-right: 10px;
  font-size: 24px;
}

.error-message {
  color: red;
  margin-top: 10px;
}
.btn-google{
  background-color: rgb(216, 83, 74);
}
#displayInfoInputPassPanel {
  background-color: #f7f7f7;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  margin-top: 20px;
}

.password-criteria {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  font-size: 16px;
  color: #333;
}

.password-criteria i {
  margin-left: 10px;
  font-size: 18px;
}

.check-icon {
  color: rgb(58, 170, 35);
}

.x-icon {
  color: red;
}

@media (max-width: 768px) {
  .signup {
    flex-direction: column;
    width: 90%;
    max-width: 100%;
  }
  .signup-connect,
  .signup-classic {
    width: 100%;
  }
}
</style>
