import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    weight: null
  },
  mutations: {
    setWeight(state, n ){
      state.weight = n;
    }
  },
  actions: {
  },
  modules: {
  }
})
