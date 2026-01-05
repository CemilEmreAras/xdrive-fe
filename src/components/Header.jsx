import { Link } from 'react-router-dom'
import './Header.css'

function Header() {
  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <Link to="/" className="logo">
            <h1>XDrive</h1>
          </Link>
          <nav className="nav">
            <Link to="/">Ana Sayfa</Link>
            <Link to="/cars">Araçlar</Link>
          </nav>
        </div>
      </div>
    </header>
  )
}

export default Header

