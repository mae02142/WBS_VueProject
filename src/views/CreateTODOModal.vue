<template>
    <div v-if="visible" class="modal">
      <div class="modal-content">
        <span @click="close" class="close">&times;</span>
        <h3>Add New Task</h3>
        <div class="m-container">
            <div class="m-left">
                <div class="todo">
                    <span>To DO</span>
                    <input v-model="taskName" placeholder="Enter Task Name"/>
                </div>
                <div class="todo-detail">
                    <span>설명</span>
                    <input v-model="todoDetail" placeholder="설명 추가" />
                    <button>저장</button>
                </div>
            </div>
            <div class="m-right">
                <div class="status">
                    <select>
                        <option>해야 할 일</option>
                        <option>진행중</option>
                        <option>완료됨</option>
                    </select>
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
                                    <td>aaa</td>
                                </tr>
                                <tr>
                                    <th>담당자</th>
                                    <td>bbb</td>
                                </tr>
                                <tr>
                                    <th>시작일</th>
                                    <td><input type="date" class="date-picker"></td>
                                </tr>
                                <tr>
                                    <th>마감일</th>
                                    <td><input type="date" class="date-picker"></td>
                                </tr>
    
                            </tbody>
                        </table>
                    </div>
                </div>
    
    
    
            </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';

  export default {
    props: {
      visible: {
        type: Boolean,
        default: false
      },
      daysInMonth: {
        type: Number,
        required: true
      }
    },
    data() {
      return {
        taskName: '',
        taskStart: 1,
        taskDuration: 5
      };
    },
    methods: {
      close() {
        this.$emit('close');
      },
      confirm() {
        const task = {
          name: this.taskName,
          start: this.taskStart,
          duration: this.taskDuration
        };
        this.$emit('confirm', task);
        this.close();
      },

      //프로젝트 생성
      sendTask() {
        const taskData = {
            taskName: this.taskName,
            todoDetail: this.todoDetail,
            status: this.status, // 상태 선택 값을 가져오기 위한 데이터 속성 추가 필요
            pm: "aaa",
            담당자: "bbb",
            시작일: this.taskStart, // 시작일 선택 값을 가져오기 위한 데이터 속성 추가 필요
            마감일: this.taskDuration // 마감일 선택 값을 가져오기 위한 데이터 속성 추가 필요
        };
        
        axios.post('YOUR_API_ENDPOINT', taskData)
        .then(response => {
            console.log(response.data);
            // 성공 시 처리 로직
        })
        .catch(error => {
            console.error(error);
            // 오류 시 처리 로직
        });
    }

    }
  };
  </script>
  
  <style scoped>

.modal {
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
    width: 1000px;
    height: 500px;
  }
  .close {
    cursor: pointer;
    float: right;
    font-size: 28px;
    margin: 0 0 10px 10px;
  }
  
  .m-container{
      display: flex;
      gap: 40px;
  }
  
  .todo, .todo-detail{
      display: flex;
      flex-direction: column;
      gap: 10px;
  }
  
  .m-left{
      width: 55%;
      display: flex;
      flex-direction: column;
      gap: 30px;
  }
  .m-right{
    width: 45%;
    display: flex;
    flex-direction: column;
    gap: 70px;
    
}

.todo input{
    height: 30px;
    border-radius: 1ch;
}
.todo input:focus{
    border-color: rgb(94, 94, 214);
    border: none;
}



.todo-detail input{
    height: 70px;
    border-radius: 1ch;
}

.todo-detail button{
    width: 65px;
    padding: 7px;
    place-self: flex-end;
    background-color: rgb(39, 93, 194);
    color: #ffffff;
    border: none;
    border-radius: 1ch;
}

.todo-detail button:hover{
    cursor: pointer;
}

.status-detail{
    border: 1px solid gray;
    border-radius: 1ch;

}

.status-table{
    width: 100%;
    padding: 10px;
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
  </style>
  