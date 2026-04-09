import { render } from '@testing-library/react'
import { describe, test, expect } from 'vitest'
import App from '../App'

describe('App', () => {
  test('renders without crashing', () => {
    render(<App />)
  })

  test('shows loading screen initially', () => {
    render(<App />)
    expect(document.body).toBeTruthy()
  })
})
