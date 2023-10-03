import { AxiosError, AxiosRequestConfig, AxiosResponse, Method } from 'axios'
import { AUTHORIZATION_KEY, CONTENT_TYPE_KEY } from './key'
import { ErrorResponse, ResponseBase } from 'interfaces/response-base.interface'
import axiosInstance from './axios'
import { INetwork } from 'interfaces/network.interface'

const handleResponseAxios = <T = any>(
  res: AxiosResponse<any>
): ResponseBase<T> => {
  const { statusCode, status, data, message } = res.data
  return {
    statusCode,
    status,
    data,
    message
  }
}

const handleAxiosError = <T = any>(error: AxiosError): ErrorResponse<T> => {
  const { statusCode, status, data, message, path, timestamp } =
    error.response as any
  return {
    statusCode,
    status,
    data,
    message,
    path,
    timestamp
  }
}

function Request<T = unknown>(config: AxiosRequestConfig, isCheckOut = true) {
  // const router = useRouter()
  // Sai ở đây sửa lại chỗ này
  const token =
    localStorage.getItem('user') &&
    JSON.parse(localStorage.getItem('auth') || '')
  // const { token } = getState("auth");
  if (!token) {
    location.assign('/')
  }

  const defaultConfig: AxiosRequestConfig = {
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    timeout: Number(process.env.TIMEOUT_MIL_SEC) || 10000,
    headers: {
      [CONTENT_TYPE_KEY]: 'application/json',
      // Sai ở đây sửa lại chỗ này
      [AUTHORIZATION_KEY]:
        'Bearer ' + token?.token || config.headers?.[AUTHORIZATION_KEY] || ''
    }
  }

  return new Promise<ResponseBase<T> | null>((rs) => {
    axiosInstance
      .request({ ...defaultConfig, ...config })
      .then((res: AxiosResponse<T>) => {
        const result = handleResponseAxios(res)
        rs(result)
      })
      .catch((error: AxiosError) => {
        console.log({ error })
        const result = handleAxiosError(error)
        if (!isCheckOut) {
          rs(result)
        }
        if (result.statusCode === 401 && isCheckOut) {
          rs(null)
        } else {
          rs(result)
        }
      })
  })
}

export const handleParameter = <T extends INetwork>(
  props: T,
  method: Method
): AxiosRequestConfig => {
  const { url, body, params } = props
  return {
    ...props,
    method,
    url,
    data: body,
    params
  }
}

// get
async function Get<T>(params: INetwork) {
  return Request<T>(handleParameter(params, 'GET'))
}

// post
async function Post<T>(params: INetwork) {
  return Request<T>(handleParameter(params, 'POST'))
}
// patch
async function Patch<T>(params: INetwork) {
  return Request<T>(handleParameter(params, 'PATCH'))
}

// put
async function Put<T>(params: INetwork) {
  return Request<T>(handleParameter(params, 'PUT'))
}

// put
async function Delete<T>(params: INetwork) {
  return Request<T>(handleParameter(params, 'DELETE'))
}

export const networkService = {
  Request,
  Get,
  Post,
  Put,
  Delete,
  Patch
}
