<template>
<div class="home container">

 <div class="card" style="margin-bottom: 30px" v-for="data in systems" v-bind:key="data.ip">
  <header class="card-header" v-bind:class="{ 'idle': (data.state == 'Idle'), 'warning': (data.state == 'Suspicous') }" >
    <p class="card-header-title">
      {{data.name}} 
    </p>
  </header>
  <div class="card-content">
    <div class="content">
      <div><span style="font-weight: 700">MAC: </span> <span>{{data.mac}}</span></div>
      <div><span style="font-weight: 700">IP: </span> <span>{{data.ip}} </span></div>
      <div><span style="font-weight: 700">STATE: </span> <span>{{data.state}} </span></div>
      <div><span style="font-weight: 700">TAG: </span> <span>{{data.type}} </span></div>
    </div>
  </div>
  <footer class="card-footer">
    <a href="#" class="card-footer-item">Stats</a>
    <a href="#" class="card-footer-item">Configure</a>
    <a href="#" class="card-footer-item">Add to </a>
  </footer>
</div>
</div>
</template>

<script>

export default {
    
  name: 'Home',

  components: {
   
  },
  data()  {
      return {
        systems: require('../../datanew.json')
      }
  },
    
  methods: {
    change: function(location) {

    }
  },

  mounted() {
    
  }
}
</script>
<style>
.warning {
  background-color: #fffc94
}
.idle {
  background-color: #ff9494
}

</style>