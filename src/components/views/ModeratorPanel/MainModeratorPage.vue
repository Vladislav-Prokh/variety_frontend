<template>
    <div id="moderatorRoot">
        <header-page></header-page>
        <div id="moderatorContent" >
            <div class="searchWrapper">
                <input type="text" placeholder="Search orders" v-model="searchFieldInputText">
                <button @click="findOrders">Find</button>
            </div>
            <div id="moderatorPanel">
            <div id = "functionalElements" >
                <div id="moderatorPanelButtons">
                    <button class="moderatorButton" @click = "findNewOrders()">New <span class="newOrders-count">{{ newOrdersAmount }}</span></button>
                    <button class="moderatorButton" @click = "fetchOrders()">All</button>
                    <button  class="moderatorButton" :class="sortButtonClass" @click="toggleSortDirection()">Date</button>
                   <a href = "/manage/comments"><button class="moderatorButton">Коментарі</button></a>
                </div>
                <div class="selectStatusWrapper" name="selectOption" @change = "findByStatus($event.target.value)">
                        <label for="selectOption">Status:</label>
                        <select id="selectOption" class="moderatorSelect">
                            <option selected disabled>Select</option>
                            <option>PENDING</option>
                            <option>PROCESSING</option>
                            <option>SHIPPED</option>
                            <option>DELIVERED</option>
                            <option>CANCELLED</option>
                            <option>All</option>
                        </select>
                </div>
            </div>
                
            <div id = "orderDisplayPanel">
       
                <div class="orderRecord"  v-for="(order, index) in paginatedOrders" :key="index">
                    <div>
                        <p>
                            {{ order.id }}. <span class="customerName">Ім'я: {{ order.customerName }}</span>
                            <span class="customerName">Прізвище: {{ order.customerSecondName }}</span>
                            <span class="customerName">По-батькові: {{ order.customerLastName }}</span>
                        </p>

                        <p><span class="label">Місто:</span> <span class="value">{{ order.cityToDeliver }}</span></p>
                        <p><span class="label">Відділення:</span> <span class="value">{{ order.postOfficeToDeliver }}</span></p>
                        <p><span class="label">Статус:</span> <span class="value">{{ order.status }}</span></p>
                        <p><span class="label">Ціна:</span> <span class="value">{{ order.totalCost }} ₴</span></p>
                        <label for="selectOption">Statuses:</label>
                        <select  class="selectOption" name="changeStatus" @change = "handleChangeStatusOrder(index, $event.target.value)">
                            <option selected disabled>Select</option>
                            <option>PENDING</option>
                            <option>PROCESSING</option>
                            <option>SHIPPED</option>
                            <option>DELIVERED</option>
                            <option>CANCELLED</option>
                        </select>

                        <div class="orderDate">
                            <p><span class="label">Дата:</span> <span class="value">{{ formatDate(order.date) }}</span></p>
                             <p><span class="label">Час:</span> <span class="value">{{ formatTime(order.date) }}</span></p>
                        </div>
                    </div>

                    <div class="orderedProducts">
                        <button @click="findOrderedProductsByOrderId(order.id)" class ="showOrderedProductsButton">Товари</button>
                        <button @click="deleteOrder(order.id)" class = "deleteButton">X</button>
                        <div v-if="orderedProducts[order.id] && orderedProducts[order.id].length !== 0" id="productsInOrderDisplayPanel">
                            <div >
                                <div v-for="(record, index) in orderedProducts[order.id]" :key="index" class="productRecord">
                                    <div class="productInfo">
                                        <span class="productId">ID: {{ record.product.id }}</span>
                                        <span class="productName">{{ record.product.productName }}</span>
                                        <span class="productQuantity">x{{ record.quantity }}</span>
                                        <span class="productPrice">{{ record.product.price * record.quantity }}₴</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                                    
                </div>
             
               
            </div>
         
            </div>
            <div class="pagination">
                <button @click="previousPage" :disabled="currentPage === 1">Previous</button>
                <button @click="nextPage" :disabled="currentPage * pageSize >= orders.length">Next</button>
            </div>
          
        </div>
        <footer-page></footer-page>
    </div>
</template>

<script>
import HeaderPage from '../../PageHeader.vue';
import FooterPage from '../../PageFooter.vue';
import axiosInstance from '@/axious-conf';

export default {
    name: "ModeratorPageMain",
    components: {
        HeaderPage,
        FooterPage,
    },
    data(){
        return {
            orders:[],
            currentPage: 1,
            pageSize: 5,
            newOrdersAmount:0,
            sortDirection: 'asc',
            orderedProducts:[],
            searchFieldInputText:null,
        }
    },
    computed :{
        paginatedOrders() {
            if (!this.orders) {
            return [];
        }
        const startIndex = (this.currentPage - 1) * this.pageSize;
        const endIndex = startIndex + this.pageSize;
        return this.orders.slice(startIndex, endIndex);
    },
    sortButtonClass() {
        return this.sortDirection === 'asc' ? 'asc' : 'desc';
    },
    },
    mounted(){
        this.fetchOrders();
        this.findNewOrders();
    },
    methods:{
        async fetchOrders() {
        try {
             await this.$store.dispatch('GET_ALLORDERS');
            this.orders = this.$store.getters.costumersOrders;
            this.sortOrdersByDate();
        } catch (error) {
            console.error('Ошибка при загрузке заказов: ', error);
        }
    },
    previousPage() {
        if (this.currentPage > 1) {
            this.currentPage--;
        }
    },
    nextPage() {
        const lastPage = Math.ceil(this.orders.length / this.pageSize);
        if (this.currentPage < lastPage) {
            this.currentPage++;
        }
    },
    formatDate(timestamp) {
        const date = new Date(timestamp);
        return date.toLocaleDateString();
    },
    formatTime(timestamp) {
        const time = new Date(timestamp);
        return time.toLocaleTimeString();
    },
    handleChangeStatusOrder(index, status) {
    let order_id = this.orders[index].id;
    let formData = new FormData();
    formData.append('order_id', order_id);
    formData.append('status', status);
    axiosInstance.post('/orders/change/status', formData, {
        headers: {
            'Content-Type': 'multipart/form-data' 
        }
    }).then(() => {
        this.paginatedOrders[index].status = status;
    });
    },
    async findByStatus(status){
        try {
            if(status==="All"){
                this.fetchOrders();
                return;
            }
            const response = await axiosInstance.get(`/orders/${status}`);
            this.orders = response.data;

        } 
        catch (error) {
            console.error('Error fetching orders:', error);
        }
    },
    findNewOrders() {
        try {
            this.findByStatus("PENDING").then(() => {
                this.newOrdersAmount = this.orders.filter(order => order.status === "PENDING").length;
            });
        } catch (error) {
            console.error('Error fetching new orders:', error);
        }
    },

    sortOrdersByDate() {
        if (this.sortDirection === 'asc') {
            this.orders.sort((a, b) => new Date(a.date) - new Date(b.date));
        } else {
            this.orders.sort((a, b) => new Date(b.date) - new Date(a.date));
        }
    },

    toggleSortDirection() {
            this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
            this.sortOrdersByDate();
    },  
    async findOrderedProductsByOrderId(orderId){
        const self = this;

        try {
            const response = await axiosInstance.get(`/orders/${orderId}/products`);
            const orderedProducts = [];

            response.data.forEach(item => {
                const product = item.product;
                const quantity = item.quantity;

                orderedProducts.push({
                    product: product,
                    quantity: quantity,
                });
            });

            self.orderedProducts[orderId] = orderedProducts;
        } catch (error) {
            console.error('Error fetching ordered products:', error);
        }

        },
        async findOrders(){
            if(this.searchFieldInputText){
                const data = await axiosInstance.get(`/orders/search/${this.searchFieldInputText}`)
                if(data.data.length>0){
                    this.orders = data.data;
                    this.searchFieldInputText = "";
                }
            }
        },
       async deleteOrder(id){
           await axiosInstance.post(`/orders/delete/${id}`);
            this.$router.go(0);
        }
    }
}
</script>
<style scoped>
#moderatorRoot {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
}

#moderatorContent {
    flex: 1;
    padding: 0 10px;
}

#moderatorPanel {
    width: 90%;
    margin: auto;
    margin-top: 2%;
    background-color: #f8f8f8;
    border: 1px solid #ddd;
    border-radius: 10px;
    padding: 20px;
    display: flex;
    flex-direction: column;
}

#moderatorPanelButtons {
    display: flex;
    justify-content: flex-start;
    padding-bottom: 10px;
    border-bottom: 1px solid #ddd;
    flex-wrap: wrap;
}

.moderatorButton {
    background-color: #4CAF50;
    border: none;
    color: white;
    padding: 10px 20px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 16px;
    margin: 5px 2px;
    cursor: pointer;
    border-radius: 5px;
    transition-duration: 0.4s;
}

.deleteButton {
    background-color: #aa5555;
    border: none;
    color: white;
    padding: 10px 20px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 16px;
    margin: 5px 2px;
    cursor: pointer;
    border-radius: 5px;
    transition-duration: 0.4s;
}

.deleteButton:hover {
    background-color: #ce2e2e;
}

.moderatorButton:hover {
    background-color: #45a049;
}

.selectStatusWrapper {
    display: flex;
    flex-direction: column;
    margin-right: 20px;
}

label {
    margin-bottom: 5px;
}

.orderRecord {
    border: 1px solid #ccc;
    padding: 10px;
    margin-bottom: 10px;
    border-radius: 5px;
    background-color: #f9f9f9;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.customerName {
    font-weight: bold;
}

.label {
    font-weight: bold;
}

.moderatorSelect {
    padding: 8px;
    border-radius: 5px;
    border: 1px solid #ccc;
    font-size: 16px;
    width: 150px;
}

#orderDisplayPanel {
    width: 100%;
    margin: auto;
}

.orderRecord p {
    margin: 5px 0;
}

.orderRecord select {
    width: 100%;
    padding: 8px;
    font-size: 14px;
    border: 1px solid #ccc;
    border-radius: 3px;
}

.orderRecord select option {
    background-color: #fff;
    color: #333;
}

.orderRecord select option:hover {
    background-color: #f0f0f0;
}

.orderDate {
    display: flex;
    margin-top: 2%;
    margin-left: 1%;
    border-top: 1px solid #ccc;
}

.orderDate p {
    margin-right: 5%;
}

.pagination {
    margin-top: 20px;
    display: flex;
    justify-content: center;
    text-align: center;
    width: 100%;
    margin: 0 auto;
    margin-bottom: 5%;
}

.pagination button {
    padding: 8px 16px;
    margin: 0 5px;
    border: 1px solid #ccc;
    background-color: #f9f9f9;
    color: #333;
    cursor: pointer;
    border-radius: 4px;
}

.pagination button:hover {
    background-color: #e0e0e0;
}

.newOrders-count {
    background-color: #FF5733;
    color: white;
    padding: 4px 8px;
    border-radius: 50%;
}

.asc::after {
    content: '▲';
}

.desc::after {
    content: '▼';
}

.orderRecord {
    display: flex;
    flex-direction: column;
}

.orderedProducts {
    margin-top: 10px;
}

.orderedProducts button {
    margin-right: 10px;
}

#productsInOrderDisplayPanel {
    margin-top: 10px;
    background-color: #fff;
    padding: 10px;
    border-radius: 5px;
    border: 1px solid #ddd;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.productRecord {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
    padding-bottom: 10px;
    border-bottom: 1px solid #eee;
}

.productRecord:last-child {
    border-bottom: none;
}

.productInfo {
    display: flex;
    justify-content: space-between;
    width: 100%;
}

.productInfo span {
    margin-right: 10px;
}

.productId {
    width: 50px;
}

.productName {
    flex: 1;
}

.productQuantity, .productPrice {
    width: 100px;
    text-align: right;
}

.productPrice {
    font-weight: bold;
    color: #4CAF50;
}

#moderatorPanelButtons {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    padding-bottom: 10px;
    border-bottom: 1px solid #ddd;
}

@media only screen and (min-width: 601px) {
    #moderatorPanel {
        width: 70%;
    }
}

@media only screen and (min-width: 1025px) {
    #moderatorPanel {
        width: 60%;
    }
}

.searchWrapper {
    margin-top: 1%;
    display: flex;
    flex-wrap: wrap;
}

.searchWrapper input {
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 5px;
    font-size: 16px;
    width: calc(100% - 100px);
    margin-right: 10px;
    box-sizing: border-box;
}

.searchWrapper button {
    padding: 8px 16px;
    border: none;
    background-color: #4CAF50;
    color: white;
    border-radius: 5px;
    cursor: pointer;
    width: 80px;
}

.searchWrapper button:hover {
    background-color: #45a049;
}

@media (max-width: 600px) {
    .searchWrapper input,
    .searchWrapper button {
        width: 100%;
        margin-right: 0;
        margin-bottom: 10px;
    }

    .searchWrapper {
        flex-direction: column;
        align-items: center;
    }
}

@media (max-width: 332px) {
    #moderatorPanel {
        width: 100%;
    }

    .moderatorButton, .deleteButton, .showOrderedProductsButton {
        width: 100%;
        margin-bottom: 10px;
        padding: 8px;
    }

    .orderRecord {
        padding: 8px;
    }

    .orderRecord p {
        font-size: 14px;
    }

    .productRecord {
        flex-direction: column;
        align-items: flex-start;
    }

    .productInfo {
        flex-direction: column;
        align-items: flex-start;
    }

    .productInfo span {
        margin-right: 0;
        margin-bottom: 5px;
    }
}
</style>
