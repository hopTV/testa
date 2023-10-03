import React from 'react'
import Warehouse from 'components/warehouse'
import DefaultLayout from 'layouts/default'
import { NextPageWithLayout } from 'types/layout.type'

const WarehousePage: NextPageWithLayout = () => {
  return <Warehouse />
}

WarehousePage.getLayout = function getLayout(page: React.ReactElement) {
  return <DefaultLayout>{page}</DefaultLayout>
}

export default WarehousePage
