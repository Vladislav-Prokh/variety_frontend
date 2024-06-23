<template>
  <a :href="'/products/' + product.id" class="card mb-4">
    <div id="productItem" class="d-flex flex-column">
      <div class="card-img-container">
        <img :src="product.displayImageURL" class="card-img-top" alt="...">
      </div>
      <div class="card-body">
        <h5 class="card-title">{{ product.productName }}</h5>

        <div class="price-and-button d-flex justify-content-between align-items-center">
          <h3 class="card-price">{{ product.price }} <small>₴</small></h3>
          <a @click="addItemToCart(product)" href="#" class="BtnAddToCart"><i class="bi bi-cart3"></i></a>
        </div>
        
      </div>
    </div>
  </a>
</template>

<script>
export default {
  props: {
    product: {
      type: Object,
      required: true
    }
  },
  methods: {
    addItemToCart(product) {
      const items = JSON.parse(localStorage.getItem('cartItems')) || [];
      if (items.length > 0 && items.some(item => item.id === product.id)) {
        return;
      }
      this.$store.dispatch('ADD_ITEM_TO_CART', product);
      this.$emit('itemAddedToCart');
    }
  }
};
</script>

<style scoped>
.card {
  width: calc(25% - 2rem);
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s ease;
  margin: 1rem;
}

.card-img-container {
  height: 200px; 
  overflow: hidden;
}

.card-img-top {
  object-fit: contain; 
  height: 100%;
  width: 100%;
}

.card-title {
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
}

.card-price {
  font-weight: 700;
}

.BtnAddToCart {
  font-size: 1rem;
  padding: 5px 10px; 
  background-color: #31be2c; 
  color: #fff; 
  border: none;
  border-radius: 5px;
}

.BtnAddToCart:hover {
  background-color: #016e0f; 
}

.card:hover {
  background-color: #f1eded;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

a {
  text-decoration: none;
}

@media (max-width: 1020px) {
  .card {
    width: calc(33.33% - 2rem);
  }
}

@media (max-width: 768px) {
  .card {
    width: calc(50% - 2rem);
  }
}

@media (max-width: 576px) {
  .card {
    width: calc(100% - 2rem);
  }
}

</style>
