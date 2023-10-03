import { TEXT_DEF } from 'constants/text'
import React, { memo } from 'react'
interface Props {
  onOffTutorial: () => void
}

const TitleTutorial = ({ onOffTutorial }: Props) => {
  return (
    <div
      className={`fixed left-0 top-0 z-30 mt-[12%] flex h-[3.5rem] w-full items-center justify-center bg-[url('/images/bg_instruct.png')] 
bg-contain bg-center bg-no-repeat text-sm font-bold text-gray-600 md:mt-10`}
    >
      <div className='py-2' onClick={onOffTutorial}>
        {TEXT_DEF.text_desc}
      </div>
    </div>
  )
}

export default memo(TitleTutorial)
