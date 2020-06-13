import Vue from "vue";
import Vuex from "vuex";
import axios from 'axios';
import router from '../router/index'
import _ from 'lodash'
import socketModule from './modules/socketModule.js';
import moment from "moment";

Vue.use(Vuex);

export const store = new Vuex.Store({
  modules: {
    socketModule,
  },
  state: {
    auth_status: null,
    user: {
      id: null,
      email: null,
      firstName: null,
      lastName: null,
      profilePictureUrl: null,
    },
    devices: [
      {
        name: null,
        status: false,
        logs: [
          {
            datetime: null,
            isOnline: false
          }
        ]
      }
    ]

  },
  getters: {

  },
  mutations: {
    // Login mutations
    auth_request(state){
      state.auth_status = 'loading'
    },

    auth_error(state){
      state.auth_status = 'error'
    },
    auth_success(state, payload){
      state.auth_status = 'success';
      state.user.id = payload.id;
      state.user.email = payload.email;
      state.user.firstName = payload.firstName;
      state.user.lastName = payload.lastName;
      state.user.profilePictureUrl = payload.profilePictureUrl;
    },
    logout(state) {
      state.auth_status = null;
      state.user.id = null;
      state.user.email = null;
      state.user.firstName = null;
      state.user.lastName = null;
      state.user.profilePictureUrl = null;
    },

    // Dashboard mutations
    toogleDevice(state, payload) {
      state.devices[payload].status = !state.devices[payload].status;
    },
    setDevices(state, payload) {
      state.devices = _.map(payload, itm => {
        return {
          name: itm,
          status: true,
          logs: []
        }
      })
    },
    socketOnMessage (state, message) {
      const array = message.split('|');
      const data = {
        isOnline: array[1],
        datetime: moment(Date.now()).format('hh:mm:ss')
      }
      _.find(state.devices, {'name':array[0]}).logs.unshift(data)
    },
  },
  actions: {
    // Login actions
    login: ({ commit }, payload) => {
      return new Promise((resolve, reject) => {
        commit('auth_request')
        axios.post('/login', payload)
          .then(response => {
            const payload = {
              'id':response.data.id,
              'email':response.data.email,
              'firstName':response.data.firstName,
              'lastName':response.data.lastName,
              'profilePictureUrl':response.data.profilePictureUrl,
            };
            commit('auth_success', payload)
            resolve(response)
          })
          .catch(function (error) {
            commit('auth_error')
            reject(error)
          });
      })
    },
    logout({commit}){
      return new Promise((resolve, reject) => {
        commit('logout')
        router.push("/login");
        resolve()
      })
    },

    // Dashboard Actions
    toggleDevice ({commit}, payload) {
      commit('toogleDevice', payload)
    },
    getDevices: ({ commit }, payload) => {
      return new Promise((resolve, reject) => {
        commit('auth_request')
        axios.post('/device/list', payload)
          .then(response => {
            const payload = response.data.devices;
            commit('setDevices', payload);
            resolve(response)
          })
          .catch(function (error) {
            reject(error)
          });
      })
    },
    socketOnMessage: ({ commit }, message) => {
      commit('socketOnMessage', message);
    },

  },
});
