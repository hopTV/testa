import IconArrow from 'components/common/icon-arrow'
import ModalTutorial from 'components/modal-tutorial'
import { TEXT_DEF } from 'constants/text'
import Image from 'next/image'
import { useRouter } from 'next/router'
import React, { memo, useState } from 'react'
import { useSelector } from 'react-redux'
import { RootState, useAppDispatch } from 'store'
import { setTabActive } from 'store/reducers/history.slice'

const FooterChild = () => {
  // const [tabActive, setTabActive] = useState<number>(1)
  const dispatch = useAppDispatch()

  const router = useRouter()
  const path: String = router.pathname

  const isStore = useSelector((state: RootState) => state?.generate?.isStore)

  const isBeginner = useSelector((state: RootState) => state?.user?.isBeginner)

  const tabActive: any = useSelector(
    (state: RootState) => state.history.tabActive
  )

  const setTab = (num: number) => {
    dispatch(setTabActive(num))
  }

  const goToHis = () => {
    router.push('/history')
  }

  const goToHome = () => {
    router.push('/home')
  }

  const goToRules = () => {
    router.push('/rules')
  }

  const goToWareHouse = () => {
    router.push('/warehouse')
  }

  return (
    <div className='absolute bottom-0 left-0 flex w-full flex-col items-center pb-4 pt-3'>
      <div className='relative flex w-full max-w-[450px] items-center justify-between px-6'>
        {/* LEFT */}
        {path === '/rules' ? (
          <div
            className='relative z-10 h-16 w-20 cursor-pointer max-sm:h-12 max-sm:w-16'
            onClick={goToHome}
          >
            <Image src={'/images/footHome.png'} alt='backIcon' fill priority />
          </div>
        ) : path === '/history' ? (
          <div
            className={`relative ${
              tabActive == 1
                ? `h-24 w-32 max-sm:h-20 max-sm:w-24`
                : `h-20 w-24 max-sm:h-16 max-sm:w-20`
            } cursor-pointer`}
            onClick={() => setTab(1)}
          >
            <Image
              src={`/images/${
                tabActive == 1 ? `gieohat_active` : `gieohat`
              }.png`}
              alt='backIcon'
              fill
              priority
            />
          </div>
        ) : (
          <div
            className='relative z-10 h-16 w-20 cursor-pointer max-sm:h-12 max-sm:w-16'
            onClick={goToRules}
          >
            <Image src={'/images/footRules.png'} alt='backIcon' fill priority />
          </div>
        )}
        {/* MID */}
        {path === '/home' ? (
          <div
            className='relative z-10 flex h-24 w-32 cursor-pointer items-center justify-center max-sm:h-20 max-sm:w-24'
            onClick={goToWareHouse}
          >
            <Image src={`/images/footKho.png`} alt='backIcon' fill priority />
            {isStore && isBeginner && (
              <>
                <ModalTutorial
                  className="absolute bottom-[2rem] flex h-[12rem] w-[23rem] items-center justify-center
                bg-[url('/images/note.png')] bg-[length:100%_100%] bg-no-repeat md:-bottom-[3rem]"
                  textTutorialTop={TEXT_DEF.click_here}
                  textTutorialBottom={TEXT_DEF.store}
                />
                <IconArrow
                  className='absolute bottom-[3rem] right-[-3rem] z-20 rotate-[210deg] md:bottom-[-3rem] md:left-[15rem]'
                  width={60}
                  height={60}
                />
              </>
            )}
          </div>
        ) : path === '/history' ? (
          <div
            className={`relative ${
              tabActive == 2
                ? `h-24 w-32 max-sm:h-20 max-sm:w-24`
                : `h-20 w-24 max-sm:h-16 max-sm:w-20`
            } cursor-pointer`}
            onClick={() => setTab(2)}
          >
            <Image
              src={`/images/${
                tabActive == 2 ? `thuhoach_active` : `thuhoach`
              }.png`}
              alt='backIcon'
              fill
              priority
            />
          </div>
        ) : null}
        {/* RIGHT */}
        {path === '/rules' || path === '/warehouse' || path === '/home' ? (
          <div
            className='relative z-10 h-16 w-20 cursor-pointer max-sm:h-12 max-sm:w-16'
            onClick={goToHis}
          >
            <Image src={'/images/footHis.png'} alt='iconMusic' fill priority />
          </div>
        ) : path === '/history' ? (
          <div
            className={`relative ${
              tabActive == 3
                ? `h-24 w-32 max-sm:h-20 max-sm:w-24`
                : `h-20 w-24 max-sm:h-16 max-sm:w-20`
            } cursor-pointer`}
            onClick={() => setTab(3)}
          >
            <Image
              src={`/images/${
                tabActive == 3 ? `diemnhan_active` : `diemnhan`
              }.png`}
              alt='backIcon'
              fill
              priority
            />
          </div>
        ) : null}
      </div>
    </div>
  )
}

export default memo(FooterChild)
