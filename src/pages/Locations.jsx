import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import SEO from '../components/SEO'

function Locations() {
  const { t } = useTranslation()
  const [currentIndices, setCurrentIndices] = useState({
    'USA': 0,
    'MOROCCO': 0,
    'JORDAN': 0,
    'NEW ZEALAND': 0,
    'AZERBAIJAN': 0,
    'BARBADOS': 0,
    'SRI LANKA': 0,
    'UAE': 0,
    'MALAYSIA': 0,
    'ZAMBIA': 0,
    'MAURITIUS': 0,
    'MEXICO': 0,
    'OMAN': 0,
    'FIJI': 0,
    'BAHAMAS': 0,
    'TRINIDAD AND TOBAGO': 0,
    'BULGARIA': 0,
    'AUSTRALIA': 0,
    'TANZANIA': 0,
    'SINT MARTIN': 0,
    'TURKEY': 0,
    'KENYA': 0
  })

  // Location data generated from images
  const locationsData = {
    'USA': [
      {
        name: 'Miami Airport',
        country: 'USA',
        image: '/images/locations/Miami, USA.jpg',
        icon: 'airplane'
      },
      {
        name: 'Orlando Airport',
        country: 'USA',
        image: '/images/locations/Orlando, USA.jpg',
        icon: 'airplane'
      }
    ],
    'MOROCCO': [
      {
        name: 'Agadir Airport',
        country: 'Morocco',
        image: '/images/locations/Agadir, Morocco.jpg',
        icon: 'airplane'
      },
      {
        name: 'Marrakesh Airport',
        country: 'Morocco',
        image: '/images/locations/Marrakesh, Morocco.jpg',
        icon: 'airplane'
      }
    ],
    'JORDAN': [
      {
        name: 'Amman Airport',
        country: 'Jordan',
        image: '/images/locations/Amman, Jordan.jpg',
        icon: 'airplane'
      }
    ],
    'NEW ZEALAND': [
      {
        name: 'Auckland Airport',
        country: 'New Zealand',
        image: '/images/locations/Auckland, New Zealand.jpg',
        icon: 'airplane'
      }
    ],
    'AZERBAIJAN': [
      {
        name: 'Baku Airport',
        country: 'Azerbaijan',
        image: '/images/locations/Baku, Azerbaijan.jpg',
        icon: 'airplane'
      }
    ],
    'BARBADOS': [
      {
        name: 'Bridgetown Airport',
        country: 'Barbados',
        image: '/images/locations/Bridgetown, Barbados.jpg',
        icon: 'airplane'
      }
    ],
    'SRI LANKA': [
      {
        name: 'Colombo Airport',
        country: 'Sri Lanka',
        image: '/images/locations/Colombo, Sri Lanka.jpg',
        icon: 'airplane'
      }
    ],
    'UAE': [
      {
        name: 'Dubai Airport',
        country: 'United Arab Emirates',
        image: '/images/locations/Dubai, United Arab Emirates.jpg',
        icon: 'airplane'
      }
    ],
    'MALAYSIA': [
      {
        name: 'Kuala Lumpur Airport',
        country: 'Malaysia',
        image: '/images/locations/Kuala Lumpur, Malaysia.jpg',
        icon: 'airplane'
      },
      {
        name: 'Penang Airport',
        country: 'Malaysia',
        image: '/images/locations/Penang, Malaysia.jpg',
        icon: 'airplane'
      }
    ],
    'ZAMBIA': [
      {
        name: 'Livingstone Airport',
        country: 'Zambia',
        image: '/images/locations/Livingstone, Zambia.jpg',
        icon: 'airplane'
      },
      {
        name: 'Lusaka Airport',
        country: 'Zambia',
        image: '/images/locations/Lusaka, Zambia.jpg',
        icon: 'airplane'
      },
      {
        name: 'Ndola Airport',
        country: 'Zambia',
        image: '/images/locations/Ndola, Zambia.jpg',
        icon: 'airplane'
      },
      {
        name: 'Solwezi Airport',
        country: 'Zambia',
        image: '/images/locations/Solwezi, Zambia.jpg',
        icon: 'airplane'
      }
    ],
    'MAURITIUS': [
      {
        name: 'Mauritius Airport',
        country: 'Mauritius',
        image: '/images/locations/Mauritius.jpg',
        icon: 'airplane'
      }
    ],
    'MEXICO': [
      {
        name: 'Cancun Airport',
        country: 'Mexico',
        image: '/images/locations/Mexico, Cancun.jpg',
        icon: 'airplane'
      }
    ],
    'OMAN': [
      {
        name: 'Muscat Airport',
        country: 'Oman',
        image: '/images/locations/Muscat, Oman.jpg',
        icon: 'airplane'
      },
      {
        name: 'Salalah Airport',
        country: 'Oman',
        image: '/images/locations/Salalah, Oman.jpg',
        icon: 'airplane'
      }
    ],
    'FIJI': [
      {
        name: 'Nadi Airport',
        country: 'Fiji',
        image: '/images/locations/Nadi, Fiji.jpg',
        icon: 'airplane'
      }
    ],
    'BAHAMAS': [
      {
        name: 'Nassau Airport',
        country: 'Bahamas',
        image: '/images/locations/Nassau, Bahamas.jpg',
        icon: 'airplane'
      }
    ],
    'TRINIDAD AND TOBAGO': [
      {
        name: 'Tobago Airport',
        country: 'Trinidad and Tobago',
        image: '/images/locations/Tobago, Trinidad and Tobago .jpg',
        icon: 'airplane'
      }
    ],
    'BULGARIA': [
      {
        name: 'Sofia Airport',
        country: 'Bulgaria',
        image: '/images/locations/Sofia, Bulgaria.jpg',
        icon: 'airplane'
      },
      {
        name: 'Varna Airport',
        country: 'Bulgaria',
        image: '/images/locations/Varna, Bulgaria.jpg',
        icon: 'airplane'
      }
    ],
    'AUSTRALIA': [
      {
        name: 'Sydney Airport',
        country: 'Australia',
        image: '/images/locations/Sydney, Australia.jpg',
        icon: 'airplane'
      }
    ],
    'TANZANIA': [
      {
        name: 'Zanzibar Airport',
        country: 'Tanzania',
        image: '/images/locations/Zanzibar, Tanzania.jpg',
        icon: 'airplane'
      }
    ],
    'SINT MARTIN': [
      {
        name: 'Sint Maarten Airport',
        country: 'Sint Maarten',
        image: '/images/locations/Sint Martin.jpg',
        icon: 'airplane'
      }
    ],
    'TURKEY': [
      {
        name: 'Antalya Airport',
        country: 'Turkey',
        image: '/images/locations/Antalya, Turkey.jpg',
        icon: 'airplane'
      },
      {
        name: 'Nevsehir Airport',
        country: 'Turkey',
        image: '/images/locations/Cappadocia, Turkey.jpg',
        icon: 'airplane'
      },
      {
        name: 'Kayseri Airport',
        country: 'Turkey',
        image: '/images/locations/Kayseri, Turkey.jpg',
        icon: 'airplane'
      }
    ],
    'KENYA': [
      {
        name: 'Mombasa Airport',
        country: 'Kenya',
        image: '/images/locations/Mombasa, Kenya.jpg',
        icon: 'airplane'
      },
      {
        name: 'Nairobi - Jomo Kenyatta Airport',
        country: 'Kenya',
        image: '/images/locations/Nairobi, Kenya.jpg',
        icon: 'airplane'
      },
      {
        name: 'Nairobi - Wilson Airport',
        country: 'Kenya',
        image: '/images/locations/Nairobi Wilson, Kenya.jpg',
        icon: 'airplane'
      }
    ]
  }

  const getCountryFlag = (country) => {
    const flags = {
      'USA': '🇺🇸',
      'MOROCCO': '🇲🇦',
      'JORDAN': '🇯🇴',
      'NEW ZEALAND': '🇳🇿',
      'AZERBAIJAN': '🇦🇿',
      'BARBADOS': '🇧🇧',
      'SRI LANKA': '🇱🇰',
      'UAE': '🇦🇪',
      'MALAYSIA': '🇲🇾',
      'ZAMBIA': '🇿🇲',
      'MAURITIUS': '🇲🇺',
      'MEXICO': '🇲🇽',
      'OMAN': '🇴🇲',
      'FIJI': '🇫🇯',
      'BAHAMAS': '🇧🇸',
      'TRINIDAD AND TOBAGO': '🇹🇹',
      'BULGARIA': '🇧🇬',
      'AUSTRALIA': '🇦🇺',
      'TANZANIA': '🇹🇿',
      'SINT MARTIN': '🇸🇽',
      'TURKEY': '🇹🇷',
      'KENYA': '🇰🇪'
    }
    return flags[country] || '🌍'
  }

  const nextLocation = (country) => {
    setCurrentIndices(prev => {
      const current = prev[country] || 0
      const total = locationsData[country].length
      const next = current + 3
      return {
        ...prev,
        [country]: next >= total ? 0 : next
      }
    })
  }

  const prevLocation = (country) => {
    setCurrentIndices(prev => {
      const current = prev[country] || 0
      const total = locationsData[country].length
      const prevIndex = current - 3
      return {
        ...prev,
        [country]: prevIndex < 0 ? Math.max(0, total - (total % 3 === 0 ? 3 : total % 3)) : prevIndex
      }
    })
  }

  const getTotalPages = (country) => {
    return Math.ceil(locationsData[country].length / 3)
  }

  const getCurrentPage = (country) => {
    return Math.floor((currentIndices[country] || 0) / 3) + 1
  }

  return (
    <>
      <SEO 
        title={t('seo.locations.title')}
        description={t('seo.locations.description')}
        keywords={t('seo.locations.keywords')}
      />
      <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative min-h-[400px] w-full flex items-center justify-center bg-black bg-[url('/images/locations-hero-bg.jpg')] bg-center bg-contain bg-no-repeat text-white overflow-hidden">
        <div className="absolute top-0 left-0 right-0 bottom-0 bg-black/30 z-[1]"></div>
        <div className="relative z-[2] w-full max-w-[1200px] mx-auto px-5 sm:px-6 md:px-8 lg:px-10">
          <div className="text-center max-w-[800px] mx-auto">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[48px] font-bold mb-5 leading-tight text-white">
              {t('locations.heroTitle')}
            </h1>
            <p className="text-base sm:text-lg md:text-lg text-white/90 leading-relaxed">
              {t('locations.heroSubtitle')}
            </p>
          </div>
        </div>
      </section>

      {/* Locations Section */}
      <section className="py-10 sm:py-12 md:py-16 lg:py-20 bg-white px-5 sm:px-6 md:px-8 lg:px-10">
        <div className="max-w-[1200px] mx-auto">
        {Object.keys(locationsData).map((country) => {
          const countryLocations = locationsData[country]
          const currentIndex = currentIndices[country] || 0
          const visibleLocations = countryLocations.slice(currentIndex, currentIndex + 3)
          const totalPages = getTotalPages(country)
          const currentPage = getCurrentPage(country)

          return (
            <div key={country} className="mb-16 sm:mb-20">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
                <div className="flex items-center gap-3">
                  <span className="text-3xl sm:text-3xl md:text-4xl leading-none">{getCountryFlag(country)}</span>
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#1a1a1a] m-0">{t(`countries.${country}`, country)}</h2>
                </div>
                {totalPages > 1 && (
                  <div className="flex gap-2 items-center">
                    {Array.from({ length: totalPages }).map((_, index) => (
                      <span
                        key={index}
                        className={`w-2.5 h-2.5 rounded-full transition-all cursor-pointer ${index + 1 === currentPage ? 'bg-[#ef4444] border-2 border-[#ef4444]' : 'bg-transparent border-2 border-[#d1d5db]'}`}
                      />
                    ))}
                  </div>
                )}
              </div>
              
              <div className="relative">
                {countryLocations.length <= 3 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-6 md:gap-8">
                    {countryLocations.map((location, idx) => (
                      <div key={`${country}-${idx}`} className="relative bg-white rounded-xl overflow-hidden shadow-[0_4px_12px_rgba(0,0,0,0.1)] transition-all hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(0,0,0,0.15)]">
                        <div className="relative w-full h-[250px] sm:h-[280px] md:h-[300px] overflow-hidden bg-[#f3f4f6]">
                          <img
                            src={location.image}
                            alt={location.name}
                            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                            onError={(e) => {
                              e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iI2Y1ZjVmNSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjAiIGZpbGw9IiM5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5JbWFnZSBub3QgZm91bmQ8L3RleHQ+PC9zdmc+'
                            }}
                          />
                          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 w-10 h-10 sm:w-12 sm:h-12 bg-black/75 rounded-full flex items-center justify-center text-white z-[2]">
                              {location.icon === 'airplane' ? (
                                <svg
                                  width="16"
                                  height="16"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="sm:w-5 sm:h-5"
                                >
                                  <path
                                    d="M21 16V14L15 9.5V7C15 6.45 14.55 6 14 6H10C9.45 6 9 6.45 9 7V9.5L3 14V16L9 13.5V19L7 21V22H17V21L15 19V13.5L21 16Z"
                                    fill="white"
                                  />
                                </svg>
                              ) : (
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="sm:w-5 sm:h-5">
                                <path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2ZM12 11.5C10.62 11.5 9.5 10.38 9.5 9C9.5 7.62 10.62 6.5 12 6.5C13.38 6.5 14.5 7.62 14.5 9C14.5 10.38 13.38 11.5 12 11.5Z" fill="white"/>
                              </svg>
                            )}
                          </div>
                        </div>
                        <div className="p-6">
                          <h3 className="text-lg font-bold text-[#1a1a1a] m-0 mb-2 leading-snug font-sans">{location.name}</h3>
                          <p className="text-sm text-[#FF6B35] m-0 font-medium">{t(`countries.${location.country}`, location.country)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="relative flex items-center gap-5">
                    <button
                      className="absolute top-1/2 -translate-y-1/2 -left-[25px] sm:-left-[25px] md:-left-[25px] bg-white/95 border-2 border-[#e5e7eb] rounded-full w-[40px] sm:w-[50px] h-[40px] sm:h-[50px] flex items-center justify-center text-[24px] sm:text-[28px] text-[#1a1a1a] cursor-pointer z-10 transition-all font-bold shadow-[0_2px_8px_rgba(0,0,0,0.1)] hover:bg-[#ef4444] hover:text-white hover:border-[#ef4444] hover:shadow-[0_4px_12px_rgba(239,68,68,0.3)]"
                      onClick={() => prevLocation(country)}
                      aria-label="Previous location"
                    >
                      ‹
                    </button>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-6 md:gap-8 flex-1">
                      {visibleLocations.map((location, idx) => (
                        <div key={`${country}-${currentIndex + idx}`} className="relative bg-white rounded-xl overflow-hidden shadow-[0_4px_12px_rgba(0,0,0,0.1)] transition-all hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(0,0,0,0.15)]">
                          <div className="relative w-full h-[250px] sm:h-[280px] md:h-[300px] overflow-hidden bg-[#f3f4f6]">
                            <img
                              src={location.image}
                              alt={location.name}
                              className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                              onError={(e) => {
                                e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iI2Y1ZjVmNSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjAiIGZpbGw9IiM5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5JbWFnZSBub3QgZm91bmQ8L3RleHQ+PC9zdmc+'
                              }}
                            />
                            <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-black/75 rounded-full flex items-center justify-center text-white z-[2]">
                              {location.icon === 'airplane' ? (
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M21 16V14L15 9.5V7C15 6.45 14.55 6 14 6H10C9.45 6 9 6.45 9 7V9.5L3 14V16L9 13.5V19L7 21V22H17V21L15 19V13.5L21 16Z" fill="white"/>
                                </svg>
                              ) : (
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2ZM12 11.5C10.62 11.5 9.5 10.38 9.5 9C9.5 7.62 10.62 6.5 12 6.5C13.38 6.5 14.5 7.62 14.5 9C14.5 10.38 13.38 11.5 12 11.5Z" fill="white"/>
                                </svg>
                              )}
                            </div>
                          </div>
                          <div className="p-6">
                            <h3 className="text-lg font-bold text-[#1a1a1a] m-0 mb-2 leading-snug font-sans">{location.name}</h3>
                            <p className="text-sm text-[#FF6B35] m-0 font-medium">{t(`countries.${location.country}`, location.country)}</p>
                          </div>
                        </div>
                      ))}
                      {/* Fill missing cards */}
                      {visibleLocations.length < 3 && Array.from({ length: 3 - visibleLocations.length }).map((_, idx) => (
                        <div key={`empty-${idx}`} className="relative bg-white rounded-xl overflow-hidden shadow-[0_4px_12px_rgba(0,0,0,0.1)] invisible pointer-events-none"></div>
                      ))}
                    </div>
                    <button
                      className="absolute top-1/2 -translate-y-1/2 -right-[25px] sm:-right-[25px] md:-right-[25px] bg-white/95 border-2 border-[#e5e7eb] rounded-full w-[40px] sm:w-[50px] h-[40px] sm:h-[50px] flex items-center justify-center text-[24px] sm:text-[28px] text-[#1a1a1a] cursor-pointer z-10 transition-all font-bold shadow-[0_2px_8px_rgba(0,0,0,0.1)] hover:bg-[#ef4444] hover:text-white hover:border-[#ef4444] hover:shadow-[0_4px_12px_rgba(239,68,68,0.3)]"
                      onClick={() => nextLocation(country)}
                      aria-label="Next location"
                    >
                      ›
                    </button>
                  </div>
                )}
              </div>
            </div>
          )
        })}
        </div>
      </section>
    </div>
    </>
  )
}

export default Locations
