import { networkService } from 'network/service'
import {
  WAREHOUSE,
  WAREHOUSE_SELL,
  GET_ALL,
  GET_BYUSER,
  POST_SELL_CF
} from 'network/key'

const uri1 = `${WAREHOUSE}/${GET_ALL}?take=31&skip=1&order=DESC&keyword=null`

interface SellBody {
  watermelonNumber: number
  saleType: any
}

export const getWaterMelon = async () => {
  // if (!body) return

  const network = { url: `${uri1}` }

  try {
    return await networkService.Get(network)
  } catch (error) {
    return error
  }
}

export const getScoreLevel = async () => {
  // if (!body) return

  const network = { url: `${WAREHOUSE_SELL}/${GET_BYUSER}` }

  try {
    return await networkService.Get(network)
  } catch (error) {
    return error
  }
}

export const postSellingConFirm = async (body: SellBody) => {
  if (!body) return

  const network = {
    url: `${WAREHOUSE_SELL}/${POST_SELL_CF}`,
    body: body
  }

  try {
    return await networkService.Post(network)
  } catch (error) {
    return error
  }
}
