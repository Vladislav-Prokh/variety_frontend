<template>
    <div class="signup">
  <div class="signup-connect">
    <h1>Registration</h1>
    <!--<a href="#" class="btn btn-social btn-facebook"> <i class="fab fa-facebook"></i> Sign up with Facebook</a>
    <a href="#" class="btn btn-social btn-twitter"> <i class="fab fa-twitter"></i> Sign up with Twitter</a>
    <a href="#" class="btn btn-social btn-google"> <i class="fab fa-google"></i> Sign up with Google</a>-->
  </div>
  <div class="signup-classic">
    <h1 id = "LoginField">Registration</h1>
    <form class="form" @submit.prevent="registration">
      <fieldset class="username">
        <input type="text" placeholder="username"  v-model="username" autocomplete="username"/>
      </fieldset>
      <fieldset class="email">
        <input type="text" placeholder="email"  v-model="email" autocomplete="email"/>
      </fieldset>
      <div v-if="email_error" class="error-message">{{ email_error}}</div>
      <fieldset class="password">
        <input type="password" placeholder="password" v-model="password" @input="handlePasswordChange" autocomplete="current-password" />
      </fieldset>

      <div id="displayInfoInputPassPanel">
          <div class="password-criteria">
            Пароль має довжину більше 8 символів
            <span v-if="HasLengthLessThan8">
              <i class="bi bi-x-circle x-icon"></i>
            </span>
            <span v-else>
              <i class="bi bi-check-circle check-icon"></i>
            </span>
          </div>
          <div class="password-criteria">
            Пароль містить спеціальні символи
            <span v-if="ContainsSpecials">
              <i class="bi bi-check-circle check-icon"></i>
            </span>
            <span v-else>
              <i class="bi bi-x-circle x-icon"></i>
            </span>
          </div>
          <div class="password-criteria">
            Пароль містить великі літери
            <span v-if="ContainsCapital">
              <i class="bi bi-check-circle check-icon"></i>
            </span>
            <span v-else>
              <i class="bi bi-x-circle x-icon"></i>
            </span>

          </div>

          <div class="password-criteria">
            Пароль містить тільки латиницю
            <span v-if="ContainsCyrillic">
              <i class="bi bi-x-circle x-icon"></i>
            </span>
            <span v-else>
              <i class="bi bi-check-circle check-icon"></i>
            </span>
          </div>
      </div>


      <div v-if="input_error" class="error-message">{{ input_error}}</div>
      <div v-if="reg_error" class="error-message">{{ reg_error}}</div>
      <button type="submit" class="btn">sign up</button>
    </form>
  </div>
</div>

</template>

<script>
import store from "../../../store/index.js";

export default {
  data() {
    return {
      username:'',
      email:'',
      password:'',
      input_error:'',
      email_error:'',
      reg_error:'',
      HasLengthLessThan8:true,
      ContainsSpecials:null,
      ContainsCapital:null,
      ContainsCyrillic:true,
    };
  },
  methods:{
    async registration(){

      this.email_error = '';
      this.input_error = '';
      this.reg_error = '';


    if (!this.email || !this.email.trim() || !this.password || !this.password.trim() || !this.username || !this.username.trim()) {
        this.input_error = 'Field can not be empty';
        return;
    } 

    if(this.HasLengthLessThan8||!this.ContainsSpecials||!this.ContainsCapital||this.ContainsCyrillic){
      this.input_error = 'Password has not passed validation';
        return;
    }


    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.email)) {
        this.email_error = 'Follow @mail format';
        return;
    }

    try {
      const success = await this.$store.dispatch('register', { username: this.username, email: this.email, password: this.password });
            if (success) {
                this.$router.push(`/confirm-email/${this.email}`);
            } else {
                this.reg_error = this.$store.getters.regError || 'Registration failed';
            }
    } catch (error) {
            console.error('Authentication error:', error);
    } 
    if(store.getters.regError) {
        this.reg_error = store.getters.regError;
        return;
    }
  
    },

    handlePasswordChange(){
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
*,
*::before,
*::after {
  box-sizing: border-box;
}
html,
body {
  height: 100%;
  font-family: Open Sans;
}
body {
  background: hsl(86, 85%, 95%);
}
.error-message{
  color:red;
}

.signup-classic h1{
    color: #271f91;
}
/*--------------------
Buttons
--------------------*/
.btn {
  display: block;
  background: hsl(86, 76%, 71%);
  color: hsl(0, 0, 100);
  text-decoration: none;
  margin: 20px 0;
  padding: 15px 15px;
  border-radius: 5px;
  position: relative;


  
  &::after {
    content: '';
    position: absolute;
    z-index: 1;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    transition: all .2s ease-in-out;
    box-shadow: inset 0 3px 0 hsla(0, 0, 0, 0), 0 3px 3px hsla(0, 0, 0, .2);
    border-radius: 5px;
  }
  
  &:hover::after {
    background: hsla(0, 0, 0, 0.1);
    box-shadow: inset 0 3px 0 hsla(0, 0, 0, 0.2);
  }
  
} 


.btn-social {
  padding-left: 64px;
  position: relative;
  z-index: 1;
  
  .fa {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;
    width: 50px;
    height: 100%;
    text-align: center;
    background: hsla(0, 0, 0, 0.1);
    line-height: 3.2;
    border-radius: 5px 0 0 5px;
  }
  
}
.btn-facebook {
  background-color: hsl(221, 44%, 41%);
}
.btn-twitter {
  background-color: hsl(206, 82%, 63%);
}
.btn-google {
  background-color: hsl(7, 71%, 55%); 
}
.btn-linkedin {
  background-color: hsl(196, 100%, 43%);
}

.form {
  
  fieldset {
    border: none;
    padding: 0;
    margin: 20px 0;
    position: relative;
    
    input {
      width: 100%;
      height: 48px;
      color: hsl(0, 0, 20);
      padding: 15px 40px 15px 15px;
      border-radius: 5px;
      font-size: 14px;
      outline: none!important;
      border: 1px solid hsla(0, 0, 0, 0.3);
      box-shadow: inset 0 1px 4px hsla(0, 0, 0, 0.2);
      vertical-align: top;
    }
     
  }
  
  button {
    width: 100%;
    outline: none!important;
    background: linear-gradient(-5deg, hsl(200, 80%, 60%), hsl(200, 90%, 70%)); 
    border: none;
    text-transform: uppercase;
    font-weight: bold;
    box-shadow: 0 3px 0px hsla(200, 80%, 50%, 0.2); 
    text-shadow: 0 2px 3px hsla(200, 50%, 40%, 0.2); 

  }
  
}




.signup {
  position: absolute;
  top: 30%;
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
.signup-classic
{
  width: 50%;
  padding: 30px 50px;
}

.signup-connect {
  background: linear-gradient(134deg, hsl(44, 96%, 65%), hsl(34, 95%, 45%));
  color: hsl(0, 0, 100);
  
  h1 {
    font-size: 30px;
    margin-top: 10px;
    margin-bottom: 40px;
    text-shadow: 0 2px 3px hsla(0, 0, 0, 0.1);
  }
  
}
#displayInfoInputPassPanel{
  text-align: left;
}

#displayInfoInputPassPanel {
  background-color: #f7f7f7;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  font-family: Arial, sans-serif;
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

.password-criteria:last-child {
  margin-bottom: 0;
}

.signup-classic {
  
  h2 {
    font-size: 16px;
    font-weight: normal;
    margin-top: 23px;
    margin-bottom: 43px;
    text-shadow: 0 2px 3px hsla(0, 0, 0, 0.1);
  }
  
  fieldset::after {
    content: '\f007';
    font-family: FontAwesome;
    position: absolute;
    right: 15px;
    top: 17px;
    z-index: 2;
    width: 20px;
    color: hsla(0, 0, 0, .2);
    text-align: center;
  }
  
  fieldset.email::after {
    content: '\f0e0';
  }
  
  fieldset.password::after {
    content: '\f023';
  }
  
}
</style>