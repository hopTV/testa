import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { TEXT_DEF } from 'constants/text'
import { ACCOUNT } from 'interfaces/validate.interface'
import { handleLogin } from 'action/authApi'
import { IAuth } from 'store/reducers/auth.reducer'
import PopupSell from 'components/common/popup/PopupSell'
import { getEventTime } from 'action/eventTimeApi'
import moment from 'moment'
import { setComingSoon } from 'store/reducers/history.slice'
import { useAppDispatch } from 'store'
import Popup from 'components/common/popup'
import { getUserInfo } from 'store/reducers/user.reducer'

const Login = () => {
  const [isShow, setIsShow] = useState<boolean>(false)
  const [validate, setValidate] = useState<ACCOUNT>()
  const [userName, setUserName] = useState<string>('')
  const [loginDone, setLoginDone] = useState<boolean>(false)
  const router = useRouter()
  const dispatch = useAppDispatch()

  useEffect(() => {
    const authToken = localStorage.getItem('auth')
    if (authToken) {
      router.push('/home')
    }
  }, [])

  const actionLogin = async () => {
    if (!userName) return

    let data: any = await handleLogin(userName)
    if (!data?.response) {
      setLoginDone(true)
      setIsShow(true)

      const dataAuth: IAuth = {
        token: data?.access_token,
        refresh_token: data?.access_token
      }

      localStorage.setItem('auth', JSON.stringify(dataAuth))
      const userInfoSys = {
        userName: data?.user?.username,
        userId: data?.user?.sub
      }
      localStorage.setItem('user', JSON.stringify(userInfoSys))
      dispatch(getUserInfo())
      // router.push('/home')
    } else {
      let message = data?.response?.data?.message
      if (message?.message === 'Unconditional account') {
        setValidate('unconditional')
      } else if (message?.error?.code === 13) {
        setValidate('not_exist')
      } else {
        setValidate('500')
      }
      setIsShow(true)
    }
  }

  useEffect(() => {
    if (router.pathname === '/') {
      localStorage.removeItem('persist:root')
    }
  }, [])

  useEffect(() => {}, [validate])

  const handleLogout = () => {
    setIsShow(true)
  }

  const handleAgree = () => {
    if (router.pathname === '/') {
      window.location.reload()
    }
  }

  const handleBack = () => {
    if (router.pathname === '/' && validate === '500') {
      router.push('https://vnn8d.com')
    }
    setIsShow(false)
  }

  const handleSignup = () => {
    router.push('https://vnn8d.com/signup')
  }

  const getEvent = async () => {
    const res: any = await getEventTime()
    let data = res?.data?.data?.result[0]

    if (moment(data?.[0]?.start).subtract(8, 'hours') > moment()) {
      dispatch(setComingSoon(true))
      router.push('/event')
    }
  }

  useEffect(() => {
    getEvent()
  }, [])

  const renderText = () => {
    return validate === 'unconditional' || validate === 'not_exist'
      ? TEXT_DEF.account
      : TEXT_DEF.network
  }

  const renderText2 = () => {
    return validate === 'unconditional'
      ? TEXT_DEF.unconditional
      : validate === 'not_exist'
      ? TEXT_DEF.not_exist
      : ''
  }

  const renderText3 = () => {
    return validate === 'unconditional' || validate === 'not_exist'
      ? ''
      : TEXT_DEF.try_again
  }

  return (
    <>
      <div className='relative mt-3 flex w-full flex-col items-center'>
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
        <div className='relative mt-4 h-[4rem] w-[70%]'>
          <Image
            src={'/images/login.png'}
            alt='title-bg'
            fill
            className='flex'
          />
          <div className='relative mt-4 text-center text-[#DFD5D5]'>
            <input
              type='text'
              placeholder={TEXT_DEF.login}
              onChange={(e: any) => setUserName(e.target.value.toLowerCase())}
              onInput={(e: any) =>
                (e.target.value = e.target.value.replace(/[^a-zA-Z0-9]/g, ''))
              }
              maxLength={20}
            />
          </div>
        </div>

        <>
          <div className='mt-[5%] flex w-full items-center justify-center'>
            <div
              className='relative h-[10rem] w-[60%] cursor-pointer'
              onClick={actionLogin}
            >
              <Image src={'/images/button_login.png'} alt='btn-login' fill />
            </div>
          </div>
          <div className='flex w-full items-center justify-center'>
            <div className='relative'>
              <span className='text-sm text-white'>{TEXT_DEF.no_acc}</span>
              <span
                className='cursor-pointer font-bold'
                style={{
                  color: '#9F0D27',
                  textShadow:
                    '2px 0 0 #fff, -2px 0 0 #fff, 0 2px 0 #fff, 0 -2px 0 #fff, 1px 1px #fff, -1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff'
                }}
                onClick={handleSignup}
              >
                {TEXT_DEF.signup}
              </span>
            </div>
          </div>
        </>
      </div>

      {isShow && (
        <PopupSell
          classBody="flex h-[60%] w-[80%] items-center justify-center bg-[url('/images/bg_login_err.png')] bg-[length:100%_100%] bg-no-repeat px-[2rem] -mb-[2.5rem] uppercase"
          onHandleAgree={handleAgree}
          onHandleBank={handleBack}
          messageText={!loginDone ? renderText() : TEXT_DEF.LOGIN}
          messageText2={!loginDone ? renderText2() : TEXT_DEF.DONE}
          messageText3={!loginDone ? renderText3() : TEXT_DEF.WAITING}
          style={!loginDone ? 'text-[#FCE308] lowercase' : 'lowercase'}
          error={validate === '500' ? '500' : ''}
          time={loginDone ? 5 : undefined}
        />
      )}
    </>
  )
}

export default Login
