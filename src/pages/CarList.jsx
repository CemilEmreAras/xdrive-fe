import { useState, useEffect, useRef, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { getCars, getLocations } from '../services/api'
import LoadingOverlay from '../components/LoadingOverlay'
import { useCurrency } from '../context/CurrencyContext'
import SEO from '../components/SEO'

function CarList() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { currency, getCurrencySymbol, convertPriceSync } = useCurrency()
  const currencySymbol = getCurrencySymbol()
  const [allCars, setAllCars] = useState([])
  const [cars, setCars] = useState([])
  const [loading, setLoading] = useState(true)
  const [locations, setLocations] = useState([])


  const [filters, setFilters] = useState({
    category: '',
    transmission: '',
    minPrice: 0,
    maxPrice: 750,
    pickupLocation: '',
    sortBy: 'price',
    order: 'asc'
  })

  // Collapsible sections state
  const [expandedSections, setExpandedSections] = useState({
    price: true,
    pickupLocation: true,
    carType: true,
    transmission: true
  })

  // Load locations
  useEffect(() => {
    const loadLocations = async () => {
      try {
        const locs = await getLocations()
        setLocations(locs || [])
      } catch (error) {
        console.error('Error loading locations:', error)
      }
    }
    loadLocations()
  }, [])

  // Filtreleri uygula
  useEffect(() => {
    if (allCars.length === 0) {
      setCars([])
      return
    }

    let filtered = [...allCars]

    // Category filter - strictly based on group_str, default to STANDARD if missing
    if (filters.category) {
      filtered = filtered.filter(car => {
        const carGroupStr = (car.group_str || car.groupStr || car.Group_Str || 'STANDARD').trim().toUpperCase()
        const filterCategory = (filters.category || '').trim().toUpperCase()

        // Direkt group_str eşleşmesi (case-insensitive), missing values default to STANDARD
        return carGroupStr === filterCategory
      })
    }

    // Vites filtresi
    if (filters.transmission) {
      filtered = filtered.filter(car => {
        const carTransmission = (car.transmission || car.Transmission || '').toLowerCase()
        if (filters.transmission === 'Manual') {
          return carTransmission.includes('manuel') || carTransmission.includes('manual') || carTransmission === 'm'
        } else if (filters.transmission === 'Automatic') {
          return carTransmission.includes('otomatik') || carTransmission.includes('automatic') || carTransmission.includes('auto') || carTransmission === 'o'
        }
        return true
      })
    }

    // Fiyat filtresi
    if (filters.minPrice > 0) {
      filtered = filtered.filter(car => {
        const totalPrice = car.totalPrice || car.Total_Rental || car.total_Rental || 0
        const pricePerDay = car.pricePerDay || car.Daily_Rental || car.daily_Rental || 0
        const price = totalPrice > 0 ? totalPrice : pricePerDay
        return price >= filters.minPrice
      })
    }

    if (filters.maxPrice < 750) {
      filtered = filtered.filter(car => {
        const totalPrice = car.totalPrice || car.Total_Rental || car.total_Rental || 0
        const pricePerDay = car.pricePerDay || car.Daily_Rental || car.daily_Rental || 0
        const price = totalPrice > 0 ? totalPrice : pricePerDay
        return price <= filters.maxPrice
      })
    }

    // Sıralama
    filtered.sort((a, b) => {
      let aValue = 0
      let bValue = 0

      if (filters.sortBy === 'price') {
        aValue = a.totalPrice || a.Total_Rental || a.total_Rental || a.pricePerDay || a.Daily_Rental || a.daily_Rental || 0
        bValue = b.totalPrice || b.Total_Rental || b.total_Rental || b.pricePerDay || b.Daily_Rental || b.daily_Rental || 0
      }

      if (filters.order === 'asc') {
        return aValue - bValue
      } else {
        return bValue - aValue
      }
    })

    setCars(filtered)
  }, [allCars, filters])

  useEffect(() => {
    const fetchCars = async () => {
      try {
        setLoading(true)
        const params = {
          pickupId: searchParams.get('pickupId') || '',
          dropoffId: searchParams.get('dropoffId') || '',
          pickupDate: searchParams.get('pickupDate') || '',
          dropoffDate: searchParams.get('dropoffDate') || '',
          currency: currency
        }

        const carsData = await getCars(params)
        setAllCars(carsData || [])
      } catch (error) {
        console.error('Error loading cars:', error)
        setAllCars([])
        setCars([])
      } finally {
        setLoading(false)
      }
    }

    fetchCars()
  }, [searchParams, currency])

  const handleFilterChange = (key, value) => {
    setFilters(prevFilters => ({ ...prevFilters, [key]: value }))
  }

  const resetFilters = () => {
    setFilters({
      category: '',
      transmission: '',
      minPrice: 0,
      maxPrice: 750,
      pickupLocation: '',
      sortBy: 'price',
      order: 'asc'
    })
  }

  // Date format: "13.01.2026"
  const formatDate = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const year = date.getFullYear()
    return `${day}.${month}.${year}`
  }

  // Date format: "14 Jan, 2026"
  const formatDateShort = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const day = date.getDate()
    const month = months[date.getMonth()]
    const year = date.getFullYear()
    return `${day} ${month}, ${year}`
  }

  // Time format: "12:00"
  const formatTime = (timeString) => {
    if (!timeString) return '12:00'
    return timeString
  }

  // Get location name
  const getLocationName = (locationId) => {
    if (!locationId) return ''
    const location = locations.find(loc =>
      (loc.location_id || loc.Location_ID) === locationId
    )
    if (location) {
      let name = location.location_name || location.Location_Name || ''
      // IN_Terminal yerine airport yaz
      name = name.replace(/IN_Terminal/gi, 'Airport').replace(/IN Terminal/gi, 'Airport')
      return name
    }
    let name = searchParams.get('pickupLocationName') || ''
    // IN_Terminal yerine airport yaz
    name = name.replace(/IN_Terminal/gi, 'Airport').replace(/IN Terminal/gi, 'Airport')
    return name
  }

  const pickupLocationName = getLocationName(searchParams.get('pickupId'))
  const dropoffLocationName = getLocationName(searchParams.get('dropoffId'))
  const pickupDate = searchParams.get('pickupDate')
  const dropoffDate = searchParams.get('dropoffDate')
  const pickupTime = searchParams.get('pickupTime') || '12:00'
  const dropoffTime = searchParams.get('dropoffTime') || '12:00'

  // Map pickup location to rental conditions document URL
  const getRentalConditionsUrl = () => {
    const nameCombined = `${pickupLocationName || ''} ${dropoffLocationName || ''}`.toLowerCase()

    const configs = [
      {
        keywords: ['new zealand', 'auckland'],
        file: 'auckland-new-zealand-vehicle-rental-terms-conditions.pdf'
      },
      {
        keywords: ['bahamas', 'nassau'],
        file: 'bahamas-vehicle-rental-terms-conditions.pdf'
      },
      {
        keywords: ['baku', 'azerbaijan', 'gyd'],
        file: 'baku-azerbaijan-vehicle-rental-terms-conditions.pdf'
      },
      {
        keywords: ['barbados', 'bridgetown'],
        file: 'barbados-vehicle-rental-terms-conditions.pdf'
      },
      {
        keywords: ['bulgaria', 'bulgaristan', 'sofia', 'varna'],
        file: 'bulgaria-vehicle-rental-terms-conditions.pdf'
      },
      {
        keywords: ['fiji', 'nadi', 'suva', 'nan'],
        file: 'fiji-vehicle-rental-terms-conditions.pdf'
      },
      {
        keywords: ['jordan', 'amman', 'queen alia', 'amm'],
        file: 'jordan-vehicle-rental-terms-conditions.pdf'
      },
      {
        keywords: ['malaysia', 'malezya', 'kuala lumpur', 'kul', 'penang', 'pen'],
        file: 'malaysia-vehicle-rental-terms-conditions.pdf'
      },
      {
        keywords: ['mauritius'],
        file: 'mauritius-vehicle-rental-terms-conditions.pdf'
      },
      {
        keywords: ['mexico', 'meksika', 'cancun', 'cun', 'mexico city'],
        file: 'mexico-vehicle-rental-terms-conditions.pdf'
      },
      {
        keywords: ['miami', 'mia', 'orlando', 'mco', 'usa'],
        file: 'miami-usa-vehicle-rental-terms-conditions.pdf'
      },
      {
        keywords: ['oman', 'muscat', 'salalah'],
        file: 'oman-vehicle-rental-terms-conditions.pdf'
      },
      {
        keywords: ['morocco', 'fas', 'agadir', 'marrakesh', 'marrakech', 'casablanca', 'rabat'],
        file: 'morocco-vehicle-rental-terms-conditions.pdf'
      },
      {
        keywords: [
          'sint maarten',
          'sint martin',
          'st maarten',
          'st. maarten',
          'st martin',
          'philipsburg',
          'princess juliana',
          'sxm'
        ],
        file: 'sint-maarten-vehicle-rental-terms-conditions.pdf'
      },
      {
        keywords: ['sri lanka', 'colombo'],
        file: 'sri-lanka-vehicle-rental-terms-conditions.pdf'
      },
      {
        keywords: ['sydney', 'syd', 'australia'],
        file: 'sydney-australia-vehicle-rental-terms-conditions.pdf'
      },
      {
        keywords: ['trinidad', 'tobago', 'port of spain'],
        file: 'trinidad-and-tobago-vehicle-rental-terms-conditions.pdf'
      },
      {
        keywords: ['zambia', 'lusaka', 'livingstone', 'ndola', 'solwezi', 'kenneth kaunda', 'lun'],
        file: 'zambia-vehicle-rental-terms-conditions.pdf'
      },
      {
        keywords: ['zanzibar', 'tanzania'],
        file: 'zanzibar-tanzania-vehicle-rental-terms-conditions.pdf'
      }
    ]

    for (const cfg of configs) {
      const match = cfg.keywords.some((kw) => nameCombined.includes(kw))
      if (match) {
        return `/docs/rental-conditions/${cfg.file}`
      }
    }

    return null
  }

  // Calculate number of days
  const calculateDays = () => {
    if (!pickupDate || !dropoffDate) return 1
    const pickup = new Date(pickupDate)
    const dropoff = new Date(dropoffDate)
    const diffTime = Math.abs(dropoff - pickup)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays > 0 ? diffDays : 1
  }

  const days = calculateDays()

  // Get all unique group_str values from API data (normalized as UPPERCASE)
  // If group_str is missing, default to STANDARD
  const availableCategories = useMemo(() => {
    const categories = new Set()
    allCars.forEach(car => {
      const groupStr = (car.group_str || car.groupStr || car.Group_Str || 'STANDARD').trim()
      categories.add(groupStr.toUpperCase())
    })
    return Array.from(categories).sort()
  }, [allCars])

  // Calculate max price
  const maxPrice = allCars.length > 0 ? Math.max(...allCars.map(car => {
    const totalPrice = car.totalPrice || car.Total_Rental || car.total_Rental || 0
    const pricePerDay = car.pricePerDay || car.Daily_Rental || car.daily_Rental || 0
    return totalPrice > 0 ? totalPrice : pricePerDay * days
  }), 750) : 750

  // Reset filters
  const handleResetFilters = () => {
    setFilters({
      category: '',
      transmission: '',
      minPrice: 0,
      maxPrice: maxPrice,
      pickupLocation: '',
      sortBy: 'price',
      order: 'asc'
    })
  }

  // Toggle section
  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  if (loading) {
    return <LoadingOverlay />
  }



  return (
    <>
      <SEO
        title={t('seo.cars.title')}
        description={t('seo.cars.description')}
        keywords={t('seo.cars.keywords')}
      />
      <div className="py-5 sm:py-5 md:py-5 bg-[#f5f5f5] min-h-screen overflow-x-hidden w-full">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-5 md:px-5 box-border">
          {/* Search Summary Card */}
          <div className="bg-white rounded-xl p-5 sm:p-5 md:p-6 mb-5 flex flex-col md:flex-row items-stretch md:items-center gap-4 md:gap-5 shadow-[0_2px_8px_rgba(0,0,0,0.1)]">
            <div className="flex-1 flex flex-col gap-1">
              <div className="text-sm font-medium text-[#333] leading-snug break-words overflow-wrap-anywhere">
                {pickupLocationName || 'Location not specified'}
              </div>
              <div className="text-[13px] text-[#666] leading-snug">
                {pickupDate ? formatDateShort(pickupDate) : 'Select date'} {formatTime(pickupTime)}
              </div>
            </div>
            <div className="relative flex items-center justify-center w-full md:w-10 h-[30px] md:h-auto flex-shrink-0">
              <div className="absolute left-0 md:left-1/2 top-1/2 md:top-0 md:bottom-0 w-full md:w-[1px] h-[1px] md:h-full bg-[#e5e7eb] transform md:translate-x-[-50%] translate-y-[-50%]"></div>
              <svg className="relative z-[1] bg-white p-1 transform md:rotate-0 rotate-90" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 18L15 12L9 6" stroke="#999" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div className="flex-1 flex flex-col gap-1 w-full md:w-auto md:items-start">
              <div className="text-sm font-medium text-[#333] leading-snug break-words overflow-wrap-anywhere">
                {dropoffLocationName || pickupLocationName || 'Location not specified'}
              </div>
              <div className="text-[13px] text-[#666] leading-snug">
                {dropoffDate ? formatDateShort(dropoffDate) : 'Select date'} {formatTime(dropoffTime)}
              </div>
            </div>
            <button className="bg-[#ff6b35] text-white border-none py-2.5 px-6 rounded-[20px] text-sm font-bold uppercase cursor-pointer transition-colors flex-shrink-0 whitespace-nowrap w-full md:w-auto text-center mt-2 md:mt-0 hover:bg-[#059669]" onClick={() => navigate('/')}>
              EDIT
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-5">
            {/* Filter Sidebar */}
            <aside className="w-full md:w-auto">
              {/* Filter Panel */}
              <div className="bg-white p-5 rounded-lg shadow-[0_2px_4px_rgba(0,0,0,0.1)] h-fit md:sticky md:top-5 mt-5 md:static">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="m-0 text-lg font-bold text-[#1a1a1a]">{t('carList.filter')}</h3>
                  <button className="bg-none border-none text-[#1a1a1a] text-sm font-normal cursor-pointer p-0 hover:underline" onClick={handleResetFilters}>{t('carList.reset')}</button>
                </div>
                <div className="h-[1px] bg-[#e5e7eb] mb-5"></div>

                {/* Car Type Section */}
                <div className="mb-5 border-b border-[#e5e7eb] pb-4 last:border-b-0 last:mb-0 last:pb-0">
                  <div className="flex justify-between items-center cursor-pointer font-bold text-[#1a1a1a] text-sm mb-3 select-none" onClick={() => toggleSection('carType')}>
                    <h4 className="m-0 text-sm font-bold text-[#1a1a1a]">{t('carList.carType')}</h4>
                    <svg
                      className={`w-4 h-4 transition-transform flex-shrink-0 ${expandedSections.carType ? 'rotate-180' : ''}`}
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M6 9L12 15L18 9" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  {expandedSections.carType && (
                    <div className="pl-0 mt-3">
                      {availableCategories.length > 0 ? (
                        availableCategories.map((category) => (
                          <label key={category} className="flex items-center gap-2.5 py-2 cursor-pointer text-sm text-[#333]">
                            <input
                              type="radio"
                              name="carType"
                              value={category}
                              checked={filters.category === category}
                              onChange={(e) => handleFilterChange('category', category)}
                              className="w-[18px] h-[18px] cursor-pointer accent-[#9333EA] m-0"
                            />
                            <span className="select-none">{category}</span>
                          </label>
                        ))
                      ) : (
                        // Fallback: Eğer henüz kategori yoksa eski seçenekleri göster
                        <>
                          <label className="flex items-center gap-2.5 py-2 cursor-pointer text-sm text-[#333]">
                            <input
                              type="radio"
                              name="carType"
                              value="Mini"
                              checked={filters.category === 'mini'}
                              onChange={(e) => handleFilterChange('category', 'mini')}
                              className="w-[18px] h-[18px] cursor-pointer accent-[#9333EA] m-0"
                            />
                            <span className="select-none">Mini</span>
                          </label>
                          <label className="flex items-center gap-2.5 py-2 cursor-pointer text-sm text-[#333]">
                            <input
                              type="radio"
                              name="carType"
                              value="Economy"
                              checked={filters.category === 'economy'}
                              onChange={(e) => handleFilterChange('category', 'economy')}
                              className="w-[18px] h-[18px] cursor-pointer accent-[#9333EA] m-0"
                            />
                            <span className="select-none">Economy</span>
                          </label>
                          <label className="flex items-center gap-2.5 py-2 cursor-pointer text-sm text-[#333]">
                            <input
                              type="radio"
                              name="carType"
                              value="Compact"
                              checked={filters.category === 'compact'}
                              onChange={(e) => handleFilterChange('category', 'compact')}
                              className="w-[18px] h-[18px] cursor-pointer accent-[#9333EA] m-0"
                            />
                            <span className="select-none">Compact</span>
                          </label>
                          <label className="flex items-center gap-2.5 py-2 cursor-pointer text-sm text-[#333]">
                            <input
                              type="radio"
                              name="carType"
                              value="Intermediate"
                              checked={filters.category === 'intermediate'}
                              onChange={(e) => handleFilterChange('category', 'intermediate')}
                              className="w-[18px] h-[18px] cursor-pointer accent-[#9333EA] m-0"
                            />
                            <span className="select-none">Intermediate</span>
                          </label>
                          <label className="flex items-center gap-2.5 py-2 cursor-pointer text-sm text-[#333]">
                            <input
                              type="radio"
                              name="carType"
                              value="Standard"
                              checked={filters.category === 'standard'}
                              onChange={(e) => handleFilterChange('category', 'standard')}
                              className="w-[18px] h-[18px] cursor-pointer accent-[#9333EA] m-0"
                            />
                            <span className="select-none">Standard</span>
                          </label>
                        </>
                      )}
                    </div>
                  )}
                </div>

                {/* Transmission Section */}
                <div className="mb-5 border-b border-[#e5e7eb] pb-4 last:border-b-0 last:mb-0 last:pb-0">
                  <div className="flex justify-between items-center cursor-pointer font-bold text-[#1a1a1a] text-sm mb-3 select-none" onClick={() => toggleSection('transmission')}>
                    <h4 className="m-0 text-sm font-bold text-[#1a1a1a]">{t('carList.transmission')}</h4>
                    <svg
                      className={`w-4 h-4 transition-transform flex-shrink-0 ${expandedSections.transmission ? 'rotate-180' : ''}`}
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M6 9L12 15L18 9" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  {expandedSections.transmission && (
                    <div className="pl-0 mt-3">
                      <label className="flex items-center gap-2.5 py-2 cursor-pointer text-sm text-[#333]">
                        <input
                          type="radio"
                          name="transmission"
                          value="MANUAL"
                          checked={filters.transmission === 'Manual'}
                          onChange={(e) => handleFilterChange('transmission', 'Manual')}
                          className="w-[18px] h-[18px] cursor-pointer accent-[#9333EA] m-0"
                        />
                        <span className="select-none">{t('common.manual').toUpperCase()}</span>
                      </label>
                      <label className="flex items-center gap-2.5 py-2 cursor-pointer text-sm text-[#333]">
                        <input
                          type="radio"
                          name="transmission"
                          value="AUTOMATIC"
                          checked={filters.transmission === 'Automatic'}
                          onChange={(e) => handleFilterChange('transmission', 'Automatic')}
                          className="w-[18px] h-[18px] cursor-pointer accent-[#9333EA] m-0"
                        />
                        <span className="select-none">{t('common.automatic').toUpperCase()}</span>
                      </label>
                    </div>
                  )}
                </div>
              </div>
            </aside>

            {/* Main Content */}
            <main className="flex flex-col gap-5">


              {/* Offers Count and Sort */}
              <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 sm:gap-0 bg-white p-4 sm:p-5 rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.1)] mb-5">
                <div className="text-base font-semibold text-[#1a1a1a]">{cars.length} {t('carList.offersFound')}</div>
                <select
                  className="p-2 px-3 border border-[#e5e7eb] rounded-md text-sm bg-white cursor-pointer text-[#333] w-full sm:w-auto"
                  value={`${filters.sortBy}-${filters.order}`}
                  onChange={(e) => {
                    const [sortBy, order] = e.target.value.split('-')
                    handleFilterChange('sortBy', sortBy)
                    handleFilterChange('order', order)
                  }}
                >
                  <option value="price-asc">{t('carList.sortBy')}: {t('carList.priceLowToHigh')}</option>
                  <option value="price-desc">{t('carList.sortBy')}: {t('carList.priceHighToLow')}</option>
                  <option value="popular-asc">Sort by Most popular</option>
                </select>
              </div>

              {/* Car Listings */}
              <div className="flex flex-col gap-5">
                {cars.length === 0 ? (
                  <div className="text-center py-[60px] px-5 text-lg text-[#666] bg-white rounded-lg shadow-[0_2px_4px_rgba(0,0,0,0.1)]">
                    <h3 className="text-[#333] mb-4 text-2xl">{t('carList.noCarsFound')}</h3>
                    <p>{t('carList.noCarsMessage')}</p>
                  </div>
                ) : (
                  cars.map((car, index) => {
                    const totalPrice = car.totalPrice || car.Total_Rental || car.total_Rental || 0
                    const pricePerDay = car.pricePerDay || car.Daily_Rental || car.daily_Rental || 0
                    const basePrice = totalPrice > 0 ? totalPrice : pricePerDay * days
                    const finalPriceEUR = basePrice * 1.1 // %10 komisyon eklendi
                    const finalPrice = convertPriceSync(finalPriceEUR) // Convert to selected currency
                    const dailyPrice = pricePerDay > 0 ? pricePerDay : (totalPrice > 0 ? totalPrice / days : 0)

                    // Category must come directly from group_str (normalized)
                    const categoryRaw = (car.group_str || car.groupStr || car.Group_Str || 'STANDARD').trim().toUpperCase()
                    // Translate category
                    const categoryMap = {
                      'STANDARD': t('common.standard'),
                      'MINI': t('common.mini'),
                      'ECONOMY': t('common.economy'),
                      'COMPACT': t('common.compact'),
                      'INTERMEDIATE': t('common.intermediate'),
                      'MIDSIZE': t('common.midsize')
                    }
                    const categoryTag = categoryMap[categoryRaw] || categoryRaw.charAt(0) + categoryRaw.slice(1).toLowerCase()

                    const transmission = (car.transmission || car.Transmission || '').toLowerCase()
                    const isManual = transmission.includes('manuel') || transmission.includes('manual') || transmission === 'm'
                    const transmissionText = isManual ? t('common.manual') : t('common.automatic')

                    // Fuel type translation
                    const fuelType = (car.fuel_type || car.Fuel || 'Petrol').toLowerCase()
                    const isDiesel = fuelType.includes('diesel') || fuelType.includes('dizel')
                    const fuelText = isDiesel ? t('common.diesel') : t('common.petrol')

                    const seats = car.seats || car.Seats || car.chairs || car.Chairs || 5
                    const bags = car.smallBags || car.small_bags || car.Small_Bags || car.bags || car.Bags || 2

                    const depositValueRaw = car.provision
                    const depositValueEUR = typeof depositValueRaw === 'number'
                      ? depositValueRaw
                      : Number(depositValueRaw || 0)
                    const depositValue = convertPriceSync(depositValueEUR) // Convert to selected currency
                    const isZeroDeposit = !depositValue || depositValue === 0

                    return (
                      <div key={car._id || car.externalId || index} className="bg-white rounded-xl p-4 shadow-[0_2px_8px_rgba(0,0,0,0.1)] mb-5">
                        <div className="grid grid-cols-1 md:grid-cols-[300px_250px_1fr] gap-6 items-start">
                          <div className="flex flex-col gap-0 justify-between h-full w-full md:w-auto">
                            <div className="w-full h-[180px] sm:h-[200px] md:h-[180px] rounded-lg overflow-hidden flex items-center justify-center bg-transparent mt-12 md:mt-12">
                              <img
                                src={car.image || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iI2Y1ZjVmNSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjAiIGZpbGw9IiM5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5BcmHDpyBSZXNtaTwvdGV4dD48L3N2Zz4='}
                                alt={`${car.brand || car.Brand} ${car.model || car.Car_Name}`}
                                className="max-w-full max-h-full w-auto h-auto object-contain block"
                                onError={(e) => {
                                  if (!e.target.src.includes('data:image/svg+xml')) {
                                    e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iI2Y1ZjVmNSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjAiIGZpbGw9IiM5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5BcmHDpyBSZXNtaTwvdGV4dD48L3N2Zz4='
                                  }
                                }}
                                loading="lazy"
                              />
                            </div>
                            <img
                              src="/images/logo-navbar.svg"
                              alt="XDrive Logo"
                              className="w-[100px] mt-auto mb-2"
                            />
                          </div>

                          <div className="flex flex-col gap-4">
                            <div className="flex flex-col gap-1">
                              <div className="flex items-center gap-3 flex-wrap">
                                <h3 className="text-xl font-bold text-[#1a1a1a] m-0">
                                  {(car.brand || car.Brand || '').toUpperCase()} {(car.model || car.Car_Name || '').toUpperCase()} or similar
                                </h3>
                                <span className="bg-[#f3f4f6] text-[#666] px-2.5 py-1 rounded text-xs font-semibold">{categoryTag}</span>
                              </div>
                              <p className="text-sm text-[#4b5563] font-medium capitalize">
                                {categoryTag} · {transmissionText} · {seats} {t('carList.seats')}
                              </p>
                            </div>

                            <div className="bg-[#f9fafb] rounded-lg p-4">
                              <div
                                className="text-sm font-semibold mb-3"
                                style={{ color: isManual ? '#ef4444' : '#0066FF' }}
                              >
                                {transmissionText}
                              </div>
                              <div className="flex flex-col gap-2">
                                <div className="flex items-center gap-1.5 text-sm text-[#333]">
                                  {/* seats icon (person) */}
                                  <svg className="flex-shrink-0" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" fill="#333" />
                                  </svg>
                                  <span>{seats} {t('carList.seats')}</span>
                                </div>
                                <div className="flex items-center gap-1.5 text-sm text-[#333]">
                                  {/* bags icon (suitcase) */}
                                  <svg className="flex-shrink-0" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M19 6h-4V3c0-1.1-.9-2-2-2h-2c-1.1 0-2 .9-2 2v3H5c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-6 0h-2V3.5h2V6z" fill="#333" />
                                  </svg>
                                  <span>{bags} {t('carList.smallSuitcase')}</span>
                                </div>
                                <div className="flex items-center gap-1.5 text-sm text-[#333]">
                                  {/* Fuel icon */}
                                  <svg className="flex-shrink-0" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M19.77 7.23l.01-.01-3.72-3.72L15 4.56l2.11 2.11c-.94.36-1.61 1.26-1.61 2.33 0 1.38 1.12 2.5 2.5 2.5.36 0 .69-.08.98-.21L19 21h2V9h-1.23zM7 2h6v2H7V2zm0 4h6v2H7V6zm0 4h6v2H7v-2zM5 2c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2H5zm0 18V4h14v16H5z" fill="#333" />
                                  </svg>
                                  <span>{fuelText}</span>
                                </div>
                                <div className="flex items-center gap-1.5 text-sm text-[#333]">
                                  {/* Doors icon */}
                                  <svg className="flex-shrink-0" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M19 19H5V5H19V19ZM5 3C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3H5ZM13 17H17V13H13V17ZM9 13H5V17H9V13ZM10.5 5H5V10.5H10.5V5ZM19 10.5H13.5V5H19V10.5Z" fill="#333" />
                                  </svg>
                                  <span>{car.doors || car.Doors || 5} {t('carList.doors')}</span>
                                </div>
                                <div className="flex items-center gap-1.5 text-sm text-[#333]">
                                  {/* AC icon */}
                                  <svg className="flex-shrink-0" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M14 18l1.4-1.4 3 6-5.8-.8c-.7-.3-.6-1.3-.1-1.8.8-1 1.5-2 1.5-2zm-6.5-6h13c1.1 0 2 .9 2 2v5c0 1.1-.9 2-2 2h-13c-1.1 0-2-.9-2-2v-5c0-1.1.9-2 2-2zm-2.8-5h18.6c1.1 0 2 .9 2 2v2h-22.6v-2c0-1.1.9-2 2-2z" fill="#333" />
                                  </svg>
                                  <span>{car.air_conditioning || car.AirCondition || 'A/C'}</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-col gap-3">
                            <div className="mb-0">
                              <button
                                type="button"
                                className="text-[#0066FF] underline text-sm font-medium bg-none border-none p-0 cursor-pointer"
                                onClick={(e) => {
                                  e.preventDefault()
                                  const url = getRentalConditionsUrl()
                                  if (url) {
                                    window.open(url, '_blank', 'noopener,noreferrer')
                                  } else {
                                    alert('Rental conditions are not available for this location yet.')
                                  }
                                }}
                              >
                                {t('carList.rentalConditions')}
                              </button>
                            </div>

                            <div className="flex flex-col gap-2 p-3 bg-[#f9fafb] rounded-md mt-1">
                              <div className="flex items-center gap-2 text-sm font-semibold text-[#1a1a1a]">
                                <svg className="flex-shrink-0" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M21 16V14L13 9V3.5C13 2.67 12.33 2 11.5 2C10.67 2 10 2.67 10 3.5V9L2 14V16L10 13.5V19L8 20.5V22L11.5 21L15 22V20.5L13 19V13.5L21 16Z" fill="#0066FF" />
                                </svg>
                                <span>{pickupLocationName || 'Location not specified'}</span>
                              </div>
                              <div className="flex items-center gap-2 text-[13px] text-[#ff6b35] font-medium">
                                <svg className="flex-shrink-0" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M4 16C4 16.88 4.39 17.67 5 18.22V20C5 20.55 5.45 21 6 21H7C7.55 21 8 20.55 8 20V19H16V20C16 20.55 16.45 21 17 21H18C18.55 21 19 20.55 19 20V18.22C19.61 17.67 20 16.88 20 16V6C20 4.9 19.1 4 18 4H6C4.9 4 4 4.9 4 6V16ZM6 6H18V16H6V6ZM7.5 7C7.22 7 7 7.22 7 7.5V10.5C7 10.78 7.22 11 7.5 11H10.5C10.78 11 11 10.78 11 10.5V7.5C11 7.22 10.78 7 10.5 7H7.5ZM13 7H16.5C16.78 7 17 7.22 17 7.5V10.5C17 10.78 16.78 11 16.5 11H13V7ZM7 12H17V14H7V12Z" fill="#ff6b35" />
                                </svg>
                                <span>{t('carList.freeShuttle')}</span>
                              </div>
                            </div>

                            <div className="flex flex-col gap-2.5 mt-1">
                              <div className="relative inline-flex items-center gap-2 text-sm text-[#333] group">
                                <span className={isZeroDeposit ? 'text-[#15803d] font-bold' : ''}>
                                  {isZeroDeposit ? t('carList.zeroDeposit') : t('carList.averageDeposit')}
                                </span>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0 cursor-help">
                                  <circle cx="12" cy="12" r="10" stroke="#666" strokeWidth="2" fill="none" />
                                  <path d="M12 16V12M12 8H12.01" stroke="#666" strokeWidth="2" strokeLinecap="round" />
                                </svg>
                                <span className="invisible group-hover:visible absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-[220px] bg-[#333] text-white text-center rounded-md py-2 px-3 text-[13px] font-medium shadow-[0_4px_6px_rgba(0,0,0,0.15)] leading-snug opacity-0 group-hover:opacity-100 transition-opacity z-[100] pointer-events-none">
                                  Deposit: {currencySymbol}{depositValue.toFixed(2)}
                                  <span className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1 border-4 border-transparent border-t-[#333]"></span>
                                </span>
                              </div>
                              <div className="flex items-center gap-2 text-sm text-[#333]">
                                <svg className="flex-shrink-0" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" fill="#F59E0B" />
                                </svg>
                                <span>{t('carList.instantConfirmation')}</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm text-[#333]">
                                <svg className="flex-shrink-0" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M9 16.17L4.83 12L3.41 13.41L9 19L21 7L19.59 5.59L9 16.17Z" fill="#ff6b35" />
                                </svg>
                                <span>
                                  {(() => {
                                    const kmLimitRaw = car.km_limit || car.kmLimit || car.Km_Limit || car.KmLimit || 0
                                    const kmLimit = typeof kmLimitRaw === 'string' ? parseFloat(kmLimitRaw) : (typeof kmLimitRaw === 'number' ? kmLimitRaw : 0)
                                    return kmLimit && kmLimit > 0 && !isNaN(kmLimit)
                                      ? `${kmLimit} km/day included mileage`
                                      : t('carList.unlimitedMileage')
                                  })()}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 text-sm text-[#333]">
                                <svg className="flex-shrink-0" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M9 16.17L4.83 12L3.41 13.41L9 19L21 7L19.59 5.59L9 16.17Z" fill="#ff6b35" />
                                </svg>
                                <span>{t('carList.payNow')}</span>
                              </div>
                            </div>

                            <div className="flex flex-col gap-3 pt-4 mt-1 border-t border-[#e5e7eb]">
                              <div className="text-sm text-[#666]">{t('carList.priceFor')} {days} {t('carList.days')}:</div>
                              <div className="text-2xl sm:text-3xl md:text-[32px] font-bold text-[#1a1a1a]">{currencySymbol}{finalPrice.toFixed(2)}</div>
                              <Link
                                to={`/reservation/${car._id || car.externalId || car.rezId || car.carsParkId || 'unknown'}`}
                                state={{
                                  car: {
                                    ...car,
                                    rezId: car.rezId || car.Rez_ID || car.rez_ID || car.RezID,
                                    carsParkId: car.carsParkId || car.Cars_Park_ID || car.cars_Park_ID || car.CarsParkID,
                                    groupId: car.groupId || car.Group_ID || car.group_ID || car.GroupID,
                                    location: car.location || {
                                      pickupId: searchParams.get('pickupId'),
                                      dropoffId: searchParams.get('dropoffId')
                                    },
                                    // Extras verilerini koru
                                    extras: car.extras || car.Extras || null
                                  },
                                  searchParams: {
                                    ...Object.fromEntries(searchParams),
                                    pickupLocationName: searchParams.get('pickupLocationName'),
                                    dropoffLocationName: searchParams.get('dropoffLocationName')
                                  }
                                }}
                                className="bg-[#0066FF] text-white border-none py-3.5 px-6 rounded-md text-base font-semibold text-center no-underline cursor-pointer transition-colors inline-block w-full hover:bg-[#0052CC]"
                              >
                                {t('carList.makeDeal')}
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })
                )}
              </div>
            </main>
          </div>
        </div>
      </div>
    </>
  )
}

export default CarList
