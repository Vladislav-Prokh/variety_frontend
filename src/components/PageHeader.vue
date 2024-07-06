<template>
  <div id="HeaderContainer">
    <header>
      <div id="autorizatinBtnPannel">
        <div v-if="!isAuthorised">
          <router-link to="/login">
            <i class="btn bi bi-box-arrow-in-right"></i>
          </router-link>
        </div>
        <div v-else>
          <div @click="handleLogout">
            <i class="btn bi bi-door-closed-fill"></i>
          </div>
        </div>
      </div>
      <div class="language-container">
        <select id="languages" class="language-dropdown" ref="languages" @change="changeLanguage">
          <option value="en">Eng</option>
          <option value="uk">Укр</option>
          <option value="ru">Рус</option>
        </select>
      </div>
      <div class="header-content">
        <router-link :to="isHomeRoute ? '' : '/home'" @click="refreshOrRedirect">
          <div class="logo">
            <img src="../assets/3.png" alt="Logo" id="logoItem">
          </div>
        </router-link>
        <form class="d-flex flex-grow-1" role="search" @submit.prevent="searchData" id="formSearch">
          <input id="fieldSearch" class="form-control form-control-lg me-2" type="search" placeholder="...." aria-label="Search" v-model="inputedProductName">
          <button class="btn btn-outline-dark btn-lg" id="btnSearch" type="submit">{{$t(('search'))}}</button>
        </form>
        <div class="header-buttons">
          <router-link to="/home">
            <i class="btn bi bi-house"></i>
          </router-link>
          <router-link to="/contactUs" v-if="isAuthorised">
            <i class="btn bi bi-chat-right-dots"></i>
          </router-link>
          <router-link to="/about">
            <i class="btn bi bi-book"></i>
          </router-link>
          <router-link to="/cart" class="cart-icon-container">
            <i class="btn bi bi-cart3"></i>
            <span class="cart-count">{{ countItemsCart }}</span>
          </router-link>
          <router-link to="/admin" v-if="userRoles && userRoles.includes('ROLE_ADMIN')">
            <i class="btn bi bi-dpad-fill"></i>
          </router-link>
          <router-link to="/moderator" v-if="userRoles && userRoles.includes('ROLE_MODERATOR')">
            <i class="btn bi bi-person-fill-gear"></i>
          </router-link>
          <router-link to="/users/accounts" v-if="isAuthorised">
            <i class="btn bi bi-person-rolodex"></i>
          </router-link>
        </div>
      </div>
      <div class="mobile-menu-button" @click="toggleMobileMenu">
        <i class="bi bi-list"></i>
      </div>
      <div class="mobile-menu" v-show="showMobileMenu">
        <router-link to="/home">
          <i class="btn bi bi-house"></i>
        </router-link>
        <router-link to="/contactUs">
          <i class="btn bi bi-chat-right-dots"></i>
        </router-link>
        <router-link to="/about">
          <i class="btn bi bi-book"></i>
        </router-link>
        <router-link to="/cart" class="cart-icon-container">
          <i class="btn bi bi-cart3"></i>
          <span class="cart-count">{{ countItemsCart }}</span>
        </router-link>
        <router-link to="/admin" v-if="userRoles && userRoles.includes('ROLE_ADMIN')">
          <i class="btn bi bi-dpad-fill"></i>
        </router-link>
        <router-link to="/moderator" v-if="userRoles && userRoles.includes('ROLE_MODERATOR')">
          <i class="btn bi bi-person-fill-gear"></i>
        </router-link>
        <router-link to="/users/accounts" v-if="isAuthorised">
          <i class="btn bi bi-person-rolodex"></i>
        </router-link>
      </div>
    </header>
  </div>
</template>

<script>
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'typeface-montserrat';

export default {
  data() {
    return {
      isAuthorised: null,
      userRoles: null,
      user_id: null,
      inputedProductName: "",
      showMobileMenu: false
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.$refs.languages.value = this.$i18n.locale;
    });
    this.checkAuthorization();
    this.loadCartFromStorage();
  },
  computed: {
    isHomeRoute() {
      return this.$route.path === '/home';
    },
    countItemsCart() {
      return this.$store.getters.cartItemsCount;
    }
  },
  methods: {
    changeLanguage(event) {
      const selectedLocale = event.target.value;
      this.$i18n.locale = selectedLocale;
    },
    checkAuthorization() {
    const token = localStorage.getItem('jwtToken');
    if (token) {
      this.isAuthorised = true;
      const roles = localStorage.getItem('userRoles');
      if (roles) {
        try {
          this.userRoles = roles;
        } catch (error) {
          console.error("Invalid JSON in userRoles:", error);
          this.userRoles = [];
        }
      } else {
        this.userRoles = [];
      }
      this.user_id = localStorage.getItem('user_id');
    } else {
      this.isAuthorised = false;
    }
  },
    handleLogout() {
      localStorage.removeItem('jwtToken');
      localStorage.removeItem('emailUser');
      localStorage.removeItem('user_id');
      localStorage.removeItem("userRoles");
      this.checkAuthorization();
      this.refreshOrRedirect();
    },
    async searchData() {
      if (!this.isHomeRoute) {
        await this.$router.push('/home');
      }
      await this.$store.dispatch('GET_SEARCHEDPRODUCTS', {
        name: this.inputedProductName.toLowerCase(),
      });
    },
    refreshOrRedirect() {
      if (this.isHomeRoute) {
        window.location.reload();
      } else {
        this.$router.push('/home');
      }
    },
    loadCartFromStorage() {
      this.$store.commit("LOAD_CART_FROM_STORAGE");
    },
    toggleMobileMenu() {
      this.showMobileMenu = !this.showMobileMenu;
    }
  }
};
</script>

<style scoped>
@import '~bootstrap/dist/css/bootstrap.css';

body {
  margin: 0;
  font-family: Arial, sans-serif;
}

header {
  border-bottom: 10px solid #ddd;
  background-color: #CCCCCC;
  color: #fff;
  padding: 15px 0;
  text-align: center;
  height: 13vh;
  margin: 0;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

#autorizatinBtnPannel {
  position: relative;
  float: right;
  height: 25%;
  margin-right: 1%;
}

#autorizatinBtnPannel .btn {
  height: 100%;
  width: 100%;
  background-color: #96b8dd;
  color: #000000;
  border: none;
  outline: none;
  font-size: 30px;
  text-align: center;
}

.cart-icon-container {
  position: relative;
  display: inline-block;
}

.cart-count {
  position: absolute;
  top: -3px;
  right: -3px;
  background-color: yellow;
  color: black;
  border-radius: 50%;
  padding: 3px 6px;
  font-size: 12px;
  line-height: 1;
}

.logo {
  margin-left: 20%;
  height: 15vh;
  width: auto;
}

#logoItem {
  height: 100%;
  width: auto;
}

#fieldSearch {
  width: 25vw;
  margin-left: 15%;
}

.header-buttons {
  margin-right: 5%;
}

.header-buttons .btn {
  padding: 8px 15px;
  margin-left: 2vh;
  font-size: 30px;
}

.btn:hover {
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

.language-container {
  position: absolute;
  top: 1%;
  right: 97%;
}

.language-dropdown {
  padding: 8px;
  font-size: 16px;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  appearance: none;
  background-color: #8bb5e2;
  color: #fff;
}

.language-dropdown::after {
  content: '\2022';
  font-size: 24px;
  line-height: 30px;
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
}

@media (max-width: 1200px) {
  .logo {
    height: 6vh;
    width: 15vw;
  }

  #fieldSearch {
    width: 25vw;
    margin-left: 15%;
  }

  .header-buttons {
    margin-right: 5vh;
  }

  .language-container {
    right: 95%;
  }
}

@media (max-width: 992px) {
  .logo {
    height: 90px;
    width: 150.33px;
  }

  #fieldSearch {
    width: 25vw;
    margin-left: 10%;
  }

  .language-container {
    right: 95%;
  }
}

@media (min-width: 577px) and (max-width: 768px) {
  .language-container {
    right: 93%;
  }

  #autorizatinBtnPannel {
    margin-right: 3%;
  }

  .header-buttons {
    margin-left: 5vh;
    width: 60%;
    height: 15%;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
  }

  #fieldSearch {
    width: 25vw;
    margin-left: 5%;
  }
}

@media (max-width: 576px) {
  .language-container {
    right: 91%;
  }

  .header-buttons {
    margin-top: 100px;
  }

  .logo {
    margin-left: 5%;
  }

  #fieldSearch {
    margin-left: 0vh;
  }
}

.mobile-menu-button {
  display: none;
}

.mobile-menu {
  display: none;
}

@media (max-width: 947px) {
  .header-buttons {
    display: none;
  }

  .mobile-menu-button {
    display: block;
    font-size: 30px;
  }

  .mobile-menu {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    background-color: #CCCCCC;
    padding: 15px;
    position: fixed; 
    top: 0;
    left: 0; 
    right: 0; 
    z-index: 1000; 
    border-top: 5px solid #ddd;
  }

  .mobile-menu i {
    margin-bottom: 10px;
    font-size: 30px;
    margin-left: 1vh;
  }
}

@media (max-width: 1122px) {
  .header-buttons .btn {
    padding: 8px 15px;
    margin-left: 5vh;
    font-size: 20px;
  }
}
@media (max-width: 332px) {
  #formSearch {
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    #fieldSearch {
        width: 100%;
        margin-bottom: 10px;
        padding: 6px 12px; 
        font-size: 14px; 
    }

    #btnSearch {
        width: 100%; 
        padding: 6px 12px;
        font-size: 14px;
    }


    .header-buttons {
    display: none;
  }

  .mobile-menu-button {
    display: block;
    font-size: 30px;
  }

  .mobile-menu {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    background-color: #CCCCCC;
    padding: 15px;
    position: fixed; 
    top: 0;
    left: 0; 
    right: 0; 
    z-index: 1000; 
    border-top: 5px solid #ddd;
  }

  .mobile-menu i {
    margin-bottom: 10px;
    font-size: 30px;
    margin-left: 1vh;
  }
}
</style>
