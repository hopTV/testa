/* ERROR BOUNDARY COMPONENT
   ========================================================================== */

import { Component, ReactNode } from 'react'

interface IErrorBoundaryProps {
  onReset: () => void
  children: ReactNode | null
}

interface IErrorBoundaryState {
  error: any
  errorInfo: any
}

class ErrorBoundary extends Component<
  IErrorBoundaryProps,
  IErrorBoundaryState
> {
  constructor(props: IErrorBoundaryProps) {
    super(props)
    this.state = { error: null, errorInfo: null }
  }

  componentDidCatch(error: any, errorInfo: any) {
    this.setState({ error, errorInfo })
  }

  render() {
    if (this.state.error) {
      return (
        <div>
          <div className='flex flex-col items-center justify-center'>
            <h1>Whoops!</h1>
            <p>Stuck in a blind spot. Reload to see the magic!</p>
            <button className='text-blue-400' onClick={this.props.onReset}>
              Reload
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
