<template>
  <div class="export">
      <div class="container-fluid">
        
      <div class="table-container">
          <div class="control" style="margin-top: 20px; text-align: center" v-if="this.exportlist.length > 0" >
                        <button class="button is-danger"  style="margin-left: 50px" @click="opendeleteall()">Delete all</button>
                        <button class="button is-success"  style="margin-left: 50px;" @click="csvExport()">Export</button>
            <table class="table container">
                <tr><th v-for="proprety in this.objectAttributes" v-bind:key="proprety">{{proprety}}</th><th></th></tr>
                <tr v-for="data in this.exportlist" v-bind:key="data"><td v-for="attr in Object.keys(data)" v-bind:key="attr">{{data[attr]}}</td><td> <div  @click="opendeletemodal(data)" style=" font-size: 20px; border-style: solid; border-width: 2px; border-radius: 1000px; padding-left: 10px; padding-right: 10px; padding-top: 0px; padding-bottom: 3px;">x</div></td></tr>
            </table>
    </div>
    </div>
  </div>

  <div v-bind:class="{ 'is-active': this.delModal, 'modal' : true }" >
  <div class="modal-background"></div>
  <div class="modal-card">
    <header class="modal-card-head">
      <p class="modal-card-title">Confirmation</p>
      <button class="delete" aria-label="close" @click="closedeletemodal()"></button>
    </header>
    <section class="modal-card-body" style="text-align: center">
    <h1>Are you sure you want to delete this?</h1>
    </section>
    <footer class="modal-card-foot" style="padding-left: 242px">
      <button class="button is-success" @click="deletethis()">Delete</button>
      <button class="button" @click="closedeletemodal()">Cancel</button>
    </footer>
  </div>
</div>
<div v-bind:class="{ 'is-active': this.delallmodal, 'modal' : true }" >
  <div class="modal-background"></div>
  <div class="modal-card">
    <header class="modal-card-head">
      <p class="modal-card-title">Confirmation</p>
      <button class="delete" aria-label="close" @click="closedeleteall()"></button>
    </header>
    <section class="modal-card-body" style="text-align: center">
    <h1>Are you sure you want to delete this?</h1>
    </section>
    <footer class="modal-card-foot" style="padding-left: 242px">
      <button class="button is-success" @click="deleteall()">Delete</button>
      <button class="button" @click="closedeleteall()">Cancel</button>
    </footer>
  </div>
</div>
</div>

</template>

<script>
import { mapState } from 'vuex'
import Vue from 'vue'
import JsonExcel from 'vue-json-excel'
 
Vue.component('downloadExcel', JsonExcel)

export default {
    
  name: 'Export',
  data()  {
      return {
          selectedSystem:null,
          delModal:false,
          delallmodal: false
      }
  },
  computed: {
    objectAttributes() {
        if (this.exportlist.length > 0) {
            return  Object.keys(this.exportlist[0]);
        }
        return [];
    },
      
      
    ...mapState(['exportlist'])
  },
  methods:{
    opendeletemodal:function(data) {
      this.selectedSystem = data
      this.delModal = true;
    },
    closedeletemodal:function() {
      this.delModal = false;
    },
    deletethis : function() {
      var index = 0;
      for (index = 0; index <this.$store.state.exportlist.length; index++) {
        if(this.$store.state.exportlist[index].mac == this.selectedSystem.mac && this.$store.state.exportlist[index].name == this.selectedSystem.name) {        
          this.$store.state.exportlist.splice(index,index + 1);
          this.delModal = false;
          break;
        }
      }
    },
    opendeleteall: function() {
        this.delallmodal = true;
    },
    closedeleteall:function(){
        this.delallmodal = false;
    },
    deleteall: function(){
        
        this.$store.state.exportlist = []
        
    
        this.delallmodal = false;
    },
    csvExport() {
      let csvContent = "data:text/csv;charset=utf-8,";
      csvContent += [
        Object.keys(this.$store.state.exportlist[0]).join(";"),
        ...arrData.map(item => Object.values(item).join(";"))
      ]
        .join("\n")
        .replace(/(^\[)|(\]$)/gm, "");

      const data = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", data);
      link.setAttribute("download", "export.csv");
      link.click();
    }
}
}
</script>

<style>
td{
  padding-top: 30px;
}


    

</style>