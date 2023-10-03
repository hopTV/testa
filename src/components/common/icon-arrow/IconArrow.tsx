import Image from 'next/image'
import React, { memo } from 'react'

interface Props {
  className?: string
  width?: number
  height?: number
  image?: string
}

const IconArrow = ({
  className,
  width = 70,
  height = 70,
  image = '/gifs/mui-ten.gif'
}: Props) => {
  return (
    <div className={className}>
      <Image src={image} alt='icon-down' width={width} height={height} />
    </div>
  )
}

export default memo(IconArrow)
