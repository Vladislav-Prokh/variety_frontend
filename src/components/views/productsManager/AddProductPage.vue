<template>
  <div id="app">
    <page-header></page-header>

    <div id="content">
      <div id="product-form" class="productInfo">
        <h2>Додати товар</h2>
        <form id="addForm"  @submit.prevent="handleSubmit">
          <div class="form-group">
            <label for="product-name">Назва товару:</label>
            <input type="text" id="product-name" name="product-name" v-model="productName" placeholder="Назва товару:" required>
          </div>
          <div class="form-group">
            <label for="product-description">Опис:</label>
            <textarea id="product-description" name="product-description" v-model="productDescription" placeholder="Введіть опис товару.." required></textarea>
          </div>
          <div class="form-group">
            <label for="product-price">Ціна ₴:</label>
            <input type="number" id="product-price" step=0.01 name="product-price" v-model="productPrice" placeholder="Введите цену товара" required>
          </div>

          <select class="custom-select" @change="handleBrandSelection">
                <option disabled selected value="">Оберіть бренд:</option>
                <option :value="brand.id"  v-for="brand in this.allBrands" :key="brand.id">{{ brand}}</option>
          </select>
          <div class="form-group">
            <label for="product-price">Додати бренд:</label>
            <input type="text" v-model="productBrand" placeholder="Додайте назву бренду" required>
          </div>

          <select class="custom-select"  @change="handleCategoryChange" required>
                <option disabled selected value="">Оберіть категорію</option>
                <option :value="category.name"  v-for="category in this.categories" :key="category.id">{{ category.name }}</option>
          </select>

          <select class="custom-select" v-if="this.subcategories.length!=0" @change="handleSubcategoryChange" required>
                <option disabled selected value="">Оберіть підкатегорію</option>
                <option :value="subcategory.id"  v-for="subcategory in this.subcategories" :key="subcategory.id">{{ subcategory.name }}</option>
          </select>

          <div class="colorPicker">
            <label class="colorPickerLabel">Оберіть колір товару:</label>
            <div class="colorOptions">
              <div class="colorOption" v-for="(color, index) in basicColors" :key="index">
                <input type="checkbox" :id="'colorOption' + index" :value="color" v-model="selectedColors">
                <label :for="'colorOption' + index" :style="{ backgroundColor: color, border: selectedColors.includes(color) ? '2px solid black' : 'none' }"></label>
              </div>
            </div>
          </div>

          <div v-if="productSubcategoryID && subcategoryFields[getSubcategoryNameById(productSubcategoryID)]" class="additionalFieldsPanel">
            <div v-for="(field, index) in subcategoryFields[getSubcategoryNameById(productSubcategoryID)]" :key="index">
              <label>{{ field.label }}</label>
              <input :type="field.type" v-model="additionalFields[field.name]">
            </div>
          </div>

          <div class="form-group">
            <label for="product-images">Зображення товару (до 3):</label>
            <input type="file" id="product-images" name="product-images" accept="image/*" multiple max="3" required @change="handleFileChange">

            <small>Ви можете додати до 3 зображень</small>
          </div>

          <button type="submit">Додати товар</button>
        </form>
      </div>
      
      <div id = "PreviewPanel" v-if ="!this.uploadFilesErrors.length>0">
      <div id="imagePreview" class="productInfo">
        <h2>Image preview</h2>
        <div class="imagePreviewContainer">
          <div v-for="(image, index) in selectedImages" :key="index" class="imagePreviewItem">
            <img :src="getImageURL(image)" alt="Preview">
            <div class="imagePreviewActions">
              <button @click="removeImage(index)" id="removeImageButton">Remove</button>
              <button @click="selectPreviewImage(index)" id="setPreviewImg">set as preview</button>
            </div>
          </div>
        </div>
      </div>

      <div id="productPreview" class="productInfo" v-if="this.productPreviewImageIndex>-1">
          <h1>Product preview</h1>
          <div class="card" >
            <div class="card-item">
              <img class="card-img-top" :src="this.getImageURL(this.selectedImages[this.productPreviewImageIndex])" alt="Preview">
              <div class="card-body">
                <h5 class="card-title">{{ this.productName }}</h5>
                <h3 class="card-price" v-if="this.productPrice">{{ this.productPrice }} <small>₴</small></h3>
                <a href="#" class="btn btn-success"><i class="bi bi-cart3"></i></a>
              </div>
            </div>
          </div>
      </div>
      </div>
      <div class ="errorMessage" v-else>
       <h3>{{ this.uploadFilesErrors }}</h3>
      </div>
      
    </div>

    <page-footer></page-footer>
  </div>
</template>

<script>
import PageHeader from '../../PageHeader.vue';
import PageFooter from '../../PageFooter.vue';
import axiosInstance from '../../../axious-conf.js';
import subcategoryFields from '../../../additional_fields_for_products.js';
import axios from 'axios';

export default {
  components: {
    PageHeader,
    PageFooter,
  },
  data() {
    return {
      productName: null,
      productPrice: null,
      productBrand:"no brand",
      productDescription:null,
      productPreviewImageIndex: -1,
      productCategory:null,
      productSubcategoryID:null,
      categories: [],
      subcategories: [],
      selectedImages: [],
      selectedColors: [], 
      allBrands:[],
      basicColors: ['#FF0000', '#0000FF', '#00FF00', '#000000', '#f7f7f7', '#808080', '#FFFF00','#FAB9F8','#F5A518','#9718F5','#6F18F5','#75F7F3'],
      additionalFields: {},
      subcategoryFields: subcategoryFields,
      uploadFilesErrors:[],
    };
  },

  mounted() {
    this.fetchCategories();
    this.fetchBrands();
  },
  methods: {
      fetchCategories() {
      this.$store.dispatch('GET_ALLCATEGORIES')
        .then(() => {
          this.categories = this.$store.getters.allCategories;
        })
        .catch((error) => {
          console.error('Error fetching product:', error);
        });
      },
      async fetchBrands(){
        const brands = await axios.get("/products/brands/unique/10");
        if(brands){
          this.allBrands = brands.data;
        }
  
      },
      async handleCategoryChange(event) {
        this.productCategory = event.target.value;
        const chosenCategoryName = event.target.value;
        try {
            const response = await axiosInstance.get("/category/getSubcategories", {
                params: {
                    categoryName: chosenCategoryName
                }
            });
            this.subcategories = response.data;
        } catch (error) {
            console.error("Ошибка при получении субкатегорий:", error);
        }
      },
    async handleFileUpload(id) {
        const files = this.selectedImages;

        const formData = new FormData();

        let amountOfPhotos = files.length;

        const maxPhotos = 3;

        for (let i = 0; i < Math.min(amountOfPhotos, maxPhotos); i++) {
            formData.append('photos', files[i]); 
        }
        formData.append("product_id", id); 
        formData.append("mainImageIndex",this.productPreviewImageIndex);
        try {
           await axiosInstance.post("/products/uploadImages", formData);
      
        } 
        catch (error) {
            console.error('Error uploading images:', error);
         }
      },
      handleFileChange(event) {
          const filesArray = Array.from(event.target.files);
          const allowedExtensions = ["png", "jpeg", "jpg"];
          const uploadFilesError = [];
          const filteredFiles = filesArray.filter(file => {
              const extension = file.name.split('.').pop().toLowerCase();
              if (!allowedExtensions.includes(extension)) {
                  uploadFilesError.push({ filename: file.name, error: 'Неразрешенный формат файла' });
                  return false;
              }
              return true;
          });

          this.selectedImages = filteredFiles;
          this.uploadFilesErrors = uploadFilesError;
      },
      getImageURL(image) {
      return URL.createObjectURL(image);
      },
      removeImage(index) {
        this.selectedImages.splice(index, 1);
      },
      selectPreviewImage(imageIndex) {
        this.productPreviewImageIndex = imageIndex;
      },
      handleSubcategoryChange(event){
        this.productSubcategoryID = event.target.value;
      },
      getSubcategoryNameById(subcategoryId) {
        for (let i = 0; i < this.subcategories.length; i++) {
          if (this.subcategories[i].id == subcategoryId) {
              return this.subcategories[i].name;
          }
        }
         return null; 
      } ,
      handleBrandSelection(event) {
        this.productBrand = event.target.value;
      },
      async handleSubmit() {
      await this.addProduct(); 
        this.$router.push("/privileged/products/main");
      },
      async addProduct() {

        if(!this.productBrand){
          this.productBrand ="no brand";
        }
        const productWithAdditionalFields = {
                product: {
                    productName: this.productName,
                    description: this.productDescription,
                    price: parseFloat(this.productPrice),
                    brand: this.productBrand,
                    colors: this.selectedColors
                },
                additionalFields: {
                  ...this.additionalFields,
                }
            };
    try {
         const response = await axiosInstance.post("/products/add?subcategoryId=" + this.productSubcategoryID, productWithAdditionalFields);
         await this.handleFileUpload(response.data);

    } catch (error) {
        console.error("Ошибка при добавлении продукта:", error);
    }
      },
  
      

  }
}
</script>

<style scoped>

#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

#content {
  flex: 1;
  display: flex;
  flex-wrap: wrap;
  justify-content: center; 
  margin: 0 auto;
}

#product-form,
#productPreview {
  width: 100%;
  max-width: 500px;
  margin-bottom: 20px;
}

h2 {
  margin-bottom: 5%;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  font-weight: bold;
}

.additionalFieldsPanel input{
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin-bottom: 15px;
}
.form-group input,
.form-group textarea {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin-bottom: 15px;
}

.form-group textarea {
  height: 100px;
}

.form-group input[type="file"] {
  border: none;
  margin-bottom: 15px;
}
.custom-select{
  margin:2%;
}
button {
  background-color: #007bff;
  color: #fff;
  border: none;
  padding: 10px 15px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #0056b3;
}
.custom-select {
  margin-bottom: 20px;
  padding: 10px 20px;
  font-size: 16px;
  border: 1px solid #ced4da;
  border-radius: 5px;
  background-color: #fff;
  appearance: none;
  -webkit-appearance: none; 
  -moz-appearance: none;
}

.custom-select::after {
  content: '\25BC'; 
  position: absolute;
  top: 50%;
  right: 15px;
  transform: translateY(-50%);
  pointer-events: none; 
}


.custom-select:hover, .custom-select:focus {
  border-color: #111111;
  background-color: #fcfcfc;
}


.custom-select:disabled {
  background-color: #e9ecef;
  opacity: 0.65;
  cursor: not-allowed;
}
/*Preview*/
.card {
  margin-top: 5%;
  margin-bottom: 5%;
  height: auto;
  width: 100%;
}

.card-price {
  font-weight: 700;
}

.card-img-top {
  width: 100%;
  height: auto;
}

.btn {
  width: 20%;
  margin-left: 80%;
}

.card:hover {
  background-color: #f1eded;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}
a {
  text-decoration: none;
}
.imagePreviewContainer {
  display: flex;
  flex-wrap: nowrap; 
  align-items: center;
  overflow-x: auto;
  overflow-y: hidden; 
}
.imagePreviewItem img {
  max-width: 200px; 
  max-height: 300px; 
}
.imagePreviewItem {
  margin-right: 10px; 
}

.imagePreviewActions button{
  margin:2px;
  background-color: #dbd5d5;
}
#setPreviewImg:focus{
  background-color: #47bd7c;
}
#removeImageButton{
  background-color: #d86d6d;
}

#imagePreview {
  margin-left: 10vw; 

}
.imagePreviewItem {
  margin-right: 10px;
  margin-bottom: 10px; 
}

.imagePreviewItem img {
  max-width: 100%; 
  height: auto; 
}
#productPreview{
  border-top: 1px solid #ddd;
  margin:auto;
  justify-content: center;
}

.colorPicker {
  margin-bottom: 20px;

}
.colorOption {
  display: inline-block;
  margin-right: 10px;
}

.colorOption input[type="radio"] {
  display: none;

}
.errorMessage{
  height: 10%;
  width:40%;
  margin: auto;
  justify-content: center;
}
.errorMessage h3{
  color: #eb4141;
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

@media screen and (min-width: 768px) {
  #content {
    flex-direction: row;
  }
  #imagePreview {
    margin-right: 20px;
  }
}


</style>
