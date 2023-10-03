import React, { useState, useRef, useEffect, useCallback } from 'react'
import Image from 'next/image'
import 'swiper/css'
import 'swiper/css/effect-coverflow'
import 'swiper/css/pagination'
import 'swiper/css/navigation'
import { EffectCoverflow, Pagination, Navigation } from 'swiper'
import { Swiper, SwiperSlide, type SwiperRef } from 'swiper/react'

import { TEXT_DEF } from 'constants/text'
import IconArrow from 'components/common/icon-arrow'
import { LandType } from 'interfaces/land-form.interface'
import { ARRAY_WATER } from 'constants/generate'
import moment from 'moment'
import Popup from 'components/common/popup'
import { handleClickOutside } from 'common/hooks/useClickOutSide'
import { STATUS_LAND } from 'constants/generate'
import ModalTutorial from 'components/modal-tutorial'
import { RootState, useAppDispatch } from 'store'
import {
  handleHarvestById,
  handleSeedLand,
  handleWaterTree
} from 'store/reducers/land.reducer'
import { useSelector } from 'react-redux'
import { getUserInfo, updateUserinfo } from 'store/reducers/user.reducer'
import { fetchData } from 'utils/fetchdata'
import { LAND_LIST } from 'network/key'
import { networkService } from 'network/service'
import TitleTutorial from 'components/title-tutorial'
import { setIsStore } from 'store/reducers/generate.slice'

const Home = () => {
  const [isArrow, setIsArrow] = useState<boolean>(true)
  const [isShow, setIsShow] = useState<boolean>(false)
  const [dataRender, setDataRender] = useState<LandType[]>([])
  const [activeSlide, setActiveSlide] = useState<number>(dataRender?.length - 1)
  const [messagePopupTop, setMessagePopTop] = useState<string>('')
  const [messagePopupBottom, setMessagePopBottom] = useState<string>('')
  const [classBodyPopup, setClassBodyPopup] = useState<string>('')
  const swiperRef: React.Ref<SwiperRef> | undefined = useRef(null)
  const wrapperRef = useRef<HTMLDivElement>(null)

  const dispatch = useAppDispatch()

  const isBeginner = useSelector((state: RootState) => state?.user?.isBeginner)

  useEffect(() => {
    dispatch(getUserInfo())
  }, [dispatch])

  useEffect(() => {
    if (isBeginner === true) {
      setDataRender(fetchData)
      setActiveSlide(fetchData?.length - 1)
    } else {
      const fetchDataAsync = async () => {
        const res = await networkService.Get<LandType[] | any>({
          url: LAND_LIST
        })
        const dataLand = res?.data?.result?.reverse()
        setDataRender(dataLand)
        setActiveSlide(dataLand?.length - 1)
      }
      fetchDataAsync()
    }
  }, [isBeginner])

  const getListLand = async () => {
    const res = await networkService.Get<LandType[] | any>({ url: LAND_LIST })
    const landList = res?.data?.result?.reverse()
    return setDataRender(landList)
  }

  handleClickOutside(wrapperRef, () => {
    setIsShow(false)
    setIsArrow(false)
  })

  useEffect(() => {
    if (
      swiperRef.current &&
      activeSlide !== swiperRef?.current?.swiper.realIndex
    ) {
      swiperRef?.current?.swiper?.slideTo(activeSlide!)
    }
  }, [activeSlide])

  const handleShowItem = (
    e: React.MouseEvent<HTMLElement, MouseEvent>,
    slideIndex: number
  ) => {
    setActiveSlide(slideIndex)
    setIsArrow(true)
    return e.stopPropagation()
  }

  const handleChangeItem = (e: any) => {
    setActiveSlide(e.activeIndex)
    setIsArrow(true)
  }

  const renderImage = (valueImage: string) => {
    switch (valueImage) {
      case 'Chưa gieo hạt':
        return '/images/not_strees.png'
      case 'Đã gieo hạt':
        return '/images/gieo_hat.png'
      case 'Đã nảy mầm':
        return '/images/stree_big.png'
      case 'Hỏng - Thiếu nước khi nảy mầm':
        return '/images/stree_no_water.png'
      case 'Đã ra hoa':
        return '/images/flower.png'
      case 'Hỏng - Thiếu nước khi ra hoa':
        return '/images/flower_not_water.png'
      case 'Chưa thu hoạch':
        return '/images/fruit.png'
      case 'Hỏng - Không thu hoạch':
        return '/images/no_fruited.png'
      case 'Đã thu hoạch':
        return '/images/fruited.png'
    }
  }

  const handleEventLand = (item: LandType) => {
    if (item.status === 'Chưa gieo hạt') return handelDrills(item)

    if (ARRAY_WATER.includes(item.status) && !item.currentWaterStatus)
      return handleWater(item)

    if (item.status === STATUS_LAND.harvested_yet) return handleHarvest(item)

    if (item.status === STATUS_LAND.fail_no_water_germinated) {
      setIsShow(true)
      setMessagePopTop(TEXT_DEF.message_broken_tree_water)
      setMessagePopBottom('')
      setClassBodyPopup(
        "flex h-full w-[90%] items-center justify-center bg-[url('/images/broken_water_tree_mall.png')] bg-contain bg-no-repeat"
      )
    }

    if (item.status === STATUS_LAND.fail_no_water_flowered) {
      setIsShow(true)
      setClassBodyPopup(
        "flex h-full w-[90%] items-center justify-center bg-[url('/images/broken_water_flower.png')] bg-contain bg-no-repeat"
      )
      setMessagePopTop(TEXT_DEF.message_broken_flower)
      setMessagePopBottom('')
    }

    if (item.status === STATUS_LAND.fail_harvest) {
      setIsShow(true)
      setMessagePopTop(TEXT_DEF.message_fail)
      setMessagePopBottom('')
      setClassBodyPopup(
        "flex h-full w-[90%] items-center justify-center bg-[url('/images/broken_water_tree_mall.png')] bg-contain bg-no-repeat"
      )
    }

    if (item.status === STATUS_LAND.harvested) {
      setIsShow(true)
      setMessagePopTop(TEXT_DEF.message_harvested_s)
      setMessagePopBottom('')
      setClassBodyPopup(
        "flex h-full w-[90%] items-center justify-center bg-[url('/images/successful_harvest.png')] bg-contain bg-no-repeat"
      )
      dispatch(setIsStore(true))
    }

    if (item.status === STATUS_LAND.drillsed) {
      setIsShow(true)
      setMessagePopTop(TEXT_DEF.message_drillsed)
      setMessagePopBottom('')
      setClassBodyPopup(
        "flex h-full w-[90%] items-center justify-center bg-[url('/images/successful_harvest.png')] bg-contain bg-no-repeat"
      )
    }

    if (item.status === STATUS_LAND.germinated && item.currentWaterStatus) {
      setIsShow(true)
      setMessagePopTop(TEXT_DEF.text_stree)
      setMessagePopBottom('')
      setClassBodyPopup(
        "flex h-full w-[90%] items-center justify-center bg-[url('/images/successful_harvest.png')] bg-contain bg-no-repeat"
      )
    }

    if (item.status === STATUS_LAND.has_flowered && item.currentWaterStatus) {
      setIsShow(true)
      setMessagePopTop(TEXT_DEF.text_flower)
      setMessagePopBottom('')
      setClassBodyPopup(
        "flex h-full w-[90%] items-center justify-center bg-[url('/images/successful_harvest.png')] bg-contain bg-no-repeat"
      )
    }

    return
  }

  const handelDrills = async (item: LandType) => {
    setIsShow(true)
    setMessagePopTop(TEXT_DEF.text_sown_seed)
    setMessagePopBottom(TEXT_DEF.text_desc_sown_seed)
    setClassBodyPopup(
      "flex h-full w-[90%] items-center justify-center bg-[url('/images/bg_login_err.png')] bg-contain bg-no-repeat"
    )

    const createDateLand = new Date().toDateString()
    if (isBeginner) {
      const newArray = dataRender?.map((el) => {
        if (el.id === item.id) {
          return {
            ...item,
            status: 'Đã gieo hạt',
            createdAt: createDateLand
          }
        }
        return el
      })
      setDataRender(newArray)
    } else {
      try {
        await dispatch(handleSeedLand())
        await getListLand()
      } catch (err) {
        console.log(err)
      }
    }
  }

  const handleWater = async (item: LandType) => {
    if (isBeginner) {
      const newArray = dataRender?.map((el) => {
        if (el.id === item.id) {
          return {
            ...item,
            currentWaterStatus: true
          }
        }
        return el
      })
      setDataRender(newArray)
    } else {
      try {
        await dispatch(handleWaterTree(item.id))
        await getListLand()
      } catch (err) {
        console.log(err)
      }
    }
    setIsShow(true)
    setMessagePopTop(TEXT_DEF.message_water)
    setMessagePopBottom('')
    setClassBodyPopup(
      "flex h-full w-[90%] items-center justify-center bg-[url('/images/bg_water.png')] bg-contain bg-no-repeat"
    )
  }

  const handleHarvest = async (item: LandType) => {
    setIsShow(true)
    setMessagePopTop(TEXT_DEF.message_harvested)
    setMessagePopBottom(TEXT_DEF.message_success)
    setClassBodyPopup(
      "flex h-full w-[90%] items-center justify-center bg-[url('/images/broken_water_tree_mall.png')] bg-contain bg-no-repeat"
    )
    if (isBeginner) {
      const newArray = dataRender?.map((el) => {
        if (el.id === item.id) {
          return {
            ...item,
            status: STATUS_LAND.harvested
          }
        }
        return el
      })
      setDataRender(newArray)
      dispatch(setIsStore(true))
    } else {
      try {
        await dispatch(handleHarvestById(item.id))
        await getListLand()
      } catch (err) {
        console.log(err)
      }
    }
  }

  const formatDate = (date: string) => {
    return moment(date).utcOffset('+07:00').format('DD/MM')
  }

  const renderPositionTop = (activeSlide: number) => {
    switch (activeSlide) {
      case 11:
        return 'top-[6rem] left-0 h-[15%] w-[10%] rotate-[-60deg]'
      case 10:
        return 'top-[4rem] left-[0.5rem] h-[18%] w-[12%] rotate-[-50deg]'
      case 9:
        return 'top-[2rem] left-[1rem] h-[23%] w-[15%] rotate-[-47deg]'
      case 8:
        return 'top-[-0.6rem] left-[2.5rem] h-[27%] w-[17%] rotate-[-34deg]'
      case 7:
        return 'top-[-2.2rem] left-[3.7rem] h-[30%] w-[20%] rotate-[-25deg]'
      case 6:
        return 'top-[-5rem] left-[6rem] h-[40%] w-[23%] rotate-[-10deg]'
      case 5:
        return 'top-[-5.5rem] left-[10rem] h-[40%] w-[23%] rotate-[5deg]'
      case 4:
        return 'top-[-3.3rem] left-[13rem] h-[30%] w-[20%] rotate-[24deg]'
      case 3:
        return 'top-[-1.7rem] left-[16rem] h-[27%] w-[17%] rotate-[39deg]'
      case 2:
        return 'top-[0.7rem] left-[18.5rem] h-[23%] w-[15%] rotate-[51deg]'
      case 1:
        return 'top-[3.5rem] left-[20rem] h-[18%] w-[12%] rotate-[70deg]'
      case 0:
        return 'top-[7rem] left-[21.3rem] h-[15%] w-[10%] rotate-[84deg]'
    }
  }

  const renderPositionTopFlower = (activeSlide: number) => {
    switch (activeSlide) {
      case 11:
      case 3:
        return 'top-[6rem] left-[2rem] h-[15%] w-[10%] rotate-[-115deg]'
      case 10:
      case 2:
        return 'top-[2.5rem] left-[4rem] h-[20%] w-[15%] rotate-[-90deg]'
      case 9:
      case 1:
        return 'top-[0rem] left-[7rem] h-[25%] w-[20%] rotate-[-73deg]'
      case 8:
      case 0:
        return 'top-[-0.6rem] left-[12rem] h-[25%] w-[20%] rotate-[-49deg]'
      case 7:
        return 'top-[1.7rem] left-[16rem] h-[20%] w-[15%] rotate-[-25deg]'
      case 6:
        return 'top-[4rem] left-[18rem] h-[15%] w-[10%] rotate-[-10deg]'
      case 5:
        return 'top-[6rem] left-[20.5rem] h-[13%] w-[8%] rotate-[-19deg]'
      case 4:
        return 'hidden top-[-5.5rem] left-[10rem] h-[40%] w-[23%] rotate-[5deg]'
    }
  }

  const renderPositionTopBush = (activeSlide: number) => {
    switch (activeSlide) {
      case 11:
        return 'top-[5rem] left-[3rem] h-[15%] w-[10%] rotate-[20deg]'
      case 10:
        return 'top-[1.5rem] left-[6.5rem] h-[20%] w-[15%] rotate-[40deg]'
      case 9:
        return 'top-[0rem] left-[10rem] h-[25%] w-[20%] rotate-[60deg]'
      case 8:
        return 'top-[2rem] left-[15rem] h-[20%] w-[15%] rotate-[69deg]'
      case 7:
        return 'top-[1.7rem] left-[16rem] h-[20%] w-[15%] rotate-[-25deg]'
      case 6:
        return 'top-[5.5rem] left-[20rem] h-[15%] w-[10%] rotate-[-10deg]'
      // case 5:
      //   return 'top-[5.5rem] left-[21.5rem] h-[40%] w-[23%] rotate-[5deg]'
      // case 4:
      //   return 'hidden top-[-5.5rem] left-[10rem] h-[40%] w-[23%] rotate-[5deg]'
      // case 3:
      //   return 'hidden top-[-5.5rem] left-[10rem] h-[40%] w-[23%] rotate-[5deg]'
      // case 2:
      //   return 'hidden top-[-5.5rem] left-[10rem] h-[40%] w-[23%] rotate-[5deg]'
      // case 1:
      //   return 'hidden top-[-5.5rem] left-[10rem] h-[40%] w-[23%] rotate-[5deg]'
      // case 0:
      //   return 'hidden top-[-5.5rem] left-[10rem] h-[40%] w-[23%] rotate-[5deg]'
    }
  }

  const renderPositionTopGrass = (activeSlide: number) => {
    switch (
      activeSlide
      // case 11:
      //   return 'top-[2.7rem] left-[4.5rem] h-[17%] w-[17%] rotate-[-25deg]'
      // case 10:
      //   return 'top-[0.5rem] left-[10rem] h-[20%] w-[20%] rotate-[0deg]'
      // case 9:
      //   return 'top-[2rem] left-[15rem] h-[20%] w-[18%] rotate-[25deg]'
      // case 8:
      //   return 'top-[4rem] left-[18rem] h-[15%] w-[10%] rotate-[50deg]'
      // case 7:
      //   return 'top-[1.7rem] left-[16rem] h-[20%] w-[15%] rotate-[-25deg]'
      // case 6:
      //   return 'top-[5.5rem] left-[20rem] h-[15%] w-[10%] rotate-[-10deg]'
      // case 5:
      //   return 'hidden top-[-5.5rem] left-[10rem] h-[40%] w-[23%] rotate-[5deg]'
      // case 4:
      //   return 'hidden top-[-5.5rem] left-[10rem] h-[40%] w-[23%] rotate-[5deg]'
      // case 3:
      //   return 'hidden top-[-5.5rem] left-[10rem] h-[40%] w-[23%] rotate-[5deg]'
      // case 2:
      //   return 'hidden top-[-5.5rem] left-[10rem] h-[40%] w-[23%] rotate-[5deg]'
      // case 1:
      //   return 'hidden top-[-5.5rem] left-[10rem] h-[40%] w-[23%] rotate-[5deg]'
      // case 0:
      //   return 'hidden top-[-5.5rem] left-[10rem] h-[40%] w-[23%] rotate-[5deg]'
    ) {
    }
  }

  const renderPositionTopGrass2 = (activeSlide: number) => {
    switch (
      activeSlide
      // case 11:
      //   return 'top-[0.5rem] left-[8rem] h-[20%] w-[20%] rotate-[-5deg]'
      // case 10:
      //   return 'top-[1.3rem] left-[14rem] h-[20%] w-[15%] rotate-[32deg]'
      // case 9:
      //   return 'top-[4rem] left-[18rem] h-[18%] w-[13%] rotate-[46deg]'
      // case 8:
      //   return 'top-[5.5rem] left-[19.5rem] h-[15%] w-[10%] rotate-[50deg]'
      // case 7:
      //   return 'top-[1.7rem] left-[16rem] h-[20%] w-[15%] rotate-[-25deg]'
      // case 6:
      //   return 'top-[5.5rem] left-[20rem] h-[15%] w-[10%] rotate-[-10deg]'
      // case 5:
      //   return 'hidden top-[-5.5rem] left-[10rem] h-[40%] w-[23%] rotate-[5deg]'
      // case 4:
      //   return 'hidden top-[-5.5rem] left-[10rem] h-[40%] w-[23%] rotate-[5deg]'
      // case 3:
      //   return 'hidden top-[-5.5rem] left-[10rem] h-[40%] w-[23%] rotate-[5deg]'
      // case 2:
      //   return 'hidden top-[-5.5rem] left-[10rem] h-[40%] w-[23%] rotate-[5deg]'
      // case 1:
      //   return 'hidden top-[-5.5rem] left-[10rem] h-[40%] w-[23%] rotate-[5deg]'
      // case 0:
      //   return 'hidden top-[-5.5rem] left-[10rem] h-[40%] w-[23%] rotate-[5deg]'
    ) {
    }
  }

  const renderPositionTopSunflower = (activeSlide: number) => {
    switch (
      activeSlide
      // case 11:
      //   return 'hidden top-[8.5rem] left-[-1rem] h-[10%] w-[5%] rotate-[-5deg]'
      // case 10:
      //   return 'top-[8.5rem] left-[0.5rem] h-[12%] w-[7%] rotate-[-36deg]'
      // case 9:
      //   return 'top-[5.5rem] left-[2rem] h-[15%] w-[10%] rotate-[10deg]'
      // case 8:
      //   return 'top-[2rem] left-[4rem] h-[20%] w-[15%] rotate-[30deg]'
      // case 7:
      //   return 'top-[1.7rem] left-[16rem] h-[20%] w-[15%] rotate-[-25deg]'
      // case 6:
      //   return 'top-[5.5rem] left-[20rem] h-[15%] w-[10%] rotate-[-10deg]'
      // case 5:
      //   return 'hidden top-[-5.5rem] left-[10rem] h-[40%] w-[23%] rotate-[5deg]'
      // case 4:
      //   return 'hidden top-[-5.5rem] left-[10rem] h-[40%] w-[23%] rotate-[5deg]'
      // case 3:
      //   return 'hidden top-[-5.5rem] left-[10rem] h-[40%] w-[23%] rotate-[5deg]'
      // case 2:
      //   return 'hidden top-[-5.5rem] left-[10rem] h-[40%] w-[23%] rotate-[5deg]'
      // case 1:
      //   return 'hidden top-[-5.5rem] left-[10rem] h-[40%] w-[23%] rotate-[5deg]'
      // case 0:
      //   return 'hidden top-[-5.5rem] left-[10rem] h-[40%] w-[23%] rotate-[5deg]'
    ) {
    }
  }

  const renderPositionTopWildflowers = (activeSlide: number) => {
    switch (
      activeSlide
      // case 11:
      //   return 'top-[1.5rem] left-[12.5rem] h-[15%] w-[15%] rotate-[-5deg]'
      // case 10:
      //   return 'top-[3.5rem] left-[17rem] h-[15%] w-[12%] rotate-[7deg]'
      // case 9:
      //   return 'top-[6rem] left-[20rem] h-[12%] w-[7%] rotate-[45deg]'
      // case 8:
      //   return 'top-[8rem] left-[21.5rem] h-[10%] w-[5%] rotate-[50deg]'
      // case 7:
      //   return 'top-[1.7rem] left-[16rem] h-[20%] w-[15%] rotate-[-25deg]'
      // case 6:
      //   return 'top-[5.5rem] left-[20rem] h-[15%] w-[10%] rotate-[-10deg]'
      // case 5:
      //   return 'hidden top-[-5.5rem] left-[10rem] h-[40%] w-[23%] rotate-[5deg]'
      // case 4:
      //   return 'hidden top-[-5.5rem] left-[10rem] h-[40%] w-[23%] rotate-[5deg]'
      // case 3:
      //   return 'hidden top-[-5.5rem] left-[10rem] h-[40%] w-[23%] rotate-[5deg]'
      // case 2:
      //   return 'hidden top-[-5.5rem] left-[10rem] h-[40%] w-[23%] rotate-[5deg]'
      // case 1:
      //   return 'hidden top-[-5.5rem] left-[10rem] h-[40%] w-[23%] rotate-[5deg]'
      // case 0:
      //   return 'hidden top-[-5.5rem] left-[10rem] h-[40%] w-[23%] rotate-[5deg]'
    ) {
    }
  }

  const renderPositionTopTree = (activeSlide: number) => {
    switch (
      activeSlide
      // case 11:
      //   return 'top-[-5rem] left-[9rem] h-[35%] w-[25%] rotate-[0deg]'
      // case 10:
      //   return 'top-[-3.5rem] left-[13rem] h-[30%] w-[20%] rotate-[18deg]'
      // case 9:
      //   return 'top-[-1.5rem] left-[16rem] h-[25%] w-[20%] rotate-[36deg]'
      // case 8:
      //   return 'top-[1rem] left-[18.5rem] h-[20%] w-[15%] rotate-[50deg]'
      // case 7:
      //   return 'top-[1.7rem] left-[16rem] h-[20%] w-[15%] rotate-[-25deg]'
      // case 6:
      //   return 'top-[5.5rem] left-[20rem] h-[15%] w-[10%] rotate-[-10deg]'
      // case 5:
      //   return 'hidden top-[-5.5rem] left-[10rem] h-[40%] w-[23%] rotate-[5deg]'
      // case 4:
      //   return 'hidden top-[-5.5rem] left-[10rem] h-[40%] w-[23%] rotate-[5deg]'
      // case 3:
      //   return 'hidden top-[-5.5rem] left-[10rem] h-[40%] w-[23%] rotate-[5deg]'
      // case 2:
      //   return 'hidden top-[-5.5rem] left-[10rem] h-[40%] w-[23%] rotate-[5deg]'
      // case 1:
      //   return 'hidden top-[-5.5rem] left-[10rem] h-[40%] w-[23%] rotate-[5deg]'
      // case 0:
      //   return 'hidden top-[-5.5rem] left-[10rem] h-[40%] w-[23%] rotate-[5deg]'
    ) {
    }
  }

  const renderPositionTopTree2 = (activeSlide: number) => {
    switch (
      activeSlide
      // case 11:
      //   return 'top-[-3.5rem] left-[14.5rem] h-[32%] w-[20%] rotate-[0deg]'
      // case 10:
      //   return 'top-[-1rem] left-[17rem] h-[25%] w-[15%] rotate-[18deg]'
      // case 9:
      //   return 'top-[2rem] left-[19rem] h-[20%] w-[15%] rotate-[36deg]'
      // case 8:
      //   return 'top-[4rem] left-[20.5rem] h-[18%] w-[14%] rotate-[49deg]'
      // case 7:
      //   return 'top-[1.7rem] left-[16rem] h-[20%] w-[15%] rotate-[-25deg]'
      // case 6:
      //   return 'top-[5.5rem] left-[20rem] h-[15%] w-[10%] rotate-[-10deg]'
      // case 5:
      //   return 'hidden top-[-5.5rem] left-[10rem] h-[40%] w-[23%] rotate-[5deg]'
      // case 4:
      //   return 'hidden top-[-5.5rem] left-[10rem] h-[40%] w-[23%] rotate-[5deg]'
      // case 3:
      //   return 'hidden top-[-5.5rem] left-[10rem] h-[40%] w-[23%] rotate-[5deg]'
      // case 2:
      //   return 'hidden top-[-5.5rem] left-[10rem] h-[40%] w-[23%] rotate-[5deg]'
      // case 1:
      //   return 'hidden top-[-5.5rem] left-[10rem] h-[40%] w-[23%] rotate-[5deg]'
      // case 0:
      //   return 'hidden top-[-5.5rem] left-[10rem] h-[40%] w-[23%] rotate-[5deg]'
    ) {
    }
  }

  const renderPositionTopFlower2 = (activeSlide: number) => {
    switch (activeSlide) {
      case 11:
        return 'top-[2rem] left-[16.5rem] h-[16%] w-[10%] rotate-[-30deg]'
      case 10:
        return 'top-[4.5rem] left-[19rem] h-[14%] w-[10%] rotate-[-13deg]'
      case 9:
        return 'top-[7.5rem] left-[21rem] h-[10%] w-[5%] rotate-[0deg]'
      case 8:
        return 'hidden top-[4rem] left-[0rem] h-[10%] w-[5%] rotate-[0deg]'
      // case 7:
      //   return 'top-[1.7rem] left-[16rem] h-[20%] w-[15%] rotate-[-25deg]'
      // case 6:
      //   return 'top-[5.5rem] left-[20rem] h-[15%] w-[10%] rotate-[-10deg]'
      // case 5:
      //   return 'hidden top-[-5.5rem] left-[10rem] h-[40%] w-[23%] rotate-[5deg]'
      // case 4:
      //   return 'hidden top-[-5.5rem] left-[10rem] h-[40%] w-[23%] rotate-[5deg]'
      // case 3:
      //   return 'hidden top-[-5.5rem] left-[10rem] h-[40%] w-[23%] rotate-[5deg]'
      // case 2:
      //   return 'hidden top-[-5.5rem] left-[10rem] h-[40%] w-[23%] rotate-[5deg]'
      // case 1:
      //   return 'hidden top-[-5.5rem] left-[10rem] h-[40%] w-[23%] rotate-[5deg]'
      // case 0:
      //   return 'hidden top-[-5.5rem] left-[10rem] h-[40%] w-[23%] rotate-[5deg]'
    }
  }

  const renderPositionTopStore = (activeSlide: number) => {
    switch (
      activeSlide
      // case 11:
      //   return 'top-[3rem] left-[18.5rem] h-[20%] w-[15%] rotate-[-10deg]'
      // case 10:
      //   return 'top-[6rem] left-[20.5rem] h-[15%] w-[10%] rotate-[-13deg]'
      // case 9:
      //   return 'hidden top-[0rem] left-[0rem] h-[10%] w-[5%] rotate-[-73deg]'
      // case 8:
      //   return 'top-[4rem] left-[1rem] h-[12%] w-[10%] rotate-[-111deg]'
      // case 7:
      //   return 'top-[1.7rem] left-[16rem] h-[20%] w-[15%] rotate-[-25deg]'
      // case 6:
      //   return 'top-[5.5rem] left-[20rem] h-[15%] w-[10%] rotate-[-10deg]'
      // case 5:
      //   return 'hidden top-[-5.5rem] left-[10rem] h-[40%] w-[23%] rotate-[5deg]'
      // case 4:
      //   return 'hidden top-[-5.5rem] left-[10rem] h-[40%] w-[23%] rotate-[5deg]'
      // case 3:
      //   return 'hidden top-[-5.5rem] left-[10rem] h-[40%] w-[23%] rotate-[5deg]'
      // case 2:
      //   return 'hidden top-[-5.5rem] left-[10rem] h-[40%] w-[23%] rotate-[5deg]'
      // case 1:
      //   return 'hidden top-[-5.5rem] left-[10rem] h-[40%] w-[23%] rotate-[5deg]'
      // case 0:
      //   return 'hidden top-[-5.5rem] left-[10rem] h-[40%] w-[23%] rotate-[5deg]'
    ) {
    }
  }

  const renderPositionBottom = (activeSlide: number) => {
    switch (activeSlide) {
      case 11:
        return '-bottom-[7rem] left-8 h-[80%] w-[90%]'
      case 10:
        return '-bottom-[7rem] left-8 h-[80%] w-[85%]'
      case 9:
        return '-bottom-[7rem] left-8 h-[80%] w-[85%]'
      case 8:
        return '-bottom-[7rem] left-8 h-[80%] w-[85%]'
      case 7:
        return '-bottom-[7rem] left-8 h-[80%] w-[85%]'
      case 0:
        return '-bottom-[8.5rem] left-7 h-[80%] w-[90%]'
      default:
        return '-bottom-[7rem] left-8 h-[80%] w-[85%]'
    }
  }

  const renderTextTutorial = (activeSlide: number) => {
    return dataRender?.map((item) => {
      if (Number(item.id) === activeSlide) {
        if (
          (item.status === STATUS_LAND.no_drills && item.currentWaterStatus) ||
          (item.status === STATUS_LAND.has_flowered &&
            !item.currentWaterStatus) ||
          (item.status === STATUS_LAND.germinated &&
            !item.currentWaterStatus) ||
          item.status === STATUS_LAND.harvested_yet
        ) {
          return TEXT_DEF.click_here
        }

        if (item.status === 'Đã gieo hạt' && item.currentWaterStatus) {
          return TEXT_DEF.horizontal_pull
        }

        if (
          item.status === 'Hỏng - Thiếu nước khi nảy mầm' ||
          item.status === 'Hỏng - Thiếu nước khi ra hoa' ||
          item.status === 'Hỏng - Không thu hoạch'
        ) {
          return TEXT_DEF.broken_tree
        }

        if (item.status === 'Đã ra hoa' && item.currentWaterStatus) {
          return TEXT_DEF.horizontal_pull
        }

        if (item.status === 'Đã thu hoạch') {
          return TEXT_DEF.streed
        }

        if (item.status === 'Đã nảy mầm' && item.currentWaterStatus) {
          return TEXT_DEF.text_stree
        }

        if (item.status === 'Đã ra hoa' && item.currentWaterStatus) {
          return TEXT_DEF.text_flower
        }
      }
    })
  }

  const renderTextTutorialBottom = (activeSlide: number) => {
    return dataRender?.map((item) => {
      if (Number(item.id) === activeSlide) {
        if (item.status === 'Chưa gieo hạt') {
          return TEXT_DEF.text_drills
        }

        if (
          (item.status === 'Đã nảy mầm' || item.status === 'Đã ra hoa') &&
          !item.currentWaterStatus
        ) {
          return TEXT_DEF.water_plants
        }

        if (item.status === 'Hỏng - Thiếu nước khi nảy mầm') {
          return TEXT_DEF.no_water_plants
        }

        if (item.status === 'Hỏng - Thiếu nước khi ra hoa') {
          return TEXT_DEF.no_water_plants
        }

        if (item.status === 'Chưa thu hoạch') {
          return TEXT_DEF.harvest
        }

        if (item.status === 'Hỏng - Không thu hoạch') {
          return TEXT_DEF.fail_harvest
        }

        if (item.status === 'Đã thu hoạch') {
          return TEXT_DEF.successful_harvest
        }
      }
    })
  }

  const handleOffTutorial = useCallback(async () => {
    const data = {
      isBeginner: false
    }
    if (isBeginner == true) {
      await dispatch(updateUserinfo({ body: data }))
      await getListLand()
    }
  }, [])

  return (
    <>
      <div className='mt-[25%] flex items-center justify-center p-2'>
        <div className='flex w-full flex-col items-center justify-center'>
          {isBeginner && <TitleTutorial onOffTutorial={handleOffTutorial} />}
          <div className='relative mt-[40%] flex h-full w-full items-center justify-center'>
            <div
              className="relative mb-[15rem] flex h-[23rem] w-[24rem] justify-center
            bg-[url('/images/circel.png')] bg-contain bg-center bg-no-repeat"
            >
              <div
                className={`absolute ${renderPositionTop(
                  activeSlide!
                )} transition-all duration-300`}
              >
                <div className='relative flex h-[80%] w-full items-center transition-all duration-300'>
                  <Image
                    src={`/imageTree/tree.png`}
                    alt={`top + ${activeSlide}`}
                    fill
                  />
                </div>
              </div>
              <div
                className={`absolute ${renderPositionTopFlower(
                  activeSlide!
                )} transition-all duration-300`}
              >
                <div className='relative flex h-[80%] w-full items-center transition-all duration-300'>
                  <Image
                    src={`/imageTree/bong.png`}
                    alt={`top + ${activeSlide}`}
                    fill
                  />
                </div>
              </div>
              <div
                className={`absolute ${renderPositionTopBush(
                  activeSlide!
                )} transition-all duration-300`}
              >
                <div className='relative flex h-[80%] w-full items-center transition-all duration-300'>
                  <Image
                    src={`/imageTree/bui.png`}
                    alt={`top + ${activeSlide}`}
                    fill
                  />
                </div>
              </div>
              <div
                className={`absolute ${renderPositionTopGrass(
                  activeSlide!
                )} transition-all duration-300`}
              >
                <div className='relative flex h-[80%] w-full items-center transition-all duration-300'>
                  <Image
                    src={`/imageTree/grass.png`}
                    alt={`top + ${activeSlide}`}
                    fill
                  />
                </div>
              </div>
              <div
                className={`absolute ${renderPositionTopGrass2(
                  activeSlide!
                )} transition-all duration-300`}
              >
                <div className='relative flex h-[80%] w-full items-center transition-all duration-300'>
                  <Image
                    src={`/imagetree/grass.png`}
                    alt={`top + ${activeSlide}`}
                    fill
                  />
                </div>
              </div>
              <div
                className={`absolute ${renderPositionTopSunflower(
                  activeSlide!
                )} transition-all duration-300`}
              >
                <div className='relative flex h-[80%] w-full items-center transition-all duration-300'>
                  <Image
                    src={`/imageTree/sunflower.png`}
                    alt={`top + ${activeSlide}`}
                    fill
                  />
                </div>
              </div>
              <div
                className={`absolute ${renderPositionTopWildflowers(
                  activeSlide!
                )} z-10 transition-all duration-300`}
              >
                <div className='relative flex h-[80%] w-full items-center transition-all duration-300'>
                  <Image
                    src={`/imageTree/hoa.png`}
                    alt={`top + ${activeSlide}`}
                    fill
                  />
                </div>
              </div>
              <div
                className={`absolute ${renderPositionTopTree(
                  activeSlide!
                )} transition-all duration-300`}
              >
                <div className='relative flex h-[80%] w-full items-center transition-all duration-300'>
                  <Image
                    src={`/imageTree/cay_2.png`}
                    alt={`top + ${activeSlide}`}
                    fill
                  />
                </div>
              </div>
              <div
                className={`absolute ${renderPositionTopTree2(
                  activeSlide!
                )} transition-all duration-300`}
              >
                <div className='relative flex h-[80%] w-full items-center transition-all duration-300'>
                  <Image
                    src={`/imageTree/cay_1.png`}
                    alt={`top + ${activeSlide}`}
                    fill
                  />
                </div>
              </div>
              <div
                className={`absolute ${renderPositionTopFlower2(
                  activeSlide!
                )} transition-all duration-300`}
              >
                <div className='relative flex h-[80%] w-full items-center transition-all duration-300'>
                  <Image
                    src={`/imageTree/bong.png`}
                    alt={`top + ${activeSlide}`}
                    fill
                  />
                </div>
              </div>
              <div
                className={`absolute ${renderPositionTopStore(
                  activeSlide!
                )} transition-all duration-300`}
              >
                <div className='relative flex h-[80%] w-full items-center transition-all duration-300'>
                  <Image
                    src={`/imageTree/store.png`}
                    alt={`top + ${activeSlide}`}
                    fill
                  />
                </div>
              </div>
              <div className='z-10 mt-[2%] py-5'>
                <Swiper
                  style={{ position: 'relative' }}
                  effect={'coverflow'}
                  grabCursor={true}
                  centeredSlides={true}
                  initialSlide={activeSlide}
                  slidesPerView={'auto'}
                  coverflowEffect={{
                    rotate: 0,
                    stretch: 0,
                    depth: 100,
                    modifier: 3
                  }}
                  modules={[EffectCoverflow, Pagination, Navigation]}
                  className='swiper_container'
                  ref={swiperRef}
                  onSlideChange={(e) => handleChangeItem(e)}
                >
                  {dataRender?.map((item, index) => (
                    <SwiperSlide
                      key={index}
                      className='swiper-slide'
                      onClick={(e) => handleShowItem(e, index)}
                    >
                      {/* {activeSlide === index &&
                        isArrow &&
                        (!ARRAY_WATER.includes(item.status) ||
                          item.currentWaterStatus === false) &&
                        item.status !== 'Đã gieo hạt' &&
                        isBeginner && (
                          <IconArrow className='absolute -right-[1.75rem] -top-20 z-20 rotate-[210deg]' />
                        )} */}
                      <div
                        className='container-land relative'
                        onClick={() =>
                          activeSlide === index && handleEventLand(item)
                        }
                      >
                        {item.status !== 'Chưa gieo hạt' && (
                          <div className="item-cot absolute -top-[3.8rem] left-6 flex h-[5rem] w-[4rem] justify-center bg-[url('/images/cot.png')] bg-contain bg-center bg-no-repeat">
                            <div className='mt-3 -rotate-[17deg] text-center font-bold text-[#FFEC41]'>
                              {formatDate(item.createdAt)}
                            </div>
                          </div>
                        )}
                        {ARRAY_WATER.includes(item.status) &&
                          !item.currentWaterStatus && (
                            <div
                              className='water-container absolute -top-2 left-4 text-[#fff]'
                              style={{ zIndex: '11' }}
                            >
                              <div className='water-body'>
                                <Image
                                  src='/gifs/water.gif'
                                  alt='water'
                                  width={80}
                                  height={80}
                                />
                              </div>
                            </div>
                          )}
                        <img
                          src={renderImage(item.status)}
                          alt='land'
                          className='relative z-10'
                        />
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
              {/* {isBeginner && (
                <>
                  <ModalTutorial
                    textTutorialTop={renderTextTutorial(activeSlide!)}
                    textTutorialBottom={renderTextTutorialBottom(activeSlide!)}
                  />
                  {activeSlide !== 6 && (
                    <IconArrow
                      className={`absolute bottom-[7rem] right-[6rem] z-20 rotate-[90deg]`}
                      width={60}
                    />
                  )}

                  {activeSlide !== 0 && (
                    <IconArrow
                      className='absolute bottom-[6.5rem] left-[5.5rem] z-20 rotate-[260deg]'
                      width={60}
                    />
                  )}
                </>
              )} */}

              <div className={`absolute ${renderPositionBottom(activeSlide!)}`}>
                <div className='relative flex h-[70%] w-full items-center'>
                  <Image
                    src={`/imagesLand/road_bottom_${activeSlide! + 1}.png`}
                    alt={`bottom1 + ${activeSlide! + 1}`}
                    fill
                    loading='lazy'
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {isShow && (
        <Popup
          classBody={classBodyPopup}
          classNameWrapper='flex h-[32%] w-full flex-col mb-10 items-center justify-center'
          isElementButton={true}
          messageText={messagePopupTop}
          messageDesc={messagePopupBottom}
          classTextTitle='w-[80%] px-12 text-white mt-20 text-center flex flex-col item-center justify-center'
          refProp={wrapperRef}
        />
      )}
    </>
  )
}

export default Home
