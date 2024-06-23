<template>
    <div id="app">
    <page-header></page-header> 
    <div class="input-group mb-3">
        <div class="input-group-prepend">
            <span class="input-group-text" id="basic-addon1">@</span>
        </div>
        <input type="text" class="form-control" placeholder="Product name" aria-label="Product name" aria-describedby="basic-addon1" v-model="searchQuery">
        <button class="button" @click="findProducts">Find</button>
    </div>

    <div id="content">
        <div class="button-container">
            <router-link to="/privileged/products/add">
                <button class="button-add"><i class="bi bi-bag-dash-fill"></i>  Add</button>
             </router-link>
        </div>
        <h3 v-if="error">{{ error }}</h3>

        <div id="productDisplayPanel">
            <div v-for="product in paginatedProducts" :key="product.id">
                <div class ="productItem">
                    {{ product.id }}
                    -
                    {{ product.productName}}
                    
                     <div class="productItemImage">
                        <img :src="product.displayImageURL" alt="Product Image" class="productImage">
                    </div>
                

                  <div class="productButtons">
                    <button class="button" @click="deleteProduct(product.id)">delete</button>
                    <a :href="`/privileged/products/update/${product.id}`"><button class="button">edit</button></a>
                    <button class="button" @click="visitPageOfProduct(product.id)">visit</button>
                 </div>
              </div>
          </div>
          
          <button @click="prevPage" class="buttonSwipe"><i class="bi bi-arrow-bar-left"></i>Previous</button>
          <button @click="nextPage" class="buttonSwipe">Next<i class="bi bi-arrow-bar-right"></i></button>

        </div>
        

    </div>
    <page-footer></page-footer>
    </div>

</template>

<script>
import PageHeader from '../../PageHeader.vue';
import PageFooter from '../../PageFooter.vue';
import axiosInstance from '../../../axious-conf.js';
import axios from 'axios';
import 'bootstrap-icons/font/bootstrap-icons.css';

export default {
  name: 'App',
  components: {
    PageHeader,
    PageFooter,
 
  },
  data() {
    return {
        products:null,
        currentPage: 1, 
        itemsPerPage: 5,
        error:"",
        searchQuery:"",

    };
  },
  computed: {
    Products() {
        return this.$store.getters.allProducts;
    },
    paginatedProducts() {
          if (!this.products) {
          return [];
        }
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        return this.products.slice(startIndex, endIndex);
    },
    totalPages() {
         return Math.ceil(this.products.length / this.itemsPerPage);
    }
  },
  mounted() {
    this.fetchProducts();

  },
  methods: {
    fetchProducts() {
      this.$store.dispatch('GET_ALLPRODUCTS')
      .then(() => {
        this.products= this.$store.getters.allProducts;
      })
      .catch((error) => {
        console.error('Error fetching product:', error);
      });
 
    },

    nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },
     deleteProduct(id){
      axiosInstance.post(`/products/delete/${id}`)
      location.reload();
      
    },
    visitPageOfProduct(id){
      this.$router.push(`/products/${id}`);
    },
    async findProducts() {
      try {
  if (this.searchQuery.trim() !== "") {
    let productsByName = [];
    let productById = [];
    this.error = null;  

    try {
      const responseByName = await axios.get(`/products/${this.searchQuery}`);
      productsByName = responseByName.data;
    } catch (error) {
      console.error('Error fetching products by name:', error);
    }

    if (!isNaN(this.searchQuery.trim())) {
      try {
        const responseById = await axios.get(`/products/admin/id/${this.searchQuery}`);
        productById = responseById.data;

        if (productById && !Array.isArray(productById)) {
          productById = [productById];
        }
      } catch (error) {
        console.error('Error fetching product by ID:', error);
      }
    }

    if ((Array.isArray(productsByName) && productsByName.length > 0) || (Array.isArray(productById) && productById.length > 0)) {
      this.products = [...productsByName, ...productById];
    } else {
      this.error = "Products not found";
    }
  }
} catch (error) {
  console.log(error);
}

}

  }

}
</script>

<style scoped>
h3{
  color: red;
} 

#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh; 
}

#content {
    flex: 1;
    padding: 0 10px;
}
.productButtons .button{
  background-color: #4489c9; 
    border: none;
    color: white;
    padding: 15px 32px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 16px;
    border-radius: 5px;
    margin:1%;
}

.buttonGiveRight{
  background-color: #e2512d; 
    border: none;
    color: white;
    padding: 15px 32px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 16px;
    border-radius: 5px;
    margin:1%;
}
.productButtons .buttonDeleteRight{
  background-color: #5af367; 
    border: none;
    color: white;
    padding: 15px 32px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 16px;
    border-radius: 5px;
    margin:1%;
}
.button-add {
    background-color: #5ec766; 
    color: #fff; 
    padding: 10px 20px; 
    border: none; 
    border-radius: 5px; 
    cursor: pointer; 
    transition: background-color 0.3s; 
}

.button-add:hover {
    background-color: #4fa15b; 
}
.buttonSwipe{
    background-color: #5b99cc; 
    border: none;
    color: white;
    padding: 15px 32px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 16px;
    border-radius: 5px;
    margin: 1%;
    margin-right: 40%;
  }

.button:hover{
  background-color: #2772af; 
}

.button-container .button{
  background-color: #5b99cc; 
    border: none;
    color: white;
    padding: 15px 32px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 16px;
    border-radius: 5px;
    margin:1%;
}

.productItem {
    background-color: #b9bebe;
    width: 100%; 
    margin: 5px 0; 
    display: flex;
    align-items: center;
    justify-content: space-between; 
    padding: 10px; 
    flex-wrap: wrap; 
}
.productImage {
        max-width: 20%; 
        max-height: 10%; 
    }

.productItem > * {
    margin-left: 0; 
    margin-bottom: 5px; 
    width: 100%; 
}

#productDisplayPanel {
  margin-left: 0;
}

.input-group {
    width: 100%; 
    margin: auto;
}

.input-group .button {
    width: 100%; 
    margin-top: 5px; 
    background-color: #5b99cc; 
    border: none;
    color: white;
    padding: 15px 32px;
    text-align: center;
    text-decoration: none;
    font-size: 16px;
    border-radius: 5px;
}

.button-container {
    position: static;
    display: flex;
    justify-content: space-around; 
    flex-wrap: wrap; 
}


@media screen and (min-width: 768px) {
 
    .productItem {
        width: 65%; 
    }

    #productDisplayPanel {
        margin-left: 25%; 
    }
}

</style>