import Navbar from 'components/navbar'
import { useRouter } from 'next/router'
import React from 'react'

interface ICustomLayoutProps {
  children: React.ReactNode
}

const AuthLayout = ({ children }: ICustomLayoutProps) => {
  const router = useRouter()
  const bg: String = router.pathname === '/event' ? 'bg_event' : 'bg_login'

  return (
    <React.Fragment>
      <main
        className={`mx-width relative min-h-screen w-full bg-[length:100%_100%] bg-no-repeat md:min-w-[430px]`}
        style={{ backgroundImage: `url('/images/${bg}.png')` }}
      >
        <Navbar />
        {children}
      </main>
    </React.Fragment>
  )
}

export default AuthLayout
