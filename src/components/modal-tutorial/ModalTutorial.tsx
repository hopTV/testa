import React from 'react'

interface Props {
  textTutorialTop?: (string | undefined)[] | string
  textTutorialBottom?: (string | undefined)[] | string
  className?: string
}

const ModalTutorial = ({
  textTutorialTop,
  textTutorialBottom,
  className = "absolute -top-[9rem] z-20 flex h-[12rem] w-[23rem] items-center justify-center bg-[url('/images/note.png')] bg-[length:100%_100%] bg-no-repeat"
}: Props) => {
  return (
    <div className={className}>
      <div className='mb-6 flex w-[30%] flex-col items-center justify-center px-3'>
        <div className='px-[3px] text-center font-["Baloo+2"] text-xl font-bold italic leading-5 text-[#fff]'>
          {textTutorialTop}
        </div>
        <div className='mt-1 text-center font-["Baloo+2"] text-[15px] font-bold leading-5 text-[#222]'>
          {textTutorialBottom}
        </div>
      </div>
    </div>
  )
}

export default ModalTutorial
