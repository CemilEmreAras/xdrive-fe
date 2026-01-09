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
    // localStorage'dan searchData'yı yükle
    const savedSearchData = localStorage.getItem('xdrive_searchData')
    if (savedSearchData) {
      try {
        const parsed = JSON.parse(savedSearchData)
        setSearchData(parsed)
        // Lokasyon isimlerini de yükle
        if (parsed.pickupId) {
          const savedPickupSearch = localStorage.getItem('xdrive_pickupSearch')
          if (savedPickupSearch) {
            setPickupSearch(savedPickupSearch)
          }
        }
        if (parsed.dropoffId) {
          const savedDropoffSearch = localStorage.getItem('xdrive_dropoffSearch')
          if (savedDropoffSearch) {
            setDropoffSearch(savedDropoffSearch)
          }
        }
      } catch (error) {
        console.error('Error loading saved search data:', error)
      }
    }
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
    const newSearchData = { ...searchData, pickupId: locationId }
    setSearchData(newSearchData)
    // localStorage'a kaydet
    localStorage.setItem('xdrive_searchData', JSON.stringify(newSearchData))
    localStorage.setItem('xdrive_pickupSearch', locationName)
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
    const newSearchData = { ...searchData, dropoffId: locationId }
    setSearchData(newSearchData)
    // localStorage'a kaydet
    localStorage.setItem('xdrive_searchData', JSON.stringify(newSearchData))
    localStorage.setItem('xdrive_dropoffSearch', locationName)
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
        <div className="hero-overlay"></div>
        <div className="container">
          <div className="search-section">
            <div className="search-card">
            <form onSubmit={handleSubmit} className="search-form">
              <div className="form-group">
                <label>Pick-up Location</label>
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
                    onChange={(e) => {
                      const newData = { ...searchData, sameLocation: e.target.checked }
                      setSearchData(newData)
                      localStorage.setItem('xdrive_searchData', JSON.stringify(newData))
                    }}
                  />
                  <span>Return car in same location</span>
                </label>
              </div>

              <div className="form-row dates-row-single">
                <div className="form-group date-time-group">
                  <label>Pick-up date</label>
                  <div className="date-input-wrapper">
                    <input
                      type="date"
                      value={searchData.pickupDate}
                      onChange={(e) => {
                        const newData = { ...searchData, pickupDate: e.target.value }
                        setSearchData(newData)
                        localStorage.setItem('xdrive_searchData', JSON.stringify(newData))
                      }}
                      min={new Date().toISOString().split('T')[0]}
                      className="form-input date-input"
                      required
                    />
                    {searchData.pickupDate ? (
                      <span className="date-display">{formatDateShort(searchData.pickupDate)}</span>
                    ) : (
                      <span className="date-placeholder">Select date</span>
                    )}
                  </div>
                </div>

                <div className="form-group date-time-group">
                  <label>Pick-up time</label>
                  <div className="input-with-icon">
                    <input
                      type="time"
                      value={searchData.pickupTime}
                      onChange={(e) => {
                        const newData = { ...searchData, pickupTime: e.target.value }
                        setSearchData(newData)
                        localStorage.setItem('xdrive_searchData', JSON.stringify(newData))
                      }}
                      className="form-input time-input"
                      required
                    />
                  </div>
                </div>

                <div className="form-group date-time-group">
                  <label>Drop-off date</label>
                  <div className="date-input-wrapper">
                    <input
                      type="date"
                      value={searchData.dropoffDate}
                      onChange={(e) => {
                        const newData = { ...searchData, dropoffDate: e.target.value }
                        setSearchData(newData)
                        localStorage.setItem('xdrive_searchData', JSON.stringify(newData))
                      }}
                      min={searchData.pickupDate || new Date().toISOString().split('T')[0]}
                      className="form-input date-input"
                      required
                    />
                    {searchData.dropoffDate ? (
                      <span className="date-display">{formatDateShort(searchData.dropoffDate)}</span>
                    ) : (
                      <span className="date-placeholder">Select date</span>
                    )}
                  </div>
                </div>

                <div className="form-group date-time-group">
                  <label>Drop-off time</label>
                  <div className="input-with-icon">
                    <input
                      type="time"
                      value={searchData.dropoffTime}
                      onChange={(e) => {
                        const newData = { ...searchData, dropoffTime: e.target.value }
                        setSearchData(newData)
                        localStorage.setItem('xdrive_searchData', JSON.stringify(newData))
                      }}
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
                  onChange={(e) => {
                    const newData = { ...searchData, driverCountry: e.target.value }
                    setSearchData(newData)
                    localStorage.setItem('xdrive_searchData', JSON.stringify(newData))
                  }}
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
                  onChange={(e) => {
                    const newData = { ...searchData, driverAge: e.target.value }
                    setSearchData(newData)
                    localStorage.setItem('xdrive_searchData', JSON.stringify(newData))
                  }}
                  className="driver-select"
                >
                  <option value="18-25">18-25</option>
                  <option value="26-29">26-29</option>
                  <option value="30-65">30-65</option>
                  <option value="66+">66+</option>
                </select>
              </div>

              <div className="form-group search-button-group">
                <button type="submit" className="search-button">
                  Search now
                </button>
              </div>
            </form>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="why-choose-us">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">
              Why Choose <span className="highlight">Us</span>
            </h2>
            <p className="section-description">
              We focus on making car rental simpler, clearer, and more reliable by bringing the right partners and technology together.
            </p>
          </div>
          
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <div className="icon-circle">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2ZM12 11.5C10.62 11.5 9.5 10.38 9.5 9C9.5 7.62 10.62 6.5 12 6.5C13.38 6.5 14.5 7.62 14.5 9C14.5 10.38 13.38 11.5 12 11.5Z" fill="#EF4444"/>
                  </svg>
                </div>
              </div>
              <h3 className="feature-title">Global Access</h3>
              <p className="feature-description">
                Access a broad range of vehicles through our network of local rental partners, all available via a single booking platform.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <div className="icon-circle">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7 4V2C7 1.45 7.45 1 8 1H16C16.55 1 17 1.45 17 2V4H20C20.55 4 21 4.45 21 5S20.55 6 20 6H19V19C19 20.1 18.1 21 17 21H7C5.9 21 5 20.1 5 19V6H4C3.45 6 3 5.55 3 5S3.45 4 4 4H7ZM9 3V4H15V3H9ZM7 6V19H17V6H7Z" fill="#EF4444"/>
                    <path d="M9 8H15V10H9V8ZM9 12H15V14H9V12Z" fill="#EF4444"/>
                  </svg>
                </div>
              </div>
              <h3 className="feature-title">Fair Value</h3>
              <p className="feature-description">
                Competitive pricing with clear terms, designed to give you value without unnecessary complexity or hidden costs.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <div className="icon-circle">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5H6.5C5.84 5 5.28 5.42 5.08 6.01L3 12V20C3 20.55 3.45 21 4 21H5C5.55 21 6 20.55 6 20V19H18V20C18 20.55 18.45 21 19 21H20C20.55 21 21 20.55 21 20V12L18.92 6.01ZM6.5 6.5H17.5L19.11 11H4.89L6.5 6.5ZM6.5 16C5.67 16 5 15.33 5 14.5S5.67 13 6.5 13 8 13.67 8 14.5 7.33 16 6.5 16ZM17.5 16C16.67 16 16 15.33 16 14.5S16.67 13 17.5 13 19 13.67 19 14.5 18.33 16 17.5 16Z" fill="#EF4444"/>
                    <path d="M9 8L11 10L15 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
              <h3 className="feature-title">Reliable Experience</h3>
              <p className="feature-description">
                A carefully designed booking flow that prioritizes clarity, consistency, and smooth vehicle pickup.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Dedicated to Your Journey Section */}
      <section className="dedicated-journey">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">
              Dedicated to <span className="highlight">Your Journey</span>
            </h2>
            <p className="section-description">
              From your first search to vehicle pickup, we focus on making the process clear, simple, and straightforward.
            </p>
          </div>
          
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <div className="icon-circle">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="3" y="4" width="18" height="18" rx="2" stroke="#EF4444" strokeWidth="2" fill="none"/>
                    <path d="M16 2V6M8 2V6M3 10H21" stroke="#EF4444" strokeWidth="2"/>
                    <path d="M9 14L11 16L15 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
              <h3 className="feature-title">Simple & Clear Booking</h3>
              <p className="feature-description">
                Straightforward options, transparent pricing, and a user-friendly booking experience.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <div className="icon-circle">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="1" y="4" width="22" height="16" rx="2" stroke="#EF4444" strokeWidth="2" fill="none"/>
                    <path d="M1 10H23" stroke="#EF4444" strokeWidth="2"/>
                    <path d="M7 2V6M17 2V6" stroke="#EF4444" strokeWidth="2"/>
                    <path d="M12 14L14 16L18 12" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
              <h3 className="feature-title">Flexible Payments</h3>
              <p className="feature-description">
                Choose between partial or full online payment, with all payment details clearly shown in advance.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <div className="icon-circle">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="#EF4444"/>
                    <path d="M2 17L12 22L22 17" stroke="#EF4444" strokeWidth="2" fill="none"/>
                    <path d="M2 12L12 17L22 12" stroke="#EF4444" strokeWidth="2" fill="none"/>
                    <circle cx="12" cy="7" r="1" fill="#EF4444"/>
                  </svg>
                </div>
              </div>
              <h3 className="feature-title">Local Rental Partners</h3>
              <p className="feature-description">
                We work with local rental partners to provide availability and pricing through a single, centralized platform.
              </p>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}

export default Home
