<template>
    <div id="CategoriesManagerRoot">
      <header-page></header-page>
      <div id="CategoriesManagerContent">
        <div class="form-container">
          <form @submit.prevent="addCategory">
            <input v-model="newCategoryName" type="text" placeholder="Название категории" required>
            <button class ="addButton" type="submit">Додати категорію</button>
          </form>
          <form @submit.prevent="addSubcategory">
            <select v-model="selectedCategoryId" required>
              <option v-for="category in categories" :key="category.id" :value="category.id">
                {{ category.name }}
              </option>
            </select>
            <input v-model="newSubcategoryName" type="text" placeholder="Название подкатегории" required>
            <button class ="addButton" type="submit">Додати підкатегорію</button>
          </form>
        </div>
        <table class="styled-table">
          <thead>
            <tr>
              <th>Категорія</th>
              <th>Підкатегорія</th>
              <th>Дія</th>
            </tr>
          </thead>
          <tbody>
            <template v-for="category in this.categories" :key="category.id">
         
              <tr  v-for="(subcategory, index) in category.subcategories" :key="subcategory.id">
                <td v-if="index === 0" :rowspan="category.subcategories.length">
                  {{ category.name }}
                  <button  class = "DeleteButton" @click="deleteCategory(category.id)">X</button>
                </td>
                <td>{{ subcategory.name }}</td>
                <td>
                  <button class = "DeleteButton" @click="deleteSubcategory(subcategory.id)">X</button>
                </td>
              </tr>
  
          
            </template>
          </tbody>
        </table>
      </div>
      <footer-page></footer-page>
    </div>
  </template>
  
  <script>
  import HeaderPage from "../../PageHeader.vue";
  import FooterPage from '../../PageFooter.vue';
  import axiosInstance from '../../../axious-conf';
  
  export default {
    name: 'CategoriesManagerContent',
    components: {
      HeaderPage,
      FooterPage,
    },
    data() {
      return {
        categories: null,
        newCategoryName: '',
        newSubcategoryName: '',
        selectedCategoryId: null,
      };
    },
    mounted() {
      this.fetchCategories();
    },
    methods: {
      async fetchCategories() {
        const response = await axiosInstance.get("http://localhost:8086/category/getAll");
        this.categories = response.data;
        console.log(this.categories);
      },
      async addCategory() {
        try {
          await axiosInstance.post("http://localhost:8086/category/add", {
            name: this.newCategoryName,
          });
          this.newCategoryName = '';
          this.fetchCategories();
        } catch (error) {
          console.error("Ошибка при добавлении категории:", error);
        }
      },
      async addSubcategory() {
        try {
          await axiosInstance.post(`http://localhost:8086/category/add/${this.selectedCategoryId}/subcategory/${this.newSubcategoryName}`);
          this.newSubcategoryName = '';
          this.selectedCategoryId = null;
          this.fetchCategories();
        } catch (error) {
          console.error("Ошибка при добавлении подкатегории:", error);
        }
      },
      async deleteCategory(categoryId) {
        try {
          await axiosInstance.post(`http://localhost:8086/category/delete/${categoryId}`);
          this.fetchCategories();
        } catch (error) {
          console.error("Ошибка при удалении категории:", error);
        }
      },
      async deleteSubcategory(subcategoryId) {
        try {
          await axiosInstance.post(`http://localhost:8086/category/delete/subcategory/${subcategoryId}`);
          this.fetchCategories();
        } catch (error) {
          console.error("Ошибка при удалении подкатегории:", error);
        }
      }
    }
  }
  </script>
  
  <style scoped>
  #CategoriesManagerRoot {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }
  
  #CategoriesManagerContent {
    flex: 1;
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  
  .form-container {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-bottom: 20px;
  }
  
  .form-container form {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  
  .styled-table {
    border-collapse: collapse;
    margin: 25px 0;
    font-size: 1.2em;
    font-family: 'Arial', sans-serif;
    min-width: 50%;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
  }
  
  .styled-table th, .styled-table td {
    border: 1px solid #dddddd;
    text-align: left;
    padding: 12px 15px;
  }
  
  .styled-table th {
    background-color: #009879;
    color: #ffffff;
  }
  
  .styled-table tr {
    background-color: #f3f3f3;
    transition: background-color 0.3s;
  }
  
  .styled-table tr:nth-of-type(even) {
    background-color: #f9f9f9;
  }
  
  .styled-table tr:hover {
    background-color: #f1f1f1;
  }
  
  .addButton {
    background-color: #4CAF50;
    color: white;
    border: none;
    padding: 8px 12px;
    cursor: pointer;
    border-radius: 5px;
  }
  

  input[type="text"],
select {
  width: 100%;
  padding: 10px;
  margin-bottom: 15px;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-sizing: border-box;
  font-size: 16px;
  transition: border-color 0.3s ease;
}

input[type="text"]:focus,
select:focus {
  outline: none;
  border-color: #007bff; /* Цвет рамки при фокусе */
}

  .DeleteButton{
    background-color: #d45151;
    color: white;
    border: none;
    padding: 8px 12px;
    cursor: pointer;
    border-radius: 5px;
  }

  .DeleteButton:hover {
    background-color: #af251b;
  }
  
  </style>
  