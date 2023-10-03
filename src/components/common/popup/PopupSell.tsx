import Image from 'next/image'
import React, { memo, useCallback, useEffect, useState } from 'react'
import { setNumSelling, setStep } from 'store/reducers/generate.slice'
import { RootState, useAppDispatch } from 'store'
import ModalTutorial from 'components/modal-tutorial'
import IconArrow from '../icon-arrow'
import { TEXT_DEF } from 'constants/text'
import { useRouter } from 'next/router'
import { useSelector } from 'react-redux'
import TitleTutorial from 'components/title-tutorial'
import { updateUserinfo } from 'store/reducers/user.reducer'

interface scoreLevel {
  saleType: string
  pointMin: number
  pointMax: number
}

interface Props {
  children?: React.ReactNode
  classNameWrapper?: string
  classBody?: string
  isButton?: boolean
  onHandleAgree?: () => void
  onHandleBank?: () => void
  messageText?: string
  messageText2?: string
  messageText3?: string
  numOwner?: number
  scoreLevel?: scoreLevel[]
  style?: string
  step?: number
  isSellingDone?: boolean
  error?: string
  time?: number
}

const PopupSell = ({
  children,
  classNameWrapper = 'relative flex h-[50%] w-full flex-col items-center justify-center',
  classBody = "flex h-full w-full items-center justify-center bg-[url('/images/bg_logout.png')] bg-contain bg-no-repeat",
  isButton,
  messageText,
  messageText2,
  messageText3,
  onHandleAgree,
  onHandleBank,
  numOwner,
  scoreLevel,
  style,
  step,
  isSellingDone,
  error,
  time
}: Props) => {
  const [input, setInput] = useState(false)
  const [qtySelling, setQtySelling] = useState<number>(1)
  const [countdown, setCountdown] = useState<any>(time)
  const router = useRouter()
  const dispatch = useAppDispatch()

  const arrayNum: any[] = []
  const maxQuantity: number = 30

  const isBeginner = useSelector(
    (state: RootState) => state?.user?.userInfo?.isBeginner
  )

  const isTutorial = useSelector(
    (state: RootState) => state?.generate?.isSuccessTutorial
  )

  useEffect(() => {
    if (time) {
      const timer = setInterval(() => {
        if (countdown > 0) {
          setCountdown(countdown - 1)
        } else {
          clearInterval(timer)
          router.push('/home')
        }
      }, 1000)

      return () => clearInterval(timer)
    }
  }, [countdown])

  for (let i = 1; i <= 12; i++) {
    arrayNum.push(
      numOwner && i > numOwner ? (
        <div
          className=' ml-[0.2rem] cursor-pointer border-b-2 text-center  text-[#717274] '
          key={i}
        >
          {i}
        </div>
      ) : (
        <div
          className=' ml-[0.2rem] cursor-pointer border-b-2 text-center '
          key={i}
          onClick={() => choosequantity(i)}
        >
          {i}
        </div>
      )
    )
  }

  const choosequantity = (num: number) => {
    setQtySelling(num)
    dispatch(setNumSelling(num))
    setInput(false)
  }

  const handleSetInput = (step: number) => {
    setInput(!input)
    dispatch(setStep(step + 1))
  }

  const handleRenderText = (step: number) => {
    console.log(step)

    switch (step) {
      case 1:
        return TEXT_DEF.choose_quantity
      case 2:
        return TEXT_DEF.sell_now
      default:
        return TEXT_DEF.text_agree
    }
  }

  const renderPosition = (step: number) => {
    if (isSellingDone) {
      return 'right-[7rem] bottom-[-1rem]'
    }
    if (isTutorial) {
      return 'right-[7rem] bottom-[10rem]'
    }
    switch (step) {
      case 1:
        return 'right-[9.5rem] bottom-[4rem]'
      case 6:
        return ''
      default:
        return 'left-[10rem] -bottom-[2rem]'
    }
  }

  const handleOffTutorial = useCallback(async () => {
    const data = {
      isBeginner: false
    }
    if (isBeginner == true) {
      await dispatch(updateUserinfo({ body: data }))
    }
    router.push('/home')
  }, [])

  return (
    <div className='background-config absolute left-0 top-0 z-20 flex h-full w-full items-center justify-center'>
      {isBeginner && <TitleTutorial onOffTutorial={handleOffTutorial} />}
      <div
        className={`${classNameWrapper} + ${
          isButton && router.pathname === '/warehouse' ? 'h-[56%]' : ''
        }`}
      >
        {style === 'confirm' && (
          <div className=' absolute left-[50%] top-[17.5%] font-bold text-white'>
            {messageText}
          </div>
        )}
        <div className={classBody}>
          <div
            className={`${
              style ? 'mt-10' : 'mt-24'
            } flex w-full flex-col items-center justify-center px-8 text-center text-base font-bold text-white`}
          >
            {isTutorial ? (
              <div className='mt-[20%] flex flex-col items-center justify-center px-6'>
                <span>{messageText}</span>
                <span className='mt-2'>{messageText2}</span>
              </div>
            ) : (
              <>
                {!style ||
                  (style !== 'confirm' && (
                    <span
                      className={`${
                        messageText2 === 'ĐĂNG XUẤT' ? 'text-2xl' : ''
                      }`}
                    >
                      {messageText}
                    </span>
                  ))}
                <div
                  className={`${
                    messageText2 === 'ĐĂNG XUẤT' ? 'text-2xl' : ''
                  }`}
                >
                  {messageText2}
                </div>
              </>
            )}
            <div>
              {scoreLevel &&
                scoreLevel.map((item: any, index) => (
                  <div key={index}>
                    {item.saleType}{' '}
                    {index == 1 ? ' 12 quả ' : index == 2 ? ' 30 quả ' : ' '} :{' '}
                    {item.pointMin} - {item.pointMax} Đ{' '}
                    {index == 0 ? '/ quả' : ''}
                  </div>
                ))}
            </div>
            <div className={`mt-4 uppercase ${style}`}>
              {messageText3} <span className='text-[#FCE308]'>{countdown}</span>
            </div>
            {isButton && (
              <div className="relative z-10 my-[10%] flex h-[6vh] w-[12vh] items-center justify-center bg-[url('/images/choose_num.png')] bg-[length:100%_100%]  text-center">
                <div className='mb-2 text-2xl'>
                  <span>{qtySelling}</span> |{' '}
                  <span
                    className={`cursor-pointer ${
                      input ? 'text-[#717274]' : ''
                    }`}
                    onClick={() => handleSetInput(step!)}
                  >
                    v
                  </span>
                </div>
              </div>
            )}
          </div>
          {isTutorial && (
            <div className='mt-[20%]'>
              <div className='cursor-pointer'>
                <Image
                  src={`/images/confirm.png`}
                  alt='btn_agree'
                  width={200}
                  height={80}
                  onClick={onHandleAgree}
                />
              </div>
            </div>
          )}
          {style && style === 'confirm' && (
            <div className='mt-8 flex h-[20%] w-full items-center justify-center'>
              <div className='mt-20 flex h-12 w-[60%] justify-center'>
                <div className='cursor-pointer'>
                  <Image
                    src={`/images/btn_agree.png`}
                    alt='btn_agree'
                    width={200}
                    height={80}
                    onClick={onHandleAgree}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
        {style !== 'confirm' && !isTutorial && !time && (
          <div className='mt-4 flex h-[20%] w-full items-center justify-center'>
            <div className='flex h-12 w-[60%] justify-between'>
              <div className='cursor-pointer'>
                <Image
                  src={`/images/${
                    error === '500'
                      ? 'btn_reload'
                      : router.pathname === '/'
                      ? 'btn_cskh'
                      : !style
                      ? 'sell_now'
                      : 'btn_agree'
                  }.png`}
                  alt='btn_agree'
                  width={200}
                  height={80}
                  onClick={onHandleAgree}
                />
              </div>

              <div className='cursor-pointer'>
                <Image
                  src={`/images/${
                    error === '500' ? 'btn_outgame' : 'btn_back'
                  }.png`}
                  alt='btn_agree'
                  width={200}
                  height={80}
                  onClick={onHandleBank}
                />
              </div>
            </div>
          </div>
        )}
        {router.pathname !== '/' && isBeginner && !isTutorial && (
          <>
            <ModalTutorial
              className="absolute -bottom-[12rem] z-20 flex h-[12rem] w-[23rem] items-center justify-center bg-[url('/images/note.png')] bg-[length:100%_100%] bg-no-repeat"
              textTutorialTop={TEXT_DEF.click_here}
              textTutorialBottom={handleRenderText(step!)}
            />

            <IconArrow
              className={`absolute ${renderPosition(
                step!
              )} z-20 -rotate-[40deg]`}
              width={50}
              height={50}
            />
          </>
        )}
      </div>

      {input && (
        <div className='absolute mb-[5%] flex h-[36.5%] w-[50%] items-center justify-end'>
          <div className="h-full w-[16%] bg-[url('/images/input_WM.png')] bg-[length:100%_100%] ">
            <div className='absolute mt-[5px] h-[95%] w-[30px] overflow-y-scroll pl-[0.15rem] font-bold text-white'>
              {arrayNum}
              {numOwner &&
              (numOwner > maxQuantity || numOwner == maxQuantity) ? (
                <div
                  className='mx-1 cursor-pointer text-center'
                  onClick={() => choosequantity(maxQuantity)}
                >
                  {maxQuantity}
                </div>
              ) : (
                <div className='mx-1 cursor-pointer text-center text-[#717274]'>
                  {maxQuantity}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default PopupSell
