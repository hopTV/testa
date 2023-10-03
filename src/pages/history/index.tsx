import React from 'react'
import History from 'components/history'
import DefaultLayout from 'layouts/default'
import { NextPageWithLayout } from 'types/layout.type'

const HistoryPage: NextPageWithLayout = () => {
  return <History />
}

HistoryPage.getLayout = function getLayout(page: React.ReactElement) {
  return <DefaultLayout>{page}</DefaultLayout>
}

export default HistoryPage
