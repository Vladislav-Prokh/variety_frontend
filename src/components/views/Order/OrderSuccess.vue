<template>
    <div id = "succsessOrderRoot">
        <page-header></page-header>
        <div class = "content">
            <div id = "OrderInfo">
                  <span id = "thankIntro">Дякуємо за замовлення!</span>
                  <p>Ваше замовлення #<span id="orderId">{{ orderId }}</span> прийнято в обробку. </p>
                  <p>Наш оператор може зв'язатися з вами для уточнення даних</p>
                 
                  <router-link to="/home" >
                  <button id="homeBtn" >Home</button>
                  </router-link>
            </div>
        </div>
        <page-footer></page-footer>
    </div>

</template>

<script>
  import PageHeader from '../../PageHeader.vue'
  import PageFooter from '../../PageFooter.vue'
  export default {
  props: ['orderId'],
  name: 'ThankfulPage',
  components: {
    PageHeader,
    PageFooter,
  },

}

</script>

<style>
#succsessOrderRoot {
  display: flex;
  flex-direction: column;
  min-height: 100vh; 
}

.content {
  flex: 1; 
}

#thankIntro {
    font-size: 24px;
    font-weight: bold;
    color: #007bff;
   
}
#OrderInfo{
    margin-top:5%;
}

#orderId {
    font-weight: bold;
    color: #28a745;
}

#homeBtn{
    background-color: #c8b9e4;
  border: none;
  border-radius: 20%;
  color: #fff; 
  padding: 12px 24px; 
  font-size: 18px; 
  font-weight: bold; 
  cursor: pointer; 
  transition: background-color 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease; 
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); 
}

</style>

