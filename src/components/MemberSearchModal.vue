<template>
  <div v-if="visible" class="app-t-modal">
    <div class="app-modal-content">
      <div class="app-modal-header">Search Member</div>
      <div class="app-modal-body">
        <div class="a-m-search">
          <select class="m-s-select" id="s-condition" name="searchCondition" v-model="selectedCondition" style="text-align:left; width:80px;">
            <option v-for="option in searchOptions" :key="option.value" :value="option.value">
            {{ option.text }}
            </option>
					</select>
          <input class="s-selForm" v-model="searchValue" @keyup.enter="searchMember()" placeholder="부서/사원명만 검색 가능"/>
          <button class="m-i-search" @click="searchMember">Search</button>
        </div>
        <div class="a-m-list">
          <table class="m-s-list-table">
            <tr v-for="(member, index) in members" :key="index" @click="addMember(member)">
              <td>{{ member.div_name }}</td>
              <td>{{ member.member_name }}</td>
              <td>{{ member.rank }}</td>
            </tr>
          </table>
        </div>
        <div class="s-list-div">
          <div v-for="member in selectedMembers" :key="member.member_num"  @click="addMember(member)">
              {{ member.div_name }} {{ member.member_name }} {{ member.rank }}
          </div>
        </div>
      </div>
      <div class="app-modal-footer">
        <button class="m-confirm-btn" @click="confirmMember">Confirm</button>
        <button class="m-cancel-btn" @click="closeModal">Cancel</button>
      </div>
    </div>
  </div>
</template>


<script>
import axios from 'axios';
import mixin from "../mixin";
export default {
  name:"MemberSearchModal",
  mixins:[mixin],
  props: {
      visible: {
        type: Boolean,
        default: false
      },
      sendMemberName: {
      type: Array,
      //default: () => []
    }
    },
  data() {
    return {
      searchValue: '',
      selectedCondition: 'all',  // 기본값을 'all'로 설정
      searchOptions: [
        { value: 'all', text: '전체' },
        { value: 'div_name', text: '부서' },
        { value: 'member_name', text: '이름' },
      ],
    
      members: [],
      selectedMembers: [],
    };
  },
  watch: {
  sendMemberName: {
    handler(newVal) {

      if (Array.isArray(newVal)) {
        this.selectedMembers = newVal;
      } else {
        // newVal이 배열이 아닌 경우 기본값으로 설정
        this.selectedMembers = [];
      }
    },
    immediate: true
  },
  visible(newVal){
    if(newVal){
      this.searchAllMember();
    }
  }
},
  methods: {
    forTest(temp){
      console.log("key : " + temp);
      this.key = temp;
      this.searchAllMember();
    },
    async searchAllMember(){
        try {
        const response = await axios.get("http://localhost:8030/api/searchAllMember?t_key="+this.key);
        this.members = response.data;
      } catch (error) {
        console.log(error);
      }
    },
    addMember(member) {
    // 선택된 member가 이미 selectedMembers에 있는지 확인
    const exists = this.selectedMembers.find(m => m.member_num === member.member_num);

    if (exists) {
      // 이미 있으면 배열에서 제거
      this.selectedMembers = this.selectedMembers.filter(m => m.member_num !== member.member_num);
    } else {
      // 없으면 배열에 추가
      this.selectedMembers.push(member);
    }
  },
  //조건으로 검색
  async searchMember() {
    try {
      const payload = {
        t_key : this.key,
        searchCondition: this.selectedCondition,
        searchValue: this.searchValue
      };

      const response = await axios.post("http://localhost:8030/api/searchMember",payload);
      console.log(response.data);
      this.members = [];
      this.members = response.data;
    } catch (error) {
      console.log(error);
    }
  },
  //프로젝트 참여 멤버 선택하고 confirm
  confirmMember() {
    this.$emit('update-selected-members', this.selectedMembers);
    this.$emit('close');
  },

    closeModal() {
      this.selectedMembers=[];
      this.$emit('close');
    },
  } 
};
</script>






<style scoped>
.app-t-modal {
  position: fixed;
  z-index: 1000;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}

.app-modal-content {
  width: 300px;
  background: #fff;
  border-radius: 10px;
  text-align: center;
  padding: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.app-modal-header,
.app-modal-footer {
  margin-bottom: 10px;
  margin-top: 10px;
}

.a-m-search {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
  gap: 5px;
}

.s-selForm {
  flex-grow: 1;
}

.m-i-search {
  padding: 8px 10px;
  background-color: #007BFF;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.a-m-list {
  overflow-y: auto;
  height: 150px;
  border: 1px solid #ccc;
  margin-bottom: 15px;
}

.m-s-list-table {
  width: 60%;
  border-collapse: collapse;
  margin-left: 55px;
}
.m-s-list-table td{
  padding: 0px;
}

.m-s-list-table tr:hover {
  background-color: rgba(117, 144, 194, 0.25);
  cursor: pointer;
}

.s-list-div {
  margin-top: 15px;
  border: 1px solid #ccc;
  padding: 10px;
  overflow-y: auto;
  height: 90px;
}
.s-list-div div:hover{
  cursor: pointer;
}

.m-confirm-btn,
.m-cancel-btn {
  padding: 8px 16px;
  margin: 5px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.m-confirm-btn {
  background-color: #007BFF;
  color: #fff;
}

.m-cancel-btn {
  background-color: #ccc;
}


</style>