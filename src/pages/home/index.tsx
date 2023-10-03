import Home from 'components/home'
import MainLayout from 'layouts/default'
import React from 'react'
import { NextPageWithLayout } from 'types/layout.type'

const HomePage: NextPageWithLayout = () => {
  return <Home />
}

HomePage.getLayout = function getLayout(page: React.ReactElement) {
  return <MainLayout>{page}</MainLayout>
}

export default HomePage
