<template>
  <div :class="sidebarClass">
    <button @click="$emit('toggle')" id="closeFilterBtn">
      <img src="../../../assets/cross.png" alt="button close filter" />
    </button>
    <div class="filter-section">
      <h3>Фільтри</h3>
      <div class="price-range">
        <label for="price">Діапазон цін:</label>
        <input type="range" id="price" min="1" max="25000" v-model="priceRange" @input="updatePriceLabel" />
        <span>{{ formattedPrice }}</span>
      </div>

      <div class="colorOption" v-for="(color, index) in colors" :key="index">
        <input type="checkbox" :id="'colorOption' + index" :value="color" v-model="selectedColors">
        <label :for="'colorOption' + index" :style="{ backgroundColor: color, border: selectedColors.includes(color) ? '2px solid black' : 'none' }"></label>
      </div>

      <div class="brand-filter">
        <label for="brand">Бренд:</label>
        <select id="brand" @change="handleChangeBrand">
          <option selected disabled>Оберіть бренд</option>
          <option v-for="brand in brands" :key="brand.index" :value="brand">{{ brand }}</option>
        </select>
      </div>
      <button @click="applyFilters" class="apply-button">Застосувати фільтри</button>
    </div>
  </div>

  
</template>
  
  
<script>
import axiosInstance from '@/axious-conf';
export default {
  props: {
    isOpen: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      maxRangePrice:null,
      priceRange: 25000,
      formattedPrice: '1 - 25 000',
      colors: ['#FF0000', '#0000FF', '#00FF00', '#000000', '#f7f7f7', '#808080', '#FFFF00','#FAB9F8','#F5A518','#9718F5','#6F18F5','#75F7F3'],
      selectedColors: [], 
      brands:null,
      selectedBrand:null,
    };
  },
  computed: {
    sidebarClass() {
      return {
        'sidebar': true,
        'open-sidebar': this.isOpen
      };
    },
    
  },
  mounted(){
    this.fetchBrands();
  },
  methods: {
    updatePriceLabel() {
      this.formattedPrice = `1 - ${this.priceRange}`;
    },
    async fetchBrands(){
      const data = await axiosInstance.get("/products/brands/unique/10");
      this.brands = data.data;
    },
    handleChangeBrand(event){
      this.selectedBrand = event.target.value;
    },
    applyFilters() {
            const filterCriteria = {
        priceMax: this.priceRange,
        selectedColors: this.selectedColors.length !== 0 ? this.selectedColors : this.colors,
        selectedBrand: this.selectedBrand,
      };
      this.$emit('applyFilters', filterCriteria);
          
    }
  },
  
};
</script>

<style>
.sidebar {
  margin-top: 3%;
  width: 0;
  height: 42%;
  background-color: #ffffff;
  overflow-x: hidden;
  transition: 0.5s;
  padding-top: 60px;
  position: absolute;
  left: 0;
  transform: translateX(-100%);
  z-index: 1;
}

.sidebar.open-sidebar {
  transform: translateX(0);
}

.filter-section {
  padding: 20px;
  border-bottom: 1px solid #e0e0e0;
}

.price-range,
.brand-filter {
  margin-bottom: 15px;
}

.price-range label,
.brand-filter label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.price-range input[type="range"] {
  width: 100%;
}

.brand-filter select {
  width: 100%;
  padding: 8px;
}

.sidebar ul {
  list-style-type: none;
  padding: 0;
}

.sidebar ul li {
  padding: 8px 8px;
  text-align: center;
}

.sidebar ul li a {
  text-decoration: none;
  color: #333333;
  display: block;
}

.open-sidebar {
  width: 25%;
}

#closeFilterBtn {
  height: 5%;
  width: 5%;
  background-color: white;
  border: none;
}

.colorOption {
  display: inline-block;
  margin-right: 10px;
}

.colorOption input[type="checkbox"] {
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

.colorOption input[type="checkbox"]:checked + label {
  border: 2px solid black;
}

.apply-button {
  background-color: #4caf50;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s;
}

.apply-button:hover {
  background-color: #45a049;
}

.close-filter-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  border: none;
  background: none;
  cursor: pointer;
}

.close-filter-btn img {
  width: 20px;
  height: auto;
}

.filter-section {
  padding: 20px;
  border-bottom: 1px solid #e0e0e0;
  border-radius: 10px; 
  background-color: #f9f9f9; 
}

.filter-section h3 {
  margin-top: 0;
  margin-bottom: 20px;
  font-size: 24px;
  color: #333; 
}

.colorOption label {
  width: 40px;
  height: 40px;
}

.apply-button {
  margin-top: 20px;
  padding: 12px 24px;
  font-size: 18px;
}

.apply-button:hover {
  background-color: #3f9e3f;
}

@media (max-width: 1225px) {
  .open-sidebar {
    width: 65%;
  }
}
</style>