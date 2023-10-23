<template>
  <div class="tl-container">
    <SideBar @projectSelected="handleProjectSelected"></SideBar>
    <div class="tab">
      <button @click="viewTimeline()">Time Line</button>
      <button @click="viewCalendar()">Calendar</button>
      <GanttContainer v-if="isTimeLine"
        :todoList="todoList">
      </GanttContainer>
      <FullCalendar v-if="isCalendar"
        :todoList="todoList">
      </FullCalendar>
    </div>
  </div>
</template>

<script>
import SideBar from './components/SideBar';
import GanttContainer from "./components/GanttContainer.vue";
import FullCalendar from "./components/FullCalendar.vue";
import axios from "axios";
import mixin from "./mixin";

export default {
  components: { SideBar, GanttContainer, FullCalendar},
  inject: ["eventBus"],
  mixins:[mixin],
  data() {
    return {
      todoList: [],
      isTimeLine: true,
      isCalendar: false,
    };
  },
  mounted() {
    this.eventBus.on('getTodoList',(project)=>{
      this.getTodoList(project);
    })
  },
  beforeUnmount() {
    this.eventBus.off('getTodoList');
  },
  methods: {
    getTodoList(project) {
      axios.post("http://localhost:8030/api/getAllTodoList", {
        project_num: project.project_num,
        t_key: this.key
      })
      .then(response => {
        this.todoList = response.data;
        console.log("Get Todo data >>>>", this.todoList);
        this.eventBus.emit('todoCalendar',this.todoList); // todoCalendar라는 event 발생 시 todoList 전달
      })
      .catch (error => {
        console.log("Failed to Get Todo List >>>>", error);
      })
    },
    viewTimeline() {
      if (!this.isTimeLine) {
        this.isTimeLine = !this.isTimeLine;
        this.isCalendar = false;
      }
      
    },
    viewCalendar() {
      if (!this.isCalendar) {
        this.isCalendar = !this.isCalendar;
        this.isTimeLine = false;
      }
    }
  }
}
</script>


<style>
.tl-container{
  margin-top:88px;
}



</style>
