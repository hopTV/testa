import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { TEXT_DEF } from 'constants/text'
import router from 'next/router'
import { getEventTime } from 'action/eventTimeApi'
import Clock from './ui/Clock'
import { useSelector } from 'react-redux'
import { RootState } from 'store'
import moment from 'moment'

const Event = () => {
  const [start, setStart] = useState<any>('')
  const isComingSoon: boolean = useSelector(
    (state: RootState) => state.history.comingSoon
  )

  const goToCSKH = () => {
    router.push('https://wuyue.smxjoiai.xyz/')
  }

  const getMaintenance = async () => {
    const res: any = await getEventTime()

    let data = res?.data?.data?.result?.[0]
    if (
      !data[0]?.isLock &&
      moment(data[0]?.start).subtract(8, 'hours') < moment()
    ) {
      router.push('/')
    }
    setStart(moment(data[0]?.start).subtract(8, 'hours').format('lll'))
    console.log(moment(data[0]?.start).subtract(8, 'hours').format('lll'))
  }

  useEffect(() => {
    getMaintenance()
  }, [])

  return (
    <>
      <div className='relative mt-8 flex w-full flex-col items-center'>
        <div className='relative h-[11rem] w-[70%]'>
          <Image src={'/images/logo.png'} alt='logo' fill />
        </div>
        <div className='relative h-[28vh] w-[70%] '>
          <Image
            src={'/images/title_login.png'}
            alt='title-bg'
            fill
            className='flex shrink-0'
          />
        </div>

        <div className='relative my-4 h-[2rem] w-[70%]'>
          <Image
            src={`/images/${isComingSoon ? 'coming_soon' : 'maintenance'}.png`}
            alt='title-bg'
            fill
            className='flex'
          />
        </div>
        {isComingSoon ? (
          <>
            <div className='relative my-4 flex h-[5rem] w-[75%] items-center justify-center'>
              <Clock start={start} />
            </div>
          </>
        ) : (
          <>
            <div className='mt-[5%] w-[65%] text-center text-base font-semibold text-white'>
              {TEXT_DEF.maintenance}
            </div>
          </>
        )}

        <div
          className='relative mt-4 h-[3rem] w-[25%] cursor-pointer'
          onClick={goToCSKH}
        >
          <Image
            src={'/images/btn_cskh.png'}
            alt='cskh'
            fill
            className='flex'
          />
        </div>
      </div>
    </>
  )
}

export default Event
