export default {
  namespaced: true,
  state () {
    return {
      token: localStorage.getItem('geek-store-token')
    }
  },
  mutations: {
    setToken (state, token) {
      state.token = token
      localStorage.setItem('geek-store-token', token)
    }
  },
  getters: {},
  actions: {}
}
