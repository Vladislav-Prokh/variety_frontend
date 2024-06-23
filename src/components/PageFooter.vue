<template>
    <div>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
      <link rel="preconnect" href="https://fonts.gstatic.com">
      <link href="https://fonts.googleapis.com/css2?family=Fredoka+One&family=Play&display=swap" rel="stylesheet"> 
  
      <footer>
        <div class="footer">
          <div class="row horizontal-icons">
            <a href="#"><i class="fa fa-facebook"></i></a>
            <a href="#"><i class="fa fa-instagram"></i></a>
            <a href="#"><i class="fa fa-youtube"></i></a>
            <a href="#"><i class="fa fa-twitter"></i></a>
          </div>
  
          <div class="row">
            <ul>
              <li><a href="#">Contact us</a></li>
              <li><a href="#">Our Services</a></li>
              <li><a href="#">Privacy Policy</a></li>
              <li><a href="#">Terms & Conditions</a></li>
              <li><a href="#">Career</a></li>
            </ul>
          </div>
  
          <div class="row center-text">
            Variety © 2024 Shop - All rights reserved 
          </div>
        </div>
      </footer>
    </div>
  </template>
  
  <script>
  export default {
 
  }
  </script>
  
  <style scoped>
 
  body {
    margin: 0;
    overflow-x: hidden;
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }
  
  .footer {
    background: #514e71;
    padding: 30px 0px;
    font-family: 'Play', sans-serif;
    text-align: center;
    margin-top: auto; 
  }
  
  .footer .row {
    width: 100%;
    margin: 1% 0%;
    padding: 0.6% 0%;
    color: black;
    font-size: 0.8em;
  }
  
  .footer .row a {
    text-decoration: none;
    color: black;
    transition: 0.5s;
  }
  
  .footer .row a:hover {
    color: #fff;
  }
  
  .footer .row ul {
    width: 100%;
    display: flex;
    justify-content: center;
  }
  
  .footer .row ul li {
    margin: 0 15px;
  }
  
  .footer .row a i {
    font-size: 2em;
    margin: 0 1%;
  }
  
  .footer .row.center-text {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  
  .footer .row.horizontal-icons {
    display: block;
    justify-content: center;
  }
  
  .footer .row.horizontal-icons a {
    margin: 0 15px;
  }
  
  @media (max-width: 720px) {
    .footer {
      text-align: left;
      padding: 5%;
    }
  
    .footer .row ul {
      justify-content: flex-start;
    }
  
    .footer .row ul li {
      display: block;
      margin: 10px 0px;
      text-align: left;
    }
  
    .footer .row a i {
      margin: 0% 3%;
    }
  
    .footer .row.horizontal-icons {
      display: block;
      justify-content: center;
      margin: auto;
    }
  }
  </style>
  