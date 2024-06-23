<template>
    <div id="confirmEmailMsgRoot">
        <div class="header">
            <a href="/home" class="home-link">Головна</a>
        </div>
        <div class="content">
            <p class="email-message">Пошту було успішно підтверджено</p>
        </div>
    </div>
</template>

<script>
import  AxiosInstance from "../../../axious-conf.js";

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

      await AxiosInstance.get(`/confirm/${token}`);
    }
  },
  watch: {
    '$route.params.token'(token) {
      this.token = token;
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
    content: '✉️';
    margin-right: 10px;
    color: #007BFF;
}
</style>
