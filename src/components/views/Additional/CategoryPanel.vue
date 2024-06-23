<template>
    <div id="categoryPanelRoot">
      <div class="category-container" v-if="categories">
        <div class="category" v-for="(category, index) in categories" :key="index">
          <div class="category-header" @click="toggleSubcategories(index)">
            <button class="category-link">
              {{ category.name }}
            </button>
            <span v-if="category.subcategories.length" class="arrow">{{ category.expanded ? '▼' : '▶' }}</span>
          </div>
          <div v-if="category.expanded && category.subcategories" class="subcategory-container">
            <div class="subcategory" v-for="(subcategory, subIndex) in category.subcategories" :key="subIndex">
              <button class="subcategory-link" @click="findBySubcategory(subcategory.name)">
                {{ subcategory.name }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        categories: null,
      };
    },
    mounted() {
      this.fetchCategories();
    },
    methods: {
      fetchCategories() {
        this.$store
          .dispatch("GET_ALLCATEGORIES")
          .then(() => {
            this.categories = this.$store.getters.allCategories.map(category => ({
              ...category,
              expanded: false
            }));
          })
          .catch(error => {
            console.error("Error fetching categories:", error);
          });
      },
      toggleSubcategories(index) {
        this.categories[index].expanded = !this.categories[index].expanded;
      },
      findBySubcategory(categoryName) {
        this.$emit('applyClassification', categoryName);
      }
    },
  };
  </script>
  
  
  <style scoped>
  #categoryPanelRoot {
    display: flex;
    justify-content: center;
  }
  
  .category-container {
    display: flex;
    flex-wrap: wrap;
  }
  
  .category {
    margin: 5px; 
    padding: 10px; 
    background-color: #f0f0f0; 
    border-radius: 5px; 
    font-family: Arial, sans-serif; 
    font-size: 16px; 
    color: #333; 
    cursor: pointer; 
    transition: background-color 0.3s ease; 
    display: block; 
    text-decoration: none;
  }
  
  .category:hover {
    background-color: #ccc;
  }
  
  .category-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  
  .category-link {
    color: #333;
    text-decoration: none; 
    cursor: pointer;
    background: none;
    border: none;
    font-size: 16px;
    padding: 0;
  }
  
  .category-link:hover {
    color: #555; 
  }
  
  .arrow {
    font-size: 15px;
    margin: 1vh;
  }
  
  .subcategory-container {
    margin-top: 5px; 
    padding-left: 10px; 
  }
  
  .subcategory-link {
    color: #666;
    text-decoration: none; 
    cursor: pointer;
    background: none;
    border: none;
    font-size: 14px;
    padding: 0;
  }
  
  .subcategory-link:hover {
    color: #888;
  }
  </style>
  