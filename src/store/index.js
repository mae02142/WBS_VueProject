// store.js
import { createStore } from 'vuex';

export default createStore({
  state: {
    projectList: {},
    selectedProject: {},
    loginMember:{}
  },
  mutations: {
    setProjectsData(state, projects) {
      console.log('Setting selected project:', projects);
      state.projectList = projects;
    },
    setSelectedProject(state, project) {
      state.selectedProject = project;
    },
    setLoginMember(state, member){
      state.loginMember = member;
    }
  },
  actions: {
    updateProjectsData({ commit }, projects) {
      commit('setProjectsData', projects);
    }
  }
});
