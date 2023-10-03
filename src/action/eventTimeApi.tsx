import { EVENT_TIME, GET_ALL } from 'network/key'
import axios from 'axios'

const uri = `${process.env.NEXT_PUBLIC_API_URL}${EVENT_TIME}/${GET_ALL}?take=31&skip=1&order=DESC&keyword=null`

export const getEventTime = async () => {
  const network = { url: `${uri}` }

  try {
    return await axios.get(uri)
  } catch (error) {
    return error
  }
}
