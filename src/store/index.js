import { createStore } from 'vuex'; 
import axios from 'axios'; 
import axiosInstance from '../axious-conf.js';

const store = createStore({
    state() {
        return {
            allProducts: null,
            cartItems:[],
            searchedProducts:null,
            searchQuery:null,
            allCategories:null,
            jwtToken: null,
            specificProduct:null,
            specificUser:null,
            allUsers:null,
            authError:null,
            regError:null,
            serchingProductsError:false,
            costumersOrders:null,
        };
    },

    getters: {
        allProducts: state => {
            return state.allProducts;
        },
        allCategories:state =>{
            return state.allCategories;
        },
        searchedProducts:state=>{
            return state.searchedProducts;
        },
        searchError: state =>{
            return state.serchingProductsError;
        },
        allUsers:state=>{
            return state.allUsers;
        },
        regError: state => {
            return state.regError;
        },
        authError: state => {
            return state.authError;
        },
        jwtToken: state=>{
            return state.jwtToken;
        },
        specificProduct: state=>{
            return state.specificProduct;
        },
        specificUser:state=>{
            return state.specificUser;
        },
        currentUserRoles:state=>{
            return state.currentUserRoles;
        },
        cartItems:state=>{
            return state.cartItems;
        },
        cartItemsCount:state=>{
            return state.cartItems.length;
        },
        searchQuery:state=>{
            return state.searchQuery;
        },
        costumersOrders:state=>{
            return state.costumersOrders;
        },
        
    },

    mutations: {
        SET_ALLPRODUCTS(state, payload) {
            state.allProducts = payload;
        },
        SET_ALLUSERS(state,payload){
            state.allUsers = payload;
        },
        SET_REGERROR(state, payload) {
            state.regError = payload;
        },
        SET_AUTHERROR(state, payload) {
            state.authError = payload;
        },
        SET_JWTTOKEN(state,payload){
            if (payload.jwt) {
                localStorage.setItem('jwtToken', payload.jwt);
            }
            
            if (payload.email) {
                localStorage.setItem('emailUser', payload.email);
            }
            
            if (payload.roles) {
                localStorage.setItem('userRoles', payload.roles);
            }
            
            if (payload.user_id) {
                localStorage.setItem('user_id', payload.user_id);
            }
            
            if (payload.jwt) {
                state.jwtToken = payload.jwt;
            }
        },
        SET_SPECIFICPRODUCT(state,payload){
            state.specificProduct = payload;
        },
        SET_SPECIFICUSER(state,payload){
            state.specificUser = payload;
        },
        SET_SEARCHEDPRODUCTS(state,payload){
            state.searchedProducts = payload;
        },
        SET_SEARCHEDQUERY(state,payload){
            state.searchQuery = payload;
        },
        SET_ALLCATEGORIES(state,payload){
            state.allCategories = payload;
        },
        SET_CARTITEM(state,payload){
            state.cartItems.push(payload)
            localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
        },
        REMOVE_FROM_CART: (state, index) => {
            state.cartItems.splice(index, 1);
            localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
        },
        LOAD_CART_FROM_STORAGE: (state) => {
            const cartItemsStorage = localStorage.getItem('cartItems');
            if (cartItemsStorage) {
              state.cartItems = JSON.parse(cartItemsStorage);
            }
        },
        SET_COSTUMERSORDERS(state,payload){
            state.costumersOrders = payload;
        }
    },
    
    actions: {
        async authenticate(context, { email, password }) {
            try {
                const { data } = await axiosInstance.post('/signin', {
                    email,
                    password
                }, {
  
                });
      
                const jwtToken = data.token;
                context.commit('SET_JWTTOKEN', { jwt: jwtToken, email: email, roles: data.roles, user_id: data.user_id });
                context.commit('SET_AUTHERROR', null);
        
            } catch (error) {
                console.error('Authentication error:', error);
                context.commit('SET_AUTHERROR', "authError");
            }
        },
        async register(context,{
            username,
            email,
            password

        }){
            try {
                const { data } = await axiosInstance.post('/registration', {
                    username,
                    email,
                    password
                });
                const jwtToken = data.token; 
                context.commit('SET_JWTTOKEN', {jwt:jwtToken,email:email,roles:data.roles,user_id:data.user_id});
                context.commit('SET_REGERROR', null);
            } catch (error) {
                if (error.response.status === 400) {
                    context.commit('SET_REGERROR', "user has already exists");
                }
            
            }
        },
        async GET_ALLPRODUCTS(context) {
            try {
                const { data } = await axiosInstance.get('/home');
                context.commit('SET_ALLPRODUCTS', data);
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        },
        async GET_SPECIFICPRODUCT(context,id) {
            try {
                const { data } = await axiosInstance.get(`/products/id/${id.id}`)
                context.commit('SET_SPECIFICPRODUCT', data);
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        },
        async GET_SEARCHEDPRODUCTS(context, { name }) {
            try {
                const { data } = await axiosInstance.get(`/products/${name}`);
                if (data && data.length > 0) {
                    context.state.serchingProductsError = false;
                } else {
                    context.state.serchingProductsError = true;
                }
                context.commit('SET_SEARCHEDPRODUCTS', data);
                context.commit('SET_SEARCHEDQUERY',name);
                return data;
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        },
        async GET_ALLUSERS(context) {
            try {  
               const { data } = await  axiosInstance.get(`/users/all`)
               context.commit('SET_ALLUSERS', data);
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        },
        async GET_SPECISICUSER(context,param) {
            try {  
               const { data } = await  axiosInstance.get(`/user/${param.name}`)
               context.commit('SET_SPECIFICUSER', data);
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        },
        async GET_ALLCATEGORIES(context){
            try {  
                const { data } = await  axiosInstance.get(`/category/getAll`)
                context.commit('SET_ALLCATEGORIES', data);
             } catch (error) {
                 console.error('Error fetching products:', error);
             }
        },
        ADD_ITEM_TO_CART(context,item){
            context.commit('SET_CARTITEM',item);
        },
        REMOVE_FROM_CART: (context,index) => {
            context.commit('REMOVE_FROM_CART', index);
        },
        async loadCartFromStorage (context) {
            context.commit('LOAD_CART_FROM_STORAGE');
        },
        async GET_ALLORDERS(context){
            try{
                const {data}  = await axiosInstance('/orders/All');
                context.commit('SET_COSTUMERSORDERS', data);
            }
            catch(error){
                console.log(error);
            }
        }
    },
});


export default store; 
