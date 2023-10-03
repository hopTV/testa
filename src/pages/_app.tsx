import '../styles/globals.css'
import '../styles/custom.css'
import React, { useEffect, useState } from 'react'
import DefaultLayout from 'layouts/default'
import ErrorBoundary from 'containers/error-boundary'

import 'primereact/resources/primereact.min.css' //core css
import 'primeicons/primeicons.css'
import 'primereact/resources/themes/rhea/theme.css'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import 'react-spring-bottom-sheet/dist/style.css'

import { AppPropsWithLayout } from 'types/layout.type'

import { store, persistor, useAppDispatch } from 'store'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { bannersConst } from 'constants/text'
import { getEventTime } from 'action/eventTimeApi'
import router from 'next/router'

export default function App({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout =
    Component.getLayout ??
    ((page) => (
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <DefaultLayout>{page}</DefaultLayout>
        </PersistGate>
      </Provider>
    ))

  const [index, setIndex] = useState<number>(0)
  const [bannerLeft, setBannerLeft] = useState<any>(bannersConst[0])
  const [bannerRight, setBannerRight] = useState<any>(bannersConst[1])
  // const [backgroundPC, setBackgroundPC] = useState<any>()
  const [banners, setBanners] = useState<any>(bannersConst)
  // const dispatch = useAppDispatch()

  const getEvent = async () => {
    const res: any = await getEventTime()
    let data = res?.data?.data?.result[0]
    if (data[0]?.isLock) {
      router.push('/event')
    }
  }

  useEffect(() => {
    const interval = setInterval(() => {
      getEvent()
    }, 30000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      if (index < 4) {
        setBannerLeft(banners[index])
        setBannerRight(index === 3 ? banners[0] : banners[index + 1])
        setIndex(index + 1)
      } else {
        setIndex(0)
      }
    }, 5000)
    return () => clearInterval(interval)
  }, [index])

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <div className='layout-pc flex flex-row'>
          <div className='banner'>
            <div className='banner-img'>
              <img src={bannerLeft} />
            </div>
          </div>
          <ErrorBoundary onReset={() => window.location.reload()}>
            {getLayout(<Component {...pageProps} />)}
          </ErrorBoundary>
          <div className='banner'>
            <div className='banner-img'>
              <img src={bannerRight} />
            </div>
          </div>
        </div>
      </PersistGate>
    </Provider>
  )
}
