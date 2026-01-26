import { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useLanguage } from '../context/LanguageContext'
import Flag from 'react-world-flags'
import { useNavigate } from 'react-router-dom'
import { getLocations } from '../services/api'
import SEO from '../components/SEO'
import DatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css"
import { registerLocale } from "react-datepicker"
import enUS from 'date-fns/locale/en-US'
import tr from 'date-fns/locale/tr'
import de from 'date-fns/locale/de'
import { forwardRef } from 'react'

const isDev = import.meta.env.DEV

registerLocale('en', enUS)
registerLocale('tr', tr)
registerLocale('de', de)

// Custom Input for DatePicker to match existing design
const CustomDateInput = forwardRef(({ value, onClick, placeholder }, ref) => (
  <div
    className="flex items-center justify-between w-full h-[44px] sm:h-[48px] md:h-[50px] bg-white rounded-lg px-2 sm:px-3 md:px-3 cursor-pointer min-w-0 whitespace-nowrap overflow-hidden"
    onClick={onClick}
    ref={ref}
  >
    <svg className="flex-shrink-0 mr-2 sm:mr-3 w-4 h-4 sm:w-5 sm:h-5 md:w-5 md:h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="4" width="18" height="18" rx="2" stroke="#FF6B35" strokeWidth="2" fill="none" />
      <path d="M16 2V6M8 2V6M3 10H21" stroke="#FF6B35" strokeWidth="2" />
    </svg>
    <span className="flex-1 text-xs sm:text-sm md:text-sm text-gray-800 whitespace-nowrap mx-1.5 sm:mx-2 md:mx-2 text-left font-medium overflow-hidden text-ellipsis">
      {value || placeholder}
    </span>
    <svg className="flex-shrink-0 ml-1.5 sm:ml-2 md:ml-2 w-3 h-3 sm:w-4 sm:h-4 md:w-4 md:h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M6 9L12 15L18 9" stroke="#0066FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  </div>
))

const CustomTimeInput = forwardRef(({ value, onClick, placeholder }, ref) => (
  <div
    className="flex items-center justify-between w-full h-[44px] sm:h-[48px] md:h-[50px] bg-white rounded-lg px-2 sm:px-3 md:px-3 cursor-pointer min-w-0 whitespace-nowrap overflow-hidden"
    onClick={onClick}
    ref={ref}
  >
    <span className="flex-1 text-xs sm:text-sm md:text-sm text-gray-800 whitespace-nowrap mx-1.5 sm:mx-2 md:mx-2 text-center font-medium overflow-hidden text-ellipsis">
      {value || placeholder}
    </span>
    <svg className="flex-shrink-0 ml-1.5 sm:ml-2 md:ml-2 w-3 h-3 sm:w-4 sm:h-4 md:w-4 md:h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M6 9L12 15L18 9" stroke="#0066FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  </div>
))


function Home() {
  const { t } = useTranslation()
  const { language } = useLanguage()
  const navigate = useNavigate()
  const [locations, setLocations] = useState([])
  const [loading, setLoading] = useState(true)
  // Calculate tomorrow's date (YYYY-MM-DD format)
  const getTomorrowDate = () => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    return tomorrow.toISOString().split('T')[0]
  }

  // Calculate 3 days after pickup date
  const getDropoffDate = (pickupDate) => {
    if (!pickupDate) return ''
    const dropoff = new Date(pickupDate)
    dropoff.setDate(dropoff.getDate() + 3)
    return dropoff.toISOString().split('T')[0]
  }

  const tomorrowDate = getTomorrowDate()
  const [searchData, setSearchData] = useState({
    pickupId: '',
    dropoffId: '',
    pickupDate: tomorrowDate, // Tomorrow
    pickupTime: '11:00',
    dropoffDate: getDropoffDate(tomorrowDate), // Pickup date + 3 days
    dropoffTime: '11:00',
    driverCountry: 'Turkey',
    driverAge: '30-65'
  })
  const [pickupSearch, setPickupSearch] = useState('')
  const [dropoffSearch, setDropoffSearch] = useState('')
  const [showPickupSuggestions, setShowPickupSuggestions] = useState(false)
  const [showDropoffSuggestions, setShowDropoffSuggestions] = useState(false)
  const [airports, setAirports] = useState([])
  const pickupInputRef = useRef(null)
  const dropoffInputRef = useRef(null)
  // Date/Time refs removed as DatePicker handles this
  const pickupSuggestionsRef = useRef(null)
  const dropoffSuggestionsRef = useRef(null)
  const pickupDateRef = useRef(null)
  const dropoffDateRef = useRef(null)
  const pickupTimeContainerRef = useRef(null)
  const dropoffTimeContainerRef = useRef(null)
  const pickupTimeContainerDesktopRef = useRef(null)
  const dropoffTimeContainerDesktopRef = useRef(null)

  useEffect(() => {
    loadLocations() // Single call is enough for both locations and airports
    // Reset to default values when page loads
    const tomorrow = getTomorrowDate()
    setSearchData({
      pickupId: '',
      dropoffId: '',
      pickupDate: tomorrow, // Tomorrow
      pickupTime: '11:00',
      dropoffDate: getDropoffDate(tomorrow), // Pickup date + 3 days
      dropoffTime: '11:00',
      driverCountry: 'Turkey',
      driverAge: '30-65'
    })
    setPickupSearch('')
    setDropoffSearch('')
  }, [])

  // Dil değiştiğinde, pickup location için native uyarı metnini güncel dilde ayarla
  useEffect(() => {
    if (!pickupInputRef.current) return
    const input = pickupInputRef.current.querySelector('input')
    if (!input) return

    // Eğer lokasyon seçili değilse alanı "required" yap ve güncel dilde mesaj ver
    if (!searchData.pickupId) {
      input.required = true
      input.setCustomValidity(t('home.fillRequiredFields'))
      // Alan zaten geçersiz ise, balonu yeni dilde güncelle
      if (!input.checkValidity()) {
        input.reportValidity()
      }
    } else {
      input.setCustomValidity('')
    }
  }, [language, t, searchData.pickupId])

  // Close dropdowns when clicking outside
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
      if (isDev) {
        console.log('📍 Loading locations...')
      }
      const locs = await getLocations()
      if (isDev) {
        console.log('📍 Locations loaded:', locs?.length || 0, 'locations')
      }

      // Tek bir API çağrısından hem locations hem airports state'lerini set et
      setLocations(locs || [])
      setAirports(locs || []) // Aynı veriyi airports'a da set et

      if (isDev) {
        console.log('🛫 Airport locations also set:', locs?.length || 0, 'locations')
      }
    } catch (error) {
      if (isDev) {
        console.error('❌ Error loading locations:', error)
        console.error('❌ Error details:', error.response?.data || error.message)
      }
      setLocations([])
      setAirports([])
    } finally {
      setLoading(false)
    }
  }

  // Translate country name in address based on current language
  const translateCountryInAddress = (address) => {
    if (!address) return address

    // Common country names to check
    const countryMappings = {
      'Turkey': t('countries.Turkey'),
      'Germany': t('countries.Germany'),
      'France': t('countries.France'),
      'Spain': t('countries.Spain'),
      'Italy': t('countries.Italy'),
      'United Kingdom': t('countries.United Kingdom'),
      'UK': t('countries.UK'),
      'USA': t('countries.USA'),
      'United States': t('countries.United States'),
      'Cyprus': t('countries.Cyprus'),
      'Zambia': t('countries.Zambia'),
      'Antigua and Barbuda': t('countries.Antigua and Barbuda'),
      'Antigua': t('countries.Antigua'),
      'Barbuda': t('countries.Barbuda')
    }

    let translatedAddress = address

    // Replace country names (case-insensitive)
    Object.keys(countryMappings).forEach(country => {
      const regex = new RegExp(`\\b${country}\\b`, 'gi')
      translatedAddress = translatedAddress.replace(regex, countryMappings[country])
    })

    return translatedAddress
  }

  // Return flag code based on country abbreviation (ISO 3166-1 alpha-2)
  const getCountryCode = (location) => {
    // Önce country alanından kısaltmayı al
    let countryCode = (location.country || location.Country || '').toUpperCase().trim()

    // Debug: log first 5 airports' country field
    const airportIndex = airports.indexOf(location)
    if (airportIndex < 5) {
      if (isDev) {
        console.log(`🔍 Airport ${airportIndex + 1} country field:`, {
          country: location.country,
          Country: location.Country,
          countryCode: countryCode,
          locationName: location.location_name || location.Location_Name,
          address: location.address || location.Address
        })
      }
    }

    // If country field exists, use it directly (only 2-letter codes)
    if (countryCode && countryCode.length === 2) {
      return countryCode
    }

    // If country field doesn't exist, extract from name and address using fallback logic
    const name = (location.location_name || location.Location_Name || '').toLowerCase()
    const address = (location.address || location.Address || '').toLowerCase()

    // Country matching (fallback)
    if (name.includes('turkey') || name.includes('istanbul') ||
      name.includes('ankara') || name.includes('izmir') || address.includes('turkey')) {
      return 'TR'
    }
    if (name.includes('germany') || name.includes('almanya') || name.includes('berlin') ||
      name.includes('munich') || address.includes('germany') || address.includes('almanya')) {
      return 'DE'
    }
    if (name.includes('france') || name.includes('fransa') || name.includes('paris') ||
      address.includes('france') || address.includes('fransa')) {
      return 'FR'
    }
    if (name.includes('spain') || name.includes('ispanya') || name.includes('madrid') ||
      name.includes('barcelona') || address.includes('spain') || address.includes('ispanya')) {
      return 'ES'
    }
    if (name.includes('italy') || name.includes('italya') || name.includes('rome') ||
      name.includes('milan') || address.includes('italy') || address.includes('italya')) {
      return 'IT'
    }
    if (name.includes('uk') || name.includes('united kingdom') || name.includes('london') ||
      address.includes('uk') || address.includes('united kingdom')) {
      return 'GB'
    }
    if (name.includes('usa') || name.includes('united states') || name.includes('new york') ||
      name.includes('los angeles') || address.includes('usa') || address.includes('united states')) {
      return 'US'
    }
    if (name.includes('zambia') || address.includes('zambia')) {
      return 'ZM'
    }
    if (name.includes('antigua') || name.includes('barbuda') || address.includes('antigua') || address.includes('barbuda')) {
      return 'AG'
    }
    if (name.includes('cyprus') || name.includes('cypres') || name.includes('larnaca') || name.includes('pafos') ||
      address.includes('cyprus') || address.includes('cypres')) {
      return 'CY'
    }

    // If country field is empty and we couldn't extract from name/address, default flag
    if (!countryCode || countryCode === '') {
      const airportIndex = airports.indexOf(location)
      if (airportIndex < 10) {
        if (isDev) {
          console.warn('⚠️ Country code not found:', {
            index: airportIndex,
            locationName: location.location_name || location.Location_Name,
            address: location.address || location.Address,
            country: location.country,
            Country: location.Country
          })
        }
      }
    }

    // Varsayılan bayrak (null dönebiliriz veya özel bir kod)
    return null
  }

  const handleAirportClick = (airport) => {
    const locationId = airport.location_id || airport.Location_ID
    const today = new Date()
    // Filter starting from tomorrow (pickup: tomorrow, dropoff: tomorrow + 7 days)
    const pickupDateObj = new Date(today)
    pickupDateObj.setDate(pickupDateObj.getDate() + 1) // Yarın

    const dropoffDateObj = new Date(pickupDateObj)
    dropoffDateObj.setDate(dropoffDateObj.getDate() + 7) // Tomorrow + 7 days

    const pickupDate = pickupDateObj.toISOString().split('T')[0]
    const dropoffDate = dropoffDateObj.toISOString().split('T')[0]

    // CarList sayfasına yönlendir
    navigate(`/cars?pickupId=${locationId}&dropoffId=${locationId}&pickupDate=${pickupDate}&dropoffDate=${dropoffDate}&currency=EURO`)
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    // Eğer pickup seçili değilse, native validasyonu tetikle (balon mesaj)
    if (!searchData.pickupId && pickupInputRef.current) {
      const input = pickupInputRef.current.querySelector('input')
      if (input) {
        input.required = true
        input.setCustomValidity(t('home.fillRequiredFields'))
        input.reportValidity()
        return
      }
    }

    // Tarihler eksikse de arama yapma (şimdilik sessizce iptal)
    if (!searchData.pickupDate || !searchData.dropoffDate) {
      return
    }

    // Same location: dropoffId = pickupId (always, checkbox hidden)
    const finalDropoffId = searchData.pickupId
    const finalDropoffSearch = pickupSearch

    const params = new URLSearchParams({
      pickupId: searchData.pickupId,
      dropoffId: finalDropoffId, // Same as pickupId
      pickupDate: searchData.pickupDate,
      dropoffDate: searchData.dropoffDate,
      pickupTime: searchData.pickupTime,
      dropoffTime: searchData.dropoffTime,
      pickupLocationName: pickupSearch,
      dropoffLocationName: finalDropoffSearch // Same as pickupSearch
    })
    navigate(`/cars?${params.toString()}`)
  }

  // Date format: DD/MM/YYYY @ HH:MM
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

    // If the search term is an exact match for a location (meaning user selected it), show all locations
    const exactMatch = locations.find(loc => {
      let locationName = `${loc.location_name || loc.Location_Name} - ${loc.address || loc.Address || ''}`
      locationName = locationName.replace(/IN_Terminal/gi, 'Airport').replace(/IN Terminal/gi, 'Airport')
      return locationName.toLowerCase() === searchTerm.toLowerCase()
    })

    if (exactMatch) {
      return locations
    }

    const term = searchTerm.toLowerCase()
    return locations.filter(loc => {
      let name = (loc.location_name || loc.Location_Name || '').toLowerCase()
      // Normalize name for matching: replace IN_Terminal with Airport
      name = name.replace(/in_terminal/gi, 'airport').replace(/in terminal/gi, 'airport')
      const address = (loc.address || loc.Address || '').toLowerCase()
      // Check if term matches name, address, or the combined display format
      const combined = `${name} - ${address}`
      return name.includes(term) || address.includes(term) || combined.includes(term)
    })
  }

  const handlePickupSearchChange = (e) => {
    const value = e.target.value
    setPickupSearch(value)
    setShowPickupSuggestions(true)

    // If exact match exists, auto-select
    const exactMatch = locations.find(loc => {
      const fullName = `${loc.location_name || loc.Location_Name} - ${loc.address || loc.Address || ''}`
      return fullName.toLowerCase() === value.toLowerCase()
    })

    if (exactMatch) {
      const locationId = exactMatch.location_id || exactMatch.Location_ID
      // Same location: automatically set dropoff to same as pickup (checkbox hidden)
      setDropoffSearch(value)
      setSearchData({ ...searchData, pickupId: locationId, dropoffId: locationId })
    } else {
      setSearchData({ ...searchData, pickupId: '', dropoffId: '' })
      setDropoffSearch('')
    }
  }

  const handlePickupInputClick = (e) => {
    e.stopPropagation()
    setShowPickupSuggestions(true)
    // Input'a focus ver
    if (pickupInputRef.current) {
      const input = pickupInputRef.current.querySelector('input')
      if (input) {
        input.focus()
      }
    }
  }

  const handleDropoffInputClick = (e) => {
    e.stopPropagation()
    setShowDropoffSuggestions(true)
    // Input'a focus ver
    if (dropoffInputRef.current) {
      const input = dropoffInputRef.current.querySelector('input')
      if (input) {
        input.focus()
      }
    }
  }

  const handlePickupSelect = (location, e) => {
    if (e && e.stopPropagation) e.stopPropagation()
    const locationId = location.location_id || location.Location_ID
    let locationName = `${location.location_name || location.Location_Name} - ${location.address || location.Address || ''}`
    // IN_Terminal yerine airport yaz
    locationName = locationName.replace(/IN_Terminal/gi, 'Airport').replace(/IN Terminal/gi, 'Airport')
    setPickupSearch(locationName)
    // Same location: automatically set dropoff to same as pickup (checkbox hidden)
    setDropoffSearch(locationName)
    const newSearchData = { ...searchData, pickupId: locationId, dropoffId: locationId }
    setSearchData(newSearchData)
    setShowPickupSuggestions(false)

    // Lokasyon seçilince native validasyon hatasını temizle
    if (pickupInputRef.current) {
      const input = pickupInputRef.current.querySelector('input')
      if (input) {
        input.setCustomValidity('')
        // reportValidity, açık olan balonu kapatır
        input.reportValidity()
      }
    }
  }

  const handleClearPickup = () => {
    setPickupSearch('')
    setSearchData({ ...searchData, pickupId: '' })
    setShowPickupSuggestions(false)
  }

  // Date format: "Fri, Jan 09" format
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

    // If exact match exists, auto-select
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

  const handleDropoffSelect = (location, e) => {
    if (e && e.stopPropagation) e.stopPropagation()
    const locationId = location.location_id || location.Location_ID
    let locationName = `${location.location_name || location.Location_Name} - ${location.address || location.Address || ''}`
    // IN_Terminal yerine airport yaz
    locationName = locationName.replace(/IN_Terminal/gi, 'Airport').replace(/IN Terminal/gi, 'Airport')
    setDropoffSearch(locationName)
    const newSearchData = { ...searchData, dropoffId: locationId }
    setSearchData(newSearchData)
    setShowDropoffSuggestions(false)
  }

  // Seçili lokasyonun adını göster - Same location: dropoff always equals pickup
  useEffect(() => {
    if (searchData.pickupId) {
      const selected = locations.find(loc =>
        (loc.location_id || loc.Location_ID) === searchData.pickupId
      )
      if (selected) {
        let locationName = `${selected.location_name || selected.Location_Name} - ${selected.address || selected.Address || ''}`
        // IN_Terminal yerine airport yaz
        locationName = locationName.replace(/IN_Terminal/gi, 'Airport').replace(/IN Terminal/gi, 'Airport')
        setPickupSearch(locationName)
        // Same location: automatically set dropoff to same as pickup (checkbox hidden)
        setDropoffSearch(locationName)
        setSearchData(prev => {
          if (prev.dropoffId !== prev.pickupId) {
            return { ...prev, dropoffId: prev.pickupId }
          }
          return prev
        })
      }
    }
  }, [searchData.pickupId, locations])

  // Handlers for separate date/time updates
  const handlePickupDateChange = (date) => {
    if (!date) return
    // date is a JS Date object
    // Adjust for timezone offset to keep the correct date string
    const offset = date.getTimezoneOffset()
    const adjustedDate = new Date(date.getTime() - (offset * 60 * 1000))
    const dateStr = adjustedDate.toISOString().split('T')[0];

    const newDropoffDate = getDropoffDate(dateStr)
    setSearchData(prev => ({
      ...prev,
      pickupDate: dateStr,
      dropoffDate: newDropoffDate
    }))
  }

  const handlePickupTimeChange = (date) => {
    if (!date) return
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    const timeStr = `${hours}:${minutes}`

    setSearchData(prev => ({
      ...prev,
      pickupTime: timeStr
    }))
  }

  const handleDropoffDateChange = (date) => {
    if (!date) return
    const offset = date.getTimezoneOffset()
    const adjustedDate = new Date(date.getTime() - (offset * 60 * 1000))
    const dateStr = adjustedDate.toISOString().split('T')[0];

    setSearchData(prev => ({
      ...prev,
      dropoffDate: dateStr
    }))
  }

  const handleDropoffTimeChange = (date) => {
    if (!date) return
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    const timeStr = `${hours}:${minutes}`

    setSearchData(prev => ({
      ...prev,
      dropoffTime: timeStr
    }))
  }

  // Helper helper to create Date object from time string for DatePicker
  const getTimeDate = (timeStr) => {
    if (!timeStr) return null;
    const [hours, minutes] = timeStr.split(':');
    const date = new Date();
    date.setHours(parseInt(hours, 10));
    date.setMinutes(parseInt(minutes, 10));
    return date;
  }


  return (
    <>
      <SEO
        title={t('seo.home.title')}
        description={t('seo.home.description')}
        keywords={t('seo.home.keywords')}
      />
      <div className="pb-0 overflow-x-hidden min-h-screen flex flex-col">
        <section className="relative min-h-screen block text-white overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full z-0 overflow-hidden bg-slate-900">
            <picture>
              <source media="(max-width: 1024px)" srcSet="/images/home-hero-mobile-v2.jpg" />
              <img
                src="/images/home-hero-desktop-v2.jpg"
                alt="XDrive Background"
                className="w-full h-full object-cover object-center"
              />
            </picture>
          </div>
          {/* Mobile/Tablet: Centered overlay layout */}
          <div className="w-full max-w-[1800px] mx-auto px-3 sm:px-4 md:px-6 lg:hidden box-border relative h-screen z-[2] flex flex-col justify-start items-center pt-[20vh] sm:pt-[22vh] md:pt-[25vh]">
            <div className="w-full mx-auto p-3 sm:p-4 md:p-5 relative z-[20] flex justify-center items-center">
              <div className="bg-slate-900/50 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-5 shadow-[0_10px_40px_rgba(0,0,0,0.3)] w-full mx-auto">
                <form onSubmit={handleSubmit} className="flex flex-col search:flex-row search:items-end gap-2 sm:gap-3 md:gap-4 lg:gap-4 search:flex-wrap">
                  {/* Location Field - Full width on mobile, flex on larger screens */}
                  <div className="flex flex-col gap-1.5 sm:gap-2 md:gap-2 w-full search:flex-1 search:min-w-[200px] md:min-w-[220px] lg:min-w-[250px] xl:min-w-[280px] relative z-20">
                    <label className="text-[10px] sm:text-xs md:text-xs font-semibold text-white uppercase tracking-wide mb-0.5 sm:mb-1">
                      {t('home.pickupLocation').toUpperCase()}
                    </label>
                    <div className="relative w-full" ref={pickupInputRef} onClick={handlePickupInputClick}>
                      <div className="relative flex items-center bg-white rounded-lg px-2 sm:px-3 md:px-4 min-h-[44px] sm:min-h-[48px] md:min-h-[50px] hover:bg-gray-50 transition-colors">
                        <svg className="flex-shrink-0 mr-2 sm:mr-3 w-4 h-4 sm:w-5 sm:h-5 md:w-5 md:h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2ZM12 11.5C10.62 11.5 9.5 10.38 9.5 9C9.5 7.62 10.62 6.5 12 6.5C13.38 6.5 14.5 7.62 14.5 9C14.5 10.38 13.38 11.5 12 11.5Z" fill="#FF6B35" />
                        </svg>
                        {loading ? (
                          <input
                            type="text"
                            className="flex-1 border-none outline-none text-xs sm:text-sm md:text-sm text-gray-800 bg-transparent p-0 placeholder:text-gray-400 focus:outline-none focus:shadow-none"
                            placeholder={t('home.loading')}
                            disabled
                          />
                        ) : (
                          <input
                            type="text"
                            className="flex-1 border-none outline-none text-xs sm:text-sm md:text-sm text-gray-800 bg-transparent p-0 placeholder:text-gray-400 focus:outline-none focus:shadow-none"
                            placeholder={t('home.pickupLocation') + '...'}
                            value={pickupSearch}
                            onChange={handlePickupSearchChange}
                            onFocus={() => setShowPickupSuggestions(true)}
                            onClick={handlePickupInputClick}
                          />
                        )}

                        <svg className="flex-shrink-0 ml-auto cursor-pointer relative z-[2] w-3 h-3 sm:w-4 sm:h-4 md:w-4 md:h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M6 9L12 15L18 9" stroke="#0066FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                      {showPickupSuggestions && !loading && locations.length > 0 && (
                        <div className="absolute top-full left-0 right-0 bg-white rounded-lg shadow-[0_4px_12px_rgba(0,0,0,0.15)] max-h-[250px] sm:max-h-[300px] md:max-h-[300px] overflow-y-auto z-[1000] mt-1" ref={pickupSuggestionsRef}>
                          {filterLocations(pickupSearch).map((loc) => (
                            <div
                              key={loc.location_id || loc.Location_ID}
                              className="p-2 sm:p-3 md:p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                              onMouseDown={(e) => handlePickupSelect(loc, e)}
                              onClick={(e) => handlePickupSelect(loc, e)}
                            >
                              <div className="font-medium text-gray-900 text-xs sm:text-sm md:text-sm">{(loc.location_name || loc.Location_Name || '').replace(/IN_Terminal/gi, 'Airport').replace(/IN Terminal/gi, 'Airport')}</div>
                              <div className="text-[10px] sm:text-xs md:text-sm text-gray-600 mt-0.5 sm:mt-1">{translateCountryInAddress(loc.address || loc.Address || '')}</div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* DateTime Fields Group - Stack on mobile, row on larger screens */}
                  <div className="flex flex-col search:flex-row gap-2 sm:gap-3 md:gap-4 lg:gap-4 w-full search:flex-[2.5] search:min-w-0 relative z-10">
                    {/* Pickup Date/Time */}
                    <div className="flex flex-col gap-1.5 sm:gap-2 md:gap-2 w-full search:flex-1 search:min-w-0">
                      <label className="text-[10px] sm:text-xs md:text-xs font-semibold text-white uppercase tracking-wide mb-0.5 sm:mb-1">
                        {t('home.pickupDate').toUpperCase()}
                      </label>
                      <div className="flex flex-row items-center gap-1.5 sm:gap-2 md:gap-2 w-full min-w-0">
                        {/* Pick Up Date */}
                        <div className="flex-[1.5] min-w-0">
                          <DatePicker
                            selected={searchData.pickupDate ? new Date(searchData.pickupDate) : null}
                            onChange={handlePickupDateChange}
                            dateFormat="EEE, MMM dd"
                            minDate={new Date()}
                            customInput={<CustomDateInput placeholder={t('home.selectDate')} />}
                            locale={language}
                            wrapperClassName="w-full"
                          />
                        </div>

                        {/* Pick Up Time */}
                        <div className="flex-1 min-w-0">
                          <DatePicker
                            selected={getTimeDate(searchData.pickupTime)}
                            onChange={handlePickupTimeChange}
                            showTimeSelect
                            showTimeSelectOnly
                            timeIntervals={30}
                            timeCaption={t('home.time')}
                            timeFormat="HH:mm"
                            dateFormat="HH:mm"
                            customInput={<CustomTimeInput placeholder={t('home.time')} />}
                            locale={language}
                            wrapperClassName="w-full"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Return Date/Time */}
                    <div className="flex flex-col gap-1.5 sm:gap-2 md:gap-2 w-full search:flex-1 search:min-w-0">
                      <label className="text-[10px] sm:text-xs md:text-xs font-semibold text-white uppercase tracking-wide mb-0.5 sm:mb-1">
                        {t('home.returnDate').toUpperCase()}
                      </label>
                      <div className="flex flex-row items-center gap-1.5 sm:gap-2 md:gap-2 w-full min-w-0">
                        {/* Drop Off Date */}
                        <div className="flex-[1.5] min-w-0">
                          <DatePicker
                            selected={searchData.dropoffDate ? new Date(searchData.dropoffDate) : null}
                            onChange={handleDropoffDateChange}
                            dateFormat="EEE, MMM dd"
                            minDate={searchData.pickupDate ? new Date(searchData.pickupDate) : new Date()}
                            customInput={<CustomDateInput placeholder={t('home.selectDate')} />}
                            locale={language}
                            wrapperClassName="w-full"
                          />
                        </div>

                        {/* Drop Off Time */}
                        <div className="flex-1 min-w-0">
                          <DatePicker
                            selected={getTimeDate(searchData.dropoffTime)}
                            onChange={handleDropoffTimeChange}
                            showTimeSelect
                            showTimeSelectOnly
                            timeIntervals={30}
                            timeCaption={t('home.time')}
                            timeFormat="HH:mm"
                            dateFormat="HH:mm"
                            customInput={<CustomTimeInput placeholder={t('home.time')} />}
                            locale={language}
                            wrapperClassName="w-full"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions (Button) */}
                  <div className="flex flex-col gap-2 sm:gap-3 md:gap-3 w-full search:w-auto search:items-end search:flex-shrink-0 mt-0">
                    <button
                      type="submit"
                      className="bg-[#FF6B35] border-none rounded-lg px-4 sm:px-5 md:px-6 py-2.5 sm:py-3 md:py-3 h-[44px] sm:h-[48px] md:h-[50px] flex items-center justify-center gap-1.5 sm:gap-2 md:gap-2 cursor-pointer transition-colors w-full search:w-auto search:flex-shrink-0 search:whitespace-nowrap hover:bg-[#E55A2B]"
                    >
                      <span className="text-white font-semibold text-xs sm:text-sm md:text-sm">{t('home.search')}</span>
                      <svg className="flex-shrink-0 w-4 h-4 sm:w-5 sm:h-5 md:w-5 md:h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="11" cy="11" r="8" stroke="white" strokeWidth="2" />
                        <path d="m21 21-4.35-4.35" stroke="white" strokeWidth="2" strokeLinecap="round" />
                      </svg>
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Mobile Features Bar */}
            <div className="w-full mx-auto px-3 sm:px-4 md:px-5 relative z-[3] -mt-2">
              <div className="bg-slate-900/60 backdrop-blur-sm rounded-2xl py-4 px-4 border border-white/10">
                <div className="grid grid-cols-2 gap-4 text-white">
                  {/* Feature 1 */}
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-[#FF6B35]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M7.75 12L10.58 14.83L16.25 9.17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <span className="font-medium text-sm sm:text-base">{t('home.features.noHiddenFees')}</span>
                  </div>

                  {/* Feature 2 */}
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-[#FF6B35]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9.00008 11.23L4.93008 15.3C4.66598 15.5641 4.51761 15.9223 4.51761 16.2959C4.51761 16.6695 4.66598 17.0277 4.93008 17.2918L6.70828 19.07C6.83907 19.2009 6.99441 19.3048 7.16541 19.3756C7.33642 19.4465 7.51973 19.4829 7.70488 19.4829C7.89004 19.4829 8.07335 19.4465 8.24436 19.3756C8.41536 19.3048 8.5707 19.2009 8.70148 19.07L12.7715 15M9.00008 11.23L15.3643 4.8658C16.8901 3.34001 19.3643 3.34001 20.8901 4.8658C22.4159 6.3916 22.4159 8.86578 20.8901 10.3916L17.7715 13.5102M9.00008 11.23L12.7715 15M17.7715 13.5102L19.0701 14.8088C19.3342 15.0729 19.4826 15.4311 19.4826 15.8047C19.4826 16.1783 19.3342 16.5365 19.0701 16.8006L17.2919 18.5788C17.1611 18.7097 17.0057 18.8136 16.8347 18.8844C16.6637 18.9553 16.4804 18.9917 16.2953 18.9917C16.1101 18.9917 15.9268 18.9553 15.7558 18.8844C15.5848 18.8136 15.4295 18.7097 15.2987 18.5788L12.7715 16.0516M17.7715 13.5102L12.7715 15M12.7715 15L12.7715 16.0516" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <span className="font-medium text-sm sm:text-base">{t('home.features.globalPartners')}</span>
                  </div>

                  {/* Feature 3 */}
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-[#FF6B35]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M3 18C3 18.55 3.45 19 4 19H5C5.55 19 6 18.55 6 18V10C6 9.45 5.55 9 5 9H4C3.45 9 3 9.45 3 10V18ZM3 18C3 19.66 4.34 21 6 21H18C19.66 21 21 19.66 21 18M21 18C21 18.55 20.55 19 20 19H19C18.45 19 18 18.55 18 18V10C18 9.45 18.45 9 19 9H20C20.55 9 21 9.45 21 10V18ZM15 6H9M12 3V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <span className="font-medium text-sm sm:text-base">{t('home.features.support247')}</span>
                  </div>

                  {/* Feature 4 */}
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-[#FF6B35]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M19 4H5C3.89543 4 3 4.89543 3 6V20C3 21.1046 3.89543 22 5 22H19C20.1046 22 21 21.1046 21 20V6C21 4.89543 20.1046 4 19 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M16 2V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M8 2V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M3 10H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <span className="font-medium text-sm sm:text-base">{t('home.features.freeCancellations')}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Desktop: Three-section layout (Logo top, Search middle, Cars bottom) */}
          <div className="hidden lg:flex w-full max-w-[1800px] mx-auto px-6 xl:px-10 2xl:px-12 box-border relative h-screen z-[2] flex-col justify-between items-center py-8 xl:py-12 2xl:py-16">
            {/* Top: Logo/Text Section */}
            <div className="flex-1 flex items-start justify-center pt-8 xl:pt-12 2xl:pt-16">
              {/* Logo area - background image will show through */}
            </div>

            {/* Middle: Search Bar Section */}
            <div className="flex-none w-full mx-auto p-5 xl:p-7 2xl:p-8 relative z-[20] flex justify-center items-center -mt-40 xl:-mt-44 2xl:-mt-48">
              <div className="bg-slate-900/50 rounded-xl p-5 xl:p-7 2xl:p-8 shadow-[0_10px_40px_rgba(0,0,0,0.3)] w-full max-w-[1800px] mx-auto">
                <form onSubmit={handleSubmit} className="flex flex-row items-end gap-4 xl:gap-4 2xl:gap-4 flex-wrap">
                  {/* Location Field */}
                  <div className="flex flex-col gap-2 w-full flex-1 min-w-[250px] xl:min-w-[280px] relative z-20">
                    <label className="text-xs font-semibold text-white uppercase tracking-wide mb-1">
                      {t('home.pickupLocation').toUpperCase()}
                    </label>
                    <div className="relative w-full" ref={pickupInputRef} onClick={handlePickupInputClick}>
                      <div className="relative flex items-center bg-white rounded-lg px-4 min-h-[50px] hover:bg-gray-50 transition-colors">
                        <svg className="flex-shrink-0 mr-3 w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2ZM12 11.5C10.62 11.5 9.5 10.38 9.5 9C9.5 7.62 10.62 6.5 12 6.5C13.38 6.5 14.5 7.62 14.5 9C14.5 10.38 13.38 11.5 12 11.5Z" fill="#FF6B35" />
                        </svg>
                        {loading ? (
                          <input
                            type="text"
                            className="flex-1 border-none outline-none text-sm text-gray-800 bg-transparent p-0 placeholder:text-gray-400 focus:outline-none focus:shadow-none"
                            placeholder={t('home.loading')}
                            disabled
                          />
                        ) : (
                          <input
                            type="text"
                            className="flex-1 border-none outline-none text-sm text-gray-800 bg-transparent p-0 placeholder:text-gray-400 focus:outline-none focus:shadow-none"
                            placeholder={t('home.pickupLocation') + '...'}
                            value={pickupSearch}
                            onChange={handlePickupSearchChange}
                            onFocus={() => setShowPickupSuggestions(true)}
                            onClick={handlePickupInputClick}
                          />
                        )}
                        <svg className="flex-shrink-0 ml-auto cursor-pointer relative z-[2] w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M6 9L12 15L18 9" stroke="#0066FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                      {showPickupSuggestions && !loading && locations.length > 0 && (
                        <div className="absolute top-full left-0 right-0 bg-white rounded-lg shadow-[0_4px_12px_rgba(0,0,0,0.15)] max-h-[300px] overflow-y-auto z-[1000] mt-1" ref={pickupSuggestionsRef}>
                          {filterLocations(pickupSearch).map((loc) => (
                            <div
                              key={loc.location_id || loc.Location_ID}
                              className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                              onMouseDown={(e) => handlePickupSelect(loc, e)}
                              onClick={(e) => handlePickupSelect(loc, e)}
                            >
                              <div className="font-medium text-gray-900 text-sm">{(loc.location_name || loc.Location_Name || '').replace(/IN_Terminal/gi, 'Airport').replace(/IN Terminal/gi, 'Airport')}</div>
                              <div className="text-sm text-gray-600 mt-1">{translateCountryInAddress(loc.address || loc.Address || '')}</div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* DateTime Fields Group */}
                  <div className="flex flex-row gap-4 w-full flex-[2.5] min-w-0 relative z-10">
                    {/* Pickup Date/Time */}
                    <div className="flex flex-col gap-2 w-full flex-1 min-w-0">
                      <label className="text-xs font-semibold text-white uppercase tracking-wide mb-1">
                        {t('home.pickupDate').toUpperCase()}
                      </label>
                      <div className="flex flex-row items-center gap-2 w-full min-w-0">
                        <div className="flex-[1.5] min-w-0">
                          <DatePicker
                            selected={searchData.pickupDate ? new Date(searchData.pickupDate) : null}
                            onChange={handlePickupDateChange}
                            dateFormat="EEE, MMM dd"
                            minDate={new Date()}
                            customInput={<CustomDateInput placeholder={t('home.selectDate')} />}
                            locale={language}
                            wrapperClassName="w-full"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <DatePicker
                            selected={getTimeDate(searchData.pickupTime)}
                            onChange={handlePickupTimeChange}
                            showTimeSelect
                            showTimeSelectOnly
                            timeIntervals={30}
                            timeCaption={t('home.time')}
                            timeFormat="HH:mm"
                            dateFormat="HH:mm"
                            customInput={<CustomTimeInput placeholder={t('home.time')} />}
                            locale={language}
                            wrapperClassName="w-full"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Return Date/Time */}
                    <div className="flex flex-col gap-2 w-full flex-1 min-w-0">
                      <label className="text-xs font-semibold text-white uppercase tracking-wide mb-1">
                        {t('home.returnDate').toUpperCase()}
                      </label>
                      <div className="flex flex-row items-center gap-2 w-full min-w-0">
                        <div className="flex-[1.5] min-w-0">
                          <DatePicker
                            selected={searchData.dropoffDate ? new Date(searchData.dropoffDate) : null}
                            onChange={handleDropoffDateChange}
                            dateFormat="EEE, MMM dd"
                            minDate={searchData.pickupDate ? new Date(searchData.pickupDate) : new Date()}
                            customInput={<CustomDateInput placeholder={t('home.selectDate')} />}
                            locale={language}
                            wrapperClassName="w-full"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <DatePicker
                            selected={getTimeDate(searchData.dropoffTime)}
                            onChange={handleDropoffTimeChange}
                            showTimeSelect
                            showTimeSelectOnly
                            timeIntervals={30}
                            timeCaption={t('home.time')}
                            timeFormat="HH:mm"
                            dateFormat="HH:mm"
                            customInput={<CustomTimeInput placeholder={t('home.time')} />}
                            locale={language}
                            wrapperClassName="w-full"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Search Button */}
                  <div className="flex flex-col gap-3 w-auto items-end flex-shrink-0 mt-0">
                    <button
                      type="submit"
                      className="bg-[#FF6B35] border-none rounded-lg px-6 py-3 h-[50px] flex items-center justify-center gap-2 cursor-pointer transition-colors w-auto flex-shrink-0 whitespace-nowrap hover:bg-[#E55A2B]"
                    >
                      <span className="text-white font-semibold text-sm">{t('home.search')}</span>
                      <svg className="flex-shrink-0 w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="11" cy="11" r="8" stroke="white" strokeWidth="2" />
                        <path d="m21 21-4.35-4.35" stroke="white" strokeWidth="2" strokeLinecap="round" />
                      </svg>
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Bottom: Cars Section */}
            <div className="flex-1 flex items-end justify-center pb-0 sm:pb-0.5 md:pb-1 xl:pb-1 2xl:pb-2">
              {/* Cars area - with new Features Bar overlay */}
              <div className="w-full max-w-[1200px] mx-auto bg-slate-900/60 backdrop-blur-sm rounded-full py-4 px-8 border border-white/10">
                <div className="flex items-center justify-center gap-6 sm:gap-8 lg:gap-12 text-white">
                  {/* Feature 1 */}
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                      <svg className="w-5 h-5 text-[#FF6B35]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M7.75 12L10.58 14.83L16.25 9.17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <span className="font-medium text-sm sm:text-base">{t('home.features.noHiddenFees')}</span>
                  </div>

                  <div className="h-8 w-[1px] bg-white/20"></div>

                  {/* Feature 2 */}
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                      <svg className="w-5 h-5 text-[#FF6B35]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9.00008 11.23L4.93008 15.3C4.66598 15.5641 4.51761 15.9223 4.51761 16.2959C4.51761 16.6695 4.66598 17.0277 4.93008 17.2918L6.70828 19.07C6.83907 19.2009 6.99441 19.3048 7.16541 19.3756C7.33642 19.4465 7.51973 19.4829 7.70488 19.4829C7.89004 19.4829 8.07335 19.4465 8.24436 19.3756C8.41536 19.3048 8.5707 19.2009 8.70148 19.07L12.7715 15M9.00008 11.23L15.3643 4.8658C16.8901 3.34001 19.3643 3.34001 20.8901 4.8658C22.4159 6.3916 22.4159 8.86578 20.8901 10.3916L17.7715 13.5102M9.00008 11.23L12.7715 15M17.7715 13.5102L19.0701 14.8088C19.3342 15.0729 19.4826 15.4311 19.4826 15.8047C19.4826 16.1783 19.3342 16.5365 19.0701 16.8006L17.2919 18.5788C17.1611 18.7097 17.0057 18.8136 16.8347 18.8844C16.6637 18.9553 16.4804 18.9917 16.2953 18.9917C16.1101 18.9917 15.9268 18.9553 15.7558 18.8844C15.5848 18.8136 15.4295 18.7097 15.2987 18.5788L12.7715 16.0516M17.7715 13.5102L12.7715 15M12.7715 15L12.7715 16.0516" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <span className="font-medium text-sm sm:text-base">{t('home.features.globalPartners')}</span>
                  </div>

                  <div className="h-8 w-[1px] bg-white/20"></div>

                  {/* Feature 3 */}
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                      <svg className="w-5 h-5 text-[#FF6B35]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M3 18C3 18.55 3.45 19 4 19H5C5.55 19 6 18.55 6 18V10C6 9.45 5.55 9 5 9H4C3.45 9 3 9.45 3 10V18ZM3 18C3 19.66 4.34 21 6 21H18C19.66 21 21 19.66 21 18M21 18C21 18.55 20.55 19 20 19H19C18.45 19 18 18.55 18 18V10C18 9.45 18.45 9 19 9H20C20.55 9 21 9.45 21 10V18ZM15 6H9M12 3V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <span className="font-medium text-sm sm:text-base">{t('home.features.support247')}</span>
                  </div>

                  <div className="h-8 w-[1px] bg-white/20"></div>

                  {/* Feature 4 */}
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                      <svg className="w-5 h-5 text-[#FF6B35]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M19 4H5C3.89543 4 3 4.89543 3 6V20C3 21.1046 3.89543 22 5 22H19C20.1046 22 21 21.1046 21 20V6C21 4.89543 20.1046 4 19 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M16 2V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M8 2V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M3 10H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <span className="font-medium text-sm sm:text-base">{t('home.features.freeCancellations')}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose Us Section */}
        <section className="py-16 sm:py-20 md:py-20 lg:py-20 bg-white px-5 sm:px-5 md:px-5 lg:px-5">
          <div className="max-w-[1200px] mx-auto w-full">
            <div className="text-center mb-12 sm:mb-14 md:mb-15 lg:mb-15">
              <h2 className="text-3xl sm:text-4xl md:text-[42px] font-bold text-gray-800 mb-4 leading-tight">
                {t('home.whyChooseUsTitle')} <span className="text-[#EF4444]">{t('home.whyChooseUsTitleUs')}</span>
              </h2>
              <p className="text-base sm:text-lg md:text-lg text-gray-600 max-w-[700px] mx-auto leading-relaxed">
                {t('home.whyChooseUsDescription')}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-6 md:gap-8 lg:gap-8 mt-8 sm:mt-10 md:mt-10">
              <div className="bg-white rounded-xl p-6 sm:p-6 md:p-8 lg:p-8 shadow-[0_2px_12px_rgba(0,0,0,0.08)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_4px_20px_rgba(0,0,0,0.12)]">
                <div className="mb-6">
                  <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2ZM12 11.5C10.62 11.5 9.5 10.38 9.5 9C9.5 7.62 10.62 6.5 12 6.5C13.38 6.5 14.5 7.62 14.5 9C14.5 10.38 13.38 11.5 12 11.5Z" fill="#EF4444" />
                    </svg>
                  </div>
                </div>
                <h3 className="text-xl sm:text-xl md:text-[22px] font-bold text-gray-800 mb-3">{t('home.whyChooseUsFeature1Title')}</h3>
                <p className="text-base text-gray-600 leading-relaxed m-0">
                  {t('home.whyChooseUsFeature1Description')}
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 sm:p-6 md:p-8 lg:p-8 shadow-[0_2px_12px_rgba(0,0,0,0.08)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_4px_20px_rgba(0,0,0,0.12)]">
                <div className="mb-6">
                  <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M7 4V2C7 1.45 7.45 1 8 1H16C16.55 1 17 1.45 17 2V4H20C20.55 4 21 4.45 21 5S20.55 6 20 6H19V19C19 20.1 18.1 21 17 21H7C5.9 21 5 20.1 5 19V6H4C3.45 6 3 5.55 3 5S3.45 4 4 4H7ZM9 3V4H15V3H9ZM7 6V19H17V6H7Z" fill="#EF4444" />
                      <path d="M9 8H15V10H9V8ZM9 12H15V14H9V12Z" fill="#EF4444" />
                    </svg>
                  </div>
                </div>
                <h3 className="text-xl sm:text-xl md:text-[22px] font-bold text-gray-800 mb-3">{t('home.whyChooseUsFeature2Title')}</h3>
                <p className="text-base text-gray-600 leading-relaxed m-0">
                  {t('home.whyChooseUsFeature2Description')}
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 sm:p-6 md:p-8 lg:p-8 shadow-[0_2px_12px_rgba(0,0,0,0.08)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_4px_20px_rgba(0,0,0,0.12)]">
                <div className="mb-6">
                  <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5H6.5C5.84 5 5.28 5.42 5.08 6.01L3 12V20C3 20.55 3.45 21 4 21H5C5.55 21 6 20.55 6 20V19H18V20C18 20.55 18.45 21 19 21H20C20.55 21 21 20.55 21 20V12L18.92 6.01ZM6.5 6.5H17.5L19.11 11H4.89L6.5 6.5ZM6.5 16C5.67 16 5 15.33 5 14.5S5.67 13 6.5 13 8 13.67 8 14.5 7.33 16 6.5 16ZM17.5 16C16.67 16 16 15.33 16 14.5S16.67 13 17.5 13 19 13.67 19 14.5 18.33 16 17.5 16Z" fill="#EF4444" />
                      <path d="M9 8L11 10L15 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </div>
                <h3 className="text-xl sm:text-xl md:text-[22px] font-bold text-gray-800 mb-3">{t('home.whyChooseUsFeature3Title')}</h3>
                <p className="text-base text-gray-600 leading-relaxed m-0">
                  {t('home.whyChooseUsFeature3Description')}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Dedicated to Your Journey Section */}
        <section className="py-16 sm:py-20 md:py-20 lg:py-20 bg-white px-5 sm:px-5 md:px-5 lg:px-5">
          <div className="max-w-[1200px] mx-auto w-full">
            <div className="text-center mb-12 sm:mb-14 md:mb-15 lg:mb-15">
              <h2 className="text-3xl sm:text-4xl md:text-[42px] font-bold text-gray-800 mb-4 leading-tight">
                {t('home.dedicatedJourneyTitle')} <span className="text-[#EF4444]">{t('home.dedicatedJourneyTitleJourney')}</span>
              </h2>
              <p className="text-base sm:text-lg md:text-lg text-gray-600 max-w-[700px] mx-auto leading-relaxed">
                {t('home.dedicatedJourneyDescription')}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-6 md:gap-8 lg:gap-8 mt-8 sm:mt-10 md:mt-10">
              <div className="bg-white rounded-xl p-6 sm:p-6 md:p-8 lg:p-8 shadow-[0_2px_12px_rgba(0,0,0,0.08)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_4px_20px_rgba(0,0,0,0.12)]">
                <div className="mb-6">
                  <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect x="3" y="4" width="18" height="18" rx="2" stroke="#EF4444" strokeWidth="2" fill="none" />
                      <path d="M16 2V6M8 2V6M3 10H21" stroke="#EF4444" strokeWidth="2" />
                      <path d="M9 14L11 16L15 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </div>
                <h3 className="text-xl sm:text-xl md:text-[22px] font-bold text-gray-800 mb-3">{t('home.dedicatedJourneyFeature1Title')}</h3>
                <p className="text-base text-gray-600 leading-relaxed m-0">
                  {t('home.dedicatedJourneyFeature1Description')}
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 sm:p-6 md:p-8 lg:p-8 shadow-[0_2px_12px_rgba(0,0,0,0.08)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_4px_20px_rgba(0,0,0,0.12)]">
                <div className="mb-6">
                  <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect x="1" y="4" width="22" height="16" rx="2" stroke="#EF4444" strokeWidth="2" fill="none" />
                      <path d="M1 10H23" stroke="#EF4444" strokeWidth="2" />
                      <path d="M7 2V6M17 2V6" stroke="#EF4444" strokeWidth="2" />
                      <path d="M12 14L14 16L18 12" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </div>
                <h3 className="text-xl sm:text-xl md:text-[22px] font-bold text-gray-800 mb-3">{t('home.dedicatedJourneyFeature2Title')}</h3>
                <p className="text-base text-gray-600 leading-relaxed m-0">
                  {t('home.dedicatedJourneyFeature2Description')}
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 sm:p-6 md:p-8 lg:p-8 shadow-[0_2px_12px_rgba(0,0,0,0.08)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_4px_20px_rgba(0,0,0,0.12)]">
                <div className="mb-6">
                  <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="#EF4444" />
                      <path d="M2 17L12 22L22 17" stroke="#EF4444" strokeWidth="2" fill="none" />
                      <path d="M2 12L12 17L22 12" stroke="#EF4444" strokeWidth="2" fill="none" />
                      <circle cx="12" cy="7" r="1" fill="#EF4444" />
                    </svg>
                  </div>
                </div>
                <h3 className="text-xl sm:text-xl md:text-[22px] font-bold text-gray-800 mb-3">{t('home.dedicatedJourneyFeature3Title')}</h3>
                <p className="text-base text-gray-600 leading-relaxed m-0">
                  {t('home.dedicatedJourneyFeature3Description')}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Airports Section */}
        <section id="airports" className="py-16 sm:py-20 md:py-20 lg:py-20 bg-gray-50 px-5 sm:px-5 md:px-5 lg:px-5">
          <div className="max-w-[1200px] mx-auto w-full">
            <h2 className="text-3xl sm:text-4xl md:text-[42px] font-bold text-gray-800 mb-4 text-center">{t('home.airportsTitle')}</h2>
            <p className="text-base sm:text-lg md:text-lg text-gray-600 text-center mb-12 sm:mb-14 md:mb-15 lg:mb-15">
              {t('home.airportsDescription')}
            </p>

            {loading ? (
              <div className="text-center py-10 text-gray-600 text-base">{t('home.airportsLoading')}</div>
            ) : airports.length === 0 ? (
              <div className="text-center py-10 text-gray-600 text-base">{t('home.airportsEmpty')}</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 sm:gap-4 md:gap-6 lg:gap-6" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
                {airports.map((airport, index) => {
                  const locationId = airport.location_id || airport.Location_ID
                  let locationName = airport.location_name || airport.Location_Name || 'Unknown Airport'
                  // IN_Terminal yerine airport yaz
                  locationName = locationName.replace(/IN_Terminal/gi, 'Airport').replace(/IN Terminal/gi, 'Airport')
                  const address = airport.address || airport.Address || ''
                  const flagCode = getCountryCode(airport)

                  return (
                    <div
                      key={locationId || index}
                      className="group bg-white rounded-xl p-4 sm:p-5 md:p-6 flex items-center gap-4 cursor-pointer transition-all duration-300 shadow-[0_2px_8px_rgba(0,0,0,0.1)] border-2 border-transparent hover:-translate-y-1 hover:shadow-[0_4px_16px_rgba(0,0,0,0.15)] hover:border-[#EF4444]"
                      onClick={() => handleAirportClick(airport)}
                    >
                      <div className="text-4xl sm:text-5xl md:text-5xl flex-shrink-0">
                        {flagCode ? <Flag code={flagCode} style={{ width: 24, height: 16, objectFit: 'cover' }} /> : '🌍'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg sm:text-lg md:text-lg font-semibold text-gray-800 m-0 mb-2 whitespace-nowrap overflow-hidden text-ellipsis">{locationName}</h3>
                        {address && <p className="text-sm sm:text-sm md:text-sm text-gray-600 m-0 whitespace-nowrap overflow-hidden text-ellipsis">{translateCountryInAddress(address)}</p>}
                      </div>
                      <div className="text-2xl sm:text-2xl md:text-2xl text-[#EF4444] flex-shrink-0 transition-transform duration-300 group-hover:translate-x-1">{'→'}</div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </section>

      </div>
    </>
  )
}

export default Home
