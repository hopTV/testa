import Image from 'next/image'
import React, { type RefObject, memo, useRef } from 'react'
import { isElementAccessChain } from 'typescript'

interface Props {
  refProp?: RefObject<HTMLDivElement>
  children?: React.ReactNode
  classNameWrapper?: string
  classBody?: string
  isButton?: boolean
  onHandleAgree?: () => void
  onHandleBank?: () => void
  messageText?: string
  isElementButton?: boolean
  messageDesc?: string
  classTextTitle?: string
}

const Modal = ({
  refProp,
  children,
  classNameWrapper = 'flex h-[50%] w-full flex-col items-center justify-center',
  classBody = "flex h-full w-[90%] items-center justify-center bg-[url('/images/bg_logout.png')] bg-contain bg-no-repeat",
  messageText,
  onHandleAgree,
  onHandleBank,
  isElementButton,
  messageDesc,
  classTextTitle = 'mt-7 w-full px-2 text-center text-xl font-bold text-white'
}: Props) => {
  return (
    <div className='background-config absolute left-0 top-0 z-40 flex h-full w-full items-center justify-center'>
      <div className={classNameWrapper}>
        <div
          className={classBody}
          style={{ backgroundSize: '100% 100%' }}
          ref={refProp}
        >
          <div className={classTextTitle}>
            <span className='text-md font-[Montserrat] font-bold leading-5'>
              {messageText}
            </span>
            <span className='text-md mt-2 font-[Montserrat] font-bold leading-5'>
              {messageDesc}
            </span>
          </div>
        </div>
        {!isElementButton && (
          <div className='flex h-[20%] w-full justify-center'>
            <div className='flex h-12 w-[75%] justify-between'>
              <div className='cursor-pointer'>
                <Image
                  src={'/images/btn_agree.png'}
                  alt='btn_agree'
                  width={120}
                  height={60}
                  onClick={onHandleAgree}
                />
              </div>

              <div className='cursor-pointer'>
                <Image
                  src={'/images/btn_back.png'}
                  alt='btn_agree'
                  width={120}
                  height={60}
                  onClick={onHandleBank}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default memo(Modal)
