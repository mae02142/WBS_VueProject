<template>
    <div v-if="visible" class="create-modal">
      <div class="modal-content">
        <span @click="close" class="close">&times;</span>
        <h2>{{ project.project_title }}</h2>
        <div class="m-container">
            <div class="m-left">
                <div v-if="!isEditMode"></div>
                <div v-else class="todo">
                    <span>Modify Project Title</span>
                    <input v-model="project_title" placeholder="Modify Project Name"/>
                </div>
            </div>
            <div class="status">
              <select v-if="isEditMode" name="status" v-model="selectedStatus">
                <option v-for="option in statusOptions" :key="option.value" :value="option.value">
                  {{ option.text }}
                </option>
              </select>
              <span v-else>{{ project.status }}</span>
            </div>
                <div class="status-detail">
                    <div class="s-header"> 
                        <span>세부정보</span>
                    </div>

                    <div>
                        <table class="status-table">
                            <tbody class="s-body">
                                <tr>
                                    <th>PM</th>
                                    <td>{{ project.project_manager }}</td>
                                  </tr>
                                  <tr>
                                    <th>참여 인원</th>
                                    <div v-if="isEditMode">
                                      <td @click="openMemberSearchModal" class="click-add">
                                        <span v-for="member in selectedMembers" :key="member.member_num" class="selected-member">
                                          {{ member.div_name }} {{ member.member_name }} {{ member.rank }}<br>
                                        </span>
                                      </td>
                                        </div>
                                        <div v-else>
                                          <span v-for="member in selectedMembers" :key="member.member_num" class="selected-member">
                                          {{ member.div_name }} {{ member.member_name }} {{ member.rank }}<br>
                                        </span>
                                        </div>
                                </tr>
                                <tr>
                                  <th>시작일</th>
                                  <td v-if="isEditMode" class="date-picker">
                                    <input type="date" class="date-picker" v-model="formattedStartDate">
                                  </td>
                                  <td v-else class="date-picker">{{ formattedStartDate }}</td>
                                </tr>
                                <tr>
                                  <th>마감일</th>
                                  <td v-if="isEditMode" class="date-picker">
                                    <input type="date" class="date-picker" v-model="formattedDueDate">
                                  </td>
                                  <td v-else class="date-picker">{{ formattedDueDate }}</td>
                                </tr>
                            </tbody>
                        </table>
                      </div>
                    </div>
                    <MemberSearchModal :visible="showMemberSearchModal" @close="closeMemberSearchModal"
                    @update-selected-members="updateSelectedMembers" :sendMemberName="selectedMembers">
                    </MemberSearchModal>
                    <div class="create-btn"> 
                      <button v-if="!isEditMode&&this.loginMember.member_num==this.project.member_num" @click="enterEditMode">Modify</button>
                      <div v-else-if="isEditMode&&this.loginMember.member_num==this.project.member_num">
                        <button @click="saveChanges">confirm</button>
                        <button @click="close">cancel</button>
                      </div>
                    </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import MemberSearchModal from "./MemberSearchModal.vue";
  import axios from "axios";
  import mixin from "../mixin";

  export default {
    name:"CheckAndModifyModal",
    mixins:[mixin],
    components:{MemberSearchModal},
    props: {
    visible: {
      type: Boolean,
      default: false
    },
    project: {
      type: Object,
      required: true
    }

    },
    data() {
      return {
        localProject: {...this.project},
        isEditMode: false,
        showMemberSearchModal: false,
        selectedMembers: [],
        //프로젝트 진행 상태
        selectedStatus: 'todo',  // 기본값을 'all'로 설정
        statusOptions: [
        { value: 'todo', text: '해야 할 일' },
        { value: 'ongoing', text: '진행중' },
        { value: 'done', text: '완료' },
      ],
      };
    },
    watch: {
    visible(newVal) {
      if (newVal) {  // visible이 true가 될 때
        this.participatedMemberList();
      }
    },
  },
  computed: {
    loginMember() {
    return this.$store.state.loginMember;
  },
  formattedStartDate: {
    get() {
      return this.$store.getters.formatDate(this.project.start_date);
    },
    set(value) {
      this.localProject.start_date = this.$store.getters.formatDate(value);
    },
  },
  formattedDueDate: {
    get() {
      return this.$store.getters.formatDate(this.project.due_date);
    },
    set(value) {
      this.localProject.due_date = this.$store.getters.formatDate(value);
    },
  },
  projectData() {
    return this.$store.state.selectedProject;
  }
  },
    methods: {
    updateSelectedMembers(updatedMembers) {
      this.selectedMembers = updatedMembers;
      this.hasSelectedMembers = this.selectedMembers.length > 0;
      console.log("selectedMembers",this.selectedMembers);
  },
      forTest(temp){
      console.log("key : " + temp);
      this.key = temp;
      this.participatedMemberList();
    },

      close() {
        this.isEditMode=false;
        this.$emit('close');
      },
      openMemberSearchModal() {
      this.showMemberSearchModal = true;
      },

      closeMemberSearchModal() {
      this.showMemberSearchModal = false;
    },
    async participatedMemberList(){
      try {
        const response = await axios.post("http://localhost:8030/api/participatedMemberList",{
            t_key: this.key,
            project_num:this.project.project_num
        });
        this.selectedMembers = response.data;
      } catch (error) {
        console.log(error);
      }
    },

    enterEditMode() {
    this.isEditMode = true;
    // 프로젝트 정보를 localProject에 저장
    this.localProject = { ...this.project };
    
    // 직접 수정하고 있는 변수들의 초기값 설정
    this.project_title = this.localProject.project_title;
    this.selectedStatus = this.localProject.status;
  },

  async saveChanges() {
    try {
      // 수정된 내용 서버로 전송
      const projectDTO = {
      project_num: this.localProject.project_num,
      project_title: this.project_title, // 직접 수정된 값 사용
      status: this.selectedStatus,       // 직접 수정된 값 사용
      start_date: this.localProject.start_date, // localProject의 값을 사용
      due_date: this.localProject.due_date,     // localProject의 값을 사용
      project_manager: this.localProject.project_manager,
      member_num: this.loginMember.member_num
    };
      const members = this.selectedMembers.map(member => member.member_num);
      const response = await axios.post("http://localhost:8030/api/updateProject", {
        t_key: this.key,
        projectDTO: projectDTO,
        members: members
      });
      console.log("saveChanges>>>>",response.data);

      alert("수정 완료");

      // 로컬 상태를 업데이트합니다.
      this.localProject.project_title = this.project_title;
      this.localProject.start_date = this.start_date;
      this.localProject.due_date = this.due_date;
      this.localProject.status = this.selectedStatus;
      this.localProject.selectedMembers = this.selectedMembers; // 만약 필요하다면 이 부분도 추가하세요.
      
      this.$store.dispatch('updateSelectedProject', response.data);
      this.$store.commit('updateProjectInList', response.data);
      this.isEditMode = false;
      this.$emit('close');
    } catch (error) {
      console.log(error);
    }
    }
  }

  }
  
  </script>
  
  <style scoped>

.create-modal {
    display: flex;
    justify-content: center;
    align-items: center;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0,0,0,0.6);
    z-index: 1000;
  }
  .modal-content {
    background-color: #ffffff;
    padding: 20px;
    border-radius: 1ch;
    width: 450px;
  }
  .close {
    cursor: pointer;
    float: right;
    font-size: 28px;
    margin: 0 0 10px 10px;
  }
  
  .m-container{
      display: flex;
      flex-direction: column;
      gap: 20px;
  }
  
  .todo, .todo-detail{
      display: flex;
      flex-direction: column;
      gap: 10px;
  }
.m-left{
    width: 99%;
} 

.todo input{
    height: 30px;
    border-radius: 1ch;
}
.todo input:focus{
    border-color: rgb(94, 94, 214);
    border: none;
}

.status-detail{
    border: 1px solid gray;
    border-radius: 1ch;

}

.status-table{
    width: 100%;
    padding: 10px;
}
.status{
    margin-bottom: 40px;
}

.status-table th {
    text-align: left;
    padding: 10px;
}

.s-header{
    border-bottom: 1px solid gray;
    padding: 10px;
}

.date-picker{
    border: none;
    width: 100%;
    height: 40px;
}

.date-picker:hover{
    /* border: 1px solid rgb(39, 93, 194, 0.7); */
    cursor: pointer;
    /* border-radius: 1ch; */
}

.create-btn{
  display: flex;
  justify-content: center;
}
.create-btn button{
    width: 65px;
    padding: 7px;
    place-self: flex-end;
    background-color: rgb(39, 93, 194);
    color: #ffffff;
    border: none;
    border-radius: 1ch;
}

.create-btn button:hover{
    cursor: pointer;
}

.click-add:hover{
  cursor: pointer;
  font-style: bold;
}

.s-body th{
min-width: 80px;
}

.selected-member{
  font-size: small;
}
  </style>
  