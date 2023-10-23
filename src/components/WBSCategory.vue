<template>
  <div>
    <nav id="category">
      <ul>
        <li><span>{{ selectedProject.project_title }}</span></li>
        <li><span>타임라인</span></li>
        <li><span>캘린더</span></li>
        <li><span @click="openProjectSettingModal">상세보기</span></li>
        <CheckAndModifyModal :project="selectedProject" :visible="showProjectSettingModal"
        @close="closeProjectSettingModal"></CheckAndModifyModal>
      </ul>
    </nav>
  </div>
</template>

<script>
import CheckAndModifyModal from "./CheckAndModifyModal.vue";
export default {
  name: 'WBSCategory',
  components:{CheckAndModifyModal},
  data(){
    return{
      showProjectSettingModal:false
    }
  },
  computed: {
  getProjectList() {
    return this.$store.state.projectList;
  },
  selectedProject() {
    return this.$store.state.selectedProject;
  }
},
methods:{
  openProjectSettingModal(){
    this.showProjectSettingModal=true;
    //this.$emit('projectModalOpened');
  },
  closeProjectSettingModal(){
    this.showProjectSettingModal=false;
  }
}

}
</script>

<style scoped>
  #category{
    display: flex;
    border-bottom: 1px solid rgb(204, 200, 200);
}

#category li{
    list-style: none;
    display: inline-block;
    padding: 5px;
}

#category span:hover{
    background-color: rgb(199, 221, 239);
    padding: 2px;
    border-radius: 1rem;
}

#category a{
    text-decoration: none;
    color: black;
}
</style>
