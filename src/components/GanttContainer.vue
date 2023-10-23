<template>
  <div class="g-container">
    <GanttConfig ref="GanttConfig" class="left-container" :tasks="tasks"></GanttConfig>
  </div>
</template>

<script>
import GanttConfig from './GanttConfig.vue';
import axios from 'axios';

export default {
  name: 'GanttContainer',
  components: {GanttConfig},
  props: {
    // selectedProject: {
    //   type: Object,      // 만약 selectedProject가 객체라면 type을 Object로 설정
    //   default: () => ({})  // 기본값을 빈 객체로 설정. 필요에 따라 수정 가능
    // }
    projectList:[]
  },
  data () {
    return {
      project:'',
      tasks: {
        data: [
          //{id: 1, todo_title: '메일', member: 'aaa', start_date: '2023-10-14', end_date: '2023-10-15',duration: 1, progress: 0.6},
          {id: 2, todo_title: '전자결재함', member: 'bbb', start_date: '2023-10-15', end_date: '2023-10-18',duration: 3, progress: 0.4}
        ],
      },
      messages: []
    }
  },
  // watch: {
  //   // selectedProject prop의 변경을 감지
  //   selectedProject(newProject) {
  //     if (newProject && newProject.project_num) {
  //       this.fetchProjectTasks(newProject.project_num);
  //     }
  //   }
  // },
  mounted() {
    // if (this.selectedProject && this.selectedProject.project_num) {
    //   this.fetchProjectTasks(this.selectedProject.project_num);
    // }
  },

  methods: {
    fetchProjectTasks(projectNum) {
      // 예: axios를 사용한 API 요청
      axios.get(`/api/getTasksForProject?projectNum=${projectNum}`)
        .then(response => {
          this.tasks.data = response.data.tasks || [];
          this.tasks.links = response.data.links || [];
        })
        .catch(error => {
          console.error("Error fetching tasks:", error);
        });
    }
  },
    
    
    
    
    addMessage (message) {
      this.messages.unshift(message)
      if (this.messages.length > 40) {
        this.messages.pop()
      }
    },

    logTaskUpdate (id, mode, task) {
      let text = (task && task.text ? ` (${task.text})`: '')
      let message = `Task ${mode}: ${id} ${text}`
      this.addMessage(message)
    },

    logLinkUpdate (id, mode, link) {
      let message = `Link ${mode}: ${id}`
      if (link) {
        message += ` ( source: ${link.source}, target: ${link.target} )`
      }
      this.addMessage(message)
    },
   
  }
</script> 


<style>
  html, body {
    height: 100%;
    margin: 0;
    padding: 0;
  }
  .g-container {
    display: flex;
    flex-direction: column;
  }
  .left-container {
    overflow: hidden;
    position: relative;
    height: 100%;
  }
  .right-container {
    border-right: 1px solid #cecece;
    float: right;
    height: 100%;
    width: 340px;
    box-shadow: 0 0 5px 2px #aaa;
    position: relative;
    z-index:2;
  }
  .gantt-messages {
    list-style-type: none;
    height: 50%;
    margin: 0;
    overflow-x: hidden;
    overflow-y: auto;
    padding-left: 5px;
  }
  .gantt-messages > .gantt-message {
    background-color: #f4f4f4;
    box-shadow:inset 5px 0 #d69000;
    font-family: Geneva, Arial, Helvetica, sans-serif;
    font-size: 14px;
    margin: 5px 0;
    padding: 8px 0 8px 10px;
  }

  .gantt_grid {
    overflow-y: hidden !important;
}

.gantt_task {
    overflow-y: auto !important;
}
</style>