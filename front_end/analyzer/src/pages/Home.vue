<template>
<div class="home container">
  <button onclick="topFunction()" id="myBtn" title="Go to top">Top</button>
<div style="margin-bottom: 30px">Filter: <select><option>All</option><option>Idle</option><option>Suspicious</option></select><select style="margin-left: 10px"><option>All</option><option>Not Classified</option><option>Application Server</option><option>Web Server</option><option>Storage Server</option></select></div>
 <div  v-bind:class="{'card': true,'space' : (data.hostname == selectedSystem.hostname) }"  v-for="data in systems" v-bind:key="data.ip" >
  <header  class="card-header" v-bind:class="{ 'idle': (data.state == 'Idle'), 'warning': (data.state == 'Suspicious') }"   >
    <p class="card-header-title" @click="selectSys(data)" >
      {{data.hostname}} 
    </p>
    <strong style="margin-right: 20px; margin-top: 13px" @click="selectSys(data)" >
      {{(data.tag == null) ? 'Not Classified' : data.tag}}
    </strong>
     <button @click="opendeletemodal(data)" style="margin-top: 5px; margin-right: 10px; font-size: 20px; border-style: solid; border-width: 2px; border-radius: 1000px; padding-left: 10px; padding-right: 10px; padding-top: 0px; padding-bottom: 3px; margin-top: 10px; margin-bottom: 10px">x</button>
  </header>
  
  <div v-bind:class="{'card-content' : (data.hostname == selectedSystem.hostname) }"  v-if="(data.hostname == selectedSystem.hostname)">
   
    <div class="content" style="display: inline-flex">
      <div>
      <div><span style="font-weight: 700">MAC: </span> <span>{{data.mac}}</span></div>
      <!-- <div><span style="font-weight: 700">IP: </span> <span>{{data.ip}} </span></div> -->
      <div><span style="font-weight: 700">STATE: </span> <span>{{data.state}} </span></div>
      </div>
      <div v-if="data.state == 'Suspicous'" style="display: inline-flex;"><span style="text-align: center;padding: 10px;border-radius: 10px; border-width: 1px; border-color: #000000; border-style: solid; margin-left: 600px"> We recommend you revaluate your <br> resources on this machine</span> <span>{{data.type}} </span></div>
    </div>
  </div>
  <footer class="card-footer" v-if="(data.hostname == selectedSystem.hostname)">
    <a href="#" class="card-footer-item" @click="openStatModal(data)">Stats</a>
    <a href="#" class="card-footer-item" @click="openConfModal(data)" >Report Feedback</a>
    <a href="#" class="card-footer-item" @click="exportme(data)">Add to export list</a>
  </footer>
</div>

<!-- statistics modal -->
<div  v-bind:class="{ 'is-active': statModal, 'modal' : true }">
  <div class="modal-background"></div>
  <div class="modal-card">
    <header class="modal-card-head">
      <p class="modal-card-title">Statistics on {{this.selectedSystem.hostname}}</p>
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
      <p class="modal-card-title">{{this.selectedSystem.hostname}} Report Feedback</p>
      <button class="delete" @click="closeConfModal()"  aria-label="close"></button>
    </header>
    <section class="modal-card-body" style="padding: 30px">
      <div class="control">
    
        <div class="control">  
        <div style="display: inline-flex; margin-left: 40px; margin-top: -5px" class="select">
          <select v-model="selectedOption">
            <option v-for="option in optionArray" v-bind:key="option">{{option}}</option>
            
          </select>
        </div>
        <div style="display: inline-flex; margin-left: 60px; margin-top: 100 px" class="control">
          <div class="buttons has-addons">
              <div class="field">
              <b-switch  type="is-black" @click="addtowhitelist()">Suspend alerts for this machine</b-switch>
              </div>
         </div>
        </div>
        </div>
        
        <div class="control" style="margin-top: 20px">
          <h2 style="display: inline-flex; margin-left: 40px">Please confirm state of machine:</h2>
        <a class="button is-success" style="margin-left: 63px" >Approve</a>
        <a class="button is-danger" style="margin-left: 10px;" @click="setMistake()">Deny</a>
        </div>

      </div>
    </section>
<footer class="modal-card-foot" style="padding-left: 210px">
      <button class="button is-success"  @click="setConf()">Save changes</button>
      <button class="button" @click="closeConfModal()">Cancel</button>
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
import axios from 'axios'

Vue.use(Buefy)

exportingInit(Highcharts)
export default {
    
  hostname: 'Home',

  components: {
   highcharts: Chart 
  },
  data()  {
      return {
      systems: [],
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
          data: [] // sample data  
        },
        {
          name: 'Network',
          data: [] // sample data  
        },
        {
          name: 'Memory Usage',
          data: [] // sample data  
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
      systemToDelete: null,
      selectedSystem: {hostname: "", mac: ""},
      delModal: false,
      selectedOption: null,
      optionArray: ['Not Classified',
            'Storage Server',
            'Application Server',
            'Exchange Server',
            'Web Server'],
      correct: true,
      whitedlisted: false,
      }
     
  },
    
  methods: {
    setMistake: function() {
      this.correct = false;
    },

    
    setConf : function() {
      var i ;
      for (i=0;i<this.systems.length; i++) {
        if(this.systems[i].hostname == this.selectedSystem.hostname &&  this.systems[i].mac == this.selectedSystem.mac) {
          this.systems[i].tag = this.selectedOption;
        }
      }
      axios
      .get(
        "http://10.104.238.42:3000/updatetags?hostname=" + this.selectedSystem.hostname + "&mac=" + this.selectedSystem.mac + "&tag=" + this.selectedOption + "&correct="
         + this.correct + "&whitelisted=" + this.whitedlisted
      )
      .then(r => {this.correct= true; this.whitedlisted = false; this.selectedOption=null})
      .catch(e => console.log(e));
      this.confModal = false;
    },
    openStatModal : function(system) {
      this.selectedSystem = system;
      axios.get('http://10.104.238.42:3000/stats?hostname=' + this.selectedSystem.hostname + '&mac=' + this.selectedSystem.mac).then(response =>{
        
        this.chartOptions.series.forEach(series => {
          if(series.name == "CPU Usage") {
            series.data = response.data.map(obj => {return obj.cpu});
          }
          if(series.name == "Network") {
            series.data = response.data.map(obj => {return obj.bandwidth});
          }
          if(series.name == "Memory Usage") {
            series.data = response.data.map(obj => {return obj.memory});
          }
          if(series.name == "Voltage") {
            series.data = response.data.map(obj => {return obj.cpu});
          }
        });
        
      });
      this.statModal = true;
    },
    selectSys: function(data) {
      if (this.selectedSystem.hostname == "") {
        this.selectedSystem = data;
      } else {
        this.selectedSystem = {hostname: "", mac: ""}
      }
      
      

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
    addtowhitelist : function(){
      this.whitedlisted = true;
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
        if (element.mac == data.mac && element.hostname == data.hostname) {
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
        if(this.systems[index].hostname == this.selectedSystem.hostname) {
          
          this.systems.splice(index,index + 1);
          console.log(index);
          this.delModal = false;
          break;
        }
      }
    }
  },

  mounted() {
        axios.get('http://10.104.238.42:3000/machines').then(response =>{
        this.systems = response.data
        });
    window.onscroll = function() {scrollFunction()};

function scrollFunction() {
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    document.getElementById("myBtn").style.display = "block";
  } else {
    document.getElementById("myBtn").style.display = "none";
  }
}

// When the user clicks on the button, scroll to the top of the document
function topFunction() {
  document.body.scrollTop = 0; // For Safari
  document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
}
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
.space{
  margin-bottom: 30px;
  margin-top: 10px
}
#myBtn {
  display: none; /* Hidden by default */
  position: fixed; /* Fixed/sticky position */
  bottom: 20px; /* Place the button at the bottom of the page */
  right: 30px; /* Place the button 30px from the right */
  z-index: 99; /* Make sure it does not overlap */
  border: none; /* Remove borders */
  outline: none; /* Remove outline */
  background-color: red; /* Set a background color */
  color: white; /* Text color */
  cursor: pointer; /* Add a mouse pointer on hover */
  padding: 15px; /* Some padding */
  border-radius: 10px; /* Rounded corners */
  font-size: 18px; /* Increase font size */
}

#myBtn:hover {
  background-color: #555; /* Add a dark-grey background on hover */
}
</style>