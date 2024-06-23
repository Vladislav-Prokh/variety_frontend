<template>
  <div class="container">

    <div v-if="searchError" class="errorOutput">
     <h3> {{$t(('serchingProductsError'))}}....<i class="bi bi-emoji-frown"></i></h3>
    </div>
    <div class="row">
      <product-card v-for="product in paginatedProducts" :key="product.id" :product="product"  @itemAddedToCart="handleAddedProductToCartEvent" />
    </div>

    <div class="pagination">
      <button v-for="pageNumber in displayedPages" :key="pageNumber" @click="changePage(pageNumber)" :class="{ 'current-page': pageNumber === currentPage }">
        {{ pageNumber }}
      </button>
    </div>
  </div>
</template>

<script>
import ProductCard from './ProductCard';
export default {
  components: {
    ProductCard,
  },
  props: {
    productList: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      currentPage: 1,
      pageSize: 12,
    };
  },
  computed: {
    totalPages() {
      return Math.ceil(this.productList.length / this.pageSize);
    },
    paginatedProducts() {
      const startIndex = (this.currentPage - 1) * this.pageSize;
      return this.productList.slice(startIndex, startIndex + this.pageSize);
    },
    searchError(){
      return this.$store.getters.searchError;
    },
    displayedPages() {
      const pages = [];
      let startPage = Math.max(1, this.currentPage - 2);
      let endPage = Math.min(this.totalPages, startPage + 4);

      if (endPage - startPage < 4) {
        startPage = Math.max(1, endPage - 4);
      }
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
      return pages;
    },
  },
  methods: {
    changePage(pageNumber) {
      this.currentPage = pageNumber;
    },
    handleAddedProductToCartEvent(){
      this.$emit('itemAddedToCart');
    }
  },
  
};
</script>

<style scoped>
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
}

.pagination button {
  margin: 0 5px;
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #f2f2f2;
  color: #333;
  cursor: pointer;
  transition: background-color 0.3s, color 0.3s, border-color 0.3s;
}

.pagination button:hover {
  background-color: #e0e0e0;
  color: #000;
  border-color: #999;
}

.current-page {
  background-color: #007bff;
  color: #fff;
  border: 1px solid #007bff;
}

.current-page:hover {
  background-color: #0056b3;
}

.row {
  display: flex; 
  justify-content: center;
}

@media(min-width: 577px) and (max-width: 991px){
  .row {
  margin-top: 10%;
}
}
.errorOutput{
  margin: auto;
  margin-top: 10vh;
  color: rgb(22, 22, 24);
}
</style>
