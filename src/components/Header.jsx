import { Link } from 'react-router-dom'
import { useState } from 'react'
import './Header.css'

function Header() {
  const [showVehiclesMenu, setShowVehiclesMenu] = useState(false)
  const [showLanguageMenu, setShowLanguageMenu] = useState(false)

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <Link to="/" className="logo">
            <img 
              src="/images/logo.svg" 
              alt="XDrive rent a car" 
              className="logo-image"
            />
          </Link>
          <nav className="nav">
            <Link to="/">Home</Link>
            <Link to="/offers">Offers</Link>
            <div 
              className="nav-dropdown"
              onMouseEnter={() => setShowVehiclesMenu(true)}
              onMouseLeave={() => setShowVehiclesMenu(false)}
            >
              <Link to="/cars">
                Vehicles <span className="dropdown-arrow">▼</span>
              </Link>
              {showVehiclesMenu && (
                <div className="dropdown-menu">
                  <Link to="/cars?category=economy">Economy</Link>
                  <Link to="/cars?category=standard">Standard</Link>
                  <Link to="/cars?category=luxury">Luxury</Link>
                  <Link to="/cars?category=suv">SUV</Link>
                </div>
              )}
            </div>
            <Link to="/locations">Locations</Link>
            <Link to="/faq">FAQ</Link>
            <Link to="/news">News</Link>
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

