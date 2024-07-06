<template>
  <div id="app">
    <page-header></page-header>

    <div id="content">
      <CategoryPanel @applyClassification="applyClassification"></CategoryPanel>
      <product-filter :isOpen="isOpen" @toggle="toggleSidebar" @applyFilters="applyFilter"></product-filter>
      <transition name="fade">
        <div v-if="showMessage" class="success-message">
          <span>{{ modalMessage }}</span>
        </div>
      </transition>
      <button @click="toggleSidebar" id="filterOpenBtn">
        <img src="../../assets/btnOpenFilter.png" alt="Кнопка с картинкой" />
      </button>
      <div id="productListPanel">
        <product-list :productList="products" :key="products.length" @item-added-to-cart="handleItemAddedToCart"></product-list>
      </div>

    </div>

    <page-footer></page-footer>
  </div>
</template>

<script>
import PageHeader from '../PageHeader.vue';
import PageFooter from '../PageFooter.vue';
import ProductList from '../ProductList.vue';
import ProductFilter from './Additional/ProductFilter.vue';
import CategoryPanel from './Additional/CategoryPanel.vue';
import mitt from 'mitt';


export default {
  setup() {
    const emitter = mitt();
    return {
      emitter,
    };
  },
  name: 'App',
  components: {
    PageHeader,
    PageFooter,
    ProductList,
    ProductFilter,
    CategoryPanel,
  },
  mounted() {
    this.fetchProducts();
  },
  computed: {
    products() {
      let products = this.$store.getters.allProducts || [];
      const searchQuery = this.$store.state.searchQuery;
      const appliedFilters = this.appliedFilters;
      const classification = this.classification;

      if (searchQuery) {
        products = this.$store.getters.searchedProducts;
      }
      if (classification) {
        products = products.filter(product => product.subcategory.name === classification);
      }
      if (appliedFilters) {
          products = products.filter(product => {
            const passPriceFilter = appliedFilters.priceMax ? product.price <= appliedFilters.priceMax : true;
            const passBrandFilter = appliedFilters.selectedBrand ? 
              product.brand.toLowerCase() === appliedFilters.selectedBrand.toLowerCase() : true;
            const passColorFilter = appliedFilters.selectedColors ? 
              appliedFilters.selectedColors.some(color => Array.isArray(product.colors) && product.colors.includes(color)) : true;
            return passPriceFilter && passBrandFilter && passColorFilter;
          });
        }
  
      return products;
    }
  },
  data() {
    return {
      isOpen: false,
      appliedFilters: null,
      classification: null,
      modalMessage :null,
      showMessage:false,
    };
  },
  methods: {
    fetchProducts() {
      this.$store.dispatch('GET_ALLPRODUCTS');
    },
    toggleSidebar() {
      this.isOpen = !this.isOpen;
    },
    handleItemAddedToCart() {
      this.showModal("Товар додано до кошику!");
    },
    applyFilter(filterCriteria) {
      this.appliedFilters = filterCriteria;
    },
    applyClassification(classificationCriteria) {
      this.classification = classificationCriteria;
    },
    closeModal() {
      this.showModal = false;
    },
    showModal(message){
      this.modalMessage = message;
      this.showMessage = true;
            setTimeout(() => {
              this.showMessage = false;
            }, 3000)
    },
  },
};
</script>




<style scoped>
#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh; 
}

#content {
  flex: 1; 
  height: 100%;
  width: 100%;
}

#filterOpenBtn {
  position: fixed; 
  left: 0;
  margin-left:0.3%; 
  top: 30%; 
  transform: translateY(-50%);
  z-index: 9999; 
  background: #ffff;
  border: none;
}

.colorOption {
  display: inline-block;
  margin-right: 10px;
}

.colorOption input[type="radio"] {
  display: none;

}
.colorOption label {
  display: inline-block;
  width: 30px;
  height: 30px;
  border: 1px solid #ccc;
  cursor: pointer;
  border-radius: 50%;
}
.colorOption.selected label {
  border: 2px solid black; 
}
#productListPanel{
  border-top: 1px solid #ddd;
}
.success-message {
  background-color: #4caf50;
  color: white;
  padding: 10px;
  margin-top: 10px;
  border-radius: 5px;
  text-align: center;
  position: fixed;
  top: 20px; 
  left: 80%; 
  transform: translateX(-50%);
  z-index: 1000;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

</style>
