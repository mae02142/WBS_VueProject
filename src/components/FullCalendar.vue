<script>
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import listPlugin from '@fullcalendar/list'
import CreateProjectModal from "./CreateProjectModal.vue";
import mixin from "../mixin";

export default {
  mixins:[mixin],
  components: {
    FullCalendar,
    CreateProjectModal,
  },
  inject: ["eventBus"],
  props: {
    todoList: [],
  },
  data () {
    return {
      todoListforCal: this.todoList,
      showModal: false,
      calendarOptions: {
        plugins: [
          dayGridPlugin,
          timeGridPlugin,
          interactionPlugin,
          listPlugin
        ],
        headerToolbar: {
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
        },
        initialView: 'dayGridMonth',
        events: this.todoList, // calendar에 뿌려줄 배열
        editable: false, // 일정 드래그 방지
        selectable: true,
        selectMirror: true,
        dayMaxEvents: true,
        weekends: true,
        select: this.handleDateSelect,
        eventClick: this.handleEventClick,
        eventsSet: this.setTodoList
      },
    }
  },
  mounted() {
    // App.vue에서 eventBus -> todoCalendar 라는 event 발생할 경우
    // this.resetCalendar 실행 -> todos = 전달 받은 App.vue의 todoList
    this.eventBus.on('todoCalendar',this.resetCalendar);
  },
  methods: {
    setTodoList() {
      console.log('Calendar Todo >>>>>>>', this.todoList)
    },

    handleDateSelect(selectInfo) {
      let title = prompt('일정 제목을 입력하세요')
      let calendarApi = selectInfo.view.calendar

      calendarApi.unselect() // clear date selection
      
      if (title) {
        calendarApi.addEvent({
          id: selectInfo.id,
          title,
          start: selectInfo.startStr,
          end: selectInfo.endStr,
          allDay: selectInfo.allDay
        })
      }
    },
    handleEventClick(clickInfo) {
      if (confirm(`'${clickInfo.event.title}' 일정을 삭제하시겠습니까?`)) {
        clickInfo.event.remove()
      }
    },
    closeModal() {
      this.showModal = false;
    },
    openModal() {
      this.showModal = true;
    },
    resetCalendar(todos){
      var dataList = todos;
      console.log("todos >>>>>", todos)
      this.todoListforCal = []; // project 바뀔 때마다 todoList 초기화
      dataList.map((element) => {
        const startDate = new Date(element.start_date);
        startDate.setHours(0, 0, 0, 0);
        const endDate = new Date(element.due_date);
        endDate.setHours(0, 0, 0, 0);
        startDate.setDate(startDate.getDate() + 1);
        endDate.setDate(endDate.getDate() + 1);

        this.todoListforCal.push({
          id: element.todo_num,
          title: element.todo_title,
          start: startDate.toISOString().split('T')[0],
          end: endDate.toISOString().split('T')[0],
          member_name: element.member_name,
          content: element.content,
          member_num: element.member_num 
        })
      })

      this.$refs.cal.getApi().pauseRendering();
      this.$refs.cal.getApi().destroy();
      this.calendarOptions.events = this.todoListforCal;
      this.$refs.cal.buildOptions(this.calendarOptions);
      this.$refs.cal.getApi().render();
    }
  },
}
</script>

<template>
  <div class='app'>
    <div class='app-main'>
      <FullCalendar class='app-calendar'
        :options='calendarOptions'
        ref="cal"
      >
        <template v-slot:eventContent='arg'>
          <b>{{ arg.timeText }}</b>
          <span>{{ arg.event.title }}</span>
        </template>
      </FullCalendar>

      <CreateProjectModal :visible="showModal" 
      @close="closeModal" @confirm="addTask" 
      @projectCreated="handleProjectCreated"
      :projectData="selectedProject"></CreateProjectModal>
    </div> 
  </div>
</template>

<style>
  @import '../assets/css/calendar.css';
</style>