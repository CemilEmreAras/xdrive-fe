import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { getLocations } from '../services/api'
import './Home.css'

function Home() {
  const navigate = useNavigate()
  const [locations, setLocations] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentCarIndex, setCurrentCarIndex] = useState(0)
  const [searchData, setSearchData] = useState({
    pickupId: '',
    dropoffId: '',
    pickupDate: '',
    pickupTime: '11:00',
    dropoffDate: '',
    dropoffTime: '11:00',
    sameLocation: true
  })
  const [pickupSearch, setPickupSearch] = useState('')
  const [dropoffSearch, setDropoffSearch] = useState('')
  const [showPickupSuggestions, setShowPickupSuggestions] = useState(false)
  const [showDropoffSuggestions, setShowDropoffSuggestions] = useState(false)
  const pickupInputRef = useRef(null)
  const dropoffInputRef = useRef(null)
  const pickupSuggestionsRef = useRef(null)
  const dropoffSuggestionsRef = useRef(null)

  // Carousel için örnek araç resimleri (gerçek uygulamada API'den gelecek)
  const carImages = [
    'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?w=800&h=600&fit=crop'
  ]

  useEffect(() => {
    loadLocations()
  }, [])

  useEffect(() => {
    // Carousel otomatik geçiş
    const interval = setInterval(() => {
      setCurrentCarIndex((prev) => (prev + 1) % carImages.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [carImages.length])

  // Dışarı tıklandığında dropdown'ları kapat
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (pickupInputRef.current && !pickupInputRef.current.contains(event.target) && 
          pickupSuggestionsRef.current && !pickupSuggestionsRef.current.contains(event.target)) {
        setShowPickupSuggestions(false)
      }
      if (dropoffInputRef.current && !dropoffInputRef.current.contains(event.target) && 
          dropoffSuggestionsRef.current && !dropoffSuggestionsRef.current.contains(event.target)) {
        setShowDropoffSuggestions(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const loadLocations = async () => {
    try {
      console.log('📍 Lokasyonlar yükleniyor...');
      const locs = await getLocations()
      console.log('📍 Lokasyonlar yüklendi:', locs?.length || 0, 'lokasyon');
      setLocations(locs || [])
    } catch (error) {
      console.error('❌ Lokasyon yükleme hatası:', error)
      console.error('❌ Hata detayları:', error.response?.data || error.message)
      setLocations([])
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!searchData.pickupId || !searchData.pickupDate || !searchData.dropoffDate) {
      alert('Please fill in all required fields')
      return
    }

    const params = new URLSearchParams({
      pickupId: searchData.pickupId,
      dropoffId: searchData.sameLocation ? searchData.pickupId : searchData.dropoffId,
      pickupDate: searchData.pickupDate,
      dropoffDate: searchData.dropoffDate,
      pickupTime: searchData.pickupTime,
      dropoffTime: searchData.dropoffTime
    })
    navigate(`/cars?${params.toString()}`)
  }

  // Tarih formatı: DD/MM/YYYY @ HH:MM
  const formatDateTime = (date, time) => {
    if (!date) return ''
    const d = new Date(date)
    const day = String(d.getDate()).padStart(2, '0')
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const year = d.getFullYear()
    return `${day}/${month}/${year} @ ${time || '11:00'}`
  }

  // Lokasyon filtreleme
  const filterLocations = (searchTerm) => {
    if (!searchTerm.trim()) return []
    const term = searchTerm.toLowerCase()
    return locations.filter(loc => {
      const name = (loc.location_name || loc.Location_Name || '').toLowerCase()
      const address = (loc.address || loc.Address || '').toLowerCase()
      return name.includes(term) || address.includes(term)
    })
  }

  const handlePickupSearchChange = (e) => {
    const value = e.target.value
    setPickupSearch(value)
    setShowPickupSuggestions(true)
    
    // Eğer tam eşleşme varsa otomatik seç
    const exactMatch = locations.find(loc => {
      const fullName = `${loc.location_name || loc.Location_Name} - ${loc.address || loc.Address || ''}`
      return fullName.toLowerCase() === value.toLowerCase()
    })
    
    if (exactMatch) {
      setSearchData({ ...searchData, pickupId: exactMatch.location_id || exactMatch.Location_ID })
    } else {
      setSearchData({ ...searchData, pickupId: '' })
    }
  }

  const handlePickupSelect = (location) => {
    const locationId = location.location_id || location.Location_ID
    const locationName = `${location.location_name || location.Location_Name} - ${location.address || location.Address || ''}`
    setPickupSearch(locationName)
    setSearchData({ ...searchData, pickupId: locationId })
    setShowPickupSuggestions(false)
  }

  const handleDropoffSearchChange = (e) => {
    const value = e.target.value
    setDropoffSearch(value)
    setShowDropoffSuggestions(true)
    
    // Eğer tam eşleşme varsa otomatik seç
    const exactMatch = locations.find(loc => {
      const fullName = `${loc.location_name || loc.Location_Name} - ${loc.address || loc.Address || ''}`
      return fullName.toLowerCase() === value.toLowerCase()
    })
    
    if (exactMatch) {
      setSearchData({ ...searchData, dropoffId: exactMatch.location_id || exactMatch.Location_ID })
    } else {
      setSearchData({ ...searchData, dropoffId: '' })
    }
  }

  const handleDropoffSelect = (location) => {
    const locationId = location.location_id || location.Location_ID
    const locationName = `${location.location_name || location.Location_Name} - ${location.address || location.Address || ''}`
    setDropoffSearch(locationName)
    setSearchData({ ...searchData, dropoffId: locationId })
    setShowDropoffSuggestions(false)
  }

  // Seçili lokasyonun adını göster
  useEffect(() => {
    if (searchData.pickupId) {
      const selected = locations.find(loc => 
        (loc.location_id || loc.Location_ID) === searchData.pickupId
      )
      if (selected) {
        const locationName = `${selected.location_name || selected.Location_Name} - ${selected.address || selected.Address || ''}`
        setPickupSearch(locationName)
      }
    }
  }, [searchData.pickupId, locations])

  useEffect(() => {
    if (searchData.dropoffId) {
      const selected = locations.find(loc => 
        (loc.location_id || loc.Location_ID) === searchData.dropoffId
      )
      if (selected) {
        const locationName = `${selected.location_name || selected.Location_Name} - ${selected.address || selected.Address || ''}`
        setDropoffSearch(locationName)
      }
    }
  }, [searchData.dropoffId, locations])

  return (
    <div className="home">
      <section className="hero">
        <div className="hero-background"></div>
        <div className="container">
          <div className="hero-content">
            <div className="hero-text">
              <h1 className="hero-title">
                <span className="hero-title-line">DRIVE GLOBAL</span>
                <span className="hero-title-line">RENT EASILY IN OVER 100</span>
                <span className="hero-title-line">LOCATIONS</span>
              </h1>
              <p className="hero-slogan">Simply, Rent a Car.</p>
            </div>
            <div className="hero-car">
              <div className="car-image-container">
                <img 
                  src={carImages[currentCarIndex]} 
                  alt="Premium Car" 
                  className="car-image"
                  onError={(e) => {
                    e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgZmlsbD0iI2U1ZTdlYSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IiM5Y2EzYWYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5DYXIgSW1hZ2U8L3RleHQ+PC9zdmc+'
                  }}
                />
              </div>
              <div className="carousel-indicators">
                {carImages.map((_, index) => (
                  <button
                    key={index}
                    className={`indicator ${index === currentCarIndex ? 'active' : ''}`}
                    onClick={() => setCurrentCarIndex(index)}
                    aria-label={`Go to car ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="search-section">
        <div className="container">
          <div className="search-card">
            <form onSubmit={handleSubmit} className="search-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Location of pickup</label>
                  <div className="autocomplete-wrapper" ref={pickupInputRef}>
                    <div className="input-with-icon">
                      <span className="input-icon">📍</span>
                      {loading ? (
                        <input
                          type="text"
                          className="form-input"
                          placeholder="Loading..."
                          disabled
                        />
                      ) : (
                        <input
                          type="text"
                          className="form-input"
                          placeholder="Pickup location..."
                          value={pickupSearch}
                          onChange={handlePickupSearchChange}
                          onFocus={() => setShowPickupSuggestions(true)}
                          required
                        />
                      )}
                      <span className="input-arrow">▼</span>
                    </div>
                    {showPickupSuggestions && !loading && filterLocations(pickupSearch).length > 0 && (
                      <div className="autocomplete-suggestions" ref={pickupSuggestionsRef}>
                        {filterLocations(pickupSearch).map((loc) => (
                          <div
                            key={loc.location_id || loc.Location_ID}
                            className="suggestion-item"
                            onClick={() => handlePickupSelect(loc)}
                          >
                            <div className="suggestion-name">{loc.location_name || loc.Location_Name}</div>
                            <div className="suggestion-address">{loc.address || loc.Address || ''}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div className="form-group">
                  <label>Pickup time</label>
                  <div className="input-with-icon">
                    <span className="input-icon">📅</span>
                    <input
                      type="date"
                      value={searchData.pickupDate}
                      onChange={(e) => setSearchData({ ...searchData, pickupDate: e.target.value })}
                      min={new Date().toISOString().split('T')[0]}
                      className="form-input date-input"
                      required
                    />
                    <input
                      type="time"
                      value={searchData.pickupTime}
                      onChange={(e) => setSearchData({ ...searchData, pickupTime: e.target.value })}
                      className="form-input time-input"
                      required
                    />
                    <span className="input-arrow">▼</span>
                  </div>
                  {searchData.pickupDate && (
                    <div className="formatted-date">
                      {formatDateTime(searchData.pickupDate, searchData.pickupTime)}
                    </div>
                  )}
                </div>
                <div className="form-group">
                  <label>Return time</label>
                  <div className="input-with-icon">
                    <span className="input-icon">📅</span>
                    <input
                      type="date"
                      value={searchData.dropoffDate}
                      onChange={(e) => setSearchData({ ...searchData, dropoffDate: e.target.value })}
                      min={searchData.pickupDate || new Date().toISOString().split('T')[0]}
                      className="form-input date-input"
                      required
                    />
                    <input
                      type="time"
                      value={searchData.dropoffTime}
                      onChange={(e) => setSearchData({ ...searchData, dropoffTime: e.target.value })}
                      className="form-input time-input"
                      required
                    />
                    <span className="input-arrow">▼</span>
                  </div>
                  {searchData.dropoffDate && (
                    <div className="formatted-date">
                      {formatDateTime(searchData.dropoffDate, searchData.dropoffTime)}
                    </div>
                  )}
                </div>
                <div className="form-group search-button-group">
                  <button type="submit" className="search-button">
                    <span className="search-icon">🔍</span>
                    <span className="search-icon-plane">✈️</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </section>

    </div>
  )
}

export default Home
