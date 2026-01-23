import { Link, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useCurrency } from '../context/CurrencyContext'
import { useLanguage } from '../context/LanguageContext'

function Header() {
  const { t } = useTranslation()
  const { currency, changeCurrency } = useCurrency()
  const { language, changeLanguage } = useLanguage()
  const [showLanguageMenu, setShowLanguageMenu] = useState(false)
  const [showCurrencyMenu, setShowCurrencyMenu] = useState(false)
  const [showMobileLanguageMenu, setShowMobileLanguageMenu] = useState(false)
  const [showMobileCurrencyMenu, setShowMobileCurrencyMenu] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const location = useLocation()

  // Menü açıkken body scroll'unu engelle
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [isMobileMenuOpen])

  // Dropdown'ların dışına tıklandığında kapanması
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showLanguageMenu && !event.target.closest('[data-language-menu]')) {
        setShowLanguageMenu(false)
      }
      if (showCurrencyMenu && !event.target.closest('[data-currency-menu]')) {
        setShowCurrencyMenu(false)
      }
      if (showMobileLanguageMenu && !event.target.closest('[data-mobile-language-menu]')) {
        setShowMobileLanguageMenu(false)
      }
      if (showMobileCurrencyMenu && !event.target.closest('[data-mobile-currency-menu]')) {
        setShowMobileCurrencyMenu(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showLanguageMenu, showCurrencyMenu, showMobileLanguageMenu, showMobileCurrencyMenu])

  // Logo ve header stili: tüm sayfalarda aynı, scroll ile hareket etmiyor
  const logoSource = '/images/logo-footer.svg'

  const baseHeaderClasses = `top-0 left-0 right-0 transition-all duration-300 z-[10010]`
  const variantClasses = 'relative bg-black shadow-md'
  const headerClasses = `${baseHeaderClasses} ${variantClasses}`

  const closeMobileMenu = () => setIsMobileMenuOpen(false)

  const scrollHomeTop = () => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handleHomeClick = () => {
    closeMobileMenu()
    scrollHomeTop()
  }

  const languageLabel = language === 'de' ? 'Deutsch' : 'English'

  const isActive = (path) => location.pathname === path

  return (
    <header className={`${headerClasses} overflow-visible`}>
      <div className={`mx-auto flex w-full max-w-[1800px] items-center justify-between px-3 py-1.5 sm:px-4 sm:py-2 tablet:px-4 tablet:py-2.5 mid:px-5 mid:py-2.5 md:px-5 md:py-2.5 lg:px-6 lg:py-3 xl:px-7 xl:py-3.5 2xl:px-9 2xl:py-4 relative z-[10011] min-h-[44px] tablet:min-h-[52px]`}>
        {/* Logo */}
        <Link to="/" className="flex items-center transition-transform hover:scale-105" onClick={handleHomeClick}>
          <img
            src={logoSource}
            alt="XDrive rent a car"
            className="h-6 w-auto object-contain sm:h-8 tablet:h-8 mid:h-9 md:h-10 lg:h-12 xl:h-13 2xl:h-14"
            onError={(e) => {
              console.error('Logo could not be loaded:', e.target.src)
              e.target.style.display = 'none'
            }}
          />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden flex-1 items-center justify-center gap-1 text-xs font-medium text-white tablet:flex tablet:gap-1.5 tablet:text-xs mid:gap-2 mid:text-xs md:gap-3 md:text-sm lg:gap-4 lg:text-sm xl:gap-5 xl:text-base 2xl:gap-6 2xl:text-base">
          <Link
            className={`relative px-2 py-1.5 transition-all duration-200 tablet:px-2 tablet:py-1.5 mid:px-2.5 mid:py-2 md:px-4 md:py-2.5 lg:px-5 lg:py-3 xl:px-6 xl:py-3.5 2xl:px-7 2xl:py-4 ${
              isActive('/')
                ? 'text-red-400'
                : 'text-white/90 hover:text-white hover:bg-white/5'
            } rounded-lg`}
            to="/"
            onClick={handleHomeClick}
          >
            {t('nav.home')}
            {isActive('/') && (
              <span className="absolute bottom-0 left-1/2 h-0.5 w-6 -translate-x-1/2 rounded-full bg-red-400" />
            )}
          </Link>
          <Link
            className={`relative px-2 py-1.5 transition-all duration-200 tablet:px-2 tablet:py-1.5 mid:px-2.5 mid:py-2 md:px-4 md:py-2.5 lg:px-5 lg:py-3 xl:px-6 xl:py-3.5 2xl:px-7 2xl:py-4 ${
              isActive('/about')
                ? 'text-red-400'
                : 'text-white/90 hover:text-white hover:bg-white/5'
            } rounded-lg`}
            to="/about"
            onClick={closeMobileMenu}
          >
            {t('nav.about')}
            {isActive('/about') && (
              <span className="absolute bottom-0 left-1/2 h-0.5 w-6 -translate-x-1/2 rounded-full bg-red-400" />
            )}
          </Link>
          <Link
            className={`relative px-2 py-1.5 transition-all duration-200 tablet:px-2 tablet:py-1.5 mid:px-2.5 mid:py-2 md:px-4 md:py-2.5 lg:px-5 lg:py-3 xl:px-6 xl:py-3.5 2xl:px-7 2xl:py-4 ${
              isActive('/locations')
                ? 'text-red-400'
                : 'text-white/90 hover:text-white hover:bg-white/5'
            } rounded-lg`}
            to="/locations"
            onClick={closeMobileMenu}
          >
            {t('nav.locations')}
            {isActive('/locations') && (
              <span className="absolute bottom-0 left-1/2 h-0.5 w-6 -translate-x-1/2 rounded-full bg-red-400" />
            )}
          </Link>
          <Link
            className={`relative px-2 py-1.5 transition-all duration-200 tablet:px-2 tablet:py-1.5 mid:px-2.5 mid:py-2 md:px-4 md:py-2.5 lg:px-5 lg:py-3 xl:px-6 xl:py-3.5 2xl:px-7 2xl:py-4 ${
              isActive('/faq')
                ? 'text-red-400'
                : 'text-white/90 hover:text-white hover:bg-white/5'
            } rounded-lg`}
            to="/faq"
            onClick={closeMobileMenu}
          >
            {t('nav.faq')}
            {isActive('/faq') && (
              <span className="absolute bottom-0 left-1/2 h-0.5 w-6 -translate-x-1/2 rounded-full bg-red-400" />
            )}
          </Link>
          <Link
            className={`relative px-2 py-1.5 transition-all duration-200 tablet:px-2 tablet:py-1.5 mid:px-2.5 mid:py-2 md:px-4 md:py-2.5 lg:px-5 lg:py-3 xl:px-6 xl:py-3.5 2xl:px-7 2xl:py-4 ${
              isActive('/franchise')
                ? 'text-red-400'
                : 'text-white/90 hover:text-white hover:bg-white/5'
            } rounded-lg`}
            to="/franchise"
            onClick={closeMobileMenu}
          >
            {t('nav.franchise')}
            {isActive('/franchise') && (
              <span className="absolute bottom-0 left-1/2 h-0.5 w-6 -translate-x-1/2 rounded-full bg-red-400" />
            )}
          </Link>
          <Link
            className={`relative px-2 py-1.5 transition-all duration-200 tablet:px-2 tablet:py-1.5 mid:px-2.5 mid:py-2 md:px-4 md:py-2.5 lg:px-5 lg:py-3 xl:px-6 xl:py-3.5 2xl:px-7 2xl:py-4 ${
              isActive('/contact')
                ? 'text-red-400'
                : 'text-white/90 hover:text-white hover:bg-white/5'
            } rounded-lg`}
            to="/contact"
            onClick={closeMobileMenu}
          >
            {t('nav.contact')}
            {isActive('/contact') && (
              <span className="absolute bottom-0 left-1/2 h-0.5 w-6 -translate-x-1/2 rounded-full bg-red-400" />
            )}
          </Link>
        </nav>

        {/* Sağ taraf: language + currency (desktop) */}
        <div className="hidden items-center gap-1 tablet:flex tablet:gap-1.5 mid:gap-2 md:gap-2.5 lg:gap-3 xl:gap-3.5 2xl:gap-4">
          <div className="relative" data-language-menu>
            <button
              type="button"
              className="flex items-center justify-center gap-1 rounded-lg border border-white/20 bg-white/5 px-1.5 py-1 text-[10px] tablet:px-2 tablet:py-1 tablet:text-xs mid:px-2.5 mid:py-1.5 mid:text-xs md:px-3 md:py-1.5 md:text-sm lg:px-3 lg:py-2 lg:text-sm xl:px-3.5 xl:py-2 xl:text-sm 2xl:px-4 2xl:py-2 2xl:text-sm text-white backdrop-blur-sm transition-all hover:border-white/40 hover:bg-white/10 w-10 tablet:w-11 mid:w-12 md:w-14 lg:w-16 xl:w-20 2xl:w-20"
              onClick={() => setShowLanguageMenu(!showLanguageMenu)}
            >
              <span className="text-xs tablet:text-sm mid:text-base md:text-lg lg:text-xl xl:text-xl 2xl:text-2xl">
                {language === 'de' ? '🇩🇪' : '🇬🇧'}
              </span>
            </button>
            {showLanguageMenu && (
              <div
                className="absolute right-0 z-[10002] mt-2 w-44 rounded-xl bg-white py-2 text-sm text-slate-900 shadow-2xl ring-1 ring-black/5"
              >
                <button
                  type="button"
                  onClick={() => {
                    changeLanguage('en')
                    setShowLanguageMenu(false)
                  }}
                  className={`flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors hover:bg-slate-50 ${
                    language === 'en' ? 'bg-red-50 font-semibold text-red-600' : ''
                  }`}
                >
                  <span className="text-lg">🇬🇧</span>
                  <span>English</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    changeLanguage('de')
                    setShowLanguageMenu(false)
                  }}
                  className={`flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors hover:bg-slate-50 ${
                    language === 'de' ? 'bg-red-50 font-semibold text-red-600' : ''
                  }`}
                >
                  <span className="text-lg">🇩🇪</span>
                  <span>Deutsch</span>
                </button>
              </div>
            )}
          </div>

          <div className="relative" data-currency-menu>
            <button
              type="button"
              className="flex items-center justify-center gap-1 rounded-lg border border-white/20 bg-white/5 px-1.5 py-1 text-[10px] tablet:px-2 tablet:py-1 tablet:text-xs mid:px-2.5 mid:py-1.5 mid:text-xs md:px-3 md:py-1.5 md:text-sm lg:px-3 lg:py-2 lg:text-sm xl:px-3.5 xl:py-2 xl:text-sm 2xl:px-4 2xl:py-2 2xl:text-sm text-white backdrop-blur-sm transition-all hover:border-white/40 hover:bg-white/10 w-10 tablet:w-11 mid:w-12 md:w-14 lg:w-16 xl:w-20 2xl:w-20"
              onClick={() => setShowCurrencyMenu(!showCurrencyMenu)}
            >
              <span className="text-xs tablet:text-sm mid:text-base md:text-lg lg:text-xl xl:text-xl 2xl:text-2xl font-semibold">
                {currency === 'EURO' ? '€' : currency === 'USD' ? '$' : '£'}
              </span>
            </button>
            {showCurrencyMenu && (
              <div
                className="absolute right-0 z-[10002] mt-2 w-44 rounded-xl bg-white py-2 text-sm text-slate-900 shadow-2xl ring-1 ring-black/5"
              >
                <button
                  type="button"
                  onClick={() => {
                    changeCurrency('EURO')
                    setShowCurrencyMenu(false)
                  }}
                  className={`flex w-full items-center gap-2 px-4 py-2.5 text-left transition-colors hover:bg-slate-50 ${
                    currency === 'EURO' ? 'bg-red-50 font-semibold text-red-600' : ''
                  }`}
                >
                  <span className="text-base">€</span>
                  <span>EUR</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    changeCurrency('USD')
                    setShowCurrencyMenu(false)
                  }}
                  className={`flex w-full items-center gap-2 px-4 py-2.5 text-left transition-colors hover:bg-slate-50 ${
                    currency === 'USD' ? 'bg-red-50 font-semibold text-red-600' : ''
                  }`}
                >
                  <span className="text-base">$</span>
                  <span>USD</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    changeCurrency('GBP')
                    setShowCurrencyMenu(false)
                  }}
                  className={`flex w-full items-center gap-2 px-4 py-2.5 text-left transition-colors hover:bg-slate-50 ${
                    currency === 'GBP' ? 'bg-red-50 font-semibold text-red-600' : ''
                  }`}
                >
                  <span className="text-base">£</span>
                  <span>GBP</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile right side: hamburger only */}
        <div className={`flex items-center gap-2 tablet:hidden relative flex-shrink-0 z-[10012] min-w-[44px] min-h-[44px] justify-center`}>
          <button
            className={`flex flex-col gap-1.5 rounded-lg p-2.5 transition-all relative flex-shrink-0 z-[10012] min-w-[44px] min-h-[44px] items-center justify-center ${
              isMobileMenuOpen
                ? 'bg-white/10'
                : 'hover:bg-white/10'
            }`}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <span
              className={`h-0.5 w-6 rounded-full bg-white transition-all ${
                isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''
              }`}
            />
            <span
              className={`h-0.5 w-6 rounded-full bg-white transition-all ${
                isMobileMenuOpen ? 'opacity-0' : ''
              }`}
            />
            <span
              className={`h-0.5 w-6 rounded-full bg-white transition-all ${
                isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''
              }`}
            />
          </button>
        </div>
      </div>


      {/* Mobile slide menu */}
      {isMobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 z-[10002] bg-black/60 tablet:hidden"
            onClick={closeMobileMenu}
          />
          <div className="fixed top-0 bottom-0 left-0 z-[10003] w-80 max-w-[85vw] h-screen bg-gradient-to-b from-black via-black to-slate-900 px-6 py-24 text-white shadow-2xl tablet:hidden">
            <nav className="flex flex-col gap-1">
              <Link
                to="/"
                onClick={handleHomeClick}
                className={`rounded-lg px-4 py-3 text-base font-medium transition-all ${
                  isActive('/')
                    ? 'bg-red-500/20 text-red-400'
                    : 'text-white/90 hover:bg-white/10 hover:text-white'
                }`}
              >
                {t('nav.home')}
              </Link>
              <Link
                to="/about"
                onClick={closeMobileMenu}
                className={`rounded-lg px-4 py-3 text-base font-medium transition-all ${
                  isActive('/about')
                    ? 'bg-red-500/20 text-red-400'
                    : 'text-white/90 hover:bg-white/10 hover:text-white'
                }`}
              >
                {t('nav.about')}
              </Link>
              <Link
                to="/locations"
                onClick={closeMobileMenu}
                className={`rounded-lg px-4 py-3 text-base font-medium transition-all ${
                  isActive('/locations')
                    ? 'bg-red-500/20 text-red-400'
                    : 'text-white/90 hover:bg-white/10 hover:text-white'
                }`}
              >
                {t('nav.locations')}
              </Link>
              <Link
                to="/faq"
                onClick={closeMobileMenu}
                className={`rounded-lg px-4 py-3 text-base font-medium transition-all ${
                  isActive('/faq')
                    ? 'bg-red-500/20 text-red-400'
                    : 'text-white/90 hover:bg-white/10 hover:text-white'
                }`}
              >
                {t('nav.faq')}
              </Link>
              <Link
                to="/franchise"
                onClick={closeMobileMenu}
                className={`rounded-lg px-4 py-3 text-base font-medium transition-all ${
                  isActive('/franchise')
                    ? 'bg-red-500/20 text-red-400'
                    : 'text-white/90 hover:bg-white/10 hover:text-white'
                }`}
              >
                {t('nav.franchise')}
              </Link>
              <Link
                to="/contact"
                onClick={closeMobileMenu}
                className={`rounded-lg px-4 py-3 text-base font-medium transition-all ${
                  isActive('/contact')
                    ? 'bg-red-500/20 text-red-400'
                    : 'text-white/90 hover:bg-white/10 hover:text-white'
                }`}
              >
                {t('nav.contact')}
              </Link>
            </nav>

            {/* Mobile language and currency selectors */}
            <div className="mt-8 border-t border-white/10 pt-6">
              <div className="flex flex-col gap-4">
                {/* Language selector */}
                <div className="relative" data-mobile-language-menu>
                  <button
                    type="button"
                    className="flex w-full items-center justify-between rounded-lg border border-white/20 bg-white/5 px-4 py-3 text-sm text-white backdrop-blur-sm transition-all hover:border-white/40 hover:bg-white/10"
                    onClick={() => setShowMobileLanguageMenu(!showMobileLanguageMenu)}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-lg">
                        {language === 'de' ? '🇩🇪' : '🇬🇧'}
                      </span>
                      <span>{languageLabel}</span>
                    </div>
                  </button>
                  {showMobileLanguageMenu && (
                    <div className="absolute left-0 right-0 z-[10002] mt-2 rounded-xl bg-white py-2 text-sm text-slate-900 shadow-2xl ring-1 ring-black/5">
                      <button
                        type="button"
                        onClick={() => {
                          changeLanguage('en')
                          setShowMobileLanguageMenu(false)
                        }}
                        className={`flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors hover:bg-slate-50 ${
                          language === 'en' ? 'bg-red-50 font-semibold text-red-600' : ''
                        }`}
                      >
                        <span className="text-lg">🇬🇧</span>
                        <span>English</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          changeLanguage('de')
                          setShowMobileLanguageMenu(false)
                        }}
                        className={`flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors hover:bg-slate-50 ${
                          language === 'de' ? 'bg-red-50 font-semibold text-red-600' : ''
                        }`}
                      >
                        <span className="text-lg">🇩🇪</span>
                        <span>Deutsch</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Currency selector */}
                <div className="relative" data-mobile-currency-menu>
                  <button
                    type="button"
                    className="flex w-full items-center justify-between rounded-lg border border-white/20 bg-white/5 px-4 py-3 text-sm text-white backdrop-blur-sm transition-all hover:border-white/40 hover:bg-white/10"
                    onClick={() => setShowMobileCurrencyMenu(!showMobileCurrencyMenu)}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-semibold">
                        {currency === 'EURO' ? '€' : currency === 'USD' ? '$' : '£'}
                      </span>
                      <span>{currency === 'EURO' ? 'EUR' : currency === 'USD' ? 'USD' : 'GBP'}</span>
                    </div>
                  </button>
                  {showMobileCurrencyMenu && (
                    <div className="absolute left-0 right-0 z-[10002] mt-2 rounded-xl bg-white py-2 text-sm text-slate-900 shadow-2xl ring-1 ring-black/5">
                      <button
                        type="button"
                        onClick={() => {
                          changeCurrency('EURO')
                          setShowMobileCurrencyMenu(false)
                        }}
                        className={`flex w-full items-center gap-2 px-4 py-2.5 text-left transition-colors hover:bg-slate-50 ${
                          currency === 'EURO' ? 'bg-red-50 font-semibold text-red-600' : ''
                        }`}
                      >
                        <span className="text-base">€</span>
                        <span>EUR</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          changeCurrency('USD')
                          setShowMobileCurrencyMenu(false)
                        }}
                        className={`flex w-full items-center gap-2 px-4 py-2.5 text-left transition-colors hover:bg-slate-50 ${
                          currency === 'USD' ? 'bg-red-50 font-semibold text-red-600' : ''
                        }`}
                      >
                        <span className="text-base">$</span>
                        <span>USD</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          changeCurrency('GBP')
                          setShowMobileCurrencyMenu(false)
                        }}
                        className={`flex w-full items-center gap-2 px-4 py-2.5 text-left transition-colors hover:bg-slate-50 ${
                          currency === 'GBP' ? 'bg-red-50 font-semibold text-red-600' : ''
                        }`}
                      >
                        <span className="text-base">£</span>
                        <span>GBP</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </header>
  )
}

export default Header

