<template>
  <div id="PersonalAccountRoot">
    <page-header></page-header>
    <div class="contentAccountRoot">
      <div id="errorMessageDisplayPanel" v-if="accessDeniedMessage">
        <h2>{{ accessDeniedMessage }}</h2>
        <i class="emo bi bi-emoji-frown"></i>
      </div>

      <div id="userInfoDisplayPanel" v-if="currentUser">
        <div id="userAccountImgPanel">
          <img src="../../../assets/logoAcc.png" alt="User Account Image" id="userAccountImg">
        </div>
        <div class="userDetails">
          <p><span class="label">Username:</span> <span class="value">{{ currentUser.username }}</span></p>
          <p><span class="label">Email:</span> <span class="value">{{ currentUser.email }}</span></p>
          <p><span class="label">Created At:</span> <span class="value">{{ formattedCreatedAt }}</span></p>
          <div>
            <div class="label">Roles:</div>
            <span class="authorities" v-for="role in currentUser.roles" :key="role.id">{{ role.name }}</span>
          </div>
        </div>
      </div>

      <div id="userOrderHistory" v-if="currentUser">
        <h3>History orders</h3>
        <div class="orderRecord" v-for="(order, index) in paginatedOrders" :key="index">
          <p>{{ order.id }}. {{ order.customerName }} {{ order.customerSecondName }} {{ order.customerLastName }}</p>
          <p><span class="label">Місто:</span> <span class="value">{{ order.cityToDeliver }}</span></p>
          <p><span class="label">Відділення:</span> <span class="value">{{ order.postOfficeToDeliver }}</span></p>
          <p><span class="label">Статус:</span> <span class="value">{{ order.status }}</span></p>
          <p><span class="label">Ціна:</span> <span class="value">{{ order.totalCost }} ₴</span></p>
        </div>
        <div class="pagination">
          <button @click="prevPage" :disabled="currentPage === 1" class="pageBtn">Previous</button>
          <span>Page {{ currentPage }} of {{ totalPages }}</span>
          <button @click="nextPage" :disabled="currentPage === totalPages" class="pageBtn">Next</button>
        </div>
      </div>
    </div>
    <page-footer></page-footer>
  </div>
</template>

<script>
import axiosInstance from '@/axious-conf';
import PageFooter from '@/components/PageFooter.vue';
import PageHeader from '@/components/PageHeader.vue';

export default {
  name: "PersonalAccount",
  components: {
    PageFooter,
    PageHeader,
  },
  data() {
    return {
      accessDeniedMessage: null,
      currentUser: null,
      userOrders: [],
      currentPage: 1,
      pageSize: 3,
    };
  },
  computed: {
    totalPages() {
      return Math.ceil(this.userOrders.length / this.pageSize);
    },
    paginatedOrders() {
      const start = (this.currentPage - 1) * this.pageSize;
      const end = start + this.pageSize;
      return this.userOrders.slice(start, end);
    },
    formattedCreatedAt() {
      return this.currentUser.createdAt.slice(0, 16);
    }
  },
  mounted() {
    this.fetchUser();
  },
  methods: {
    async fetchUser() {
      try {
        const current_user_id = localStorage.getItem("user_id");
        const response = await axiosInstance.get(`http://localhost:8086/users/accounts/${current_user_id}`);
        if (response.status === 200 && response.data) {
          this.currentUser = response.data;
          const ordersByUser = await axiosInstance.get(`http://localhost:8086/users/${current_user_id}/orders`);
          this.userOrders = ordersByUser.data;
        } else {
          this.accessDeniedMessage = "Access Denied";
        }
      } catch (error) {
        this.accessDeniedMessage = "An error occurred while fetching user data";
        console.error("Error fetching user data:", error);
      }
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
      }
    }
  }
};
</script><style scoped>
#PersonalAccountRoot {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.contentAccountRoot {
  flex: 1;
  padding: 20px;
  box-sizing: border-box;
}

#errorMessageDisplayPanel h2 {
  color: rgb(214, 78, 78);
}

.emo {
  width: 20%;
  height: 20%;
}

#userInfoDisplayPanel {
  display: flex;
  justify-content: center;
  margin-top: 2%;
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

#userAccountImgPanel {
  flex-shrink: 0;
}

#userAccountImg {
  height: 80%;
  width: 50%;
  border-radius: 30%;
  object-fit: fill;
  border: 3px solid #ccc;
}

.userDetails {
  flex-grow: 1;
  margin-left: 20px;
}

.userDetails p {
  margin: 10px 0;
}

.label {
  font-weight: bold;
  color: #555;
}

.value {
  margin-left: 10px;
  color: #777;
}

.authorities {
  display: inline-block;
  margin-right: 5px;
  background-color: #f0f0f0;
  padding: 3px 8px;
  border-radius: 3px;
}

#userOrderHistory {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 20px;
  margin-top: 20px;
}

.orderRecord {
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
}

.orderRecord p {
  margin: 5px 0;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
}

.pageBtn {
  margin: 0 5px;
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
  background-color: #007bff;
  color: #fff;
  cursor: pointer;
  transition: background-color 0.3s, color 0.3s;
}

.pageBtn:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.pageBtn:not(:disabled):hover {
  background-color: #0056b3;
}

/* Новые адаптивные стили */
@media (max-width: 1070px) {
  #userInfoDisplayPanel {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  #userAccountImg {
    width: 80%;
    height: auto;
    margin-bottom: 20px;
  }

  .userDetails {
    margin-left: 0;
    width: 100%;
    box-sizing: border-box;
    padding: 0 10px;
  }

  .userDetails p {
    word-wrap: break-word;
  }
}

@media (max-width: 768px) {
  #userInfoDisplayPanel {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  #userAccountImg {
    width: 80%;
    height: auto;
    margin-bottom: 20px;
  }

  .userDetails {
    margin-left: 0;
  }

  .orderRecord {
    font-size: 14px;
  }

  .pagination {
    flex-direction: column;
  }

  .pageBtn {
    width: 100%;
    margin: 10px 0;
  }
}

@media (max-width: 480px) {
  .contentAccountRoot {
    padding: 10px;
  }

  .label, .value {
    display: block;
    margin: 5px 0;
  }

  .authorities {
    display: block;
    margin: 5px 0;
  }
}
</style>
