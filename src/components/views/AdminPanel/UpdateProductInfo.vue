<template>
    <div id = "updateProductRoot">
        <page-header></page-header>
        <div class = "content">

    <div id="product-form" class="productInfo">
        <h2>Оновити товар</h2>
        <form id="addForm"  @submit.prevent="updateProduct">
          <div class="form-group">
            <label for="product-name">Назва товару:</label>
            <input type="text" id="product-name" name="product-name" v-model="productName" placeholder="Назва товару" required>
          </div>
          <div class="form-group">
            <label for="product-description">Опис:</label>
            <textarea id="product-description" name="product-description" v-model="productDescription" placeholder="Опис товару" required></textarea>
          </div>
          <div class="form-group">
            <label for="product-price">Ціна ₴:</label>
            <input type="number" id="product-price" step=0.01 name="product-price" v-model="productPrice" placeholder="ціна" required>
          </div>

       
          <div class="form-group">
            <label for="product-price">Бренд:</label>
            <input type="text" v-model="productBrand" placeholder="Бренд:" required>
          </div>

          <div class="colorPicker">
            <label class="colorPickerLabel">Оберіть колір товару:</label>
            <div class="colorOptions">
              <div class="colorOption" v-for="(color, index) in basicColors" :key="index">
                <input type="checkbox" :id="'colorOption' + index" :value="color" v-model="selectedColors">
                <label :for="'colorOption' + index" :style="{ backgroundColor: color, border: selectedColors.includes(color) ? '2px solid black' : 'none' }"></label>
              </div>
            </div>
          </div>
          <div v-if="uploadFilesErrors.length >0">
          <h2>{{ this.uploadFilesErrors }}</h2>
        </div>

          <div class="form-group">
            <label for="product-images">Зображення товару:</label>
            <input type="file" id="product-images" name="product-images" accept="image/*" multiple max="3" @change="handleFileChange">

          </div>
      
          <button type="submit">Оновити товар</button>
        </form>

        <div class="image-preview">
            <div v-for="(image, index) in images" :key="index" class="image-container">
              <img :src="image.displayImageURL" alt="Product Image" class="product-image">
              <button @click="deleteImage(image.id)" class="delete-button">✖</button>
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
import axiosInstance from '../../../axious-conf';

export default{

    components:{
        PageHeader,
        PageFooter
    },
    data(){
        return{
            selectedColors:[],
            basicColors: ['#FF0000', '#0000FF', '#00FF00', '#000000', '#f7f7f7', '#808080', '#FFFF00','#FAB9F8','#F5A518','#9718F5','#6F18F5','#75F7F3'],
            productName:null,
            productDescription:null,
            selectedImages:null,
            productPrice:null,
            productBrand:null,
            uploadFilesErrors:[],
            images:null,
            product:null,
            productPreviewImageIndex: 0,
        }
    },
    mounted(){
        this.fetchProduct();
    },
    methods:{
       async updateProduct(){
            if(!this.productBrand){
                    this.productBrand ="no brand";
                    }
                    const productToUpdate = {
                           
                                id:this.product.id,
                                productName: this.productName,
                                description: this.productDescription,
                                price: parseFloat(this.productPrice),
                                brand: this.productBrand,
                                colors: this.selectedColors
                        };
                       
                try {
                     await axiosInstance.post(`/products/update/${this.product.id}`, productToUpdate);
                     if(this.selectedImages){
                        await this.handleFileUpload(this.product.id);
                     }
                     this.$router.push(`/products/${this.product.id}`);
                } catch (error) {
                    console.error("Ошибка при добавлении продукта:", error);
                }
        },
        async fetchProduct(){
            const productId = this.$route.params.id;
            try {
                await this.$store.dispatch('GET_SPECIFICPRODUCT', { id: productId });
                this.product = this.$store.getters.specificProduct;
                if(this.product){
                    this.productName = this.product.productName;
                    this.productDescription = this.product.description;
                    this.productPrice = this.product.price;
                    this.productBrand = this.product.brand;
                    this.selectedColors = this.product.colors;
                    this.images = this.product.images;
                }
              
            } catch (error) {
                console.error('Error fetching product:', error);
            }
        },
        getImageURL(image) {
            return URL.createObjectURL(image);
        },
        handleFileChange(event) {
          const filesArray = Array.from(event.target.files);
          const allowedExtensions = ["png", "jpeg", "jpg"];
          const uploadFilesError = [];
          const filteredFiles = filesArray.filter(file => {
              const extension = file.name.split('.').pop().toLowerCase();
              if (!allowedExtensions.includes(extension)) {
                  uploadFilesError.push({ filename: file.name, error: 'Невірний формат файлу:' });
                  return false;
              }
              return true;
          });
          const filteredFilesWithUrls = filteredFiles.map((file, index) => ({
              id: index+1, 
              displayImageURL: this.getImageURL(file)
          }));
          this.images = [...this.images,...filteredFilesWithUrls];          
          this.selectedImages = filteredFiles;
          this.uploadFilesErrors = uploadFilesError;
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
      async deleteImage(imageId){
        if(imageId){
          const response  = await axiosInstance.post(`/products/deleteImageInProduct/${this.product.id}/${imageId}`);
          if(!response.data){
            this.images = this.images.filter(image => image.id !== imageId);
            this.selectedImages =   await this.selectedImages.filter(image => image.id !== imageId);
          }else{
            window.location.reload();
          }
        }
  
        
      }
    }
}

</script>

<style>
#updateProductRoot {
  display: flex;
  flex-direction: column;
  min-height: 100vh; 
}

.content {
  flex: 1; 
  height: 100%;
  width: 100%;
}


#product-form,
#productPreview {
  width: 100%;
  max-width: 500px;
  margin-bottom: 20px;
  margin:auto;
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

.image-preview {
  display: flex;
  flex-wrap: wrap;
  gap: 16px; /* Пространство между изображениями */
  padding: 10px;
  background-color: #f8f9fa;
  border-radius: 8px;
}

.image-container {
  position: relative;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
  width: 150px;
  height: 150px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #fff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s;
}

.image-container:hover {
  transform: scale(1.05);
}

.delete-button {
  position: absolute;
  top: 8px;
  right: 8px;
  background-color: #ff4d4d;
  border: none;
  color: white;
  font-size: 16px;
  padding: 4px 8px;
  border-radius: 50%;
  cursor: pointer;
  transition: background-color 0.3s;
}

.delete-button:hover {
  background-color: #ff1a1a;
}

.product-image {
  max-width: 100%;
  max-height: 100%;
  object-fit: cover;
}

</style>