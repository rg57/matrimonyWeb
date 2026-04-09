import { AirplanemodeActive, Api } from "@mui/icons-material"
import axios from "axios"

// const API = axios.create({
//   baseURL: "http://192.168.29.104:3000/api", // change to your backend
// })
const API = axios.create({
  baseURL: "/api", // proxy to backend in development
})

export const getAllUsers = () => API.get("/user/admin/all")
export const getUserProfile = (id) => API.get(`/user/admin/full/${id}`)
export const blockUser = (id) => API.post(`/user/admin/block/${id}`)
export const deleteUser = (id) => API.post(`/user/admin/delete/${id}`)
