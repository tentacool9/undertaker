<template>
<div>
<nav class="navbar">
  <div class="navbar-brand"  style="background-color: #4ce0d7">
    <a style="background-color: #4ce0d7; padding-bottom: 10px; padding-top: 10px; padding-left: 10px; padding-right: 10px"  >
      <img src="./assets/logotemp.png" style="background-color: #4ce0d7;  "  alt="Bulma: a modern CSS framework based on Flexbox" width="30" height="30">
    </a>
    <div class="navbar-burger burger" style="background-color: #4ce0d7; font-size: 10px">
      <div>
      <a style="margin-bottom: 0px; margin-top: 0px" class="navbar-item" href="/"> <router-link  class="nav-link has-text-black" to="/">Reports</router-link> </a> 
      <a class="navbar-item"> <router-link  class="nav-link has-text-black " to="/Export">Export</router-link> </a> 
      </div>
    </div>
  </div>

  <div id="navbarExampleTransparentExample" class="navbar-menu " style="background-color: #4ce0d7">
    <div class="navbar-start">
      <a class="navbar-item" href="/"> <router-link  class="nav-link has-text-black" to="/">Reports</router-link> </a> 
      <a class="navbar-item"> <router-link  class="nav-link has-text-black " to="/Export">Export</router-link> </a> 
    </div>
  </div> 
</nav>
    <br>
    <router-view transition="slide-left" class="application"/>

 
  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'

export default {
  name: 'app',
  components: {

  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
} 
a {
  color: "#fff" !important
}
</style>
