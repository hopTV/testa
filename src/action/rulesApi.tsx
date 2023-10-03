import { networkService } from 'network/service'
import { SYS_CONFIG, GET_ALL } from 'network/key'

const uri = `${SYS_CONFIG}/${GET_ALL}?take=31&skip=1&order=DESC&keyword=`

export const getRules = async (kw: any) => {
  if (!kw) return

  const network = { url: `${uri}${JSON.stringify(kw)}` }

  try {
    return await networkService.Get(network)
  } catch (error) {
    return error
  }
}
