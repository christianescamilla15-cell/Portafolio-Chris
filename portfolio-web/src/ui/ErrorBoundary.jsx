import { Component } from 'react'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }
  static getDerivedStateFromError() {
    return { hasError: true }
  }
  componentDidCatch(error, info) {
    console.error(`[ErrorBoundary] ${this.props.name || 'Section'} crashed:`, error, info)
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 40, textAlign: 'center', color: 'rgba(255,255,255,.3)', fontSize: 14 }}>
          <p>Something went wrong in this section.</p>
        </div>
      )
    }
    return this.props.children
  }
}
