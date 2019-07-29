<template>
<div class="home container">

 <div class="card" style="margin-bottom: 30px" v-for="data in systems" v-bind:key="data.ip">
  <header class="card-header" v-bind:class="{ 'idle': (data.state == 'Idle'), 'warning': (data.state == 'Suspicous') }"  >
    <p class="card-header-title" >
      {{data.name}} 
    </p>
    <div @click="opendeletemodal(data)" style="margin-top: 5px; margin-right: 10px; font-size: 20px; border-style: solid; border-width: 2px; border-radius: 1000px; padding-left: 10px; padding-right: 10px; padding-top: 0px; padding-bottom: 3px; margin-top: 10px; margin-bottom: 10px">x</div>
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
    <a href="#" class="card-footer-item" @click="openStatModal(data.name)">Stats</a>
    <a href="#" class="card-footer-item" @click="openConfModal(data.name)" >Report Feedback</a>
    <a href="#" class="card-footer-item" @click="exportme(data)">Add to export list</a>
  </footer>
</div>

<!-- statistics modal -->
<div  v-bind:class="{ 'is-active': statModal, 'modal' : true }">
  <div class="modal-background"></div>
  <div class="modal-card">
    <header class="modal-card-head">
      <p class="modal-card-title">Statistics on {{this.selectedSystem}}</p>
      <button class="delete" @click="closeStatModal()"  aria-label="close"></button>
    </header>
    <section class="modal-card-body" style="padding: 30px">
     <highcharts :options="chartOptions"></highcharts>
    </section>

  </div>
</div>
<!-- configuration modal -->
<div  v-bind:class="{ 'is-active': confModal, 'modal' : true }">
  <div class="modal-background"></div>
  <div class="modal-card">
    <header class="modal-card-head">
      <p class="modal-card-title">{{this.selectedSystem}} Report Feedback</p>
      <button class="delete" @click="closeConfModal()"  aria-label="close"></button>
    </header>
    <section class="modal-card-body" style="padding: 30px">
      <div class="control">
    
        <div class="control">  
        <div style="display: inline-flex; margin-left: 40px; margin-top: -5px" class="select">
          <select>
            <option>Not Classified</option>
            <option>Storage Server</option>
            <option>Application Server</option>
            <option>Exchange Server</option>
            <option>Web Server</option>
            
          </select>
        </div>
        <div style="display: inline-flex; margin-left: 60px; margin-top: 100 px" class="control">
          <div class="buttons has-addons">
              <div class="field">
              <b-switch  type="is-black" @click="addtowhitelist(this.selectedSystem)">Suspend alerts for this machine</b-switch>
              </div>
         </div>
        </div>
        </div>
        
        <div class="control" style="margin-top: 20px">
          <h2 style="display: inline-flex; margin-left: 40px">Please confirm state of machine:</h2>
        <a class="button is-success" style="margin-left: 63px">Approve</a>
        <a class="button is-danger" style="margin-left: 10px;">Deny</a>
        </div>

      </div>
    </section>
<footer class="modal-card-foot" style="padding-left: 210px">
      <button class="button is-success" @click="closeConfModal()">Save changes</button>
      <button class="button">Cancel</button>
    </footer>
  </div>
      
</div>
<!-- confirm -->
  <div v-bind:class="{ 'is-active': this.delModal, 'modal' : true }" >
  <div class="modal-background"></div>
  <div class="modal-card">
    <header class="modal-card-head">
      <p class="modal-card-title">Confirmation</p>
      <button class="delete" aria-label="close" @click="closedeletemodal()"></button>
    </header>
    <section class="modal-card-body" style="text-align: center">
    <h1>Are you sure you want to delete this report?</h1>
    </section>
    <footer class="modal-card-foot" style="padding-left: 242px">
      <button class="button is-success" @click="deletethis()">Delete</button>
      <button class="button" @click="closedeletemodal()">Cancel</button>
    </footer>
  </div>
</div>
</div>
</template>

<script>
import {Chart} from 'highcharts-vue'
import Highcharts from 'highcharts'
import exportingInit from 'highcharts/modules/exporting'
import Vue from 'vue'
import Buefy from 'buefy'
import 'buefy/dist/buefy.css'

Vue.use(Buefy)

exportingInit(Highcharts)
export default {
    
  name: 'Home',

  components: {
   highcharts: Chart 
  },
  data()  {
      return {
      systems: require('../../datanew.json'),
      chartOptions: {
        title: {
            text: 'Server statistics'
        },
        xAxis: {
            title: {
                text: 'Time'
            }
        },
        series: [{
          name: 'CPU Usage',
          data: [1,2,3,2,1,5] // sample data  
        },
        {
          name: 'Disk Throughput',
          data: [1,6,2,4,3,3] // sample data  
        },
        {
          name: 'Network',
          data: [1,4,3,5,1,5] // sample data  
        },
        {
          name: 'Memory Usage',
          data: [2,1,0,10,4,5] // sample data  
        },
        ],
        yAxis: {
            title: {
                text: 'Performance'
            }
        },
      },
      statModal: false,
      confModal: false,
      selectedSystem: null,
      delModal: false
      }
  },
    
  methods: {
    openStatModal : function(system) {
      this.selectedSystem = system;
      this.statModal = true;
    },
    closeStatModal: function() {
      this.statModal = false;
    },
    openConfModal : function(system) {
      this.selectedSystem = system;
      this.confModal = true;
    },
    closeConfModal: function() {
      this.confModal = false;
    },
    addtowhitelist : function(system){
      this.selectedSystem = system
    },
    opendeletemodal:function(data) {
      this.selectedSystem = data
      this.delModal = true;
    },
    closedeletemodal:function() {
      this.delModal = false;
    },
    exportme : function(data) {
      let isFound = false;
      this.$store.state.exportlist.forEach(element => {
        if (element.mac == data.mac && element.name == data.name) {
          isFound = true;
        }
      });

      if (!isFound) {
        this.$store.state.exportlist.push(data)
      } 
    },
    deletethis : function() {
      var index = 0;
      console.log("ehy")
      for (index = 0; index <this.systems.length; index++) {
        console.log(index)
        if(this.systems[index].mac == this.selectedSystem.mac && this.systems[index].name == this.selectedSystem.name) {
          
          this.systems.splice(index,index + 1);
          console.log(index);
          this.delModal = false;
          break;
        }
      }
    }
  },

  mounted() {
    
  }
}
</script>
<style>
header.warning {
  background-color: #fffc94
}
header.idle {
  background-color: #ff9494
}

</style>