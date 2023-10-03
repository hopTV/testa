import { AxiosRequestConfig } from 'axios'

export interface INetwork {
  url: string
  params?: any
  body?: any
  headers?: AxiosRequestConfig['headers']
}
