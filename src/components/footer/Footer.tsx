import Image from 'next/image'
import { useRouter } from 'next/router'
import React, { memo, useState } from 'react'
import FooterChild from './ui/FooterChild'
import { TEXT_DEF } from 'constants/text'

interface Props {
  onEventHandle: () => void
}

const Footer = ({ onEventHandle }: Props) => {
  return (
    <section className='fixed  bottom-0 left-0 right-0 z-10'>
      <div className='container mx-auto flex w-full justify-between bg-bottom'>
        <FooterChild />
      </div>
    </section>
  )
}

export default memo(Footer)
