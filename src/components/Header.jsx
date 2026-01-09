import { Link, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import './Header.css'

function Header() {
  const [showLanguageMenu, setShowLanguageMenu] = useState(false)
  const location = useLocation()

  // Hash değişikliğini dinle ve scroll et
  useEffect(() => {
    if (location.hash === '#faq') {
      setTimeout(() => {
        const faqElement = document.getElementById('faq')
        if (faqElement) {
          const headerHeight = 80
          const elementPosition = faqElement.getBoundingClientRect().top
          const offsetPosition = elementPosition + window.pageYOffset - headerHeight

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          })
        }
      }, 300)
    }
  }, [location.hash])

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <Link to="/" className="logo">
            <img 
              src="/images/logo.svg" 
              alt="XDrive rent a car" 
              className="logo-image"
              onError={(e) => {
                console.error('Logo yüklenemedi:', e.target.src);
                e.target.style.display = 'none';
              }}
              onLoad={() => {
                console.log('Logo başarıyla yüklendi');
              }}
            />
          </Link>
          <nav className="nav">
            <Link to="/">Home</Link>
            <Link to="/locations">Locations</Link>
            <Link to="/#faq">FAQ</Link>
            <Link to="/contact">Contact</Link>
            <Link to="/franchise">Franchise</Link>
          </nav>
          <div 
            className="language-selector"
            onMouseEnter={() => setShowLanguageMenu(true)}
            onMouseLeave={() => setShowLanguageMenu(false)}
          >
            <span className="flag-icon">🇬🇧</span>
            <span className="dropdown-arrow">▼</span>
            {showLanguageMenu && (
              <div className="dropdown-menu language-menu">
                <a href="#" onClick={(e) => e.preventDefault()}>🇬🇧 English</a>
                <a href="#" onClick={(e) => e.preventDefault()}>🇹🇷 Türkçe</a>
                <a href="#" onClick={(e) => e.preventDefault()}>🇩🇪 Deutsch</a>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header

