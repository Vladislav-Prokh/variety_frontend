<template>
  <div id="appCart">
    <page-header></page-header>

    <div id="content">
        <div>
            <h2>Кошик</h2>
            <h3 v-if = "checkCartIsEmpty">
            {{ cartIsEmptyMessage }}
            </h3>
            <div id="productsPanel">
              <div class="productPanelItem" v-for="(item, index) in cartItems" :key="index">
                  <img :src="item.displayImageURL" alt="Фото товару" class="productImage" />
                  <div class="productInfo">
                      <span class="productPanelItemName">{{ item.productName}}</span>
                      <span class="productPanelItemPrice">{{ item.price * item.amountInOrder }}  ₴</span>
                  </div>
                  <input type="number" class = "amountOfCurrentProducts"  step="1" min="1" max="20" value = "1" v-model ="cartItems[index].amountInOrder">
                  <button @click="removeFromCart(index)" class="removeButton">Х</button>
              </div>
          </div>
          <div id = "additionalPanel" v-if = "!checkCartIsEmpty">
          <div id = "TotalPrice">
            <h3>Сума: {{ total }} ₴</h3>
          </div>
          <div id = "createOrderPanel">
            <router-link :to="{ path: '/order', query: { orderedProducts:JSON.stringify(this.cartItems)  } }">
            <button id="createOrderBtn" >Оформити замовлення</button>
            </router-link>
         
          </div>
          </div>
      </div>
          
    </div>

    <page-footer></page-footer>
  </div>
</template>



<script>
import PageHeader from '../../PageHeader.vue';
import PageFooter from '../../PageFooter.vue';

export default {
  name: 'ProductCart',
  components: {
    PageHeader,
    PageFooter,
  },
    data() {
        return {
        cartItems: [],
        cartIsEmptyMessage:"Кошик порожній",
        };
    },
    computed: {
        total() {
            if (Array.isArray(this.cartItems)) {
              const totalPrice = this.cartItems.reduce((acc, item) => acc + (item.price * item.amountInOrder), 0);
   
              return parseFloat(totalPrice.toFixed(2));
            }
            return 0;
        },
        checkCartIsEmpty(){
          return this.cartItems.length === 0;
        }
    },
    mounted() {
        this.loadCartItems();
    },
    methods: {
        removeFromCart(index) {
          this.$store.dispatch('REMOVE_FROM_CART',index)
        },
        async loadCartItems() {
        this.$store.dispatch('loadCartFromStorage').then(() => {
              this.cartItems = this.$store.getters.cartItems;
              if (this.cartItems.length>0) {
                this.cartItems.forEach(function(item){
                  item.amountInOrder = 1;
            });
          }
        }).catch((error) => {
          console.error('Error loading cart:', error);
        });
        },
    },
};

</script>
<style scoped>
*, *::before, *::after {
  box-sizing: border-box;
}
#appCart {
  display: flex;
  flex-direction: column;
  min-height: 100vh; 
}

#content {
  flex: 1; 
}
h2 {
  text-align: center;
  margin-bottom: 20px;
}
#productsPanel {
  background-color: #f4f4f4;
  border-radius: 8px;
  padding: 20px;
  max-width: 800px;
  margin: 20px auto;
}

.productPanelItem {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #ddd;
    padding: 10px 0;
}

.productImage {
    width: 80px;
    height: 80px;
    border-radius: 4px;
    margin-right: 20px;
}

.productInfo {
    display: flex;
    flex-direction: column;
    justify-content: center;
    flex-grow: 1;
}

.productPanelItemName {
    font-size: 18px;
    color: #333;
    margin-bottom: 5px;
}

.productPanelItemPrice {
    font-size: 16px;
    color: #777;
}

.removeButton {
    background-color: #e74c3c;
    color: white;
    border: none;
    padding: 5px 10px; 
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s ease;
}
#TotalPrice{
  width: 40%;
  margin: auto;
  border-top: 1px solid #ddd;
}
.removeButton:hover {
    background-color: #c0392b;
}
#createOrderBtn {
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
.amountOfCurrentProducts{
  margin:3%;
  padding: 0.375rem 0.75rem;
  font-family: inherit;
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.5;
  color: #212529;
  background-color: #fff;
  background-clip: padding-box;
  border: 1px solid #bdbdbd;
  border-radius: 0.25rem;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;

}
#createOrderBtn:hover {
  background-color: #68e237;
  transform: scale(1.05); 
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2); 
}

input {
  font-family: inherit; 
  font-size: inherit; 
  line-height: inherit; 
  margin: 0; 
}
@media (max-width: 600px) {
  #productsPanel {
    padding: 10px;
  }

  .productPanelItem {
    flex-direction: column;
    align-items: flex-start;
  }

  .productInfo {
    width: 100%;
    justify-content: space-between;
    margin-top: 10px;
  }

  .productPanelItemName,
  .productPanelItemPrice {
    margin-right: 0;
  }
}
</style>
