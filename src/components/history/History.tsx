import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { TEXT_DEF } from 'constants/text'
import DatePicker, { registerLocale } from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import vi from 'date-fns/locale/vi'
import moment from 'moment'
registerLocale('vi', vi)
import { useSelector } from 'react-redux'
import { RootState, useAppDispatch } from 'store'
import { getHistoryDrill } from 'action/historyApi'
import { getHistoryHarvest } from 'action/historyApi'
import { getHistorySell } from 'action/historyApi'
import { setTabActive } from 'store/reducers/history.slice'

const History = () => {
  const tabActive: any = useSelector(
    (state: RootState) => state.history.tabActive
  )

  const [openDate, setOpenDate] = useState<boolean>(false)
  const [current, setCurrent] = useState(new Date())
  const [monthRequest, setMonthRequest] = useState<number>(
    new Date().getMonth() + 1
  )
  const [yearRequest, setYearRequest] = useState<number>(
    new Date().getFullYear()
  )
  const [dataHis, setDataHis] = useState([])
  const [total, setTotal] = useState<number>(0)
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(setTabActive(1))
  }, [])

  const getHisDrill = async () => {
    let kw = { startYearMonth: `${yearRequest}-${monthRequest}` }

    const res: any = await getHistoryDrill(kw)

    let data: any = []
    if (res?.data?.result) {
      res?.data?.result?.map((item: any) => {
        const obj = {
          date: moment(item.createdAt).format('DD/MM/YYYY'),
          status: item.status.includes('Hỏng - Thiếu nước')
            ? 'Hỏng - Thiếu nước'
            : item.status
        }
        data.push(obj)
      })
      console.log(data)
      setDataHis(data)
    }
  }

  const getHisHarvest = async () => {
    let kw = {
      startYearMonth: `${yearRequest}-${monthRequest}`,
      status: 'HARVESTED'
    }

    const res: any = await getHistoryHarvest(kw)

    let data: any = []
    if (res?.data?.result[0]) {
      res?.data?.result[0]?.map((item: any) => {
        const obj = {
          date: moment(item.createdAt).format('DD/MM/YYYY'),
          status: item.status === 'Đã thu hoạch' ? 'Nhận 1 quả' : 'null'
        }
        data.push(obj)
      })
      let sum = 0
      for (let i = 0; i < data.length; i++) {
        if (data[i].status === 'Nhận 1 quả') {
          sum += 1
        }
      }
      setTotal(Number(sum.toFixed(0)))
      setDataHis(data)
    }
  }

  const getHisSell = async () => {
    let kw = {
      sendAwardStatus: 'SUCCESS',
      startYearMonth: `${yearRequest}-${monthRequest}`
    }
    const res: any = await getHistorySell(kw)

    let data: any = []
    if (res?.data?.result[0]) {
      res?.data?.result[0]?.map((item: any) => {
        const obj = {
          date: moment(item.createdAt).format('DD/MM/YYYY'),
          status: `Bán ${item.watermelonNumber} quả : ${Number(
            (item.awardPoint * 1.0).toFixed(1)
          )} Đ`
        }
        data.push(obj)
      })
      let sum = 0
      let arr = res?.data?.result[0]
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].sendAwardStatus === 'SUCCESS') {
          sum += arr[i].awardPoint * 1.0
        }
      }

      setTotal(Number(sum.toFixed(1)))
      setDataHis(data)
    }
  }

  useEffect(() => {
    setOpenDate(false)

    switch (tabActive) {
      case 1:
        getHisDrill()
        break

      case 2:
        getHisHarvest()
        break

      default:
        getHisSell()
        break
    }
  }, [tabActive, monthRequest, yearRequest])

  const onChangeDate = (date: Date) => {
    setCurrent(date)
    setOpenDate(!openDate)
    const month: number = moment(date).month() + 1
    const year: number = moment(date).year()
    setYearRequest(year)
    setMonthRequest(month)
  }

  const renderData = (dataHis: any, index: number) => {
    return (
      <div className='- flex flex-row' key={index}>
        <span className='flex w-[40%] justify-center p-2'>{dataHis.date}</span>
        <span className='justty-start flex w-[60%] p-2'>{dataHis.status}</span>
      </div>
    )
  }

  return (
    <>
      <div className='relative top-10 mb-[11rem] flex h-[full] w-full flex-col items-center justify-center'>
        <div className='relative w-[35vh] '>
          <Image
            src={'/images/his_title.png'}
            alt='logo'
            height={260}
            width={340}
          />
        </div>

        <div className='mt-4 flex h-[50vh] w-[90%] flex-wrap items-center justify-center rounded-lg bg-[#B05B08] p-2 text-left'>
          <div className='flex h-[50vh] w-full flex-col items-start'>
            <div className='flex h-[14%] w-full items-center justify-center'>
              <div className='flex h-[100%] w-[100%] flex-row rounded-t-lg bg-[#7A2D03]'>
                <div className='flex w-[35%] justify-center p-2'>
                  <Image
                    src={'/images/his_date.png'}
                    alt='logo'
                    height={20}
                    width={80}
                  />
                </div>
                <div className='flex w-[55%] justify-between p-2'>
                  <Image
                    src={'/images/his_status.png'}
                    alt='logo'
                    height={60}
                    width={150}
                  />
                </div>

                <div
                  className='flex w-[10%] justify-center p-1.5'
                  onClick={() => setOpenDate(!openDate)}
                >
                  <Image
                    src={'/images/his_filter.png'}
                    alt='logo'
                    height={30}
                    width={40}
                  />
                </div>
              </div>
            </div>
            <div
              className={`flex ${
                openDate ? 'items-start' : 'items-center'
              } h-[74.5%] w-full justify-center`}
            >
              {!openDate ? (
                <div className='flex h-[100%] w-[100%] flex-col justify-start overflow-y-scroll bg-[#903E05] text-sm font-bold text-white'>
                  {dataHis?.map((item: any, index: number) =>
                    renderData(item, index)
                  )}
                </div>
              ) : (
                <DatePicker
                  selected={current}
                  onChange={(date: Date) => onChangeDate(date)}
                  maxDate={new Date()}
                  showMonthYearPicker
                  showFourColumnMonthYearPicker
                  locale='vi'
                  inline
                />
              )}
            </div>

            <div className='bottom-0 left-0 block h-[3%] w-full items-center justify-center'>
              <div className=' flex min-h-[4vh] w-[100%] items-center justify-center rounded-b-lg bg-[#7A2D03] text-center font-bold text-white'>
                <span>
                  {tabActive === 2
                    ? TEXT_DEF.sum_seeded
                    : tabActive === 3
                    ? TEXT_DEF.sum_score
                    : null}
                  <span className='text-lg text-[#F2DD1A]'>
                    {' '}
                    {tabActive !== 1 ? total : null}{' '}
                    {tabActive === 2 ? 'quả' : tabActive === 3 ? 'Đ' : ''}
                  </span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default History
