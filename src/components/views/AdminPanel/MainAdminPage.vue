<template>
    <div id="app">
    <page-header></page-header> 
    <div class="input-group mb-3">
        <div class="input-group-prepend">
            <span class="input-group-text" id="basic-addon1">@</span>
        </div>
        <input type="text" class="form-control" placeholder="Username" aria-label="Username" aria-describedby="basic-addon1" v-model="searchQuery">
        <button class="button" @click="findUser">Find</button>
    </div>

    <div id="content">
        <div class="button-container">
            <router-link to="/privileged/products/main">
                <button class="button"><i class="bi bi-bag-dash-fill"></i>products</button>
             </router-link>

             <router-link to="/manage/categories">
                <button class="button"><i class="bi bi-bag-dash-fill"></i>categories</button>
             </router-link>

             <router-link to="/statistics">

                 <button class="button"><i class="bi bi-percent"></i>statistcs</button>
            </router-link>
        </div>
        <h3 v-if="error">{{ error }}</h3>
        <div id="userDisplayPanel">
            <div v-for="user in paginatedUsers" :key="user.id">
                <div class ="userItem">
                    {{ user.id }}
                    -
                    {{ user.username }}
                  <div class="usersButtons">
                    <button class="button" @click="deleteUser(user.id)">delete</button>
                    <button class="button" @click="banUser(user.id)" v-if="user.accountNonLocked">ban</button>
                    <button class="button" @click="unBanUser(user.id)" v-else>unban</button>


                    <button class="buttonDeleteRight"  @click="deleteRole(user.id,'ROLE_ADMIN')" v-if="checkUserRole(user, 'ROLE_ADMIN')">admin</button>
                    <button class="buttonGiveRight" @click="giveRole(user.id,'ROLE_ADMIN')" v-else >admin</button> 
                    
                    
                    <button class="buttonDeleteRight"  @click="deleteRole(user.id,'ROLE_MODERATOR')" v-if="checkUserRole(user, 'ROLE_MODERATOR')">moderator</button>
                    <button class="buttonGiveRight"  @click="giveRole(user.id,'ROLE_MODERATOR')" v-else>moderator</button>
                 </div>
              </div>
          </div>
          
          <button @click="prevPage" class="buttonSwipe"><i class="bi bi-arrow-bar-left"></i>Previous</button>
          <button @click="nextPage" class="buttonSwipe">Next<i class="bi bi-arrow-bar-right"></i></button>

        </div>
        

    </div>
    <page-footer></page-footer>
    </div>

</template>

<script>
import PageHeader from '../../PageHeader.vue';
import PageFooter from '../../PageFooter.vue';
import axiosInstance from '../../../axious-conf.js';

import 'bootstrap-icons/font/bootstrap-icons.css';
export default {
  name: 'App',
  components: {
    PageHeader,
    PageFooter,
 
  },
  data() {
    return {
        users:null,
        currentPage: 1, 
        itemsPerPage: 10,
        error:"",
        searchQuery:"",

    };
  },
  computed: {
    Users() {
        return this.$store.getters.allUsers;
    },
    paginatedUsers() {
          if (!this.users) {
          return [];
        }
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        return this.users.slice(startIndex, endIndex);
    },
    totalPages() {
         return Math.ceil(this.users.length / this.itemsPerPage);
    }
  },
  mounted() {
    this.fetchUsers();

  },
  methods: {
    fetchUsers() {
      this.$store.dispatch('GET_ALLUSERS')
      .then(() => {
        this.users= this.$store.getters.allUsers;
      })
      .catch((error) => {
        console.error('Error fetching product:', error);
      });
 
    },
    async deleteUser(userId){
      try{
        await axiosInstance.post(`/users/delete/${userId}`)
        this.$router.go();
      }
      catch(error){
        this.error = "Delete user error!!!"
      }

    },
    async banUser(userId){
      await axiosInstance.post(`/users/ban/${userId}`)
        this.$router.go();
    },
    async unBanUser(userId){
        await axiosInstance.post(`/users/unban/${userId}`)
        this.$router.go();
    },
    async giveRole(id,role){
      await axiosInstance.post(`/users/giveRights/${id}/${role}`)
      this.$router.go();
    },
    async deleteRole(id,role){
      await axiosInstance.post(`/users/deleteRights/${id}/${role}`)
      this.$router.go();
    },
   async findUser(){
      if(this.searchQuery){
        const {data} = await axiosInstance.post(`/users/${this.searchQuery}`)
        this.users = data;
      }
    },
    checkUserRole(user, role) {
      return user.roles.some(userRole => userRole.name === role);
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
    }

  }

}
</script>

<style scoped>
h3{
  color: red;
} 

#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh; 
}

#content {
    flex: 1;
    padding: 0 10px;
}
.usersButtons .button{
  background-color: #4489c9; 
    border: none;
    color: white;
    padding: 15px 32px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 16px;
    border-radius: 5px;
    margin:1%;
}
.buttonGiveRight{
  background-color: #e2512d; 
    border: none;
    color: white;
    padding: 15px 32px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 16px;
    border-radius: 5px;
    margin:1%;
}
.usersButtons .buttonDeleteRight{
  background-color: #5af367; 
    border: none;
    color: white;
    padding: 15px 32px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 16px;
    border-radius: 5px;
    margin:1%;
}
.buttonSwipe{
    background-color: #5b99cc; 
    border: none;
    color: white;
    padding: 15px 32px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 16px;
    border-radius: 5px;
    margin: 1%;
    margin-right: 40%;
  }

.button:hover{
  background-color: #2772af; 
}

.button-container .button{
  background-color: #5b99cc; 
    border: none;
    color: white;
    padding: 15px 32px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 16px;
    border-radius: 5px;
    margin:1%;
}

.userItem {
    background-color: #b9bebe;
    height: auto;
    width: 100%; 
    margin: 5px 0; 
    display: flex;
    align-items: center;
    justify-content: space-between; 
    padding: 10px; 
    flex-wrap: wrap; 
}

.userItem > * {
    margin-left: 0; 
    margin-bottom: 5px; 
    width: 100%; 
}

#userDisplayPanel {
  margin-left: 0;
}

.input-group {
    width: 100%; 
    margin: auto;
}

.input-group .button {
    width: 100%; 
    margin-top: 5px; 
    background-color: #5b99cc; 
    border: none;
    color: white;
    padding: 15px 32px;
    text-align: center;
    text-decoration: none;
    font-size: 16px;
    border-radius: 5px;
}

.button-container {
    position: static;
    display: flex;
    justify-content: space-around; 
    flex-wrap: wrap; 
}


@media screen and (min-width: 768px) {
 
    .userItem {
        width: 65%; 
    }

    #userDisplayPanel {
        margin-left: 25%; 
    }
}

</style>