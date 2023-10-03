import axios from 'axios'

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: Number(process.env.TIMEOUT_MIL_SEC) || 10000
})

export default axiosInstance
