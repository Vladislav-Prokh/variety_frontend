<template>
    <div id="OrderPanelRoot">
      <page-header></page-header>
  
      <div id="content">
        <div class = "panels-container">
          <div id = "makeOrderPanel" class = "panels_container_item">
              <h3>{{ $t('makeOrderNameForm') }}</h3>
        
                <div class="clientInfoInput">
                  <h5>{{ $t('personal_info') }}</h5>
                    <div class="input-row">
                        <label for="mobilePhone">Мобільний телефон:</label>
                        <input type="text" id="mobilePhone" class="input-field" v-model="mobilePhone" placeholder="номер телефону" required>
                    </div>
                    <div class="input-row">
                        <label for="name">Ім'я:</label>
                        <input type="text" id="name" class="input-field" v-model="customerName" placeholder="Ім'я" required>
                    </div>
                    <div class="input-row">
                        <label for="lastname">Прізвище:</label>
                        <input type="text" id="lastname" class="input-field" v-model="customerSecondName" placeholder="Прізвище" required> 
                    </div>
                    <div class="input-row">
                        <label for="lastname">По-батькові:</label>
                        <input type="text" id="lastname" class="input-field" v-model="customerLastName" placeholder="По-батькові" required> 
                    </div>
                </div>
                <div class = "InputError" v-if = " this.inputContactsError">
                 <h5> {{  this.inputContactsError }}</h5>
                </div>
              <div id = "panelRedirectAuth" v-if = "!isAuthorised">
                  <h6>Маєш аккаунт?</h6>
                  <router-link to="/registration">
                      <i class="button bi bi-person-circle" id="registerBtn">registration</i>
                  </router-link>
                  <router-link to="/login">
                      <i class="button bi bi-door-open" id = "logBtn">login</i>
                  </router-link>
              </div>

              <div id = "shippingMethodsPanel">
                <h5>{{ $t('shippingWay') }}</h5>

                <div class="delivery-company-logo">
                  <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR5ryCaBudwxzIb5HuAOd_LvlfZZzBdAdlF4xnD-1kL8g&s" alt="Нова Пошта" />
                </div>
    
              <div>
                <input type="text" class="input-field" v-model="searchText" placeholder="Введіть назву міста">
                <select class="custom-select" @change="handleCityChange($event.target.value)">
                    <option :value="filteredCities.length > 0 ? filteredCities[0].Description : ''" selected >
                        {{ filteredCities.length > 0 ? filteredCities[0].Description : 'Введіть назву міста' }}
                    </option>
                      <option :value="city.IndexCOATSU1" v-for="city in filteredCities.slice(0,100)" :key="city.CityID"  >{{ city.Description }}</option>
                </select>
                <select class="custom-select" v-if="postOfficesByCity" v-model = "this.postOfficeToDeliver">
                  <option :value="null" disabled selected>Оберіть пункт видачі</option>
                    <option :value="office.Description" v-for="office in this.postOfficesByCity" :key="office.SiteKey" >{{ office.Description  }}</option>
                </select>
            </div>
            </div> 
             
            <span v-if="this.shippingMessageError" id ="shippingMessageError" class = "InputError">
                <h5>{{  this.shippingMessageError }}</h5>
              </span>

            <div id = "PaymentPanel">
              <h5>{{ $t('paymentWay') }}</h5>
                   <!--<div class="payment-method">
                    <input type="radio" id="cardPayment" name="paymentMethod" value="card" v-model="paymentMethod" >
                    <label for="cardPayment">Карткою <img src="../../../assets/cardWayToPay.png" alt="Card"></label>
                  </div>-->
                  <div class="payment-method">
                    <input type="radio" id="cashPayment" name="paymentMethod" value="cash" v-model="paymentMethod">
                    <label for="cashPayment">  Готівкою <img src="../../../assets/moneyWayToPay.png" alt="Card"> </label>
                  </div>
            </div>
            <span v-if="this.inputPaymentError" class = "InputError">
                <h5>{{ this.inputPaymentError }}</h5>
              </span>
            </div>


            <div id = "previewProductInOrderPanel" class = "panels_container_item">
              <h3>Товари:</h3>
              <div class = "productRecord" v-for = "(product,index) in this.orderedProducts" :key = "product.id"> 
                <div>
                <p><span class="fieldNumber"> {{index+1}}</span>.{{product.productName}} - {{  product.price }} ₴  - <span class = "amountProductsInRecordByType">x{{ product.amountInOrder }}</span></p>
                </div>
                <div>
                  <img :src = "product.displayImageURL">
                </div>
              </div>
              <div>Усього: {{ total }}  ₴</div>
              <button id = "createOrderBtn" @click = "createOrder">Оформити</button>
              <h5> {{  this.errorCreationOrder  }}</h5>
            </div>

        </div>
       
      </div>
  
      <page-footer></page-footer>
    </div>
  </template>
  
  <script>
  import PageHeader from '../../PageHeader.vue';
  import PageFooter from '../../PageFooter.vue';
  import axios from 'axios';
  import 'bootstrap-icons/font/bootstrap-icons.css';
  import 'typeface-montserrat';

export default {
  
  name: 'OrderPanel',
  components: {
    PageHeader,
    PageFooter,
  },
  data(){
    return{
        isAuthorised:null,
        mobilePhone:"+380",
        customerName:null,
        customerSecondName:null,
        customerLastName:null,
        allCities:null,
        postOfficesByCity:null,
        searchText: '',
        shippingMessageError:'',
        orderedProducts:[],
        cityToDeliver:null,
        postOfficeToDeliver:null,
        paymentMethod:null,
        inputContactsError:null,
        inputPaymentError:null,
        errorCreationOrder:null,
    };
  },
  mounted() {
    this.checkAuthorization();
    this.getCities();
    this.orderedProducts = JSON.parse(this.$route.query.orderedProducts);
  },
  computed: {
        filteredCities() {
            if (this.allCities) {
                return this.allCities.filter(city => city.Description.toLowerCase().includes(this.searchText.toLowerCase()));
            } else {
                return [];
            }
        },
        total() {
            if (Array.isArray(this.orderedProducts)) {
                return this.orderedProducts.reduce((acc, item) => acc + item.price*item.amountInOrder, 0);
            }
            return 0;
        }
    },
  methods:{
    checkAuthorization(){
      const token = localStorage.getItem('jwtToken');
        if (token) {
          this.isAuthorised = true;
          this.userRoles = localStorage.getItem('userRoles');
        } else {
          this.isAuthorised = false;
        }
    },
    async getShippingAddressesByCity(city){
        try {
          const  response = await axios.post('https://api.novaposhta.ua/v2.0/json/', {
            apiKey: "22dbdaa67f1928687ca6242922dd576e",
            modelName: "Address",
            calledMethod: "getWarehouses",
                methodProperties: {
                    FindByString : "",
                    CityName : city,
                    Page : "1",
                    Limit : "50",
                    Language : "UA"
                }  
        });
        return response;
      } catch (error) {
        console.error('Помилка при отриманні довідника міст:', error);
      }

    },
    handlePostOfficeChange(postOffice){
      this.postOfficeToDeliver = postOffice;
    },
    async getCities() {
      try {
        const response = await axios.post('https://api.novaposhta.ua/v2.0/json/', {
          apiKey: "22dbdaa67f1928687ca6242922dd576e",
          modelName: 'Address',
          calledMethod: 'getCities',
          methodProperties: {
            FindByString: '',
          },
   
        });
        this.allCities = response.data.data;
      } catch (error) {
        console.error('Помилка при отриманні довідника міст:', error);
      }
    },
    async handleCityChange(cityName){
      this.shippingMessageError = null;
      const response = await this.getShippingAddressesByCity(cityName);

      if(response && response.data.info.totalCount!=0){
        this.postOfficesByCity = response.data.data;
        this.cityToDeliver = cityName;
      }
      else{
        this.shippingMessageError= "Shipping is not available";
      }
    },
    createOrder(){
          if (!this.validateInputedFields()) {
            return;
        }

        const productData = this.orderedProducts.reduce((acc, product) => {
            acc.productIds.push(product.id);
            acc.productAmountInOrderByIds.push(product.amountInOrder.toString());
            return acc;
        }, { productIds: [], productAmountInOrderByIds: [] });

        const orderRequest = {
            orderInfo: {
                customerName: this.customerName,
                customerSecondName: this.customerSecondName,
                customerLastName: this.customerLastName,
                cityToDeliver: this.cityToDeliver,
                postOfficeToDeliver: this.postOfficeToDeliver,
                status: "PENDING",
                totalCost: this.total,
                date: new Date().toISOString(),
            },
            ...productData
        };

        const orderedUserId = localStorage.getItem("user_id");
        if (orderedUserId) {
            orderRequest.orderInfo.userId = orderedUserId;
        }

        axios.post(`/orders/add`, orderRequest)
            .then(response => {
              this.$router.push({ name: 'succeedOrder', params: { orderId: response.data } });

            })
            .catch(error => {
              this.errorCreationOrder = "При формуванні замовлення сталась помилка, такого товару більше не існує"
                console.error("Error creating order:", error);
            });
      },

    validateInputedFields(){
      if(!this.mobilePhone || !this.customerName || !this.customerSecondName||!this.customerLastName){
        this.inputContactsError = "Невірні контактні дані!"
        return false;
      }
      if (this.mobilePhone) {
        const mobileRegex = /^\+?380\d{9}$/;
        if (!mobileRegex.test(this.mobilePhone)) {
          this.inputContactsError = "Мобильный номер неверный";
          return false;
        } 
      }
      if(!this.cityToDeliver || !this.postOfficeToDeliver){
        this.shippingMessageError = "Оберіть адресу"
        return false;
      }
      if(!this.paymentMethod){
        this.inputPaymentError = "Оберіть способ оплати"
        return false;
      }
      return true;

    }

  }

};


</script>

<style scoped>

#OrderPanelRoot {
  display: flex;
  flex-direction: column;
  min-height: 100vh; 
}
#content {
  flex: 1; 
}


.panels-container {
  display: flex;
  justify-content: space-around;
}

#makeOrderPanel {
  width: 40%;
  margin-left:10%;
  margin-bottom: 2%;
  margin-top: 2%;
}


.clientInfoInput {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  border: 2px solid #e0d464;
  border-radius: 10px;
  padding: 20px;
  margin: 0 auto;
  position: relative;
  flex: 1;
}
.clientInfoInput::before {
    content: '1'; 
    position: absolute; 
    top: 0; 
    left: 0; 
    background-color: #e0d464; 
    color: #fff; 
    width: 30px; 
    height: 30px; 
    border-radius: 50%; 
    display: flex; 
    justify-content: center;
    align-items: center; 
}

.input-row {
    display: flex;
    flex-direction: column;
    margin-bottom: 10px;
    width: 100%;
}

.input-field {
  flex: 1; 
  padding: 10px;
  width: 100%;
  margin: 0 5px;
  margin-top:1%;
  border-radius: 5px;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  background-color: #fff;
  border: 1px solid #d2d2d2;
  font-size: 16px;
  outline: none;
  transition: border .2s ease-in-out;
}


#panelRedirectAuth .button {
  display: inline-block;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  text-align: center;
  text-decoration: none;
  border: none;
  border-radius: 5px;
  color: #fff;
  margin-right: 2%; 
  width: 15%;
}

#registerBtn {
  background-color: #e0d464;
}

#logBtn {
  background-color: #6ab863;
}

#panelRedirectAuth .button:hover {
  background-color: #9fddd5; 
}

.bi {
  vertical-align: middle;
}

.button i {
  margin-right: 5px;
}

/* Shipping methods panel */
#shippingMethodsPanel {
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 2px solid #e0d464;
  border-radius: 10px;
  padding: 20px;
  margin: 10px auto 0; 
  position:relative;
  width: 100%; 
  margin-right: 0;
  margin-top: 10px; 
}

#shippingMethodsPanel::after {
  content: '2'; 
  position: absolute; 
  top: 0; 
  left: 0; 
  background-color: #e0d464; 
  color: #fff; 
  width: 30px; 
  height: 30px; 
  border-radius: 50%; 
  display: flex; 
  justify-content: center;
  align-items: center; 
}

#shippingMethodsPanel input {
  display: block;
  margin-bottom: 10px;
  min-width: 80%;
  margin-top: 5%;
  
}

#shippingMethodsPanel select {
  display: block;
  min-width: 90%;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #d2d2d2;
  background-color: #fff;
  font-size: 16px;
  outline: none;
  transition: border .2s ease-in-out;
  margin: 1%;
  width: 100%; 
    max-width: 300px; 
    box-sizing: border-box; 
}

#shippingMethodsPanel option[disabled] {
  display: none; 
}

/* Payment panel */
#PaymentPanel {
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 2px solid #e0d464;
  border-radius: 10px;
  padding: 20px;
  margin: 10px auto 0; 
  width: 100%;
  position:relative;
}

#PaymentPanel::after {
  content: '3'; 
  position: absolute; 
  top: 0; 
  left: 0; 
  background-color: #e0d464; 
  color: #fff; 
  width: 30px; 
  height: 30px; 
  border-radius: 50%; 
  display: flex; 
  justify-content: center;
  align-items: center; 
}

.delivery-company-logo {
  display: inline-block;
  margin-right: 10px; 
}

.delivery-company-logo img {
  width: 50px; 
  height: auto;
}

.payment-method {
  margin-bottom: 2%;
}

.payment-method input[type="radio"] {
  display: none;
}

.payment-method label {
  display: inline-block;
  cursor: pointer;
  padding: 10px 20px;
  background-color: #f2f2f2;
  border-radius: 5px;
  transition: background-color 0.3s ease;
}

.payment-method label:hover {
  background-color: #e0e0e0;
}

.payment-method input[type="radio"]:checked + label {
  background-color: #007bff;
  color: #fff;
}

#PaymentPanel {
  margin-bottom: 1%;
}


#previewProductInOrderPanel {
  height: 100%; 
  width: 30%;
  background-color: #f8f8f8;
  border: 1px solid #ddd;
  margin-top: 2%; 
  margin-right:10%;
}


.panels_container_item {
  padding: 20px;
  background-color: #f8f8f8;
  border: 1px solid #ddd;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); 
}

.productRecord {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px; 
  padding: 15px;
  border-radius: 10px; 
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); 
  background-color: #fff;
}

.productRecord p {
  margin: 0;
  font-size: 16px;
  color: #333;
  flex: 1; 
}

.productRecord img {
  width: 70px; 
  height: 70px;
  margin-left: 20px; 
  border-radius: 5px;
}

#createOrderBtn{
  background-color: #9aeb7a;
  border: none;
  border-radius: 25%;
  color: #fff; 
  padding: 12px 24px; 
  font-size: 18px; 
  font-weight: bold; 
  cursor: pointer; 
  transition: background-color 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease; 
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); 
}
.InputError h5{
  color: #e04f4f;
}
@media only screen and (max-width: 768px) {
  #makeOrderPanel {
    width: 100%; 
    margin-left: 0; 
    margin-bottom: 2%; 
    margin-top: 2%; 
  }

  #previewProductInOrderPanel {
    width: 100%; 
    background-color: #f8f8f8;
    border: 1px solid #ddd;
    margin-top: 2%; 
    margin-right: 0; 
  }
  .panels-container {
    display: flex;
    flex-direction: column; 
    justify-content: space-around;
  }

  .panels_container_item {
    width: calc(50% - 20px); 
  }
  .clientInfoInput {
    width: 80%;
  }

  #shippingMethodsPanel{
    width: 100%; 
    margin-right: 0; 
    margin-top: 10px; 
  }
}

@media only screen and (max-width: 576px) {
  #makeOrderPanel {
    width: 95%; 
  }
  .panels_container_item {
    width: calc(100% - 20px); 
  }
  .clientInfoInput {
    width: 90%; 
  }
}

@media (min-width: 768px)  and (max-width :1100px){
 
  #makeOrderPanel {
    width: 80%; 
  }

  #previewProductInOrderPanel {
  height: 100%; 
  width: 30%;
  margin-left:1%;
}
  
}
</style>
