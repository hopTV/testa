import React, { useCallback, useEffect, useState } from 'react'
import Image from 'next/image'
import { TEXT_DEF } from 'constants/text'
import PopupSell from 'components/common/popup/PopupSell'
import {
  setIsSelling,
  setIsSellingConfirm,
  setIsSuccessTutorial,
  setNumSelling,
  setStep
} from 'store/reducers/generate.slice'
import { useSelector } from 'common/hooks/useSelector'
import { RootState, useAppDispatch } from 'store'
import IconArrow from 'components/common/icon-arrow'
import ModalTutorial from 'components/modal-tutorial'
import {
  getWaterMelon,
  getScoreLevel,
  postSellingConFirm
} from 'action/warehouseApi'
import TitleTutorial from 'components/title-tutorial'
import { SELLS } from 'constants/generate'
import { setUserInfo, updateUserinfo } from 'store/reducers/user.reducer'
import { useRouter } from 'next/router'

const Warehouse = () => {
  const [isSell, setIsSell] = useState<boolean>(false)
  const [isShowTutroial, setIsShowTutorrial] = useState<boolean>(true)
  const [numOwner, setNumOwner] = useState<number>(0)
  const [scoreLevel, setScoreLevel] = useState<any[]>([])
  const [awardPoint, setAwardPoint] = useState<number>(0)
  const [sellFail, setSellFail] = useState<string>()
  const dispatch = useAppDispatch()

  const router = useRouter()
  // const numOwner: number = 12
  const isSelling = useSelector((state: RootState) => state.generate.isSelling)
  const numSelling = useSelector(
    (state: RootState) => state.generate.numSelling
  )

  const isSellingDone = useSelector(
    (state: RootState) => state.generate.isSellingDone
  )

  const isBeginner = useSelector((state: RootState) => state?.user?.isBeginner)

  const step = useSelector((state: RootState) => state.generate.step)

  const isTutorial = useSelector(
    (state: RootState) => state.generate.isSuccessTutorial
  )

  const handleSelling = () => {
    dispatch(setStep(step + 1))
    setIsSell(false)
    dispatch(setIsSelling(true))
  }

  const renderTypeScore = (type = '') => {
    return scoreLevel?.find((e: any) => e.saleType === type)
  }

  const handleSellingConfirm = async () => {
    let body = {
      watermelonNumber: numSelling,
      saleType:
        numSelling < 12
          ? renderTypeScore('Bán lẻ')?.saleType
          : numSelling == 12
          ? renderTypeScore('Bán lô')?.saleType
          : renderTypeScore('Bán vựa')?.saleType
    }
    const res: any = await postSellingConFirm(body)
    if (isBeginner) {
      setAwardPoint(23.2)
    } else {
      if (res?.data?.code !== 40000 && res?.data?.result) {
        await getDataWM()
        setAwardPoint(res?.data?.result.awardPoint)
      } else {
        setSellFail(res?.data?.result)
      }
    }
    dispatch(setNumSelling(1))
    dispatch(setIsSelling(false))
    dispatch(setIsSellingConfirm(true))
  }

  const handleBack = () => {
    dispatch(setNumSelling(1))

    setIsSell(false)
    dispatch(setIsSelling(false))
    dispatch(setIsSellingConfirm(false))
    if (isSellingDone && isBeginner) {
      dispatch(setIsSuccessTutorial(true))
    }
  }

  const handleSell = () => {
    setIsSell(true)
    dispatch(setStep(step + 1))
    setIsShowTutorrial(false)
  }

  const getDataWM = async () => {
    const res: any = await getWaterMelon()
    const res2: any = await getScoreLevel()
    if (res.statusCode === 200 && res2.statusCode === 200) {
      let data = res?.data?.result[0]
      setNumOwner(data[0].inventory)

      let arr = []
      arr[0] = res2?.data?.result?.find((e: any) => e.saleType === 'Bán lẻ')
      arr[1] = res2?.data?.result?.find((e: any) => e.saleType === 'Bán lô')
      arr[2] = res2?.data?.result?.find((e: any) => e.saleType === 'Bán vựa')
      setScoreLevel(arr)
    }
  }

  useEffect(() => {
    if (isBeginner === false) {
      getDataWM()
    } else {
      setScoreLevel(SELLS)
      setNumOwner(45)
    }
  }, [])

  const rederText = () => {
    return numSelling < 12
      ? `${renderTypeScore('Bán lẻ')?.saleType} ${numSelling} ${
          TEXT_DEF.reedem
        } `
      : numSelling == 12
      ? `${renderTypeScore('Bán lô')?.saleType} ${numSelling} ${
          TEXT_DEF.reedem
        } `
      : `${renderTypeScore('Bán vựa')?.saleType} 30 ${TEXT_DEF.reedem} `
  }

  const rederText3 = () => {
    return numSelling < 12
      ? `${Number(
          (renderTypeScore('Bán lẻ')?.pointMin * numSelling).toFixed(1)
        )}  - ${Number(
          (renderTypeScore('Bán lẻ')?.pointMax * numSelling).toFixed(1)
        )} Đ`
      : numSelling == 12
      ? `${Number(
          (renderTypeScore('Bán lô')?.pointMin * 1).toFixed(1)
        )}  - ${Number((renderTypeScore('Bán lô')?.pointMax * 1).toFixed(1))} Đ`
      : `${Number(
          (renderTypeScore('Bán vựa')?.pointMin * 1).toFixed(1)
        )}  - ${Number(
          (renderTypeScore('Bán vựa')?.pointMax * 1).toFixed(1)
        )} Đ`
  }

  const handleSetUserInfo = useCallback(async () => {
    dispatch(setIsSuccessTutorial(false))
    const data = {
      isBeginner: false
    }
    await dispatch(updateUserinfo({ body: data }))
    await dispatch(setUserInfo(false))
    router.push('/home')
    window.location.href
  }, [])

  const handleOffTutorial = useCallback(async () => {
    const data = {
      isBeginner: false
    }
    if (isBeginner) {
      await dispatch(updateUserinfo({ body: data }))
      await dispatch(setUserInfo(false))
      router.push('/home')
    }
  }, [])

  return (
    <>
      {isBeginner && isShowTutroial && (
        <TitleTutorial onOffTutorial={handleOffTutorial} />
      )}
      <div className='relative -top-4 flex h-full w-full flex-col items-center'>
        <div
          className=" relative mt-[18vh] flex h-[40vh] w-[40vh] bg-[url('/images/numWaterMelon.png')]"
          style={{ backgroundSize: '100% 100%' }}
        >
          <div className='flex h-full w-full flex-col items-center justify-end pb-[15%]'>
            <div className='relative text-base font-semibold uppercase text-white'>
              {TEXT_DEF.numWaterMelon}
            </div>
            <div className='text-2xl font-extrabold text-white '>
              {numOwner ? numOwner : 0}
            </div>
          </div>
        </div>

        <div
          className='relative mt-[10%] flex w-[30%] cursor-pointer items-center justify-center'
          onClick={numOwner && numOwner > 0 ? handleSell : () => {}}
        >
          <Image
            src={`/images/${
              numOwner && numOwner > 0 ? 'sell' : 'sell_dis'
            }.png`}
            alt='logo'
            height={80}
            width={200}
          />
          {isShowTutroial && isBeginner && step === 0 && (
            <>
              <ModalTutorial
                className="absolute bottom-[-14rem] z-20 flex h-[12rem] w-[23rem] items-center justify-center bg-[url('/images/note.png')] bg-[length:100%_100%] bg-no-repeat"
                textTutorialTop={TEXT_DEF.click_here}
                textTutorialBottom={TEXT_DEF.sell}
              />

              <IconArrow
                className='absolute bottom-[-4rem] right-[-2rem] z-20 -rotate-[40deg]'
                width={50}
                height={50}
              />
            </>
          )}
        </div>
      </div>

      {isSell && (
        <PopupSell
          classBody="flex h-full w-[90%] items-center justify-center bg-[url('/images/popup_sell.png')] bg-no-repeat px-[2rem] bg-[length:100%_100%]"
          onHandleAgree={handleSelling}
          onHandleBank={handleBack}
          messageText3={TEXT_DEF.choose_num}
          isButton={true}
          numOwner={numOwner}
          scoreLevel={scoreLevel}
          step={step}
        />
      )}

      {isSelling && (
        <PopupSell
          classBody="flex h-[70%] w-[70%] items-center justify-center bg-[url('/images/bg_selling.png')] bg-no-repeat px-[2rem] bg-[length:100%_100%]"
          onHandleAgree={handleSellingConfirm}
          onHandleBank={handleBack}
          messageText={rederText()}
          messageText3={rederText3()}
          style={'text-2xl'}
        />
      )}

      {isSellingDone && (
        <PopupSell
          classBody="flex flex-col h-[70%] w-[70%] items-center justify-end bg-[url('/images/bg_sellingDone.png')] bg-no-repeat px-[2rem] bg-[length:100%_100%] z-12"
          onHandleAgree={handleBack}
          messageText={`${awardPoint} Đ`}
          messageText2={
            awardPoint > 0 ? `Bạn nhận được ${awardPoint} Đ` : sellFail
          }
          messageText3={awardPoint > 0 ? TEXT_DEF.sellCF1 : TEXT_DEF.sellCF2}
          step={step}
          style={'confirm'}
          isSellingDone={isSellingDone}
        />
      )}

      {isTutorial && (
        <PopupSell
          classNameWrapper='relative flex h-full w-full flex-col items-center justify-center'
          classBody="flex flex-col h-[90%] w-[90%] items-center justify-center bg-[url('/images/note_big.png')] 
          bg-no-repeat px-[2rem] bg-[length:100%_100%] z-12"
          messageText={TEXT_DEF.message_final_1}
          messageText2={TEXT_DEF.message_final_2}
          onHandleAgree={handleSetUserInfo}
        />
      )}
    </>
  )
}

export default Warehouse
