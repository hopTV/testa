import React from 'react'
import Event from 'components/event'
import AuthLayout from 'layouts/auth'
import { NextPageWithLayout } from 'types/layout.type'

const EventPage: NextPageWithLayout = () => {
  return <Event />
}

EventPage.getLayout = function getLayout(page: React.ReactElement) {
  return <AuthLayout>{page}</AuthLayout>
}

export default EventPage
