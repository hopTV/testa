import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { TEXT_DEF } from 'constants/text'
import { getRules } from 'action/rulesApi'

const Rules = () => {
  const [rule, setRule] = useState<any[]>([])
  const [content, setContent] = useState<any[]>([])

  const takeRules = async () => {
    let kw = { module: 'REGULATION' }
    let rl = []
    let ct = []

    const res: any = await getRules(kw)

    if (res?.data?.result[0]) {
      let data = res?.data?.result[0]
      ct = data?.find((e: any) => e.item === 'content').value
      rl = data?.find((e: any) => e.item === 'rule').value

      setContent(ct?.split('\n'))
      setRule(rl?.split('\n'))
    } else {
      setContent([])
      setRule([])
    }
  }

  useEffect(() => {
    takeRules()
  }, [])

  return (
    <>
      <div className='relative top-10 mb-[8rem] flex h-[full] w-full flex-col items-center justify-center'>
        <div className='relative w-[35vh]'>
          <Image
            src={'/images/rules_title.png'}
            alt='logo'
            height={260}
            width={340}
          />
        </div>

        <div className='mt-4 flex h-[50vh] w-[90%] flex-wrap items-center justify-center rounded-lg bg-[#B05B08] p-2 text-left'>
          <div className=' h-[48vh] overflow-y-auto rounded-lg bg-[#7A2D03] p-4'>
            <div className='flex flex-col'>
              <div className='relative flex flex-col gap-x-1'>
                <div className='text-lg font-bold text-[#FAFF09] underline underline-offset-4'>
                  1. {TEXT_DEF.rules}
                </div>
                <div className='font-semibold text-white'>
                  {rule.length > 0 &&
                    rule.map((item: any, index: number) => (
                      <div key={index}>{item}</div>
                    ))}
                </div>
              </div>

              <div className='flex flex-col gap-x-1'>
                <div className='text-lg font-bold text-[#FAFF09] underline underline-offset-4'>
                  2. {TEXT_DEF.program}
                </div>
                <div className='font-semibold text-white'>
                  {content.length > 0 &&
                    content.map((item: any, index: number) => (
                      <div key={index}>{item}</div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className='relative mt-4 cursor-pointer'>
          <Image src={'/images/tutor.png'} alt='logo' height={20} width={200} />
        </div>
      </div>
    </>
  )
}

export default Rules
