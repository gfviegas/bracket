import Vue from 'vue'
import VueResource from 'vue-resource'
Vue.use(VueResource)

const API_URL = 'http://localhost:3000/api/v1/'

export default {
  find (identifier) {
    return Vue.http.get(`${API_URL}brackets/${identifier}`)
  },
  query (params) {
    return Vue.http.get(`${API_URL}brackets`, {params: params})
  },
  get (id) {
    return Vue.http.get(`${API_URL}brackets/${id}`)
  }
}
