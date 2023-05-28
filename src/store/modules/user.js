export default {
  namespaced: true,
  state () {
    return {
      token: localStorage.getItem('geek-store-token'),
      refreshToken: localStorage.getItem('geek-client-mobile-refreshToken')
    }
  },
  mutations: {
    setToken (state, token) {
      state.token = token
      localStorage.setItem('geek-store-token', token)
    },
    setRefreshToken (state, refreshToken) {
      state.refreshToken = refreshToken
      localStorage.setItem('geek-client-mobile-refreshToken', refreshToken)
    }
  },
  getters: {},
  actions: {}
}
