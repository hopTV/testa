import { POST_LOGIN } from 'network/key'
import axios from 'axios'
const url: any = process.env.NEXT_PUBLIC_API_URL + POST_LOGIN

export const handleLogin = async (userName: String = '') => {
  if (!userName) return

  const params = {
    username: userName,
    password: 'jtmbdguF@Jcuf%5dhRMQrjj',
    is_admin: false,
    mac: '00:1A:C2:7B:00:47',
    ip: '210.24.209.42' //I don't know what'sit?
  }
  let res: any = {}
  try {
    res = await axios.post(url, params)
    const data = res.data?.data

    return data
  } catch (error) {
    return error
  }
}
