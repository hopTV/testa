import React, { SetStateAction, useState } from 'react'

type ColorScheme = 'light' | 'dark'

interface LayoutConfig {
  ripple: boolean
  inputStyle: string
  menuMode: string
  colorScheme: ColorScheme
  theme: string
  scale: number
}

interface LayoutState {
  staticMenuDesktopInactive: boolean
  overlayMenuActive: boolean
  profileSidebarVisible: boolean
  configSidebarVisible: boolean
  staticMenuMobileActive: boolean
  menuHoverActive: boolean
}

interface ILayoutValue {
  layoutConfig: LayoutConfig
  layoutState: LayoutState
  onMenuToggle: () => void
  setLayoutConfig: React.Dispatch<SetStateAction<LayoutConfig>>
  setLayoutState: React.Dispatch<SetStateAction<LayoutState>>
  showProfileSidebar: () => void
}

export const LayoutContext = React.createContext<ILayoutValue>(
  {} as ILayoutValue
)

interface ILayoutProps {
  children: React.ReactNode
}

export const LayoutProvider = ({ children }: ILayoutProps) => {
  const [layoutConfig, setLayoutConfig] = useState<LayoutConfig>({
    ripple: false,
    inputStyle: 'outlined',
    menuMode: 'static',
    colorScheme: 'light',
    theme: 'rhea',
    scale: 14
  })

  const [layoutState, setLayoutState] = useState<LayoutState>({
    staticMenuDesktopInactive: false,
    overlayMenuActive: false,
    profileSidebarVisible: false,
    configSidebarVisible: false,
    staticMenuMobileActive: false,
    menuHoverActive: false
  })

  const onMenuToggle = () => {
    if (isOverlay()) {
      setLayoutState((prevLayoutState) => ({
        ...prevLayoutState,
        overlayMenuActive: !prevLayoutState.overlayMenuActive
      }))
    }

    if (isDesktop()) {
      setLayoutState((prevLayoutState) => ({
        ...prevLayoutState,
        staticMenuDesktopInactive: !prevLayoutState.staticMenuDesktopInactive
      }))
    } else {
      setLayoutState((prevLayoutState) => ({
        ...prevLayoutState,
        staticMenuMobileActive: !prevLayoutState.staticMenuMobileActive
      }))
    }
  }

  const showProfileSidebar = () => {
    setLayoutState((prevLayoutState) => ({
      ...prevLayoutState,
      profileSidebarVisible: !prevLayoutState.profileSidebarVisible
    }))
  }

  const isOverlay = () => {
    return layoutConfig.menuMode === 'overlay'
  }

  const isDesktop = () => {
    return window.innerWidth > 991
  }

  const value = {
    layoutConfig,
    setLayoutConfig,
    layoutState,
    setLayoutState,
    onMenuToggle,
    showProfileSidebar
  }

  return (
    <LayoutContext.Provider value={value}>{children}</LayoutContext.Provider>
  )
}
