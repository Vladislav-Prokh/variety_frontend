import { createWebHistory, createRouter } from 'vue-router';
import Home from './components/views/HomePage.vue';
import LoginPage from './components/views/Auth/LoginPage.vue'
import RegPage from './components/views/Auth/RegistrationPage.vue'
import SpecificProduct from './components/views/SpecificProduct.vue'
import AdminPanel from './components/views/AdminPanel/MainAdminPage.vue'
import ProductAddPage from './components/views/productsManager/AddProductPage.vue';
import productManageMainPage from './components/views/productsManager/ProductManegerPage.vue'
import OrderPanel from './components/views/Order/OrderPanel.vue';
import ProductCart from "./components/views/Order/ProductCart.vue";
import ContactUsPage from "./components/views/Pages/ContactUs.vue";
import AboutUsView from './components/views/Pages/AboutUs.vue';
import ThankPage from './components/views/Order/OrderSuccess.vue';
import ModeratorPage from './components/views/ModeratorPanel/MainModeratorPage.vue';
import StatComponent from './components/views/AdminPanel/statisticPages/StatisticPage.vue'
import UserAccountPage from './components/views/Auth/PersonalAccount.vue';
import ConfirmEmailMsg from './components/views/Auth/ConfirmEmailMsg.vue';
import ConfirmEmailSeccessMsg from './components/views/Auth/ConfirmEmailSuccessMsg.vue';
import CategoriesManager from './components/views/productsManager/CategoriesManagerPage.vue';
import CommentDisplayPanel from '././components/views/ModeratorPanel/CommentsDisplayPanel.vue';
import UpdateProductPanel from './components/views/AdminPanel/UpdateProductInfo.vue';
import GoogleAuthSuccessRedirect from './components/views/Auth/AuthSuccesRedirect.vue';

const routes = [
  { path: '/', component: Home },
  { path: '/home', component: Home },
  { path: '/login', component: LoginPage },
  { path: '/registration', component: RegPage },
  { path: '/products/:id', component: SpecificProduct },
  { path: '/privileged/products/add', component: ProductAddPage ,meta: { roles: ['ROLE_ADMIN'] }  },
  { path: '/privileged/products/main', component:productManageMainPage ,meta: { roles: ['ROLE_ADMIN'] } },
  { path: '/privileged/products/update/:id', name: 'updateProductPanel', component: UpdateProductPanel ,meta: { roles: ['ROLE_ADMIN'] } },
  { path: '/admin', component: AdminPanel, meta: { roles: ['ROLE_ADMIN'] } },
  { path: '/statistics', component: StatComponent, meta: { roles: ['ROLE_ADMIN'] } },
  { path: '/moderator', component: ModeratorPage ,meta: { roles: ['ROLE_MODERATOR','ROLE_ADMIN'] }},
  { path: '/order', component: OrderPanel,props: true },
  { path: '/cart', component: ProductCart },
  { path: '/contactUs', component: ContactUsPage },
  { path: '/about', component: AboutUsView },
  { path: '/succeedOrder/:orderId', name: 'succeedOrder', component: ThankPage },
  { path: '/users/accounts', name: 'UserAccountPage', component: UserAccountPage },
  { path: '/confirm-email/:email', name: 'confirm-email-msg', component: ConfirmEmailMsg },
  { path: '/confirm-email/success/:token', name: 'confirm-email-success-msg', component: ConfirmEmailSeccessMsg },
  { path: '/manage/categories', name: 'categoriesManager', component: CategoriesManager,  meta: { roles: ['ROLE_ADMIN'] }},
  { path: '/manage/comments', name: 'commentsManager', component: CommentDisplayPanel, meta: { roles: ['ROLE_MODERATOR','ROLE_ADMIN'] } },
  { path: '/auth/google/success', name: 'GoogleRedirect', component: GoogleAuthSuccessRedirect },

];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

function getCurrentUserRoles() {
  const rolesString = localStorage.getItem("userRoles");
  if (!rolesString) return [];
  return rolesString.split(','); 
}


router.beforeEach((to, from, next) => {
  const userRoles = getCurrentUserRoles();
  const requiredRoles = to.meta.roles;

  if (requiredRoles) {
    const hasAccess = requiredRoles.some(role => userRoles.includes(role));
    if (!hasAccess) {
      return next('/login');
    }
  }
  next();
});







export default router;