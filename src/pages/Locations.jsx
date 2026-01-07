import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getLocations } from '../services/api'
import './Locations.css'

function Locations() {
  const [locations, setLocations] = useState([])
  const [groupedLocations, setGroupedLocations] = useState({})
  const [loading, setLoading] = useState(true)
  const [currentIndices, setCurrentIndices] = useState({})

  useEffect(() => {
    fetchLocations()
  }, [])

  const fetchLocations = async () => {
    try {
      setLoading(true)
      const data = await getLocations()
      setLocations(data || [])
      
      // Lokasyonları ülkelere göre grupla
      const grouped = {}
      data.forEach(location => {
        // Ülke adını çıkar (Location_Name'den veya Address'ten)
        const country = extractCountry(location)
        if (!grouped[country]) {
          grouped[country] = []
        }
        grouped[country].push(location)
      })
      
      setGroupedLocations(grouped)
      
      // Her ülke için carousel index'lerini başlat
      const indices = {}
      Object.keys(grouped).forEach(country => {
        indices[country] = 0
      })
      setCurrentIndices(indices)
    } catch (error) {
      console.error('Lokasyonlar yüklenirken hata:', error)
      setLocations([])
    } finally {
      setLoading(false)
    }
  }

  const extractCountry = (location) => {
    // Location_Name'den ülke adını çıkar
    // Örnek: "V.C. Bird International Airport (ANU)" -> "Antigua and Barbuda"
    // Veya Address'ten ülke adını çıkar
    const name = location.Location_Name || location.location_name || ''
    const address = location.Address || location.address || ''
    
    // Eğer Location_Name'de ülke adı varsa onu kullan
    // Aksi halde Address'ten çıkar
    if (name.includes('Antigua') || name.includes('Barbuda')) return 'ANTIGUA AND BARBUDA'
    if (name.includes('Cyprus') || name.includes('Cypres') || name.includes('Larnaca') || name.includes('Pafos')) return 'CYPRES'
    if (name.includes('USA') || name.includes('United States')) return 'USA'
    if (name.includes('Germany') || name.includes('Deutschland')) return 'GERMANY'
    if (name.includes('Turkey') || name.includes('Türkiye')) return 'TURKEY'
    
    // Address'ten ülke adını çıkar
    if (address.includes('Antigua') || address.includes('Barbuda')) return 'ANTIGUA AND BARBUDA'
    if (address.includes('Cyprus') || address.includes('Cypres')) return 'CYPRES'
    if (address.includes('USA') || address.includes('United States')) return 'USA'
    if (address.includes('Germany') || address.includes('Deutschland')) return 'GERMANY'
    if (address.includes('Turkey') || address.includes('Türkiye')) return 'TURKEY'
    
    // Varsayılan olarak "OTHER" döndür
    return 'OTHER'
  }

  const getCountryFlag = (country) => {
    const flags = {
      'ANTIGUA AND BARBUDA': '🇦🇬',
      'CYPRES': '🇨🇾',
      'USA': '🇺🇸',
      'GERMANY': '🇩🇪',
      'TURKEY': '🇹🇷',
      'OTHER': '🌍'
    }
    return flags[country] || '🌍'
  }

  const getLocationImage = (location) => {
    // API'den resim gelirse kullan
    if (location.image || location.Image || location.image_path || location.Image_Path) {
      const imagePath = location.image || location.Image || location.image_path || location.Image_Path
      if (imagePath && imagePath.trim() !== '' && !imagePath.includes('data:image/svg+xml')) {
        if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
          return imagePath
        } else if (imagePath.startsWith('/')) {
          return `https://xdrivejson.turevsistem.com${imagePath}`
        } else {
          return `https://xdrivejson.turevsistem.com/${imagePath}`
        }
      }
    }
    
    // Varsayılan placeholder resimler (ülkeye göre)
    const country = extractCountry(location)
    const placeholders = {
      'ANTIGUA AND BARBUDA': 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iIzAwN2JiZiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjAiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+QW50aWd1YSBhbmQgQmFyYnVkYTwvdGV4dD48L3N2Zz4=',
      'CYPRES': 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iIzAwN2JiZiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjAiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+Q3lwcnVzPC90ZXh0Pjwvc3ZnPg==',
      'USA': 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iIzAwN2JiZiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjAiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+VVNBPC90ZXh0Pjwvc3ZnPg==',
      'GERMANY': 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iIzAwN2JiZiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjAiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+R2VybWFueTwvdGV4dD48L3N2Zz4=',
      'TURKEY': 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iIzAwN2JiZiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjAiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+VHVya2V5PC90ZXh0Pjwvc3ZnPg==',
      'OTHER': 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iIzAwN2JiZiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjAiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+TG9jYXRpb248L3RleHQ+PC9zdmc+'
    }
    return placeholders[country] || placeholders['OTHER']
  }

  const nextLocation = (country) => {
    setCurrentIndices(prev => {
      const current = prev[country] || 0
      const total = groupedLocations[country].length
      // Her seferinde 2 lokasyon göster, bu yüzden 2'şer atla
      const next = current + 2
      return {
        ...prev,
        [country]: next >= total ? 0 : next
      }
    })
  }

  const prevLocation = (country) => {
    setCurrentIndices(prev => {
      const current = prev[country] || 0
      const total = groupedLocations[country].length
      // Her seferinde 2 lokasyon göster, bu yüzden 2'şer geri git
      const prevIndex = current - 2
      return {
        ...prev,
        [country]: prevIndex < 0 ? Math.max(0, total - (total % 2 === 0 ? 2 : 1)) : prevIndex
      }
    })
  }

  if (loading) {
    return (
      <div className="locations-page">
        <div className="container">
          <div className="loading">Lokasyonlar yükleniyor...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="locations-page">
      <div className="container">
        <h1 className="page-title">Location list</h1>
        
        {Object.keys(groupedLocations).map((country, countryIndex) => {
          const countryLocations = groupedLocations[country]
          const currentIndex = currentIndices[country] || 0
          const currentLocation = countryLocations[currentIndex]
          const locationName = currentLocation?.Location_Name || currentLocation?.location_name || 'Unknown Location'
          const locationId = currentLocation?.Location_ID || currentLocation?.location_id
          
          return (
            <div key={country} className="country-section">
              <div className="country-header">
                <div className="country-title">
                  <span className="country-flag">{getCountryFlag(country)}</span>
                  <h2>{country}</h2>
                  <span className="chevron-icons">››</span>
                </div>
                {countryLocations.length > 1 && (
                  <div className="pagination-dots">
                    {countryLocations.map((_, index) => (
                      <span
                        key={index}
                        className={`dot ${index === currentIndex ? 'active' : ''}`}
                      />
                    ))}
                  </div>
                )}
              </div>
              
              <div className="locations-container">
                {countryLocations.length === 1 ? (
                  <div className="locations-grid single">
                    <div className="location-card">
                      <div className="location-image-wrapper">
                        <img
                          src={getLocationImage(currentLocation)}
                          alt={locationName}
                          className="location-image"
                          onError={(e) => {
                            e.target.src = getLocationImage(currentLocation)
                          }}
                        />
                        <div className="airplane-icon">✈</div>
                      </div>
                      <div className="location-info">
                        <h3>{locationName}</h3>
                        <p className="location-country">{country}</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="locations-carousel">
                    <button
                      className="carousel-button prev"
                      onClick={() => prevLocation(country)}
                      aria-label="Previous location"
                    >
                      ‹
                    </button>
                    <div className="locations-grid">
                      {countryLocations.slice(currentIndex, currentIndex + 2).map((location, idx) => {
                        const locName = location?.Location_Name || location?.location_name || 'Unknown Location'
                        const locId = location?.Location_ID || location?.location_id || idx
                        return (
                          <div key={`${country}-${locId}-${idx}`} className="location-card">
                            <div className="location-image-wrapper">
                              <img
                                src={getLocationImage(location)}
                                alt={locName}
                                className="location-image"
                                onError={(e) => {
                                  e.target.src = getLocationImage(location)
                                }}
                              />
                              <div className="airplane-icon">✈</div>
                            </div>
                            <div className="location-info">
                              <h3>{locName}</h3>
                              <p className="location-country">{country}</p>
                            </div>
                          </div>
                        )
                      })}
                      {/* Eğer tek lokasyon kaldıysa boş card ekle */}
                      {countryLocations.slice(currentIndex, currentIndex + 2).length === 1 && (
                        <div className="location-card empty"></div>
                      )}
                    </div>
                    <button
                      className="carousel-button next"
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
    </div>
  )
}

export default Locations

