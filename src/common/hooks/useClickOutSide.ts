import { RefObject, useEffect } from 'react'

export function handleClickOutside<T extends HTMLElement>(
  ref: RefObject<T>,
  callback: () => void
) {
  const handleClick = (event: MouseEvent) => {
    if (ref.current && !ref.current.contains(event.target as Node)) {
      callback()
    }
  }
  // eslint-disable-next-line
  useEffect(() => {
    document.addEventListener('click', handleClick)

    return () => {
      document.removeEventListener('click', handleClick)
    }
  }, [])
}
