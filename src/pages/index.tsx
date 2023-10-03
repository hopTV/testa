import Login from 'components/auth'
import AuthLayout from 'layouts/auth'
import React from 'react'
import { NextPageWithLayout } from 'types/layout.type'

const LoginEventPage: NextPageWithLayout = () => {
  return <Login />
}

LoginEventPage.getLayout = function getLayout(page: React.ReactElement) {
  return <AuthLayout>{page}</AuthLayout>
}

export default LoginEventPage
