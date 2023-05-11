import axios from 'axios'

export const api = axios.create({
  baseURL: '/api', // como o back e o front end estão no mesmo projeto eles ja partilham da mesma url, então não precisa informar a url, só a rota da api
})
