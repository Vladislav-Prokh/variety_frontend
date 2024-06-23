<template>
    <div id="CommentDisplayPanelRoot">
      <page-header></page-header>
      <div class="content">
        <div class="commentDisplayPanel">
          <div class="record" v-for="comment in comments" :key="comment.id">
            <div class="comment-header">
              <p class="comment-id">{{ comment.id }}</p>
              <button class="delete-button" @click="deleteComment(comment.id)">X</button>
            </div>
            <div class="comment-body">
              <p class="comment-text">{{ comment.comment }}</p>
              <p class="comment-date">{{ comment.date }}</p>
              <p class="comment-user">{{ comment.user.username }}</p>
              <div class="product-info">
                <span class="product-id">{{ comment.product.id }}</span>
                <span class="product-name">{{ comment.product.productName }}</span>
              </div>
              <div class="comment-read-status">
                <label for="hasRead">Прочитано:</label>
                <input class="hasRead" type="checkbox" @change="toggleReadStatus(comment.id)">
              </div>
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
  import axiosInstance from '../../../axious-conf.js';
  
  export default {
    components: {
      PageHeader,
      PageFooter,
    },
    data() {
      return {
        comments: null,
      };
    },
    mounted() {
      this.fetchComments();
    },
    methods: {
      async fetchComments() {
        const data = await axiosInstance.get(`/comments/find/NonReadByModerator`);
        this.comments = data.data;
      },
      async deleteComment(id) {
        await axiosInstance.post(`/comments/delete/${id}`);
        this.fetchComments();
      },
      async toggleReadStatus(id) {
        await axiosInstance.post(`/comments/changeStatusToRead/${id}`);
        this.fetchComments();
        }
    }
  }
  </script>
  
  <style scoped>
  #CommentDisplayPanelRoot {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    background-color: #f5f5f5;
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  }
  
  .content {
    flex: 1;
    padding: 20px;
  }
  
  .commentDisplayPanel {
    background-color: #ffffff;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    padding: 20px;
  }
  
  .record {
    border-bottom: 1px solid #e0e0e0;
    padding: 10px 0;
  }
  
  .comment-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .comment-id {
    font-weight: bold;
    color: #333;
  }
  
  .delete-button {
    background-color: #ff6b6b;
    border: none;
    border-radius: 50%;
    color: #fff;
    cursor: pointer;
    font-size: 16px;
    height: 24px;
    width: 24px;
    position:relative;
  }
  
  .comment-body {
    margin-top: 10px;
  }
  
  .comment-text {
    font-size: 14px;
    color: #555;
  }
  
  .comment-date {
    font-size: 12px;
    color: #888;
  }
  
  .comment-user {
    font-size: 14px;
    font-weight: bold;
    color: #333;
  }
  
  .product-info {
    margin-top: 10px;
    display: flex;
    gap: 10px;
  }
  
  .product-id {
    font-size: 12px;
    color: #999;
  }
  
  .product-name {
    font-size: 14px;
    color: #333;
  }

  .comment-read-status {
  margin-top: 10px;
  display: flex;
  align-items: center;
}

.hasRead {
  margin-left: 10px;
}
  </style>
  