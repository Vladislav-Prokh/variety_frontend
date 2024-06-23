<template>
  <div id="statisticRoot">
    <page-header></page-header>
 
    <div id="statisticContent">
      <div id="chooseDatePanel">
        <label for="startDate">Дата початку</label>
        <input type="date" id="startDate" v-model="startDate" class="datePicker">
        <label for="endDate">Дата кінця</label>
        <input type="date" id="endDate" v-model="endDate" class="datePicker">
        <h4 id ="errorDateInput">{{ this.inputDateError }}</h4>
        <h4 id ="noOrdersFoundMessage">{{ this.noOrdersFoundMessage }}</h4>
        <button @click = "fetchDataForChart" id = "btnChartBuilder">Графік</button>
      </div>

 

      <div id="chartDisplayPanel">
      
        <div id = "toolsDisplayPanel">
    
            <div id="radioBtnsChartOption">

              <h6>Тип Графіку</h6>
              <div>
                <input type="radio" id="chart1" name="chart" value="bar" v-model="selectedChart">
                <label for="chart1">Bar</label>
              </div>
              <div>
                <input type="radio" id="chart2" name="chart" value="line" v-model="selectedChart">
                <label for="chart2">Line</label>
              </div>
              <div>
                <input type="radio" id="chart3" name="chart" value="doughnut" v-model="selectedChart">
                <label for="chart3">doughnut</label>
              </div>
            </div>
            <div id="radioBtnsSalesTypeOption">
                  <h6>Тип продажу</h6>
                  <div class="radio-container">
                    <input type="radio" name="sale1" id="sale1" value="DELIVERED" v-model="selectedTypeSales">
                    <label for="sale1">Фактичні продажи</label>
                  </div>
                  <div class="radio-container">
                    <input type="radio" name="sale2" id="sale2" value="PENDING" v-model="selectedTypeSales">
                    <label for="sale2">Потенційні</label>
                  </div>
                  <div class="radio-container">
                    <input type="radio" name="sale3" id="sale3" value="CANCELLED" v-model="selectedTypeSales">
                    <label for="sale3">Скасовані</label>
                  </div>
                  <div class="radio-container">
                    <input type="radio" name="sale4" id="sale4" value="SHIPPED" v-model="selectedTypeSales">
                    <label for="sale4">Доставляються</label>
                  </div>
            </div>
          
        </div>
        <div id="chartDisplay">
          <div v-if="selectedChart === 'bar'">
              <Bar
                id="my-chart-id"
                :options="chartOptions"
                :data="chartData"
              />
          </div>
          <div v-if="selectedChart === 'line'">
            <Line :data="chartData" :options="chartOptions" />
          </div>
          <div id = "doughnutPanel" v-if="selectedChart === 'doughnut'">
            <Doughnut :data="chartData" :options="chartOptions" />
          </div>
        </div>  
      </div>
    </div>
    <page-footer></page-footer>
  </div>
</template>
<script>
import PageHeader from '@/components/PageHeader.vue';
import PageFooter from '@/components/PageFooter.vue';
import { Bar, Line, Doughnut } from 'vue-chartjs';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend, PointElement, LineElement, ArcElement } from 'chart.js';
import axiosInstance from '@/axious-conf';

ChartJS.register(ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale, Title, PointElement, LineElement);

export default {
  name: 'StatisticPage',
  components: {
    PageHeader,
    PageFooter,
    Bar,
    Line,
    Doughnut,
  },
  data() {
    const currentDateTime = new Date();
    const formattedDate = currentDateTime.toISOString().split('T')[0];
    return {
      startDate: formattedDate,
      endDate: null,
      inputDateError:null,
      noOrdersFoundMessage:null,
      selectedChart: 'bar',
      selectedTypeSales: 'DELIVERED',
      chartData: {
        labels: [],
        datasets: [
          {
            label: 'Sales',
            backgroundColor: [],
            data: [],
          },
        ],
      },
      chartOptions: {
        responsive: true,
      },
    };
  },
  computed: {
    dateInputValidation() {
      if (this.startDate && this.endDate) {
        const startDate = new Date(this.startDate);
        const endDate = new Date(this.endDate);
        return startDate < endDate;
      }
      return !!this.startDate && !this.endDate;
    },
  },
  methods: {
    async fetchDataForChart() {
      this.noOrdersFoundMessage = null;
      try {
        if (this.dateInputValidation) {
          this.inputDateError = null;
          const requestData = {
            startDate: this.startDate,
            endDate: this.endDate,
            status: this.selectedTypeSales,
          };
          const response = await axiosInstance.get('/orders/countByDateAndStatus', {
            params: requestData,
          });
          const dataFromServer = response.data;
          if(dataFromServer.length>0){
          this.updateChartData(dataFromServer);
          }
          else{
            this.noOrdersFoundMessage = "no orders found";
          }
        }
        else{
          this.inputDateError = "input date error";
        }
      } catch (error) {
        console.error(error);
      }
    },
    updateChartData(dataFromServer) {
      const newLabels = [];
      const newData = [];
      const newBackgroundColors = [];

      dataFromServer.forEach((item) => {
        newLabels.push(item.date);
        newData.push(item.orderCount);
        newBackgroundColors.push(this.generateBackGroundColorsForCharts());
      });

      this.chartData = {
        labels: newLabels,
        datasets: [
          {
            label: 'Sales',
            backgroundColor: newBackgroundColors,
            data: newData,
          },
        ],
      };
    },
    generateBackGroundColorsForCharts() {
      let alphabet = ['A', 'B', 'C', 'D', 'E', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
      let colorCodeLength = 6;
      let color = '#';
      for (let i = 0; i < colorCodeLength; i++) {
        const randomIndex = Math.floor(Math.random() * alphabet.length);
        color += alphabet[randomIndex];
      }
      return color;
    },
  },
};
</script>

<style scoped>
#statisticRoot {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

#statisticContent {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

#chooseDatePanel {
  width: 15%;
  padding: 20px;
  border: 2px solid #ccc;
  border-radius: 10px;
  background-color: #f9f9f9;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

#chooseDatePanel input[type="date"] {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-sizing: border-box;
  font-size: 16px;
  background-color: #fff; 
  color: #333; 
  border-color: #999;
  border-radius: 5px; 
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}
#endDate{
  margin-top: 5%;
}
#chooseDatePanel input[type="date"]:focus {
  outline: none; 
  border-color: #66afe9;
  box-shadow: 0 0 5px rgba(102, 175, 233, 0.6); 
}
#chooseDatePanel input[type="date"]::-webkit-calendar-picker-indicator:hover {
  filter: invert(0); 
}
#chooseDatePanel input[type="date"]::-webkit-calendar-picker-indicator:active {
  transform: scale(0.9); 
}
#chartDisplayPanel {
  background-color: #f8f8f8;
  border: 1px solid #ddd;
  height: 60vh;
  width: 70%;
  display: flex;
  justify-content: flex-start;
  margin-left: 5%;
  margin: 2%;
}

#chartDisplayPanel div {
  margin-bottom: 10px;
}

#chartDisplayPanel input[type="radio"] {
  display: none;
}

#chartDisplayPanel label {
  display: inline-block;
  cursor: pointer;
  padding: 10px 20px;
  background-color: #f0f0f0;
  border-radius: 20px; 
  border: 1px solid #ccc;
  font-size: 16px;
  transition: background-color 0.3s, color 0.3s, border-color 0.3s;
  width: 150px; 
  text-align: center; 
}

#chartDisplayPanel input[type="radio"]:checked + label {
  background-color: #007bff;
  color: #fff;
  border-color: #007bff;
}
#radioBtnsChartOption{
  margin-left: 2%;
  margin-top: 1%;
  align-items: center;
}
#chartDisplay{
height: 100%;
width: 100%;
}

#doughnutPanel{
 height:70%;
 width: 70%;
 display: flex;
 justify-content: center;
}
#toolsDisplayPanel{
  margin-left: 1%;
}
#radioBtnsSalesTypeOption {
  margin-top: 20px;
}
#errorDateInput{
  color:red;
}
#noOrdersFoundMessage{
  color:rgb(233, 211, 16);
}
.radio-container {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.radio-container input[type="radio"] {
  display: none;
}

.radio-container label {
  display: inline-block;
  cursor: pointer;
  padding: 10px 20px;
  background-color: #f0f0f0;
  border-radius: 20px;
  border: 1px solid #ccc;
  font-size: 16px;
  transition: background-color 0.3s, color 0.3s, border-color 0.3s;
}
#btnChartBuilder {
  background-color: #4CAF50; 
  border: none; 
  color: white; 
  padding: 15px 32px; 
  text-align: center; 
  text-decoration: none;
  display: inline-block; 
  font-size: 16px;
  margin: 30px 2px; 
  cursor: pointer;
  border-radius: 10px;
}

#btnChartBuilder:hover {
  background-color: #45a049; 
}
.radio-container input[type="radio"]:checked + label {
  background-color: #007bff;
  color: #fff;
  border-color: #007bff;
}

@media only screen and (max-width: 768px) {
  #statisticContent {
    flex-direction: column;
    align-items: stretch;
  }
  
  #chooseDatePanel {
    width: 100%;
    margin-bottom: 20px;
  }

  #chartDisplayPanel {
    width: 100%;
    margin: 0;
    height: auto;
    overflow: hidden;
  }

  #chartDisplayPanel div {
    margin-bottom: 20px;
  }
}
</style>
