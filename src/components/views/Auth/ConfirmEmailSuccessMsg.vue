<template>
    <div id="confirmEmailMsgRoot">
        <div class="header">
            <a href="/home" class="home-link">Р“РѕР»РѕРІРЅР°</a>
        </div>
        <div class="content">
            <p class="email-message">РџРѕС€С‚Сѓ Р±СѓР»Рѕ СѓСЃРїС–С€РЅРѕ РїС–РґС‚РІРµСЂРґР¶РµРЅРѕ</p>
        </div>
    </div>
</template>

<script>
<<<<<<< HEAD
import  AxiosInstance from "../../../axious-conf.js";
=======
import AxiosInstance from "../../../axious-conf.js";
>>>>>>> 8452eda4cdfefd28cfbe7dc6218f80cd46f79375

export default {
  data() {
    return {
      token: ''
    };
  },
  created() {
    this.token = this.$route.params.token;
    this.confirmEmail(this.token);
  },
  methods:{
   async confirmEmail(token){
<<<<<<< HEAD

      await AxiosInstance.get(`/confirm/${token}`);
=======
      try {
        await AxiosInstance.get(`/confirm/${token}`);
        // После успешного подтверждения показать сообщение или выполнить другие действия
        console.log("Email successfully confirmed");
      } catch (error) {
        console.error("Error confirming email:", error);
        // Обработка ошибки, например, показать пользователю сообщение об ошибке
      }
>>>>>>> 8452eda4cdfefd28cfbe7dc6218f80cd46f79375
    }
  },
  watch: {
    '$route.params.token'(token) {
      this.token = token;
      this.confirmEmail(token); // Вызываем метод при изменении токена через watch
    }
  }
};
</script>

<style scoped>
#confirmEmailMsgRoot {
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: #f9f9f9;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    max-width: 400px;
    margin: 50px auto;
    font-family: 'Arial', sans-serif;
}

.header {
    width: 100%;
    text-align: right;
}

.home-link {
    text-decoration: none;
    color: #007BFF;
    font-weight: bold;
}

.home-link:hover {
    color: #0056b3;
}

.content {
    margin-top: 20px;
    text-align: center;
}

.email-message {
    font-size: 18px;
    color: #333;
    line-height: 1.6;
    margin: 0;
}

.email-message::before {
    content: 'вњ‰пёЏ';
    margin-right: 10px;
    color: #007BFF;
}
</style>
