import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { getLocations } from '../services/api'
import './Home.css'

function Home() {
  const navigate = useNavigate()
  const [locations, setLocations] = useState([])
  const [loading, setLoading] = useState(true)
  // Yarının tarihini hesapla (YYYY-MM-DD formatında)
  const getTomorrowDate = () => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    return tomorrow.toISOString().split('T')[0]
  }

  // Pickup date'in 3 gün sonrasını hesapla
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
    pickupDate: tomorrowDate, // Yarın
    pickupTime: '11:00',
    dropoffDate: getDropoffDate(tomorrowDate), // Pickup date + 3 gün
    dropoffTime: '11:00',
    sameLocation: true,
    driverCountry: 'Turkey',
    driverAge: '30-65'
  })
  const [pickupSearch, setPickupSearch] = useState('')
  const [dropoffSearch, setDropoffSearch] = useState('')
  const [showPickupSuggestions, setShowPickupSuggestions] = useState(false)
  const [showDropoffSuggestions, setShowDropoffSuggestions] = useState(false)
  const [activeFaq, setActiveFaq] = useState(null)
  const [airports, setAirports] = useState([])
  const pickupInputRef = useRef(null)
  const dropoffInputRef = useRef(null)
  const pickupSuggestionsRef = useRef(null)
  const dropoffSuggestionsRef = useRef(null)

  useEffect(() => {
    loadLocations()
    loadAirports()
    // Sayfa her yüklendiğinde default değerlere dön
    const tomorrow = getTomorrowDate()
    setSearchData({
      pickupId: '',
      dropoffId: '',
      pickupDate: tomorrow, // Yarın
      pickupTime: '11:00',
      dropoffDate: getDropoffDate(tomorrow), // Pickup date + 3 gün
      dropoffTime: '11:00',
      sameLocation: true,
      driverCountry: 'Turkey',
      driverAge: '30-65'
    })
    setPickupSearch('')
    setDropoffSearch('')

    // Hash kontrolü - FAQ bölümüne scroll et
    const scrollToFaq = () => {
      if (window.location.hash === '#faq') {
        setTimeout(() => {
          const faqElement = document.getElementById('faq')
          if (faqElement) {
            const headerHeight = 80 // Header yüksekliği
            const elementPosition = faqElement.getBoundingClientRect().top
            const offsetPosition = elementPosition + window.pageYOffset - headerHeight

            window.scrollTo({
              top: offsetPosition,
              behavior: 'smooth'
            })
          }
        }, 300) // Biraz daha uzun timeout
      }
    }

    // Sayfa yüklendiğinde hash kontrolü
    scrollToFaq()

    // Hash değişikliklerini dinle
    const handleHashChange = () => {
      scrollToFaq()
    }

    window.addEventListener('hashchange', handleHashChange)

    return () => {
      window.removeEventListener('hashchange', handleHashChange)
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

  const loadAirports = async () => {
    try {
      console.log('🛫 Airport lokasyonları yükleniyor...')
      const data = await getLocations()
      console.log('🛫 Airport lokasyonları yüklendi:', data?.length || 0, 'lokasyon')
      console.log('🛫 İlk 3 lokasyon:', data?.slice(0, 3))
      // Tüm lokasyonları göster (filtreleme yok)
      setAirports(data || [])
    } catch (error) {
      console.error('❌ Airport lokasyonları yüklenirken hata:', error)
      console.error('❌ Hata detayları:', error.response?.data || error.message)
      setAirports([])
    }
  }

  // Ülke kısaltmasına göre bayrak emoji döndür (ISO 3166-1 alpha-2)
  const getCountryFlag = (location) => {
    // Önce country alanından kısaltmayı al
    let countryCode = (location.country || location.Country || '').toUpperCase().trim()
    
    // Debug: country alanını logla (ilk 5 airport için)
    const airportIndex = airports.indexOf(location)
    if (airportIndex < 5) {
      console.log(`🔍 Airport ${airportIndex + 1} country alanı:`, {
        country: location.country,
        Country: location.Country,
        countryCode: countryCode,
        locationName: location.location_name || location.Location_Name,
        address: location.address || location.Address
      })
    }
    
    // Eğer country alanı varsa, direkt kullan (sadece 2 harfli kodlar)
    if (countryCode && countryCode.length === 2) {
      // ISO 3166-1 alpha-2 kodlarına göre bayrak eşleştirmesi (TÜM ÜLKELER)
      const countryFlags = {
        // A
        'AD': '🇦🇩', 'AE': '🇦🇪', 'AF': '🇦🇫', 'AG': '🇦🇬', 'AI': '🇦🇮',
        'AL': '🇦🇱', 'AM': '🇦🇲', 'AO': '🇦🇴', 'AQ': '🇦🇶', 'AR': '🇦🇷',
        'AS': '🇦🇸', 'AT': '🇦🇹', 'AU': '🇦🇺', 'AW': '🇦🇼', 'AX': '🇦🇽',
        'AZ': '🇦🇿', // Azerbaijan
        // B
        'BA': '🇧🇦', 'BB': '🇧🇧', // Barbados
        'BD': '🇧🇩', 'BE': '🇧🇪', 'BF': '🇧🇫', 'BG': '🇧🇬', 'BH': '🇧🇭',
        'BI': '🇧🇮', 'BJ': '🇧🇯', 'BL': '🇧🇱', 'BM': '🇧🇲', 'BN': '🇧🇳',
        'BO': '🇧🇴', 'BQ': '🇧🇶', 'BR': '🇧🇷', 'BS': '🇧🇸', 'BT': '🇧🇹',
        'BV': '🇧🇻', 'BW': '🇧🇼', 'BY': '🇧🇾', 'BZ': '🇧🇿',
        // C
        'CA': '🇨🇦', 'CC': '🇨🇨', 'CD': '🇨🇩', 'CF': '🇨🇫', 'CG': '🇨🇬',
        'CH': '🇨🇭', 'CI': '🇨🇮', 'CK': '🇨🇰', 'CL': '🇨🇱', 'CM': '🇨🇲',
        'CN': '🇨🇳', 'CO': '🇨🇴', 'CR': '🇨🇷', 'CU': '🇨🇺', 'CV': '🇨🇻',
        'CW': '🇨🇼', 'CX': '🇨🇽', 'CY': '🇨🇾', 'CZ': '🇨🇿',
        // D
        'DE': '🇩🇪', 'DJ': '🇩🇯', 'DK': '🇩🇰', 'DM': '🇩🇲', 'DO': '🇩🇴',
        'DZ': '🇩🇿',
        // E
        'EC': '🇪🇨', 'EE': '🇪🇪', 'EG': '🇪🇬', 'EH': '🇪🇭', 'ER': '🇪🇷',
        'ES': '🇪🇸', 'ET': '🇪🇹',
        // F
        'FI': '🇫🇮', 'FJ': '🇫🇯', 'FK': '🇫🇰', 'FM': '🇫🇲', 'FO': '🇫🇴',
        'FR': '🇫🇷',
        // G
        'GA': '🇬🇦', 'GB': '🇬🇧', 'GD': '🇬🇩', 'GE': '🇬🇪', 'GF': '🇬🇫',
        'GG': '🇬🇬', 'GH': '🇬🇭', 'GI': '🇬🇮', 'GL': '🇬🇱', 'GM': '🇬🇲',
        'GN': '🇬🇳', 'GP': '🇬🇵', 'GQ': '🇬🇶', 'GR': '🇬🇷', 'GS': '🇬🇸',
        'GT': '🇬🇹', 'GU': '🇬🇺', 'GW': '🇬🇼', 'GY': '🇬🇾',
        // H
        'HK': '🇭🇰', 'HM': '🇭🇲', 'HN': '🇭🇳', 'HR': '🇭🇷', 'HT': '🇭🇹',
        'HU': '🇭🇺',
        // I
        'ID': '🇮🇩', 'IE': '🇮🇪', 'IL': '🇮🇱', 'IM': '🇮🇲', 'IN': '🇮🇳',
        'IO': '🇮🇴', 'IQ': '🇮🇶', 'IR': '🇮🇷', 'IS': '🇮🇸', 'IT': '🇮🇹',
        // J
        'JE': '🇯🇪', 'JM': '🇯🇲', 'JO': '🇯🇴', 'JP': '🇯🇵',
        // K
        'KE': '🇰🇪', 'KG': '🇰🇬', 'KH': '🇰🇭', 'KI': '🇰🇮', 'KM': '🇰🇲',
        'KN': '🇰🇳', 'KP': '🇰🇵', 'KR': '🇰🇷', 'KW': '🇰🇼', 'KY': '🇰🇾',
        'KZ': '🇰🇿',
        // L
        'LA': '🇱🇦', 'LB': '🇱🇧', 'LC': '🇱🇨', 'LI': '🇱🇮', 'LK': '🇱🇰',
        'LR': '🇱🇷', 'LS': '🇱🇸', 'LT': '🇱🇹', 'LU': '🇱🇺', 'LV': '🇱🇻',
        'LY': '🇱🇾',
        // M
        'MA': '🇲🇦', 'MC': '🇲🇨', 'MD': '🇲🇩', 'ME': '🇲🇪', 'MF': '🇲🇫',
        'MG': '🇲🇬', 'MH': '🇲🇭', 'MK': '🇲🇰', 'ML': '🇲🇱', 'MM': '🇲🇲',
        'MN': '🇲🇳', 'MO': '🇲🇴', 'MP': '🇲🇵', 'MQ': '🇲🇶', 'MR': '🇲🇷',
        'MS': '🇲🇸', 'MT': '🇲🇹', 'MU': '🇲🇺', // Mauritius
        'MV': '🇲🇻', 'MW': '🇲🇼', 'MX': '🇲🇽', 'MY': '🇲🇾', 'MZ': '🇲🇿',
        // N
        'NA': '🇳🇦', 'NC': '🇳🇨', 'NE': '🇳🇪', 'NF': '🇳🇫', 'NG': '🇳🇬',
        'NI': '🇳🇮', 'NL': '🇳🇱', 'NO': '🇳🇴', 'NP': '🇳🇵', 'NR': '🇳🇷',
        'NU': '🇳🇺', 'NZ': '🇳🇿',
        // O
        'OM': '🇴🇲',
        // P
        'PA': '🇵🇦', 'PE': '🇵🇪', 'PF': '🇵🇫', 'PG': '🇵🇬', 'PH': '🇵🇭',
        'PK': '🇵🇰', 'PL': '🇵🇱', 'PM': '🇵🇲', 'PN': '🇵🇳', 'PR': '🇵🇷',
        'PS': '🇵🇸', 'PT': '🇵🇹', 'PW': '🇵🇼', 'PY': '🇵🇾',
        // Q
        'QA': '🇶🇦',
        // R
        'RE': '🇷🇪', 'RO': '🇷🇴', 'RS': '🇷🇸', 'RU': '🇷🇺', 'RW': '🇷🇼',
        // S
        'SA': '🇸🇦', 'SB': '🇸🇧', 'SC': '🇸🇨', 'SD': '🇸🇩', 'SE': '🇸🇪',
        'SG': '🇸🇬', 'SH': '🇸🇭', 'SI': '🇸🇮', 'SJ': '🇸🇯', 'SK': '🇸🇰',
        'SL': '🇸🇱', 'SM': '🇸🇲', 'SN': '🇸🇳', 'SO': '🇸🇴', 'SR': '🇸🇷',
        'SS': '🇸🇸', 'ST': '🇸🇹', 'SV': '🇸🇻', 'SX': '🇸🇽', 'SY': '🇸🇾',
        'SZ': '🇸🇿',
        // T
        'TC': '🇹🇨', 'TD': '🇹🇩', 'TF': '🇹🇫', 'TG': '🇹🇬', 'TH': '🇹🇭',
        'TJ': '🇹🇯', 'TK': '🇹🇰', 'TL': '🇹🇱', 'TM': '🇹🇲', 'TN': '🇹🇳',
        'TO': '🇹🇴', 'TR': '🇹🇷', 'TT': '🇹🇹', 'TV': '🇹🇻', 'TW': '🇹🇼',
        'TZ': '🇹🇿',
        // U
        'UA': '🇺🇦', 'UG': '🇺🇬', 'UM': '🇺🇲', 'US': '🇺🇸', 'UY': '🇺🇾',
        'UZ': '🇺🇿',
        // V
        'VA': '🇻🇦', 'VC': '🇻🇨', 'VE': '🇻🇪', 'VG': '🇻🇬', 'VI': '🇻🇮',
        'VN': '🇻🇳', 'VU': '🇻🇺',
        // W
        'WF': '🇼🇫', 'WS': '🇼🇸',
        // Y
        'YE': '🇾🇪', 'YT': '🇾🇹',
        // Z
        'ZA': '🇿🇦', 'ZM': '🇿🇲', 'ZW': '🇿🇼',
        // Alternatif kodlar
        'UK': '🇬🇧', // UK -> GB
      }
      
      // Eğer direkt eşleşme varsa döndür
      if (countryFlags[countryCode]) {
        return countryFlags[countryCode]
      }
    }
    
    // Eğer country alanı yoksa, eski yöntemle name ve address'ten çıkar
    const name = (location.location_name || location.Location_Name || '').toLowerCase()
    const address = (location.address || location.Address || '').toLowerCase()
    
    // Ülke eşleştirmeleri (fallback)
    if (name.includes('turkey') || name.includes('türkiye') || name.includes('istanbul') || 
        name.includes('ankara') || name.includes('izmir') || address.includes('turkey') || 
        address.includes('türkiye')) {
      return '🇹🇷'
    }
    if (name.includes('germany') || name.includes('almanya') || name.includes('berlin') || 
        name.includes('munich') || address.includes('germany') || address.includes('almanya')) {
      return '🇩🇪'
    }
    if (name.includes('france') || name.includes('fransa') || name.includes('paris') || 
        address.includes('france') || address.includes('fransa')) {
      return '🇫🇷'
    }
    if (name.includes('spain') || name.includes('ispanya') || name.includes('madrid') || 
        name.includes('barcelona') || address.includes('spain') || address.includes('ispanya')) {
      return '🇪🇸'
    }
    if (name.includes('italy') || name.includes('italya') || name.includes('rome') || 
        name.includes('milan') || address.includes('italy') || address.includes('italya')) {
      return '🇮🇹'
    }
    if (name.includes('uk') || name.includes('united kingdom') || name.includes('london') || 
        address.includes('uk') || address.includes('united kingdom')) {
      return '🇬🇧'
    }
    if (name.includes('usa') || name.includes('united states') || name.includes('new york') || 
        name.includes('los angeles') || address.includes('usa') || address.includes('united states')) {
      return '🇺🇸'
    }
    if (name.includes('zambia') || address.includes('zambia')) {
      return '🇿🇲'
    }
    if (name.includes('antigua') || name.includes('barbuda') || address.includes('antigua') || address.includes('barbuda')) {
      return '🇦🇬'
    }
    if (name.includes('cyprus') || name.includes('cypres') || name.includes('larnaca') || name.includes('pafos') || 
        address.includes('cyprus') || address.includes('cypres')) {
      return '🇨🇾'
    }
    
    // Eğer country alanı boşsa ve name/address'ten de çıkaramadıysak, varsayılan bayrak
    if (!countryCode || countryCode === '') {
      const airportIndex = airports.indexOf(location)
      if (airportIndex < 10) {
        console.warn('⚠️ Ülke kodu bulunamadı:', {
          index: airportIndex,
          locationName: location.location_name || location.Location_Name,
          address: location.address || location.Address,
          country: location.country,
          Country: location.Country
        })
      }
    }
    
    // Varsayılan bayrak
    return '🌍'
  }

  const handleAirportClick = (airport) => {
    const locationId = airport.location_id || airport.Location_ID
    const today = new Date()
    // Ertesi günden başlayarak filtrele (pickup: yarın, dropoff: yarın + 7 gün)
    const pickupDateObj = new Date(today)
    pickupDateObj.setDate(pickupDateObj.getDate() + 1) // Yarın
    
    const dropoffDateObj = new Date(pickupDateObj)
    dropoffDateObj.setDate(dropoffDateObj.getDate() + 7) // Yarın + 7 gün
    
    const pickupDate = pickupDateObj.toISOString().split('T')[0]
    const dropoffDate = dropoffDateObj.toISOString().split('T')[0]
    
    // CarList sayfasına yönlendir
    navigate(`/cars?pickupId=${locationId}&dropoffId=${locationId}&pickupDate=${pickupDate}&dropoffDate=${dropoffDate}&currency=EURO`)
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

  const handlePickupInputClick = (e) => {
    e.preventDefault()
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
    e.preventDefault()
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

  const handlePickupSelect = (location) => {
    const locationId = location.location_id || location.Location_ID
    const locationName = `${location.location_name || location.Location_Name} - ${location.address || location.Address || ''}`
    setPickupSearch(locationName)
    const newSearchData = { ...searchData, pickupId: locationId }
    setSearchData(newSearchData)
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
                <div className="autocomplete-wrapper" ref={pickupInputRef} onClick={handlePickupInputClick}>
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
                    }}
                  />
                  <span>Return car in same location</span>
                </label>
              </div>

              <div className="form-row dates-row-single">
                <div className="form-group date-time-group">
                  <label>Pick-up date</label>
                  <div className="date-input-wrapper" onClick={(e) => {
                    const input = e.currentTarget.querySelector('input[type="date"]')
                    if (input) {
                      input.focus()
                      input.showPicker?.()
                    }
                  }}>
                    <input
                      type="date"
                      value={searchData.pickupDate}
                      onChange={(e) => {
                        const newPickupDate = e.target.value
                        // Pickup date değiştiğinde dropoff date'i de güncelle (pickup + 3 gün)
                        const newDropoffDate = getDropoffDate(newPickupDate)
                        const newData = { 
                          ...searchData, 
                          pickupDate: newPickupDate,
                          dropoffDate: newDropoffDate
                        }
                        setSearchData(newData)
                      }}
                      min={new Date().toISOString().split('T')[0]}
                      className="form-input date-input"
                      onClick={(e) => {
                        e.stopPropagation()
                        e.target.focus()
                        e.target.showPicker?.()
                      }}
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
                  <div className="input-with-icon" onClick={(e) => {
                    const input = e.currentTarget.querySelector('input[type="time"]')
                    if (input) {
                      input.focus()
                      input.showPicker?.()
                    }
                  }}>
                    <input
                      type="time"
                      value={searchData.pickupTime}
                      onChange={(e) => {
                        const newData = { ...searchData, pickupTime: e.target.value }
                        setSearchData(newData)
                      }}
                      className="form-input time-input"
                      onClick={(e) => {
                        e.stopPropagation()
                        e.target.focus()
                        e.target.showPicker?.()
                      }}
                      required
                    />
                  </div>
                </div>

                <div className="form-group date-time-group">
                  <label>Drop-off date</label>
                  <div className="date-input-wrapper" onClick={(e) => {
                    const input = e.currentTarget.querySelector('input[type="date"]')
                    if (input) {
                      input.focus()
                      input.showPicker?.()
                    }
                  }}>
                    <input
                      type="date"
                      value={searchData.dropoffDate}
                      onChange={(e) => {
                        const newData = { ...searchData, dropoffDate: e.target.value }
                        setSearchData(newData)
                      }}
                      min={searchData.pickupDate || new Date().toISOString().split('T')[0]}
                      className="form-input date-input"
                      onClick={(e) => {
                        e.stopPropagation()
                        e.target.focus()
                        e.target.showPicker?.()
                      }}
                      required
                    />
                    {searchData.dropoffDate && (
                      <span className="date-display">{formatDateShort(searchData.dropoffDate)}</span>
                    )}
                  </div>
                </div>

                <div className="form-group date-time-group">
                  <label>Drop-off time</label>
                  <div className="input-with-icon" onClick={(e) => {
                    const input = e.currentTarget.querySelector('input[type="time"]')
                    if (input) {
                      input.focus()
                      input.showPicker?.()
                    }
                  }}>
                    <input
                      type="time"
                      value={searchData.dropoffTime}
                      onChange={(e) => {
                        const newData = { ...searchData, dropoffTime: e.target.value }
                        setSearchData(newData)
                      }}
                      className="form-input time-input"
                      onClick={(e) => {
                        e.stopPropagation()
                        e.target.focus()
                        e.target.showPicker?.()
                      }}
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

      {/* FAQ Section */}
      <section id="faq" className="faq-section">
        <div className="container">
          <h2 className="faq-title">Frequently Asked Questions (FAQ)</h2>
          
          <div className="faq-category">
            <h3 className="faq-category-title">Booking & Payment</h3>
            <div className="faq-items">
              <div className={`faq-item ${activeFaq === 'payment-process' ? 'active' : ''}`}>
                <div className="faq-question" onClick={() => setActiveFaq(activeFaq === 'payment-process' ? null : 'payment-process')}>
                  <span>How does the payment process work?</span>
                  <span className="faq-icon">{activeFaq === 'payment-process' ? '−' : '+'}</span>
                </div>
                <div className="faq-answer">
                  Depending on the selected payment option, you may pay either a partial amount or the full rental cost online via the Xdrive Mobility platform. If applicable, the remaining balance is paid directly to the Rental Provider at vehicle pickup.
                </div>
              </div>

              <div className={`faq-item ${activeFaq === 'pay-part' ? 'active' : ''}`}>
                <div className="faq-question" onClick={() => setActiveFaq(activeFaq === 'pay-part' ? null : 'pay-part')}>
                  <span>What does "Pay Part" mean?</span>
                  <span className="faq-icon">{activeFaq === 'pay-part' ? '−' : '+'}</span>
                </div>
                <div className="faq-answer">
                  "Pay Part" means you make a partial advance payment online to confirm your booking. The remaining balance is paid directly to the Rental Provider at vehicle pickup.
                </div>
              </div>

              <div className={`faq-item ${activeFaq === 'pay-full' ? 'active' : ''}`}>
                <div className="faq-question" onClick={() => setActiveFaq(activeFaq === 'pay-full' ? null : 'pay-full')}>
                  <span>What does "Pay Full" mean?</span>
                  <span className="faq-icon">{activeFaq === 'pay-full' ? '−' : '+'}</span>
                </div>
                <div className="faq-answer">
                  "Pay Full" means you pay the total rental amount online in advance via the Xdrive Mobility platform.
                </div>
              </div>

              <div className={`faq-item ${activeFaq === 'payment-methods' ? 'active' : ''}`}>
                <div className="faq-question" onClick={() => setActiveFaq(activeFaq === 'payment-methods' ? null : 'payment-methods')}>
                  <span>Which payment methods are accepted?</span>
                  <span className="faq-icon">{activeFaq === 'payment-methods' ? '−' : '+'}</span>
                </div>
                <div className="faq-answer">
                  Only credit cards are accepted for online payments made via the Xdrive Mobility platform.
                </div>
              </div>
            </div>
          </div>

          <div className="faq-category">
            <h3 className="faq-category-title">Prices & Fees</h3>
            <div className="faq-items">
              <div className={`faq-item ${activeFaq === 'rental-price' ? 'active' : ''}`}>
                <div className="faq-question" onClick={() => setActiveFaq(activeFaq === 'rental-price' ? null : 'rental-price')}>
                  <span>What is included in the rental price?</span>
                  <span className="faq-icon">{activeFaq === 'rental-price' ? '−' : '+'}</span>
                </div>
                <div className="faq-answer">
                  Included services are shown during the booking process and may vary depending on the Rental Provider. Please review the price details before confirming your reservation.
                </div>
              </div>

              <div className={`faq-item ${activeFaq === 'additional-fees' ? 'active' : ''}`}>
                <div className="faq-question" onClick={() => setActiveFaq(activeFaq === 'additional-fees' ? null : 'additional-fees')}>
                  <span>Are there any additional fees?</span>
                  <span className="faq-icon">{activeFaq === 'additional-fees' ? '−' : '+'}</span>
                </div>
                <div className="faq-answer">
                  Certain charges such as optional extras, local taxes, or young driver fees may be payable directly to the Rental Provider at pickup.
                </div>
              </div>

              <div className={`faq-item ${activeFaq === 'security-deposit' ? 'active' : ''}`}>
                <div className="faq-question" onClick={() => setActiveFaq(activeFaq === 'security-deposit' ? null : 'security-deposit')}>
                  <span>Is a security deposit required?</span>
                  <span className="faq-icon">{activeFaq === 'security-deposit' ? '−' : '+'}</span>
                </div>
                <div className="faq-answer">
                  Most Rental Providers require a refundable security deposit at pickup. Deposits are typically refunded within up to 30 business days after the rental ends, depending on the Rental Provider and the issuing bank.
                </div>
              </div>
            </div>
          </div>

          <div className="faq-category">
            <h3 className="faq-category-title">Booking Management</h3>
            <div className="faq-items">
              <div className={`faq-item ${activeFaq === 'modify-booking' ? 'active' : ''}`}>
                <div className="faq-question" onClick={() => setActiveFaq(activeFaq === 'modify-booking' ? null : 'modify-booking')}>
                  <span>Can I modify my booking?</span>
                  <span className="faq-icon">{activeFaq === 'modify-booking' ? '−' : '+'}</span>
                </div>
                <div className="faq-answer">
                  Booking modifications depend on the Rental Provider's terms. Please contact our support team for assistance.
                </div>
              </div>

              <div className={`faq-item ${activeFaq === 'cancel-booking' ? 'active' : ''}`}>
                <div className="faq-question" onClick={() => setActiveFaq(activeFaq === 'cancel-booking' ? null : 'cancel-booking')}>
                  <span>Can I cancel my booking?</span>
                  <span className="faq-icon">{activeFaq === 'cancel-booking' ? '−' : '+'}</span>
                </div>
                <div className="faq-answer">
                  Free cancellation is available up to 72 hours before the scheduled pickup time. For cancellations made within 72 hours of pickup, cancellation protection may be available for purchase during booking, subject to the applicable terms. Detailed cancellation, refund, and liability terms are governed by the Pre-Sale & Advance Booking Agreement.
                </div>
              </div>

              <div className={`faq-item ${activeFaq === 'flight-delayed' ? 'active' : ''}`}>
                <div className="faq-question" onClick={() => setActiveFaq(activeFaq === 'flight-delayed' ? null : 'flight-delayed')}>
                  <span>What happens if my flight is delayed?</span>
                  <span className="faq-icon">{activeFaq === 'flight-delayed' ? '−' : '+'}</span>
                </div>
                <div className="faq-answer">
                  If you have provided your flight details, some Rental Providers may monitor delays. However, we recommend contacting the Rental Provider directly in case of significant delays.
                </div>
              </div>
            </div>
          </div>

          <div className="faq-category">
            <h3 className="faq-category-title">Vehicle Pickup & Return</h3>
            <div className="faq-items">
              <div className={`faq-item ${activeFaq === 'documents-required' ? 'active' : ''}`}>
                <div className="faq-question" onClick={() => setActiveFaq(activeFaq === 'documents-required' ? null : 'documents-required')}>
                  <span>What documents are required at pickup?</span>
                  <span className="faq-icon">{activeFaq === 'documents-required' ? '−' : '+'}</span>
                </div>
                <div className="faq-answer">
                  You typically need a valid driver's license, a credit card in the main driver's name, and your booking confirmation. Additional documents may be required depending on the location.
                </div>
              </div>

              <div className={`faq-item ${activeFaq === 'cash-payment' ? 'active' : ''}`}>
                <div className="faq-question" onClick={() => setActiveFaq(activeFaq === 'cash-payment' ? null : 'cash-payment')}>
                  <span>Can I pay the remaining balance in cash?</span>
                  <span className="faq-icon">{activeFaq === 'cash-payment' ? '−' : '+'}</span>
                </div>
                <div className="faq-answer">
                  Accepted payment methods at pickup depend on the Rental Provider's policy. Please review the Rental Provider's terms before arrival.
                </div>
              </div>

              <div className={`faq-item ${activeFaq === 'additional-driver' ? 'active' : ''}`}>
                <div className="faq-question" onClick={() => setActiveFaq(activeFaq === 'additional-driver' ? null : 'additional-driver')}>
                  <span>Can someone else drive the car?</span>
                  <span className="faq-icon">{activeFaq === 'additional-driver' ? '−' : '+'}</span>
                </div>
                <div className="faq-answer">
                  Additional drivers may be allowed depending on the Rental Provider's policy and may be subject to an extra charge.
                </div>
              </div>
            </div>
          </div>

          <div className="faq-category">
            <h3 className="faq-category-title">Xdrive Mobility & Rental Providers</h3>
            <div className="faq-items">
              <div className={`faq-item ${activeFaq === 'rental-service' ? 'active' : ''}`}>
                <div className="faq-question" onClick={() => setActiveFaq(activeFaq === 'rental-service' ? null : 'rental-service')}>
                  <span>Who provides the rental service?</span>
                  <span className="faq-icon">{activeFaq === 'rental-service' ? '−' : '+'}</span>
                </div>
                <div className="faq-answer">
                  Xdrive Mobility operates as a booking and distribution platform. The car rental service is provided by local rental companies.
                </div>
              </div>

              <div className={`faq-item ${activeFaq === 'contact-issue' ? 'active' : ''}`}>
                <div className="faq-question" onClick={() => setActiveFaq(activeFaq === 'contact-issue' ? null : 'contact-issue')}>
                  <span>Who should I contact if I have an issue?</span>
                  <span className="faq-icon">{activeFaq === 'contact-issue' ? '−' : '+'}</span>
                </div>
                <div className="faq-answer">
                  For booking or online payment-related questions, please contact Xdrive Mobility support. For vehicle-related or on-site issues, please contact the Rental Provider directly.
                </div>
              </div>
            </div>
          </div>

          <div className="faq-category">
            <h3 className="faq-category-title">Insurance</h3>
            <div className="faq-items">
              <div className={`faq-item ${activeFaq === 'insurance' ? 'active' : ''}`}>
                <div className="faq-question" onClick={() => setActiveFaq(activeFaq === 'insurance' ? null : 'insurance')}>
                  <span>Does Xdrive Mobility sell insurance?</span>
                  <span className="faq-icon">{activeFaq === 'insurance' ? '−' : '+'}</span>
                </div>
                <div className="faq-answer">
                  No. Xdrive Mobility does not sell insurance products. Any insurance or protection options are offered solely by the Rental Provider under their own terms.
                </div>
              </div>
            </div>
          </div>

          <div className="faq-category">
            <h3 className="faq-category-title">General</h3>
            <div className="faq-items">
              <div className={`faq-item ${activeFaq === 'payment-secure' ? 'active' : ''}`}>
                <div className="faq-question" onClick={() => setActiveFaq(activeFaq === 'payment-secure' ? null : 'payment-secure')}>
                  <span>Is my payment secure?</span>
                  <span className="faq-icon">{activeFaq === 'payment-secure' ? '−' : '+'}</span>
                </div>
                <div className="faq-answer">
                  Yes. All online payments made through the Xdrive Mobility platform are processed using secure payment systems.
                </div>
              </div>

              <div className={`faq-item ${activeFaq === 'rental-terms' ? 'active' : ''}`}>
                <div className="faq-question" onClick={() => setActiveFaq(activeFaq === 'rental-terms' ? null : 'rental-terms')}>
                  <span>Where can I find the full rental terms?</span>
                  <span className="faq-icon">{activeFaq === 'rental-terms' ? '−' : '+'}</span>
                </div>
                <div className="faq-answer">
                  The full rental terms and conditions are available during the booking process and in your confirmation email.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Airports Section */}
      <section id="airports" className="airports-section">
        <div className="container">
          <h2 className="airports-title">Airports</h2>
          <p className="airports-description">
            Select an airport location to view available vehicles
          </p>
          
          {loading ? (
            <div className="airports-loading">Loading airports...</div>
          ) : airports.length === 0 ? (
            <div className="airports-empty">No airport locations found</div>
          ) : (
            <div className="airports-grid">
              {airports.map((airport, index) => {
                const locationId = airport.location_id || airport.Location_ID
                const locationName = airport.location_name || airport.Location_Name || 'Unknown Airport'
                const address = airport.address || airport.Address || ''
                const flag = getCountryFlag(airport)
                
                return (
                  <div 
                    key={locationId || index} 
                    className="airport-card"
                    onClick={() => handleAirportClick(airport)}
                  >
                    <div className="airport-flag">{flag}</div>
                    <div className="airport-info">
                      <h3 className="airport-name">{locationName}</h3>
                      {address && <p className="airport-address">{address}</p>}
                    </div>
                    <div className="airport-arrow">→</div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </section>

    </div>
  )
}

export default Home
