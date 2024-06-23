<template>
  <div id="specProductRootElem">
    <page-header></page-header>


    <div id="content">
      <div class ="breadcrumbs">
        {{ this.categoryName }}  > {{ this.subcategoryName }}
      </div>
      <transition name="fade">
        <div v-if="showMessage" class="success-message" v-bind:class="{ 'fail-message': !modalStatusSuccess }">
          <span>{{ modalMessage }}</span>
        </div>
      </transition>
      <div class="container">
        <div class="carousel">
          <div v-for="(image, index) in product.images" :key="index" class="carousel-slide" v-show="index === currentImageIndex">
            <img :src="image.displayImageURL" alt="Product Image" class="imageProduct">
          </div>
          <button @click="previousImage" class="carousel-button carousel-button-prev">‹</button>
          <button @click="nextImage" class="carousel-button carousel-button-next">›</button>
        </div>
   
        <div class="product-info">
          <h1>{{ product.productName }}</h1>
          <div class="rating">
            <div class="rating_body">
              <div class="rating_active" :style="{ width: RatingActiveWidth + '%' }"></div>
              <div class="rating_items">
                <input type="radio" class="rating__item" value="1" name="rating" v-on:mouseover="handleRatingHover" v-on:change="handleRatingChange"/>
                <input type="radio" class="rating__item" value="2" name="rating" v-on:mouseover="handleRatingHover" v-on:change="handleRatingChange"/>
                <input type="radio" class="rating__item" value="3" name="rating" v-on:mouseover="handleRatingHover" v-on:change="handleRatingChange"/>
                <input type="radio" class="rating__item" value="4" name="rating" v-on:mouseover="handleRatingHover" v-on:change="handleRatingChange"/>
                <input type="radio" class="rating__item" value="5" name="rating" v-on:mouseover="handleRatingHover" v-on:change="handleRatingChange"/>
              </div>
            </div>
            <div class="rating_value">
              {{ avarageRatingByRatings }}
            </div>
          </div>

          <p class="price">{{$t('price')}}: <span class="price-value">{{ product.price }}₴</span></p>
          <p class="brand">{{$t('brand')}}: <span class="brand-name">{{ product.brand }}</span></p>
          <p>{{$t('productDescription')}}:</p>
          <p class ="productDescription">{{ product.description }}</p>


          <div class="colorOption" v-for="(color, index) in product.colors" :key="index">
            <span type="checkbox" :id="'colorOption' + index"></span>
            <label :for="'colorOption' + index" :style="{ backgroundColor: color}"></label>
        </div>


          <div id="makeOrderButtons">
            <button id="addToCart" @click="addItemToCart">В кошик</button>
            <router-link :to="{ path: '/order', query: { orderedProducts: JSON.stringify([{ ...product, amountInOrder : 1 }]) } }">
              <button id="createOrderBtn">Купити</button>
            </router-link>
          </div>
        </div>
      </div>
  


      <h3>{{ $t('Additional_information')}}:</h3>
      <div id="additional_info">
        <p v-for="(characteristic,index) in this.extraInfoProduct" :key="index" class="characteristcProduct">{{ characteristic.key}} :<span>{{characteristic.value  }}</span></p>
      </div>

      <div class="comments">
        <h2>Коментарі</h2>
        <div class="comment" v-for="comment in this.paginatedComments" :key="comment.id">
        <p>{{ comment.user.username }}:</p>
        <p>{{ comment.comment }}</p>.<small><p>{{ comment.date }}</p></small>
        <div v-if ="currentUserRoles && currentUserRoles.includes('ROLE_MODERATOR')">
         <button @click = "deleteComment(comment.id)" class = "deleteCommentBtn"><i class="bi bi-trash3"></i></button>
        </div>
       
        </div>
      <div>
        <div class="NewCommentSection">
              <label for="new-comment">Новий коментар:</label>
              <textarea id="new-comment" v-model="commentForProduct" class="sendCommnedFieldInput"></textarea>
          </div>

        <button  class="ButtonSendComment" @click = "sendComment">Відправити</button>
      </div>
  
      <button @click="prevPage" class="buttonSwipe"><i class="bi bi-arrow-bar-left"></i>Попередня</button>
      <button @click="nextPage" class="buttonSwipe">Наступна<i class="bi bi-arrow-bar-right"></i></button>
      </div>
    </div>
    <page-footer></page-footer>
  </div>




</template>

<script>
import PageHeader from '../PageHeader.vue';
import PageFooter from '../PageFooter.vue';
import axiosInstance from '../../axious-conf.js';

export default {
  name: 'App',
  components: {
    PageHeader,
    PageFooter,
  },
  data() {
    return {
      product: {}, 
      RatingActiveWidth: 0,
      avarageRatingByRatings: 0,
      extraInfoProduct:[],
      currentImageIndex: 0,
      categoryName:null,
      currentUserEmail:null,
      currentUserRoles:null,
      subcategoryName:null,
      showMessage: false,
      modalMessage :null,
      modalStatusSuccess: true ,
      allComments:null,
      commentForProduct:"",
      currentPage: 1, 
      commentsPerPage: 5,
    };
  },
  computed: {
    specificProduct() {
      return this.$store.getters.specificProduct;
    },
    paginatedComments(){
      if (!this.allComments) {
          return [];
        }
        const startIndex = (this.currentPage - 1) * this.commentsPerPage;
        const endIndex = startIndex + this.commentsPerPage;
        return this.allComments.slice(startIndex, endIndex);
    },
    totalPages() {
         return Math.ceil(this.allComments.length / this.commentsPerPage);
    }
  },
  mounted() {
    this.fetchSpecProduct();
    this.fetchComments();
    this.initCurrentuserInfo();
  },
  methods: {
    async fetchSpecProduct() {
      const productId = this.$route.params.id;
      try {
        await this.$store.dispatch('GET_SPECIFICPRODUCT', { id: productId });
        this.product = this.$store.getters.specificProduct;
        this.subcategoryName = this.product.subcategory.name;
        this.categoryName = this.product.subcategory.categoryName;
        await this.initRatings(); 
        this.getAdditionalInfoProduct();
      } catch (error) {
        console.error('Error fetching product:', error);
      }
    },
    async initRatings() {
      const ratings = await axiosInstance.get(`/products/getRatings/${this.product.id}`);
      let averageRating = 0;
      if (ratings.data.length > 0) {
        for (let index = 0; index < ratings.data.length; index++) {
          averageRating += ratings.data[index].rating;
        }
          averageRating = averageRating / ratings.data.length;
        }
        this.avarageRatingByRatings = averageRating;
        this.setRatingActiveWidth(averageRating);
      },
      setRatingActiveWidth(averageRating) {
        this.RatingActiveWidth = averageRating / 0.05;
      },
      handleRatingHover(event){
        this.setRatingActiveWidth(event.target.value);
      },
      async handleRatingChange(event){
        const valueByUser = event.target.value;
        this.currentUserEmail = localStorage.getItem('emailUser');
        if(this.currentUserEmail){
          try{
          await axiosInstance.post(`/products/setRatings/${this.product.id}/${this.currentUserEmail}/${valueByUser}`);
          }
          catch{
            this.showModal("Користувач не купив товар або вже оцінив його!",false);
            return;
          }
          this.initRatings();
          this.showModal("Дякую за оцінку!",true);
       
        } else {
          this.$router.push("/login");
        }
      },
      async addItemToCart() {
        const items = JSON.parse(localStorage.getItem('cartItems')) || [];
        if (items.length > 0 && items.some(item => item.id === this.product.id)) {
          return;
        }
        this.$store.dispatch('ADD_ITEM_TO_CART', this.product);
        this.$emit('itemAddedToCart');
      },
       initCurrentuserInfo(){
        this.currentUserEmail = localStorage.getItem('emailUser');
        this.currentUserRoles = localStorage.getItem('userRoles');
      },
      getAdditionalInfoProduct(){
        if(this.product){
          const keys = Object.keys(this.product);
          const imagesIndex = keys.indexOf('images');

          if (imagesIndex !== -1) {
            const additionalInfo = [];

            for (let i = imagesIndex + 1; i < keys.length; i++) {
              additionalInfo.push({"key":keys[i].charAt(0).toUpperCase() + keys[i].slice(1),"value":this.product[keys[i]]});
            }

            this.extraInfoProduct = additionalInfo;
          }
        }
      },
      previousImage() {
        this.currentImageIndex = (this.currentImageIndex - 1 + this.product.images.length) % this.product.images.length;
      },
      nextImage() {
        this.currentImageIndex = (this.currentImageIndex + 1) % this.product.images.length;
      },
      showModalFunction() {
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
    },
    showModal(message,status){
      this.modalStatusSuccess = status;
      this.modalMessage = message;
      this.showMessage = true;
            setTimeout(() => {
              this.showMessage = false;
            }, 3000)
    },
    async fetchComments(){
      const comments = await axiosInstance.get(`http://localhost:8086/comments/${this.$route.params.id}`)
      this.allComments = comments.data;
    },
    async sendComment(){
      if (this.commentForProduct.trim() !== "" || this.commentForProduct) {
          if(!this.currentUserEmail){
            this.$router.push("/login");
            return;
          }
          else{
            const response = await axiosInstance.post(`http://localhost:8086/comments/add/${this.$route.params.id}/${this.currentUserEmail}/${this.commentForProduct}`);
            this.commentForProduct = "";
            if (response.data === false) {
              this.showModal("Ви ще не купили даний товар або вже залишили відгук!", false);
            } else {
              this.showModal("Дякуємо за відгук!", true);
            }
          }
        
        } else {
          return;
        }

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
    deleteComment(id){
      axiosInstance.post(`http://localhost:8086/comments/delete/${id}`)
    }
    }
  };
</script>

<style scoped>

#specProductRootElem {
  display: flex;
  flex-direction: column;
  min-height: 100vh; 
}

#content {
  flex: 1; 
}
.breadcrumbs {
  font-size: 20px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  margin-top: 1%;
  margin-left: 5%;
}

.breadcrumbs a {
  color: #0496df;
  text-decoration: none;
  transition: color 0.3s;
}

.breadcrumbs a:hover {
  text-decoration: underline;
  color: #0056b3;
}

.breadcrumbs span {
  margin-right: 5px;
  color: #6c757d;
}

    .container {
        width: 80%;
        margin: 5% auto;
        display: flex;
    }
    .product-image {
      flex: 1;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .product-image img {
      max-width: 100%; 
      max-height: 100%; 
      border-radius: 5px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); 
    }
    .product-info {
        flex: 1;
        padding-left: 20px;
    }
   
    .comment {
        border-bottom: 1px solid #ccc;
        padding: 10px 0;
        width: 70%;
        margin: auto;

    }
    .comment p {
        margin: 0;
      
    }

  .productDescription {
  width: 100%;
  word-wrap: break-word;
  word-break: break-word;
  line-height: 1.5;
  max-height: 200px; 
  overflow-y: auto;
  margin-bottom: 10px; 
}


#addToCart{
  background-color: #7adaeb;
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
.comments{
  margin-top: 5%;
}

.rating{
  display: flex;
  align-items: flex-end;
  font-size:40px;
  line-height: 0.75;
}
.rating_body:before{
  content:"★★★★★";
  display: block;
}
.rating_body{
  position:relative;
}
.rating_active{
  position: absolute;
  width: 0%;
  height: 100%;
  top:0;
  left:0;
  overflow: hidden;

}
.rating_active::before{
  content:"★★★★★";
  position: absolute;
  width: 100%;
  height: 100%;
  top:0;
  left: 0;
  color:#ffd300;
}
.rating_items{
display: flex;
position:absolute;
width:100%;
height: 100%;
top:0;
left: 0;
}
.rating__item{
  flex: 0 0 20%;
  height:100%;
  opacity:0;
}
.rating_value{
  font-size: 50%;
  line-height: 1;
  padding:0px,0px,0px,10px ;
}
.rating{
  margin: 5%;
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

.product-info h1 {
  font-size: 24px; 
  margin-bottom: 10px; 
}

.product-info p {
  font-size: 16px; 
  margin-bottom: 10px; 
}

.product-info .price,
.product-info .brand {
  font-size: 16px; 
  margin-bottom: 5px; 
}

.product-info .price .price-value {
  font-weight: bold;
}

.product-info .colorOption {
  margin-top: 10px; 
}

.product-info .colorOption label {
  margin-right: 5px; 
}

.product-info .colorOption.selected label {
  border: 2px solid black; 
}

#makeOrderButtons{
  margin: 5%;
}
#makeOrderButtons button{
  margin: 1%;
}

#additional_info {
  margin-top: 5%;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  width: 40%;
  margin: auto;
  text-align: left;
}

#additional_info p {
  padding: 8px 0;
  font-size: 16px;
}

.characteristcProduct {
  margin-bottom: 8px;
  font-size: 16px;
}

.characteristcProduct span {
  margin-left: 8px;
  font-weight: bold;
}
.carousel-button {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: transparent;
  border: 1px solid #50517e;
  font-size: 24px;
  color: rgb(10, 89, 141);
  cursor: pointer;
}

.carousel-button-prev {
  left: 10px;
}

.carousel-button-next {
  right: 10px;
}

.container {
  width: 90%;
  margin: 5% auto;
  display: flex;
  flex-wrap: wrap; 
}

.product-image {
  flex: 0 0 100%; 
  display: flex;
  justify-content: center;
  align-items: center;
}

.product-image img {
  max-width: 100%; 
  max-height: 100%; 
  border-radius: 5px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); 
}

@media (max-width: 768px){
  .container {
    flex-direction: column;
  }

  .product-info {
    padding-left: 0;
  }

  .product-info h1 {
    font-size: 20px;
  }

  .product-info p {
    font-size: 14px;
  }

  .colorOption {
    margin-top: 5px;
  }

  #makeOrderButtons {
    margin: 2% 5%;
  }

  #additional_info {
    width: 90%;
  }
  .carousel-slide img {
  max-width: 100%;
  height: auto;
}
}

.deleteCommentBtn {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 0.5rem;
  border: none;
  background-color: #dc3545; 
  color: white;
  border-radius: 0.25rem;
}

.deleteCommentBtn i {
  font-size: 1rem; 
}

.success-message {
  background-color: #4caf50;
  color: white;
  padding: 10px;
  right:0;
  margin-top: 10px;
  border-radius: 5px;
  text-align: center;
  position: fixed;
  bottom: 20px;
  transform: translateX(-50%);
  z-index: 1000;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}
.fail-message{
  background-color: #bd4949;
  color: white;
  padding: 10px;
  right:0;
  margin-top: 10px;
  border-radius: 5px;
  text-align: center;
  position: fixed;
  bottom: 20px;
  transform: translateX(-50%);
  z-index: 1000;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}


.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter, .fade-leave-to  {
  opacity: 0;
}
.comments {
  margin-top: 10%;
    width: 100%;
    max-width: 800px;
    margin: 2% auto;
    padding: 20px;
    background-color: #f9f9f9;
    border: 1px solid #ddd;
    border-radius: 8px;
}

.comments h2 {
    font-size: 24px;
    margin-bottom: 20px;
    color: #333;
}

.comment {
  height: 20%;
    margin-bottom: 20px;
    padding: 15px;
    background-color: #fff;
    border: 1px solid #ddd;
    border-radius: 8px;
}

.comment p:first-child {
    font-weight: bold;
    color: #555;
}

.comment p:nth-child(2) {
    margin: 10px 0;
    color: #333;
}

.comment small p {
    font-size: 12px;
    color: #999;
}

.NewCommentSection {
    margin-top: 20px;
}

.NewCommentSection label {
    display: block;
    margin-bottom: 10px;
    font-weight: bold;
    color: #333;
}

.sendCommnedFieldInput {
    width: 100%;
    height: 100px;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 8px;
    resize: vertical;
    font-size: 14px;
    color: #333;
}

.ButtonSendComment {
    display: block;
    margin-top: 10px;
    padding: 10px 20px;
    background-color: #007bff;
    color: #fff;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-size: 16px;
}

.ButtonSendComment:hover {
    background-color: #0056b3;
}
.buttonSwipe{
  margin: 0 5px;
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #f2f2f2;
  color: #333;
  cursor: pointer;
  transition: background-color 0.3s, color 0.3s, border-color 0.3s;
  }

  @media (max-width: 587px){
    .success-message {
  background-color: #4caf50;
  color: white;
  padding: 10px;
  margin-left: 15vh;
  margin-top: 10px;
  border-radius: 5px;
  text-align: center;
  bottom: 20px;
  transform: translateX(-50%);
  z-index: 1000;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}
.fail-message{
  background-color: #bd4949;
  color: white;
  padding: 10px;
   margin-left: 15vh;
  margin-top: 10px;
  border-radius: 5px;
  text-align: center;
  bottom: 20px;
  transform: translateX(-50%);
  z-index: 1000;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

  }
</style>
