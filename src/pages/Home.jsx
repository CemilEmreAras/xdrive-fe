import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { getLocations } from '../services/api'
import './Home.css'

function Home() {
  const navigate = useNavigate()
  const [locations, setLocations] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchData, setSearchData] = useState({
    pickupId: '',
    dropoffId: '',
    pickupDate: '',
    pickupTime: '11:00',
    dropoffDate: '',
    dropoffTime: '11:00',
    sameLocation: true,
    driverCountry: 'Turkey',
    driverAge: '30-65'
  })
  const [pickupSearch, setPickupSearch] = useState('')
  const [dropoffSearch, setDropoffSearch] = useState('')
  const [showPickupSuggestions, setShowPickupSuggestions] = useState(false)
  const [showDropoffSuggestions, setShowDropoffSuggestions] = useState(false)
  const pickupInputRef = useRef(null)
  const dropoffInputRef = useRef(null)
  const pickupSuggestionsRef = useRef(null)
  const dropoffSuggestionsRef = useRef(null)

  useEffect(() => {
    loadLocations()
  }, [])

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
    if (!searchTerm || !searchTerm.trim()) {
      // Boş arama terimi için tüm lokasyonları döndür
      return locations
    }
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

  const handlePickupInputClick = () => {
    setShowPickupSuggestions(true)
  }

  const handlePickupSelect = (location) => {
    const locationId = location.location_id || location.Location_ID
    const locationName = `${location.location_name || location.Location_Name} - ${location.address || location.Address || ''}`
    setPickupSearch(locationName)
    setSearchData({ ...searchData, pickupId: locationId })
    setShowPickupSuggestions(false)
  }

  const handleClearPickup = () => {
    setPickupSearch('')
    setSearchData({ ...searchData, pickupId: '' })
    setShowPickupSuggestions(false)
  }

  // Tarih formatı: "Fri, Jan 09" formatında
  const formatDateShort = (date) => {
    if (!date) return ''
    const d = new Date(date)
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const day = days[d.getDay()]
    const month = months[d.getMonth()]
    const dateNum = String(d.getDate()).padStart(2, '0')
    return `${day}, ${month} ${dateNum}`
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
        <div className="hero-background">
          <img 
            src="/images/hero-background.svg" 
            alt="Hero Background" 
            className="hero-bg-image"
            onError={(e) => {
              e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgZmlsbD0iI2U1ZTdlYSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IiM5Y2EzYWYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5DYXIgSW1hZ2U8L3RleHQ+PC9zdmc+'
            }}
          />
          <div className="hero-overlay"></div>
        </div>
        <div className="container">
          <div className="hero-content">
            <div className="hero-text">
              <h2 className="hero-save-text">Save up to 70% on car rentals</h2>
              <h1 className="hero-title">Clear prices, no surprises</h1>
              <div className="hero-features">
                <div className="hero-feature">
                  <span className="checkmark">✓</span>
                  <span>Trusted by 7M travelers</span>
                </div>
                <div className="hero-feature">
                  <span className="checkmark">✓</span>
                  <span>24/7 Support</span>
                </div>
                <div className="hero-feature">
                  <span className="checkmark">✓</span>
                  <span>Free Cancellation</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="search-section">
            <div className="search-card">
            <form onSubmit={handleSubmit} className="search-form">
              <div className="form-group">
                <label>Pick-up location</label>
                <div className="autocomplete-wrapper" ref={pickupInputRef}>
                  <div className="input-with-icon">
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
                        placeholder="Pick-up location..."
                        value={pickupSearch}
                        onChange={handlePickupSearchChange}
                        onFocus={() => setShowPickupSuggestions(true)}
                        onClick={handlePickupInputClick}
                        required
                      />
                    )}
                    {pickupSearch && (
                      <button
                        type="button"
                        className="input-clear"
                        onClick={handleClearPickup}
                        aria-label="Clear"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                  {showPickupSuggestions && !loading && locations.length > 0 && (
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

              <div className="form-group checkbox-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={searchData.sameLocation}
                    onChange={(e) => setSearchData({ ...searchData, sameLocation: e.target.checked })}
                  />
                  <span>Return car in same location</span>
                </label>
              </div>

              <div className="form-row dates-row">
                <div className="form-group date-group">
                  <label>Pick-up date</label>
                  <div className="date-input-wrapper">
                    <span className="date-arrow-left">◄</span>
                    <input
                      type="date"
                      value={searchData.pickupDate}
                      onChange={(e) => setSearchData({ ...searchData, pickupDate: e.target.value })}
                      min={new Date().toISOString().split('T')[0]}
                      className="form-input date-input"
                      required
                    />
                    {searchData.pickupDate ? (
                      <span className="date-display">{formatDateShort(searchData.pickupDate)}</span>
                    ) : (
                      <span className="date-placeholder">Select date</span>
                    )}
                    <span className="date-arrow-right">►</span>
                  </div>
                  <label className="time-label">Time</label>
                  <div className="input-with-icon">
                    <input
                      type="time"
                      value={searchData.pickupTime}
                      onChange={(e) => setSearchData({ ...searchData, pickupTime: e.target.value })}
                      className="form-input time-input"
                      required
                    />
                  </div>
                </div>

                <div className="form-group date-group">
                  <label>Drop-off date</label>
                  <div className="date-input-wrapper">
                    <span className="date-arrow-left">◄</span>
                    <input
                      type="date"
                      value={searchData.dropoffDate}
                      onChange={(e) => setSearchData({ ...searchData, dropoffDate: e.target.value })}
                      min={searchData.pickupDate || new Date().toISOString().split('T')[0]}
                      className="form-input date-input"
                      required
                    />
                    {searchData.dropoffDate ? (
                      <span className="date-display">{formatDateShort(searchData.dropoffDate)}</span>
                    ) : (
                      <span className="date-placeholder">Select date</span>
                    )}
                    <span className="date-arrow-right">►</span>
                  </div>
                  <label className="time-label">Time</label>
                  <div className="input-with-icon">
                    <input
                      type="time"
                      value={searchData.dropoffTime}
                      onChange={(e) => setSearchData({ ...searchData, dropoffTime: e.target.value })}
                      className="form-input time-input"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="form-group driver-details">
                <span>Driver's country of residence is </span>
                <select
                  value={searchData.driverCountry}
                  onChange={(e) => setSearchData({ ...searchData, driverCountry: e.target.value })}
                  className="driver-select"
                >
                  <option value="Turkey">Turkey</option>
                  <option value="USA">USA</option>
                  <option value="UK">UK</option>
                  <option value="Germany">Germany</option>
                  <option value="France">France</option>
                </select>
                <span> and age is </span>
                <select
                  value={searchData.driverAge}
                  onChange={(e) => setSearchData({ ...searchData, driverAge: e.target.value })}
                  className="driver-select"
                >
                  <option value="18-25">18-25</option>
                  <option value="26-29">26-29</option>
                  <option value="30-65">30-65</option>
                  <option value="66+">66+</option>
                </select>
                <span className="info-icon" title="Age information">ⓘ</span>
              </div>

              <div className="form-group search-button-group">
                <button type="submit" className="search-button">
                  Search now
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

    </div>
  )
}

export default Home
