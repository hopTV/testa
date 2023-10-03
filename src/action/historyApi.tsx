import { networkService } from 'network/service'
import { LANDS, SALE_HIS, GET_USER_ALL, GET_USER_FIND } from 'network/key'

const uriDrill = `${LANDS}/${GET_USER_ALL}?take=31&skip=1&order=DESC&keyword=`
const uriHarvest = `${LANDS}/${GET_USER_FIND}?take=31&skip=1&order=DESC&keyword=`
const uriSell = `${SALE_HIS}/${GET_USER_ALL}?take=31&skip=1&order=DESC&keyword=`

interface reqHisSell {
  sendAwardStatus: String
  startYearMonth: String
}

export const getHistoryDrill = async (kw: any) => {
  if (!kw) return

  const network = { url: `${uriDrill}${JSON.stringify(kw)}` }

  try {
    return await networkService.Get(network)
  } catch (error) {
    return error
  }
}

export const getHistoryHarvest = async (kw: any) => {
  if (!kw) return

  const network = { url: `${uriHarvest}${JSON.stringify(kw)}` }

  try {
    return await networkService.Get(network)
  } catch (error) {
    return error
  }
}

export const getHistorySell = async (kw: reqHisSell) => {
  if (!kw) return

  const network = { url: `${uriSell}${JSON.stringify(kw)}` }

  try {
    return await networkService.Get(network)
  } catch (error) {
    return error
  }
}
