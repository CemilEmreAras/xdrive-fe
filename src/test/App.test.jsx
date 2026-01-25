import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { HelmetProvider } from 'react-helmet-async'
import App from '../App'

describe('App', () => {
  it('renders without crashing', () => {
    // App already includes BrowserRouter, so we don't need to wrap it
    // But it needs HelmetProvider because App uses SEO component which uses Helmet
    const { container } = render(
      <HelmetProvider>
        <App />
      </HelmetProvider>
    )
    expect(container).toBeDefined()
  })
})
