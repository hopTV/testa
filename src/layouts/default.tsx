import React from 'react'
import { Roboto } from '@next/font/google'
import Navbar from 'components/navbar'
import Footer from 'components/footer'
import { useRouter } from 'next/router'

interface ILayoutProps {
  children: React.ReactNode
}

const DefaultLayout = ({ children }: ILayoutProps) => {
  const router = useRouter()

  return (
    <React.Fragment>
      <main
        className='mx-width relative min-h-screen w-full overflow-hidden overscroll-y-auto
      bg-[length:100%_100%] bg-no-repeat md:min-w-[430px]'
        style={{
          backgroundImage: `url('/images/${
            router.pathname === '/rules'
              ? 'bg_his'
              : router.pathname === '/history'
              ? 'bg_his'
              : router.pathname === '/warehouse'
              ? 'bg_warehouse'
              : 'bg_home'
          }.png')`
        }}
      >
        <Navbar />
        {children}
        <footer>
          <Footer onEventHandle={() => {}} />
        </footer>
      </main>
    </React.Fragment>
  )
}

export default DefaultLayout
