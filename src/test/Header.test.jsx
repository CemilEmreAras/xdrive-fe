import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import Header from '../components/Header'
import { LanguageProvider } from '../context/LanguageContext'
import { CurrencyProvider } from '../context/CurrencyContext'

describe('Header', () => {
  it('renders navigation links', () => {
    render(
      <BrowserRouter>
        <LanguageProvider>
          <CurrencyProvider>
            <Header />
          </CurrencyProvider>
        </LanguageProvider>
      </BrowserRouter>
    )
    
    // Check if navigation links are present
    expect(screen.getByText(/home/i)).toBeInTheDocument()
  })
})
