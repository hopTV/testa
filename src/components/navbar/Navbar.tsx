import React, { useCallback, useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/router'
import PopupSell from 'components/common/popup/PopupSell'
// import useSound from 'use-sound'

const Navbar = () => {
  const [isShow, setIsShow] = useState<boolean>(false)
  const [audioStatus, changeAudioStatus] = useState(true)
  const [isLogout, setIsLogout] = useState<boolean>(false)
  // const audio = useMemo(() => new Audio('./audio/song.mp3'), [])
  const router = useRouter()
  // const [play, { stop }] = useSound('./audio/song.mp3')

  // useEffect(() => {
  //   if (audioStatus) {
  //     play()
  //   } else {
  //     stop()
  //   }
  // })

  // const handleAudio = () => {
  //   changeAudioStatus(!audioStatus)
  //   if (audioStatus) {
  //     play()
  //   } else {
  //     stop()
  //   }
  // }

  const handleLogout = () => {
    if (router.pathname === '/home') {
      localStorage.clear()
      setIsLogout(true)
      setIsShow(true)
    } else {
      history.back()
    }
  }

  const handleAgree = useCallback(() => {
    if (router.pathname !== '/') {
      router.push('/home')
    }
    if (router.pathname === '/home') {
      localStorage.removeItem('auth')
      router.push('/')
    } else {
      router.push('https://vnn8d.com')
    }
  }, [])

  const handleBank = useCallback(() => {
    setIsShow(false)
  }, [])

  return (
    <>
      {!isShow ? (
        <header
          className='fixed left-0 right-0 top-0 z-[3] flex w-full'
          style={{ justifyContent: 'center', height: '3.5rem' }}
        >
          <div className='flex w-full flex-col items-center pt-3'>
            <div
              className={`relative flex w-full max-w-[450px] justify-${
                router.pathname !== '/' && router.pathname !== '/event'
                  ? 'between'
                  : 'end'
              } px-6`}
            >
              {router.pathname !== '/' && router.pathname !== '/event' ? (
                <div
                  className='relative z-10 h-12 w-12 cursor-pointer'
                  onClick={handleLogout}
                >
                  <Image
                    src={'/images/back_header.png'}
                    alt='backIcon'
                    fill
                    priority
                  />
                </div>
              ) : null}
              <div
                className='relative z-10 h-12 w-12 cursor-pointer'
                // onClick={handleAudio}
              >
                <Image
                  src={`/images/${audioStatus ? 'music' : 'mute_music'}.png`}
                  alt='iconMusic'
                  fill
                  priority
                />
              </div>
            </div>
          </div>
        </header>
      ) : (
        <PopupSell
          classBody="flex h-[60%] w-[80%] items-center justify-center bg-[url('/images/bg_login_err.png')] bg-[length:100%_100%] bg-no-repeat px-[2rem] -mb-[2.5rem] uppercase"
          onHandleAgree={handleAgree}
          onHandleBank={handleBank}
          messageText={'BẠN MUỐN'}
          messageText2={'ĐĂNG XUẤT'}
          style={'uu'}
        />
      )}
    </>
  )
}

export default Navbar
