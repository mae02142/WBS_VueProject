<template>
  <div ref="gantt" class="gantt-c"></div>
  <div>
    <input
      type="radio"
      id="scale1"
      class="gantt_radio"
      name="scale"
      value="day"
      v-model="selectedScale"
    />
    <label for="scale1">Day scale</label>

    <input
      type="radio"
      id="scale2"
      class="gantt_radio"
      name="scale"
      value="week"
      v-model="selectedScale"
    />
    <label for="scale2">Week scale</label>

    <input
      type="radio"
      id="scale3"
      class="gantt_radio"
      name="scale"
      value="month"
      v-model="selectedScale"
    />
    <label for="scale3">Month scale</label>

    <input
      type="radio"
      id="scale4"
      class="gantt_radio"
      name="scale"
      value="quarter"
      v-model="selectedScale"
    />
    <label for="scale4">Quarter scale</label>

    <input
      type="radio"
      id="scale5"
      class="gantt_radio"
      name="scale"
      value="year"
      v-model="selectedScale"
    />
    <label for="scale5">Year scale</label>
  </div>
</template>

<script>
import { gantt } from "dhtmlx-gantt";
import axios from "axios";
import mixin from "../mixin";
export default {
  name: "GanttConfig",
  mixins: [mixin],
  props: {
    tasks: {
      type: Object,
      default() {
        return {
          data: [],
        };
      },
    },
  },
  data() {
    return {
      selectedScale: "day",
    };
  },
  watch: {
    selectedScale(newValue) {
      switch (newValue) {
        case "day":
          this.setDayScale();
          break;
        case "week":
          this.setWeekScale();
          break;
        case "month":
          this.setMonthScale();
          break;
        case "quarter":
          this.setQuarterScale();
          break;
        case "year":
          this.setYearScale();
          break;
      }
    },
  },
  computed: {
    loginMember() {
      return this.$store.state.loginMember;
    }
  },
    methods: {
      setDayScale() {
        gantt.config.scale_unit = "day";
        gantt.config.date_scale = "%d %M";
        gantt.config.subscales = [];
        gantt.render();
      },

      setWeekScale() {
        gantt.config.scale_unit = "week";
        gantt.config.date_scale = "%W";
        gantt.config.subscales = [{ unit: "day", step: 1, date: "%d %M" }];
        gantt.render();
      },

      setMonthScale() {
        gantt.config.scale_unit = "month";
        gantt.config.date_scale = "%F, %Y";
        gantt.config.subscales = [{ unit: "week", format: "Week #%W" }];
        gantt.render();
      },
      setQuarterScale() {
        gantt.config.scale_unit = "quarter";
        gantt.config.date_scale = "%M";
        gantt.config.subscales = [{ unit: "month", step: 1, date: "%M" }];
        gantt.render();
      },

      setYearScale() {
        gantt.config.scale_unit = "year";
        gantt.config.date_scale = "%Y";
        gantt.render();
      },
      //todo 저장
      async saveTaskToServer(task) {
        try {
          const response = await axios.post(
            "http://localhost:8030/api/createTodo",
            {
              t_key: this.key,
              project_num:this.$store.state.selectedProject.project_num,
              todoDTO: task,
            }
          );
          console.log(response.data);
          this.data=response.data;

        } catch (error) {
          console.log(error);
        }
      },
    },

    mounted: function () {
      gantt.config.date_format = "%Y-%m-%d";
      gantt.config.columns = [
        { name: "todo_title", label: "Title", tree: true, width: 130 },
        { name: "member", label: "member", align: "center" },
        { name: "start_date", label: "Start time", align: "center" },
        { name: "end_date", label: "End time", align: "center" },
        { name: "add", label: "" },
      ];
      gantt.config.grid_width = 450;
      //주 단위로 보기
      //gantt.config.scale_unit = "week";
      gantt.config.scrollable = true;
      gantt.config.scale_unit = "day";

      gantt.config.show_links = false;

      gantt.templates.lightbox_header = function (start_date, end_date, task) {
        return (
          gantt.templates.task_time(task.start_date, task.end_date, task) +
          "&nbsp;" +
          (
            gantt.templates.task_text(task.start_date, task.end_date, task.text) ||
            ""
          ).substr(0, 70)
        );
      };
      //todo 추가 모달창 - 구성
      gantt.config.lightbox.sections = [
        { name: "todo_title", height: 38, map_to: "todo_title", type: "textarea" }, //title
        { name: "content", height: 38, map_to: "content", type: "textarea" }, // Content
        { name: "project_manager", height: 16, type: "template", map_to: "project_manager"}, // PM
        { name: "member", height: 60, type: "template", map_to: "member"}, //manager
        { name: "priority", height: 22, map_to: "status", type: "select",
          options: [
            // status
            { key: "todo", label: "해야 할 일" },
            { key: "ongoing", label: "진행 중" },
            { key: "done", label: "완료됨" },
          ],
        },
        {
          name: "period", height: 72, type: "time", map_to: "dedline", time_format: ["%Y", "%m", "%d"],
        }, //Deadline
      ];
      gantt.locale.labels.section_todo_title = "Todo";
      gantt.locale.labels.section_content = "Explanation";
      gantt.locale.labels.section_project_manager = "PM";
      gantt.locale.labels.section_member = "담당자";
      gantt.locale.labels.section_priority = "status";
      gantt.locale.labels.section_period = "deadline";

      gantt.attachEvent("onTaskLoading", function (task) {
        task.start_date = new Date(task.start_date);
        task.end_date = new Date(task.end_date);
        return true;
      });
      //todo 모달창 열때 기본값
      gantt.attachEvent("onTaskCreated", (task) => {
        task.project_manager = this.$store.state.selectedProject.project_manager;
        task.member = this.$store.state.loginMember.member_name;
        return true;
      });
      gantt.templates.task_text = function(start,end,task){
      return task.todo_title;  
      };

      gantt.attachEvent("onLightboxSave", (id, task, is_new) => {
        task.start_date = this.$store.getters.formatDate(task.start_date);
        task.due_date = this.$store.getters.formatDate(task.end_date);
        delete task.end_date;
        console.log("라이트박스 task>>>", task);
        const sendtask = {
          todo_num: id,
          todo_title: task.todo_title,
          status: task.status, 
          start_date: task.start_date, 
          due_date: task.due_date,
          member_name: task.member,
          member_num: this.$store.state.loginMember.member_num,
          content: task.content
        };
        console.log("is_new",is_new);
        this.saveTaskToServer(sendtask);
        return true; // 이를 반환하여 gantt가 작업을 저장하게 합니다.
      });
      gantt.createDataProcessor((entity, action, data, id) => {
        this.$emit(`${entity}-updated`, id, action, data);
      });
      //document.querySelector(".gantt_radio[value='" + config.name + "']").checked = true;
      //초기화
      gantt.init(this.$refs.gantt);
      gantt.parse(this.$props.tasks);
    },
}
</script>

<style>
@import "~dhtmlx-gantt/codebase/dhtmlxgantt.css";
div[ref="gantt"] {
  width: 100%;
  height: 800px;
}

.gantt-c {
  min-height: 600px;
}
</style>