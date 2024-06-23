<template>
  <div id="contactUs">
      <page-header></page-header>

      <div id="content">
          <div id="contactUsTextPanel">
              <p>{{ $t('contactUs') }}</p>
          </div>

          <div id="informSendingMsg" :class="{ 'successSentLetter': isSentSuccessLetter, 'failSentLetter': !isSentSuccessLetter }" v-if="informSendingLetterMsgVisible">
              {{ informSendingLetterMsg }}
          </div>
          <div id="contactForm">
              <h2>Зв'яжіться з нами</h2>
              <form ref="emailLetterForm" @submit.prevent="sendEmail">
                  <label for="email">Email:</label>
                  <input type="email" id="email" v-model="emailData.email" name="from_email" readonly>

                  <label for="name">Им'я:</label>
                  <input type="text" id="name" v-model="emailData.name" name="to_name" required>

                  <label for="message">Повідомлення:</label>
                  <textarea id="message" v-model="emailData.message" rows="4" name="message" required></textarea>
                  <button class="btnSendLetter" type="submit">Відправити</button>
              </form>
          </div>
      </div>

      <page-footer></page-footer>
  </div>
</template>

<script>
import PageHeader from '../../PageHeader.vue'
import PageFooter from '../../PageFooter.vue';
import emailjs from 'emailjs-com';

export default {
  components: {
    PageHeader,
    PageFooter,
  },

  data() {
    return {
      emailData: {
        email: '',
        name: '',
        message: ''
      },
      informSendingLetterMsg: null,
      isSentSuccessLetter: null,
      informSendingLetterMsgVisible: false,
      lastSentTime: null, 
      sendInterval: 24 * 60 * 60 * 1000,
    };
  },

  created() {
    this.emailData.email = localStorage.getItem("emailUser");
    this.lastSentTime = localStorage.getItem("lastSentTime");
  },

  methods: {
    sendEmail() {
      const successMessage = "Лист надіслано";
      const errorMessage = "Помилка відправки листа";
      const errorMessageLimit = "Ви можете надіслати лист лише раз на 24 години.";

      const currentTime = new Date().getTime();
      if (this.lastSentTime && currentTime - this.lastSentTime < this.sendInterval) {
        this.handleSendResult(false, errorMessageLimit);
        return;
      }

      emailjs.sendForm('service_0i1jvj8', 'template_5c4z9bs', this.$refs.emailLetterForm, 'vk-axwNAUgQ2kvXA9')
        .then(() => {
          this.handleSendResult(true, successMessage);
          this.lastSentTime = currentTime;
          localStorage.setItem("lastSentTime", this.lastSentTime);
        })
        .catch(() => {
          this.handleSendResult(false, errorMessage);
        });
    },

    handleSendResult(isSuccess, message) {
      this.isSentSuccessLetter = isSuccess;
      this.informSendingLetterMsg = message;
      this.informSendingLetterMsgVisible = true;

      setTimeout(() => {
        this.informSendingLetterMsgVisible = false;
      }, 5000);
    }
  }
}
</script>



<style scoped>
#contactUs {
  display: flex;
  flex-direction: column;
  min-height: 100vh; 
}

#content {
  flex: 1; 
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

#contactForm {
  width: 80%;
  max-width: 500px;
  background-color: #f9f9f9;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

#contactForm h2 {
  text-align: center;
  margin-bottom: 20px;
}

#contactForm label {
  display: block;
  margin-bottom: 8px;
}

#contactForm input,
#contactForm textarea {
  width: 100%;
  padding: 8px;
  margin-bottom: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

#contactForm button {
  width: 100%;
  padding: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

#contactForm button:hover {
  background-color: #0056b3;
}

#informSendingMsg {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-20%, -50%);
  padding: 10px 20px;
  border-radius: 5px;
  width: auto;
  max-width: 300px;
  color: white;
  text-align: center;
  background-color: rgba(0, 123, 255, 0.8);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 999; 
}

.successSentLetter {
  background-color: #4CAF50; 
}

.failSentLetter {
  background-color: #af4c4c; 
}

#contactUsTextPanel {
  margin-right: 5%;
  width: 25%;
  text-align: center; 
  padding: 20px;
  background-color: #f9f9f9; 
  border-radius: 10px; 
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 1%;
}

#contactUsTextPanel p {
  font-size: 16px;
  color: #333;
  line-height: 1.5;
  margin: 0; 
}
</style>

