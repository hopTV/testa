import moment from 'moment'
import React, { useState, useEffect } from 'react'

const Clock = ({ start }: any) => {
  const [days, setDays] = useState<number>()
  const [hours, setHours] = useState<number>()
  const [minutes, setMinutes] = useState<number>()
  const [seconds, setSeconds] = useState<number>()

  let Interval: any

  const countdown = async () => {
    Interval = await setInterval(() => {
      const destination = new Date(start).getTime()
      const now = new Date().getTime()
      const differnt = destination - now
      const oneD = 1000 * 60 * 60 * 24
      const days = Math.floor(differnt / oneD)
      const hours = Math.floor((differnt % oneD) / (1000 * 60 * 60))
      const minutes = Math.floor((differnt % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((differnt % (1000 * 60)) / 1000)

      if (destination < 0) {
        clearInterval(Interval.current)
      } else {
        setDays(days)
        setHours(hours)
        setMinutes(minutes)
        setSeconds(seconds)
      }
    }, 1000)
  }

  useEffect(() => {
    countdown()
  })

  return (
    <div className='clock_wrapper flex items-center gap-5 font-bold'>
      <div className='clock_data flex items-center gap-3 '>
        <div>
          <div className='min-w-[60px] rounded-xl border-2 bg-[#71610D] p-4 text-center text-2xl text-white'>
            {days}
          </div>
          <h5 className='text-center text-xl italic text-black'>Ngày</h5>
        </div>
      </div>

      <div className='clock_data flex items-center gap-3 '>
        <div>
          <div className='min-w-[60px] rounded-xl border-2 bg-[#71610D] p-4 text-center text-2xl text-white'>
            {hours}
          </div>
          <h5 className='text-center text-xl italic text-black'>Giờ</h5>
        </div>
      </div>

      <div className='clock_data flex items-center gap-3 '>
        <div>
          <div className='min-w-[60px] rounded-xl border-2 bg-[#71610D] p-4 text-center text-2xl text-white'>
            {minutes}
          </div>
          <h5 className='text-center text-xl italic text-black'>Phút</h5>
        </div>
      </div>

      <div className='clock_data flex items-center gap-3 '>
        <div>
          <div className='min-w-[60px] rounded-xl border-2 bg-[#71610D] p-4 text-center text-2xl text-white'>
            {seconds}
          </div>
          <h5 className='text-center text-xl italic text-black'>Giây</h5>
        </div>
      </div>
    </div>
  )
}

export default Clock
