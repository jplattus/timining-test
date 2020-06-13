const socketModule = {
  namespaced: true,
  state: {
    connected: false,
    socketMessages: [],
  },
  getters:{
  },
  mutations: {
    socketOnConnect (state) {
      state.socketMessages.push('socket connected');
      state.connected = true;
    },
    socketOnDisconnect (state) {
      state.socketMessages.push('socket disconnected');
      state.connected = false;
    },

  },
  actions: {
    socketConnect: ({commit}) => {commit('socketOnConnect')},
    socketDisconnect: ({commit}) => {commit('socketOnDisconnect')},
  }
};

export default socketModule;
