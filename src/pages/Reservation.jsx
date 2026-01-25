import { useState, useEffect, useMemo } from 'react'
import { useParams, useNavigate, useLocation, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { createReservation, getCar, getLocations } from '../services/api'
import PayTRPayment from '../components/PayTRPayment';
import { useCurrency } from '../context/CurrencyContext'
// import { loadStripe } from '@stripe/stripe-js';
// import { Elements } from '@stripe/react-stripe-js';
// import PaymentForm from '../components/PaymentForm';

// const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_placeholder');
const isDev = import.meta.env.DEV

function Reservation() {
  const { t, i18n } = useTranslation()
  const { carId } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const { currency, getCurrencySymbol, convertPriceSync } = useCurrency()
  const currencySymbol = getCurrencySymbol()
  const [urlSearchParams] = useSearchParams() // URL'den direkt parametreleri al
  const [car, setCar] = useState(location.state?.car || null)
  const [searchParams] = useState(location.state?.searchParams || {})
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [showPayment, setShowPayment] = useState(false);

  // URL'den direkt tarihleri al (öncelikli)
  const urlPickupDate = urlSearchParams.get('pickupDate')
  const urlDropoffDate = urlSearchParams.get('dropoffDate')
  const urlPickupTime = urlSearchParams.get('pickupTime')
  const urlDropoffTime = urlSearchParams.get('dropoffTime')
  const urlPickupLocationName = urlSearchParams.get('pickupLocationName')
  const urlDropoffLocationName = urlSearchParams.get('dropoffLocationName')

  // Initial state'i URL'den veya searchParams'tan al
  const initialSearchParams = location.state?.searchParams || {}
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    flightNumber: '',
    age: '',
    country: '',
    pickupDate: urlPickupDate || initialSearchParams.pickupDate || '',
    dropoffDate: urlDropoffDate || initialSearchParams.dropoffDate || '',
    pickupTime: urlPickupTime || initialSearchParams.pickupTime || '11:00',
    dropoffTime: urlDropoffTime || initialSearchParams.dropoffTime || '11:00',
    pickupLocation: {
      city: '',
      address: ''
    },
    sameLocation: true,
    dropoffLocation: {
      city: '',
      address: ''
    },
    paymentType: 'payPart' // 'payPart' or 'payFull'
  })

  // Extras configuration from API (car.extras) - memoized
  const extrasConfig = useMemo(() => {
    if (!car) {
      if (isDev) {
        console.log('⚠️ Extras: Car objesi yok')
      }
      return [];
    }

    if (!car.extras) {
      if (isDev) {
        console.log('⚠️ Extras: Car objesinde extras yok', {
          carKeys: Object.keys(car),
          hasExtras: !!car.extras,
          extras: car.extras
        })
      }
      return [];
    }

    const extras = car.extras
    const metadata = extras.metadata || {} // API'den gelen title ve description'lar
    if (isDev) {
      console.log('✅ Extras: Extras verileri bulundu', extras)
      console.log('✅ Extras Metadata:', metadata)
    }
    const config = []

    // Additional Driver
    if (extras.additionalDriver && extras.additionalDriver > 0) {
      config.push({
        key: 'additionalDriver',
        label: t('common.additionalDriver'),
        description: t('common.additionalDriverDesc'),
        pricePerDay: extras.additionalDriver // Will be converted when displayed
      })
    }

    // Baby Seat / Child Seat
    if (extras.babySeat && extras.babySeat > 0) {
      config.push({
        key: 'babySeat',
        label: t('common.babySeat'),
        description: t('common.babySeatDesc'),
        pricePerDay: extras.babySeat // Will be converted when displayed
      })
    }

    // GPS Navigation
    if (extras.navigation && extras.navigation > 0) {
      config.push({
        key: 'navigation',
        label: t('common.navigation'),
        description: t('common.navigationDesc'),
        pricePerDay: extras.navigation // Will be converted when displayed
      })
    }

    // CDW Insurance
    if (extras.cdw && extras.cdw > 0) {
      config.push({
        key: 'cdw',
        label: t('common.cdw'),
        description: t('common.cdwDesc'),
        pricePerDay: extras.cdw // Will be converted when displayed
      })
    }

    // SCDW Insurance (Full Insurance)
    if (extras.scdw && extras.scdw > 0) {
      config.push({
        key: 'scdw',
        label: t('common.scdw'),
        description: t('common.scdwDesc'),
        pricePerDay: extras.scdw // Will be converted when displayed
      })
    }

    // Young Driver
    if (extras.youngDriver && extras.youngDriver > 0) {
      // Alt yaş (genç sürücü başlangıç yaşı) - öncelik young_drive_age
      const minYoungAge =
        extras.young_drive_age ||
        extras.youngDriveAge ||
        extras.young_driver_age ||
        car.young_drive_age ||
        21

      // Üst yaş (genç sürücü sınır yaşı) - öncelik driver_age
      const maxYoungAge =
        car.driverAge ||
        car.driver_age ||
        25

      config.push({
        key: 'youngDriver',
        label: t('common.youngDriver'),
        description: t('common.youngDriverDesc', { min: minYoungAge, max: maxYoungAge }),
        pricePerDay: extras.youngDriver // Will be converted when displayed
      })
    }

    // Extended Free Cancellation - Always available, fixed price 5 EUR per day
    config.push({
      key: 'extendedCancellation',
      label: t('common.extendedCancellation'),
      description: t('common.extendedCancellationDesc'),
      pricePerDay: 5 // 5 EUR per day, will be converted when displayed
    })

    return config
  }, [car, t])

  const [selectedExtras, setSelectedExtras] = useState({})

  // Update selectedExtras when extrasConfig changes
  useEffect(() => {
    if (extrasConfig.length > 0) {
      setSelectedExtras(
        extrasConfig.reduce((acc, extra) => {
          acc[extra.key] = false
          return acc
        }, {})
      )
    } else {
      setSelectedExtras({})
    }
  }, [extrasConfig])

  useEffect(() => {
    // İlk önce formData'yı state'den veya URL'den set et
    const stateParams = location.state?.searchParams || {}
    const hasStateParams = Object.keys(stateParams).length > 0

    if (hasStateParams || urlPickupDate || urlDropoffDate || urlPickupTime || urlDropoffTime || urlPickupLocationName || urlDropoffLocationName) {
      setFormData(prev => ({
        ...prev,
        pickupDate: urlPickupDate || stateParams.pickupDate || prev.pickupDate || '',
        dropoffDate: urlDropoffDate || stateParams.dropoffDate || prev.dropoffDate || '',
        pickupTime: urlPickupTime || stateParams.pickupTime || prev.pickupTime || '11:00',
        dropoffTime: urlDropoffTime || stateParams.dropoffTime || prev.dropoffTime || '11:00'
      }))
    }

    fetchCar()
    loadLocationData()
  }, [carId, location.state, urlPickupDate, urlDropoffDate, urlPickupTime, urlDropoffTime, urlPickupLocationName, urlDropoffLocationName])

  const loadLocationData = async () => {
    try {
      // State'den searchParams'ı al (öncelikli)
      const stateParams = location.state?.searchParams || {}

      // URL'den direkt parametreleri al (öncelikli)
      const pickupId = urlSearchParams.get('pickupId') || stateParams.pickupId || searchParams.pickupId
      const dropoffId = urlSearchParams.get('dropoffId') || stateParams.dropoffId || searchParams.dropoffId
      const pickupDate = urlPickupDate || stateParams.pickupDate || searchParams.pickupDate
      const dropoffDate = urlDropoffDate || stateParams.dropoffDate || searchParams.dropoffDate
      const pickupTime = urlPickupTime || stateParams.pickupTime || searchParams.pickupTime || '11:00'
      const dropoffTime = urlDropoffTime || stateParams.dropoffTime || searchParams.dropoffTime || '11:00'
      const pickupLocationName = urlPickupLocationName || stateParams.pickupLocationName || searchParams.pickupLocationName || ''
      const dropoffLocationName = urlDropoffLocationName || stateParams.dropoffLocationName || searchParams.dropoffLocationName || ''

      // Tarihleri ve saatleri set et (state'den gelen değerler öncelikli)
      if (pickupDate || dropoffDate || pickupTime || dropoffTime) {
        setFormData(prev => ({
          ...prev,
          pickupDate: pickupDate || prev.pickupDate || '',
          dropoffDate: dropoffDate || prev.dropoffDate || '',
          pickupTime: pickupTime || prev.pickupTime || '11:00',
          dropoffTime: dropoffTime || prev.dropoffTime || '11:00'
        }))
      }

      // Eğer pickupLocationName varsa, direkt kullan (API'ye gerek yok)
      if (pickupLocationName) {
        // IN_Terminal yerine airport yaz
        let processedLocationName = pickupLocationName.replace(/IN_Terminal/gi, 'Airport').replace(/IN Terminal/gi, 'Airport')
        // Lokasyon ismini parse et: "Location Name - Address" formatından city ve address'i ayır
        const parts = processedLocationName.split(' - ')
        const city = parts[0] || processedLocationName
        const address = parts[1] || ''

        setFormData(prev => ({
          ...prev,
          pickupLocation: {
            city: city,
            address: address
          },
          // Eğer sameLocation true ise, dropoff location'ı da aynı yap
          dropoffLocation: prev.sameLocation ? {
            city: city,
            address: address
          } : prev.dropoffLocation
        }))
      } else if (pickupId) {
        // Eğer pickupLocationName yoksa ama pickupId varsa, API'den çek
        const locations = await getLocations()
        const pickupLocation = locations.find(loc =>
          loc.Location_ID === pickupId ||
          loc.location_id === pickupId ||
          loc.id === pickupId ||
          String(loc.Location_ID) === String(pickupId) ||
          String(loc.location_id) === String(pickupId) ||
          String(loc.id) === String(pickupId)
        )

        if (pickupLocation) {
          let city = pickupLocation.Location_Name || pickupLocation.location_name || pickupLocation.name || ''
          // IN_Terminal yerine airport yaz
          city = city.replace(/IN_Terminal/gi, 'Airport').replace(/IN Terminal/gi, 'Airport')
          const address = pickupLocation.Address || pickupLocation.address || ''

          setFormData(prev => ({
            ...prev,
            pickupLocation: {
              city: city,
              address: address
            },
            // Eğer sameLocation true ise, dropoff location'ı da aynı yap
            dropoffLocation: prev.sameLocation ? {
              city: city,
              address: address
            } : prev.dropoffLocation
          }))
        }
      }

      // Eğer dropoffLocationName varsa, direkt kullan
      if (dropoffLocationName && !searchParams.sameLocation) {
        // IN_Terminal yerine airport yaz
        let processedDropoffLocationName = dropoffLocationName.replace(/IN_Terminal/gi, 'Airport').replace(/IN Terminal/gi, 'Airport')
        const parts = processedDropoffLocationName.split(' - ')
        const dropoffCity = parts[0] || processedDropoffLocationName
        const dropoffAddress = parts[1] || ''

        setFormData(prev => ({
          ...prev,
          dropoffLocation: {
            city: dropoffCity,
            address: dropoffAddress
          }
        }))
      } else if (dropoffId && !searchParams.sameLocation) {
        // Eğer dropoffLocationName yoksa ama dropoffId varsa, API'den çek
        const locations = await getLocations()
        const dropoffLocation = locations.find(loc =>
          loc.Location_ID === dropoffId ||
          loc.location_id === dropoffId ||
          loc.id === dropoffId ||
          String(loc.Location_ID) === String(dropoffId) ||
          String(loc.location_id) === String(dropoffId) ||
          String(loc.id) === String(dropoffId)
        )

        if (dropoffLocation) {
          let dropoffCity = dropoffLocation.Location_Name || dropoffLocation.location_name || dropoffLocation.name || ''
          // IN_Terminal yerine airport yaz
          dropoffCity = dropoffCity.replace(/IN_Terminal/gi, 'Airport').replace(/IN Terminal/gi, 'Airport')
          const dropoffAddress = dropoffLocation.Address || dropoffLocation.address || ''

          setFormData(prev => ({
            ...prev,
            dropoffLocation: {
              city: dropoffCity,
              address: dropoffAddress
            }
          }))
        }
      }
    } catch (error) {
      if (isDev) {
        console.error('Error loading location information:', error)
      }
    }
  }

  const fetchCar = async () => {
    try {
      // Eğer state'den car geldiyse, onu kullan (CarList'ten geçirilen)
      if (car) {
        // Car objesini normalize et - farklı isimlendirmeleri kontrol et
        const normalizedCar = {
          ...car,
          rezId: car.rezId || car.Rez_ID || car.rez_ID || car.RezID,
          carsParkId: car.carsParkId || car.Cars_Park_ID || car.cars_Park_ID || car.CarsParkID,
          groupId: car.groupId || car.Group_ID || car.group_ID || car.GroupID,
          location: car.location || {
            pickupId: searchParams.pickupId,
            dropoffId: searchParams.dropoffId
          },
          // Extras verilerini koru
          extras: car.extras || car.Extras || null
        };

        // Debug: Extras verilerini kontrol et
        if (isDev) {
          console.log('🔍 Reservation: Extras verileri kontrol ediliyor:', {
            hasExtras: !!normalizedCar.extras,
            extras: normalizedCar.extras,
            originalCarExtras: car.extras,
            originalCarExtrasType: typeof car.extras,
            originalCarExtrasKeys: car.extras ? Object.keys(car.extras) : null,
            allCarKeys: Object.keys(car),
            carHasExtras: 'extras' in car,
            carHasExtrasUpper: 'Extras' in car
          })
        }

        // Normalize edilmiş car objesini set et
        setCar(normalizedCar);

        // Debug: Car objesini kontrol et - TÜM alanları göster
        if (isDev) {
          console.log('🔍 Reservation: Car objesi state\'den geldi:', {
            rezId: normalizedCar.rezId,
            carsParkId: normalizedCar.carsParkId,
            groupId: normalizedCar.groupId,
            location: normalizedCar.location,
            hasAllFields: !!(normalizedCar.rezId && normalizedCar.carsParkId && normalizedCar.groupId),
            originalCar: car
          })

          // TÜM car objesi alanlarını göster (debug için)
          console.log('🔍 Reservation: Car objesi TÜM alanları:', {
            allKeys: Object.keys(car),
            allValues: car,
            normalizedKeys: Object.keys(normalizedCar),
            normalizedValues: normalizedCar
          })
        }

        // Eğer hala eksik alanlar varsa uyar ve TÜM alanları göster
        if (!normalizedCar.rezId || !normalizedCar.carsParkId || !normalizedCar.groupId) {
          if (isDev) {
            console.error('❌ Reservation: Car objesinde hala eksik alanlar var!', {
              rezId: normalizedCar.rezId,
              carsParkId: normalizedCar.carsParkId,
              groupId: normalizedCar.groupId,
              car: normalizedCar
            })

            // Orijinal car objesindeki TÜM alanları göster
            console.error('❌ Orijinal car objesi TÜM alanları:', JSON.stringify(car, null, 2))
            console.error('❌ Orijinal car objesi keys:', Object.keys(car))

            // Tüm key'leri ve değerlerini göster
            console.error('❌ Orijinal car objesi - Tüm key-value çiftleri:')
            Object.keys(car).forEach(key => {
              console.error(`  ${key}:`, car[key], `(tip: ${typeof car[key]})`)
            })

            // Farklı isimlendirmeleri kontrol et
            console.error('❌ Farklı isimlendirmeler kontrol ediliyor:', {
              'car.Rez_ID': car.Rez_ID,
              'car.rez_ID': car.rez_ID,
              'car.RezID': car.RezID,
              'car.rezId': car.rezId,
              'car.Cars_Park_ID': car.Cars_Park_ID,
              'car.cars_Park_ID': car.cars_Park_ID,
              'car.CarsParkID': car.CarsParkID,
              'car.carsParkId': car.carsParkId,
              'car.Group_ID': car.Group_ID,
              'car.group_ID': car.group_ID,
              'car.GroupID': car.GroupID,
              'car.groupId': car.groupId
            })

            // Rez_ID, Cars_Park_ID, Group_ID içeren tüm key'leri bul
            const rezIdKeys = Object.keys(car).filter(key =>
              key.toLowerCase().includes('rez') || key.toLowerCase().includes('id')
            )
            const carsParkIdKeys = Object.keys(car).filter(key =>
              key.toLowerCase().includes('park') || key.toLowerCase().includes('cars')
            )
            const groupIdKeys = Object.keys(car).filter(key =>
              key.toLowerCase().includes('group')
            )

            console.error('❌ Rez_ID içeren key\'ler:', rezIdKeys)
            console.error('❌ Cars_Park_ID içeren key\'ler:', carsParkIdKeys)
            console.error('❌ Group_ID içeren key\'ler:', groupIdKeys)
          }
        }

        setFormData(prev => ({
          ...prev,
          // URL'den gelen tarihler öncelikli, sonra searchParams, sonra mevcut değerler
          pickupDate: urlPickupDate || searchParams.pickupDate || prev.pickupDate || initialSearchParams.pickupDate || '',
          dropoffDate: urlDropoffDate || searchParams.dropoffDate || prev.dropoffDate || initialSearchParams.dropoffDate || '',
          pickupLocation: {
            city: normalizedCar.location?.city || '',
            address: normalizedCar.location?.address || ''
          }
        }));
        setLoading(false);
        return;
      }

      // Car objesi yoksa, API'den çekmeyi dene
      // Eğer carId rezId formatındaysa (XML- ile başlıyorsa), query parametrelerinden tarih ve lokasyon bilgilerini kullan
      if (!car && carId) {
        if (isDev) {
          console.warn('⚠️ Reservation: Car objesi state\'den gelmedi, API\'den çekmeyi deniyoruz...')
        }
        try {
          // Eğer carId rezId formatındaysa ve query parametreleri varsa, onları kullan
          const isRezId = carId.startsWith('XML-');
          let apiUrl = `${import.meta.env.PROD ? 'https://xdrive-be.vercel.app/api' : '/api'}/cars/${carId}`;

          if (isRezId) {
            // Query parametrelerini topla
            const queryParams = new URLSearchParams();
            const pickupId = urlSearchParams.get('pickupId') || searchParams.pickupId;
            const dropoffId = urlSearchParams.get('dropoffId') || searchParams.dropoffId;
            const pickupDate = urlPickupDate || searchParams.pickupDate;
            const dropoffDate = urlDropoffDate || searchParams.dropoffDate;
            const pickupTime = urlPickupTime || searchParams.pickupTime || '11:00';
            const dropoffTime = urlDropoffTime || searchParams.dropoffTime || '11:00';
            const currency = searchParams.currency || 'EURO';

            if (pickupId) queryParams.append('pickupId', pickupId);
            if (dropoffId) queryParams.append('dropoffId', dropoffId);
            if (pickupDate) queryParams.append('pickupDate', pickupDate);
            if (dropoffDate) queryParams.append('dropoffDate', dropoffDate);
            if (pickupTime) {
              const [hour, min] = pickupTime.split(':');
              queryParams.append('pickupHour', hour || '10');
              queryParams.append('pickupMin', min || '0');
            }
            if (dropoffTime) {
              const [hour, min] = dropoffTime.split(':');
              queryParams.append('dropoffHour', hour || '10');
              queryParams.append('dropoffMin', min || '0');
            }
            queryParams.append('currency', currency);

            if (queryParams.toString()) {
              apiUrl += '?' + queryParams.toString();
            }

            if (isDev) {
              console.log('🔍 RezId ile araç çekiliyor:', apiUrl)
            }
          }

          // API service fonksiyonunu kullan (production'da doğru URL'i kullanır)
          const response = await fetch(apiUrl);
          if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
          }
          const fetchedCar = await response.json();

          setCar(fetchedCar);

          // Debug: API'den gelen car objesini kontrol et
          if (isDev) {
            console.log('🔍 API\'den gelen car objesi:', {
              rezId: fetchedCar.rezId,
              carsParkId: fetchedCar.carsParkId,
              groupId: fetchedCar.groupId,
              location: fetchedCar.location,
              car: fetchedCar
            })
          }

          // Eğer API'den gelen car objesinde de bu alanlar yoksa, uyar
          if (!fetchedCar.rezId || !fetchedCar.carsParkId || !fetchedCar.groupId) {
            if (isDev) {
              console.error('❌ API\'den gelen car objesinde rezId, carsParkId veya groupId eksik!')
              console.error('Car objesi:', fetchedCar)
            }
            if (isRezId && (!pickupId || !dropoffId || !pickupDate || !dropoffDate)) {
              alert('⚠️ Car information could not be loaded.\n\nPlease provide pickupId, dropoffId, pickupDate, and dropoffDate in the URL query parameters.');
            } else {
              alert('⚠️ Car information is missing. Please select again from the car list.');
            }
          }
        } catch (apiError) {
          // 404 hatası beklenen bir durum (MongoDB yoksa veya rezId ile bulunamazsa)
          if (apiError.response?.status === 404 || apiError.message?.includes('404')) {
            if (isDev) {
              console.warn('⚠️ Car not found from API (404).')
            }
            if (carId.startsWith('XML-')) {
              if (isDev) {
                console.warn('RezId formatında ID tespit edildi. Query parametrelerinde pickupId, dropoffId, pickupDate, dropoffDate gerekli.')
              }
              alert('⚠️ Car information could not be loaded.\n\nFor rezId format, please provide pickupId, dropoffId, pickupDate, and dropoffDate in the URL.\n\nExample: /reservation/XML-6900295?pickupId=73&dropoffId=73&pickupDate=2026-01-16&dropoffDate=2026-01-25');
            } else {
              if (isDev) {
                console.warn('Please select again from the car list or refresh the page.')
              }
              alert('⚠️ Car information could not be loaded.\n\nPlease select again from the car list.');
            }
          } else {
            if (isDev) {
              console.error('❌ API hatası:', apiError)
            }
            alert('⚠️ An error occurred while loading car information.\n\nPlease refresh the page.');
          }
        }
      }

      // Varsayılan lokasyon bilgilerini doldur
      if (car) {
        setFormData(prev => ({
          ...prev,
          // URL'den gelen tarihler öncelikli, sonra searchParams, sonra mevcut değerler
          pickupDate: urlPickupDate || searchParams.pickupDate || prev.pickupDate || initialSearchParams.pickupDate || '',
          dropoffDate: urlDropoffDate || searchParams.dropoffDate || prev.dropoffDate || initialSearchParams.dropoffDate || '',
          pickupLocation: {
            city: car.location?.city || '',
            address: car.location?.address || ''
          }
        }));
      }
    } catch (error) {
      if (isDev) {
        console.error('Error loading car information:', error)
      }
    } finally {
      setLoading(false)
    }
  }

  // Handle HTML5 validation messages in selected language
  // Handle HTML5 validation messages in selected language
  const handleInvalid = (e) => {
    if (e.target.validity.valueMissing) {
      e.target.setCustomValidity(t('reservation.fillRequiredFields'))
    } else if (e.target.type === 'email' && (e.target.validity.typeMismatch || e.target.validity.patternMismatch)) {
      e.target.setCustomValidity(t('reservation.invalidEmail'))
    } else {
      e.target.setCustomValidity(t('reservation.fillRequiredFields'))
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    if (name.startsWith('pickupLocation.')) {
      const field = name.split('.')[1]
      setFormData(prev => ({
        ...prev,
        pickupLocation: {
          ...prev.pickupLocation,
          [field]: value
        }
      }))
    } else if (name.startsWith('dropoffLocation.')) {
      const field = name.split('.')[1]
      setFormData(prev => ({
        ...prev,
        dropoffLocation: {
          ...prev.dropoffLocation,
          [field]: value
        }
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }))
    }
  }

  const toggleExtra = (key) => {
    setSelectedExtras(prev => ({
      ...prev,
      [key]: !prev[key]
    }))
  }

  const formatDate = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const year = date.getFullYear()
    return `${day}.${month}.${year}`
  }

  const formatTime = (timeString) => {
    if (!timeString) return '11:00'
    return timeString
  }

  const calculateDays = () => {
    if (!formData.pickupDate || !formData.dropoffDate) return 0
    const pickup = new Date(formData.pickupDate)
    const dropoff = new Date(formData.dropoffDate)
    return Math.ceil((dropoff - pickup) / (1000 * 60 * 60 * 24))
  }

  const calculateBasePrice = () => {
    if (!car || !formData.pickupDate || !formData.dropoffDate) return 0

    // Önce toplam fiyatı kontrol et
    const possibleTotalPrices = [
      car.totalPrice,
      car.Total_Rental,
      car.total_Rental,
      car.TotalRental,
      car.totalRental,
      car.TOTAL_RENTAL
    ];

    let totalPriceValue = 0;
    for (const price of possibleTotalPrices) {
      if (price !== undefined && price !== null && price !== '') {
        const priceNum = typeof price === 'string' ? parseFloat(price) : price;
        if (!isNaN(priceNum) && priceNum > 0) {
          totalPriceValue = priceNum;
          break;
        }
      }
    }

    // Eğer toplam fiyat yoksa, günlük fiyat × gün sayısı hesapla
    if (totalPriceValue === 0) {
      const days = calculateDays();
      const possibleDailyPrices = [
        car.pricePerDay,
        car.Daily_Rental,
        car.daily_Rental,
        car.DailyRental,
        car.dailyRental,
        car.price,
        car.Price
      ];

      let dailyPriceValue = 0;
      for (const price of possibleDailyPrices) {
        if (price !== undefined && price !== null && price !== '') {
          const priceNum = typeof price === 'string' ? parseFloat(price) : price;
          if (!isNaN(priceNum) && priceNum > 0) {
            dailyPriceValue = priceNum;
            break;
          }
        }
      }

      if (dailyPriceValue > 0) {
        totalPriceValue = dailyPriceValue * days;
      }
    }

    return totalPriceValue;
  }

  const calculateExtrasPrice = () => {
    const days = Math.max(calculateDays(), 1)
    const extrasPriceEUR = extrasConfig.reduce((sum, extra) => {
      return selectedExtras[extra.key] ? sum + extra.pricePerDay * days : sum
    }, 0)
    return convertPriceSync(extrasPriceEUR) // Convert to selected currency
  }

  const calculateCommission = () => {
    const basePriceEUR = calculateBasePrice()
    // Komisyonu sadece araç kira bedeli üzerinden uygula (extralar hariç)
    const commissionEUR = basePriceEUR * 0.10 // %10 komisyon
    return convertPriceSync(commissionEUR) // Convert to selected currency
  }

  const calculateTotalPrice = () => {
    const basePriceEUR = calculateBasePrice()
    const extrasPriceEUR = extrasConfig.reduce((sum, extra) => {
      return selectedExtras[extra.key] ? sum + extra.pricePerDay * Math.max(calculateDays(), 1) : sum
    }, 0)
    // Komisyon sadece base price üzerinden
    const commissionEUR = basePriceEUR * 0.10
    const totalEUR = basePriceEUR + extrasPriceEUR + commissionEUR
    return convertPriceSync(totalEUR) // Convert to selected currency
  }

  // Calculate how much should be paid now for the "Pay Part" option
  // Rule:
  // - Pay Part = basePrice'in %10'u + Extended Free Cancellation (tam tutarı)
  // - Extended Free Cancellation hem totale hem pay part'a tam olarak eklenir
  // - Komisyon ve diğer extralar pay part hesaplamasına dahil edilmez
  const calculatePayPartAmountEUR = () => {
    const basePriceEUR = calculateBasePrice()
    const days = Math.max(calculateDays(), 1)

    // Find Extended Free Cancellation price if selected
    let extendedCancellationEUR = 0
    for (const extra of extrasConfig) {
      if (extra.key === 'extendedCancellation' && selectedExtras[extra.key]) {
        extendedCancellationEUR = extra.pricePerDay * days
        break
      }
    }

    // Pay Part = basePrice'in %10'u + (varsa) Extended'in tamamı
    const payPartPercentEUR = basePriceEUR * 0.10
    return payPartPercentEUR + extendedCancellationEUR
  }

  const calculateAmountToPayNow = () => {
    const basePriceEUR = calculateBasePrice()
    const extrasPriceEUR = extrasConfig.reduce((sum, extra) => {
      return selectedExtras[extra.key] ? sum + extra.pricePerDay * Math.max(calculateDays(), 1) : sum
    }, 0)
    // Komisyon sadece base price üzerinden
    const commissionEUR = basePriceEUR * 0.10
    const totalPriceEUR = basePriceEUR + extrasPriceEUR + commissionEUR

    if (formData.paymentType === 'payFull') {
      // Pay Full → full total amount now
      return convertPriceSync(totalPriceEUR) // Convert to selected currency
    }

    // Pay Part → totalWithoutExtendedEUR'in %10'u + Extended Free Cancellation (tam)
    const payPartEUR = calculatePayPartAmountEUR()
    return convertPriceSync(payPartEUR)
  }

  const submitReservation = async (paymentIntent = null) => {
    try {
      // API için gerekli parametreleri kontrol et
      // Car objesinden veya searchParams'tan al
      const pickupId = searchParams.pickupId || car?.location?.pickupId;
      const dropoffId = formData.sameLocation
        ? (searchParams.pickupId || car?.location?.pickupId)
        : (searchParams.dropoffId || car?.location?.dropoffId);

      // Car objesinden rezId, carsParkId, groupId al
      // Farklı isimlendirmeleri kontrol et
      let rezId = car?.rezId || car?.Rez_ID || car?.rez_ID || car?.RezID;
      let carsParkId = car?.carsParkId || car?.Cars_Park_ID || car?.cars_Park_ID || car?.CarsParkID;
      let groupId = car?.groupId || car?.Group_ID || car?.group_ID || car?.GroupID;

      // Eğer hala eksikse ve carId varsa, carId'den parse etmeyi dene
      // carId bazen rezId veya carsParkId olabilir
      if (!rezId && !carsParkId && carId) {
        // carId'yi kontrol et - belki rezId veya carsParkId içeriyor
        if (isDev) {
          console.warn('⚠️ Car objesinde rezId/carsParkId yok, carId kullanılıyor:', carId)
        }
      }

      // Eksik parametreleri kontrol et
      const missingParams = [];
      if (!pickupId) missingParams.push('pickupId');
      if (!dropoffId) missingParams.push('dropoffId');
      if (!rezId) missingParams.push('rezId');
      if (!carsParkId) missingParams.push('carsParkId');
      if (!groupId) missingParams.push('groupId');

      if (missingParams.length > 0) {
        console.error('❌ Rezervasyon için eksik parametreler:', missingParams);
        console.error('Car objesi:', car);
        console.error('Search params:', searchParams);
        console.error('Car rezId:', car?.rezId);
        console.error('Car carsParkId:', car?.carsParkId);
        console.error('Car groupId:', car?.groupId);
        console.error('Car location:', car?.location);
        alert(`Cannot make reservation. Missing information: ${missingParams.join(', ')}\n\nPlease try again from the car detail page.`);
        setSubmitting(false);
        return;
      }

      const reservationData = {
        carId: car?._id || carId,
        user: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          flightNumber: formData.flightNumber,
          age: parseInt(formData.age),
          country: formData.country
        },
        pickupDate: formData.pickupDate,
        dropoffDate: formData.dropoffDate,
        pickupLocation: formData.pickupLocation,
        dropoffLocation: formData.sameLocation
          ? { ...formData.pickupLocation, sameLocation: true }
          : formData.dropoffLocation,
        // API için gerekli parametreler
        pickupId: pickupId,
        dropoffId: dropoffId,
        rezId: rezId,
        carsParkId: carsParkId,
        groupId: groupId,
        extras: {
          selected: selectedExtras,
          totalExtrasPrice: calculateExtrasPrice(),
          config: extrasConfig
        },
        // Fiyat bilgileri
        basePrice: calculateBasePrice(),
        extrasPrice: calculateExtrasPrice(),
        commission: calculateCommission(),
        totalPrice: calculateTotalPrice(),
        paymentAmount: calculateAmountToPayNow(), // Amount to pay (depends on paymentType)
        paymentType: formData.paymentType, // 'payPart' or 'payFull'
        currency: car?.currency || 'EURO',
        days: calculateDays(),
        // Ödeme bilgileri
        paymentType: formData.paymentType, // 'payPart' or 'payFull'
        currency: car?.currency || 'EURO',
        days: calculateDays(),
        // Ödeme bilgileri
        paymentIntentId: paymentIntent ? paymentIntent.id : null,
        paymentStatus: paymentIntent ? 'paid' : 'pending',
        language: i18n.language // Add language for email localization
      }

      if (isDev) {
        console.log('📤 Sending reservation:', {
          pickupId,
          dropoffId,
          rezId,
          carsParkId,
          groupId
        })
      }

      // API service fonksiyonunu kullan (production'da doğru URL'i kullanır)
      // createReservation zaten response.data döndürüyor
      if (isDev) {
        console.log('📤 Sending reservation...')
      }
      const reservationResponse = await createReservation(reservationData)
      if (isDev) {
        console.log('✅ Reservation successful! Response:', reservationResponse)
      }

      // Response kontrolü
      if (!reservationResponse) {
        throw new Error('Reservation response not received');
      }

      // Reservation number kontrolü
      const reservationNumber = reservationResponse.reservationNumber ||
        reservationResponse.reservation_number ||
        `RES-${Date.now()}`;

      if (isDev) {
        console.log('✅ Reservation number:', reservationNumber)
      }

      // Save reservation information to localStorage (to use when MongoDB is not available)
      const reservationInfo = {
        ...reservationResponse,
        reservationNumber, // Normalized reservation number
        car: car // Add car information
      }

      if (isDev) {
        console.log('💾 Saving reservation information to localStorage...')
      }
      localStorage.setItem(`reservation_${reservationNumber}`, JSON.stringify(reservationInfo))

      // External API hatası varsa uyarı göster ama rezervasyonu tamamla
      if (reservationResponse.externalApiError) {
        if (isDev) {
          console.warn('⚠️ External API hatası:', reservationResponse.externalApiError)
        }
        // Uyarı mesajı göster ama rezervasyonu tamamla
        // alert(`⚠️ Reservation saved but could not be sent to external API.\n\n${reservationResponse.externalApiError}\n\nYour reservation number: ${reservationNumber}\n\nPlease contact the API provider: 0312 870 10 35`);
        console.warn('⚠️ Reservation saved but external API failed:', reservationResponse.externalApiError);
      }

      if (isDev) {
        console.log('🚀 Redirecting to reservation confirmation page...')
      }
      navigate(`/reservation-confirmation/${reservationNumber}`, {
        state: { reservation: reservationInfo }
      })
    } catch (error) {
      if (isDev) {
        console.error('❌ Reservation error:', error)
        console.error('❌ Error response:', error.response)
        console.error('❌ Error response data:', error.response?.data)
        console.error('❌ Error message:', error.message)
        console.error('❌ Error stack:', error.stack)
      }

      // Detaylı hata mesajı göster
      let errorMessage = 'An error occurred while making the reservation.';

      if (error.response) {
        // Backend'den gelen hata mesajı
        const errorData = error.response.data;
        if (isDev) {
          console.error('❌ Backend hata data:', errorData)
        }

        if (errorData && typeof errorData === 'object') {
          if (errorData.details) {
            errorMessage = `${errorData.error || 'Hata'}\n\n${errorData.details}`;
          } else if (errorData.error) {
            errorMessage = String(errorData.error);
          } else if (errorData.message) {
            errorMessage = String(errorData.message);
          }
        } else if (errorData && typeof errorData === 'string') {
          errorMessage = errorData;
        }

        // Eksik parametreler varsa detaylı bilgi göster
        if (error.response.status === 400 && errorData.received) {
          const missing = Object.entries(errorData.received)
            .filter(([key, value]) => !value)
            .map(([key]) => key);
          if (missing.length > 0) {
            errorMessage += `\n\nEksik parametreler: ${missing.join(', ')}`;
          }
        }
      } else if (error.request) {
        errorMessage = 'Sunucuya bağlanılamadı. Lütfen internet bağlantınızı kontrol edin.';
      } else {
        errorMessage = error.message || errorMessage;
      }

      // alert(errorMessage);
      console.warn('⚠️ Reservation error suppressed (User Request):', errorMessage);
    } finally {
      setSubmitting(false)
    }
  }

  const handlePaymentSuccess = async (paymentIntent) => {
    // Payment successful, now create the reservation
    if (isDev) {
      console.log('Payment successful:', paymentIntent)
    }
    setShowPayment(false);
    await submitReservation(paymentIntent);
  };

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)

    // Validate required fields
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone) {
      alert(t('reservation.fillRequiredFields'));
      setSubmitting(false);
      return;
    }

    // Directly submit reservation without payment
    await submitReservation();
  }

  if (loading) {
    return (
      <div className="max-w-[1200px] mx-auto px-5">
        <div className="text-center py-[60px] text-lg text-[#666]">
          {t('home.loading')}
        </div>
      </div>
    )
  }

  if (!car) {
    return <div className="max-w-[1200px] mx-auto px-5"><div className="text-center py-[60px] text-lg text-red-600">{t('reservation.carNotFound')}</div></div>
  }

  return (
    <div className="py-10 sm:py-10 md:py-10">
      <div className="max-w-[1200px] mx-auto px-5 sm:px-6 md:px-8 lg:px-10">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#333] mb-8">{t('reservation.pageTitle')}</h1>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-10">
          <div className="bg-white p-6 sm:p-8 md:p-10 rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.1)]">
            <form onSubmit={handleSubmit}>
              <section className="mb-10 pb-8 border-b-2 border-[#f0f0f0] last:border-b-0">
                <h2 className="text-xl sm:text-2xl md:text-2xl mb-6 text-[#333]">{t('reservation.carInformation')}</h2>
                <div className="flex flex-col sm:flex-row gap-5 p-5 bg-[#f8f9fa] rounded-lg">
                  <img
                    src={(() => {
                      // Backend'den gelen image field'ını direkt kullan (artık direkt https://t1.trvcar.com/XDriveDzn/ formatında)
                      if (car.image && car.image.trim() !== '' && !car.image.includes('data:image/svg+xml')) {
                        // Backend artık direkt https://t1.trvcar.com/XDriveDzn/{image_path} formatında URL döndürüyor
                        const imageUrl = car.image;

                        // Resim URL'ini logla (sadece development)
                        if (isDev) {
                          console.log(`🖼️ Reservation: ${car.brand || car.Brand} ${car.model || car.Car_Name}`)
                          console.log(`  🔗 Image URL:`, imageUrl)
                        }

                        return imageUrl;
                      }

                      // Hiç resim yoksa placeholder
                      if (isDev) {
                        console.warn(`⚠️ Reservation: ${car.brand || car.Brand} ${car.model || car.Car_Name} - Resim yok, placeholder kullanılıyor`)
                      }
                      return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iI2Y1ZjVmNSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjAiIGZpbGw9IiM5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5BcmHDpyBSZXNtaTwvdGV4dD48L3N2Zz4=';
                    })()}
                    alt={`${car.brand || car.Brand} ${car.model || car.Car_Name}`}
                    className="w-full sm:w-[120px] h-auto sm:h-[80px] object-cover rounded-md"
                    onError={(e) => {
                      // Resim yüklenemezse placeholder göster
                      if (!e.target.src.includes('data:image/svg+xml')) {
                        e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iI2Y1ZjVmNSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjAiIGZpbGw9IiM5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5BcmHDpyBSZXNtaTwvdGV4dD48L3N2Zz4=';
                      }
                    }}
                    loading="lazy"
                  />
                  <div className="text-center sm:text-left">
                    <h3 className="mb-1.5 text-[#333]">{car.brand} {car.model} {t('reservation.orSimilar')}</h3>
                    <p className="text-[#666] text-sm">
                      <span className="capitalize">
                        {
                          (() => {
                            const categoryRaw = (car.group_str || car.groupStr || car.Group_Str || 'STANDARD').trim().toUpperCase()
                            const map = {
                              'STANDARD': t('common.standard'),
                              'MINI': t('common.mini'),
                              'ECONOMY': t('common.economy'),
                              'COMPACT': t('common.compact'),
                              'INTERMEDIATE': t('common.intermediate'),
                              'MIDSIZE': t('common.midsize')
                            }
                            return map[categoryRaw] || categoryRaw.charAt(0) + categoryRaw.slice(1).toLowerCase()
                          })()
                        }
                      </span>
                      {' • '}
                      {
                        (() => {
                          const transmission = (car.transmission || car.Transmission || '').toLowerCase()
                          const isManual = transmission.includes('manuel') || transmission.includes('manual') || transmission === 'm'
                          return isManual ? t('common.manual') : t('common.automatic')
                        })()
                      }
                      {' • '}
                      <span className="capitalize">
                        {(car.seats || car.Seats || car.chairs || car.Chairs || 5)} {t('reservation.seats')}
                      </span>
                    </p>
                  </div>
                </div>
              </section>

              <section className="mb-10 pb-8 border-b-2 border-[#f0f0f0] last:border-b-0">
                <h2 className="text-xl sm:text-2xl md:text-2xl mb-6 text-[#333]">{t('reservation.personalInformation')}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-semibold text-[#333] mb-2">{t('reservation.firstName')}</label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      onInvalid={handleInvalid}
                      onInput={(e) => e.target.setCustomValidity('')}
                      required
                      placeholder={t('reservation.placeholderFirstName')}
                      className="w-full p-3 border border-[#ddd] rounded-lg text-base focus:outline-none focus:border-[#EF4444]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#333] mb-2">{t('reservation.lastName')}</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      onInvalid={handleInvalid}
                      onInput={(e) => e.target.setCustomValidity('')}
                      required
                      placeholder={t('reservation.placeholderLastName')}
                      className="w-full p-3 border border-[#ddd] rounded-lg text-base focus:outline-none focus:border-[#EF4444]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-semibold text-[#333] mb-2">{t('reservation.email')}</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      onInvalid={handleInvalid}
                      onInput={(e) => e.target.setCustomValidity('')}
                      required
                      placeholder={t('reservation.placeholderEmail')}
                      className="w-full p-3 border border-[#ddd] rounded-lg text-base focus:outline-none focus:border-[#EF4444]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#333] mb-2">{t('reservation.phone')}</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      onInvalid={handleInvalid}
                      onInput={(e) => e.target.setCustomValidity('')}
                      required
                      placeholder={t('reservation.placeholderPhone')}
                      className="w-full p-3 border border-[#ddd] rounded-lg text-base focus:outline-none focus:border-[#EF4444]"
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-semibold text-[#333] mb-2">{t('reservation.flightNumber')}</label>
                  <input
                    type="text"
                    name="flightNumber"
                    value={formData.flightNumber}
                    onChange={handleChange}
                    placeholder={t('reservation.placeholderFlightNumber')}
                    className="w-full p-3 border border-[#ddd] rounded-lg text-base focus:outline-none focus:border-[#EF4444]"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-[#333] mb-2">{t('reservation.age')}</label>
                    <input
                      type="number"
                      name="age"
                      value={formData.age}
                      onChange={handleChange}
                      onInvalid={handleInvalid}
                      onInput={(e) => e.target.setCustomValidity('')}
                      min="18"
                      required
                      placeholder={t('reservation.placeholderAge')}
                      className="w-full p-3 border border-[#ddd] rounded-lg text-base focus:outline-none focus:border-[#EF4444]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#333] mb-2">{t('reservation.country')}</label>
                    <input
                      type="text"
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      onInvalid={handleInvalid}
                      onInput={(e) => e.target.setCustomValidity('')}
                      required
                      placeholder={t('reservation.placeholderCountry')}
                      className="w-full p-3 border border-[#ddd] rounded-lg text-base focus:outline-none focus:border-[#EF4444]"
                    />
                  </div>
                </div>
              </section>

              <section className="mb-10 pb-8 border-b-2 border-[#f0f0f0] last:border-b-0">
                <h2 className="text-xl sm:text-2xl md:text-2xl mb-6 text-[#333]">{t('reservation.dateAndLocation')}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-semibold text-[#333] mb-2">{t('reservation.pickupDate')}</label>
                    <input
                      type="date"
                      name="pickupDate"
                      value={formData.pickupDate}
                      onChange={handleChange}
                      min={new Date().toISOString().split('T')[0]}
                      required
                      onInvalid={handleInvalid}
                      onInput={(e) => e.target.setCustomValidity('')}
                      className="w-full p-3 border border-[#ddd] rounded-lg text-base focus:outline-none focus:border-[#EF4444]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#333] mb-2">{t('reservation.dropoffDate')}</label>
                    <input
                      type="date"
                      name="dropoffDate"
                      value={formData.dropoffDate}
                      onChange={handleChange}
                      min={formData.pickupDate || new Date().toISOString().split('T')[0]}
                      required
                      onInvalid={handleInvalid}
                      onInput={(e) => e.target.setCustomValidity('')}
                      className="w-full p-3 border border-[#ddd] rounded-lg text-base focus:outline-none focus:border-[#EF4444]"
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      name="sameLocation"
                      checked={formData.sameLocation}
                      onChange={handleChange}
                      className="w-4 h-4 cursor-pointer accent-[#EF4444]"
                    />
                    <span>{t('reservation.returnToSameLocation')}</span>
                  </label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-semibold text-[#333] mb-2">{t('reservation.pickupCity')}</label>
                    <input
                      type="text"
                      name="pickupLocation.city"
                      value={formData.pickupLocation.city}
                      onChange={handleChange}
                      onInvalid={handleInvalid}
                      onInput={(e) => e.target.setCustomValidity('')}
                      required
                      placeholder={t('reservation.placeholderPickupCity')}
                      className="w-full p-3 border border-[#ddd] rounded-lg text-base focus:outline-none focus:border-[#EF4444]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#333] mb-2">{t('reservation.pickupAddress')}</label>
                    <input
                      type="text"
                      name="pickupLocation.address"
                      value={formData.pickupLocation.address}
                      onChange={handleChange}
                      onInvalid={handleInvalid}
                      onInput={(e) => e.target.setCustomValidity('')}
                      required
                      placeholder={t('reservation.placeholderPickupAddress')}
                      className="w-full p-3 border border-[#ddd] rounded-lg text-base focus:outline-none focus:border-[#EF4444]"
                    />
                  </div>
                </div>

                {!formData.sameLocation && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-[#333] mb-2">{t('reservation.dropoffCity')}</label>
                      <input
                        type="text"
                        name="dropoffLocation.city"
                        value={formData.dropoffLocation.city}
                        onChange={handleChange}
                        onInvalid={handleInvalid}
                        onInput={(e) => e.target.setCustomValidity('')}
                        required={!formData.sameLocation}
                        placeholder={t('reservation.placeholderDropoffCity')}
                        className="w-full p-3 border border-[#ddd] rounded-lg text-base focus:outline-none focus:border-[#EF4444]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-[#333] mb-2">{t('reservation.dropoffAddress')}</label>
                      <input
                        type="text"
                        name="dropoffLocation.address"
                        value={formData.dropoffLocation.address}
                        onChange={handleChange}
                        onInvalid={handleInvalid}
                        onInput={(e) => e.target.setCustomValidity('')}
                        required={!formData.sameLocation}
                        placeholder={t('reservation.placeholderDropoffAddress')}
                        className="w-full p-3 border border-[#ddd] rounded-lg text-base focus:outline-none focus:border-[#EF4444]"
                      />
                    </div>
                  </div>
                )}
              </section>

              <section className="mb-10 pb-8 border-b-2 border-[#f0f0f0] last:border-b-0">
                <h2 className="text-xl sm:text-2xl md:text-2xl mb-6 text-[#333]">{t('reservation.extrasAndAddons')}</h2>
                <div className="flex flex-col gap-3">
                  {extrasConfig.map((extra) => (
                    <label
                      key={extra.key}
                      className={`flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0 p-3 sm:p-3.5 rounded-lg border cursor-pointer transition-all ${selectedExtras[extra.key]
                        ? 'border-[#ff6b35] bg-[#ecfdf5] shadow-[0_2px_8px_rgba(16,185,129,0.15)]'
                        : 'border-[#e5e7eb] bg-[#f9fafb]'
                        }`}
                    >
                      <div className="flex items-start gap-2.5 flex-1">
                        <input
                          type="checkbox"
                          checked={!!selectedExtras[extra.key]}
                          onChange={() => toggleExtra(extra.key)}
                          className="mt-1"
                        />
                        <div className="w-6 h-6 flex items-center justify-center flex-shrink-0">
                          {extra.key === 'additionalDriver' && (
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M12 11C13.66 11 15 9.66 15 8C15 6.34 13.66 5 12 5C10.34 5 9 6.34 9 8C9 9.66 10.34 11 12 11Z" fill="#ff6b35" />
                              <path d="M6 19C6 16.79 7.79 15 10 15H14C16.21 15 18 16.79 18 19V20H6V19Z" fill="#ff6b35" />
                            </svg>
                          )}
                          {(extra.key === 'babySeat' || extra.key === 'childSeat') && (
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M7 4H17L19 8V20H5V8L7 4Z" fill="#ff6b35" />
                            </svg>
                          )}
                          {(extra.key === 'navigation' || extra.key === 'gps') && (
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2ZM12 11.5C10.62 11.5 9.5 10.38 9.5 9C9.5 7.62 10.62 6.5 12 6.5C13.38 6.5 14.5 7.62 14.5 9C14.5 10.38 13.38 11.5 12 11.5Z" fill="#ff6b35" />
                            </svg>
                          )}
                          {(extra.key === 'scdw' || extra.key === 'fullInsurance') && (
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M12 2L4 5V11C4 15.42 7.06 19.5 12 21C16.94 19.5 20 15.42 20 11V5L12 2Z" fill="#ff6b35" />
                              <path d="M9 12L11 14L15 10" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          )}
                          {extra.key === 'cdw' && (
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M12 2L4 5V11C4 15.42 7.06 19.5 12 21C16.94 19.5 20 15.42 20 11V5L12 2Z" fill="#ff6b35" />
                            </svg>
                          )}
                          {extra.key === 'youngDriver' && (
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M12 11C13.66 11 15 9.66 15 8C15 6.34 13.66 5 12 5C10.34 5 9 6.34 9 8C9 9.66 10.34 11 12 11Z" fill="#ff6b35" />
                              <path d="M6 19C6 16.79 7.79 15 10 15H14C16.21 15 18 16.79 18 19V20H6V19Z" fill="#ff6b35" />
                              <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z" fill="#ff6b35" />
                            </svg>
                          )}
                          {extra.key === 'extendedCancellation' && (
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M9 16.17L4.83 12L3.41 13.41L9 19L21 7L19.59 5.59L9 16.17Z" fill="#ff6b35" />
                            </svg>
                          )}
                        </div>
                        <div className="flex flex-col gap-0.5">
                          <span className="text-sm font-semibold text-[#111827]">{extra.label}</span>
                          <span className="text-xs text-[#6b7280]">{extra.description}</span>
                        </div>
                      </div>
                      <div className="text-sm font-semibold text-[#111827] whitespace-nowrap sm:self-end">
                        {currencySymbol} {convertPriceSync(extra.pricePerDay).toFixed(2)} / {t('reservation.day')}
                      </div>
                    </label>
                  ))}
                </div>
              </section>

              <div className="mb-10">
                <h2 className="text-xl sm:text-2xl md:text-2xl mb-6 text-[#333]">{t('reservation.payment')}</h2>
                <div className="mt-6 pt-6 border-t border-[#e5e7eb]">
                  <h3 className="text-lg font-semibold text-[#333] mb-4">{t('reservation.paymentOption')}</h3>
                  <div className="flex flex-col gap-3">
                    <label className={`flex items-start gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${formData.paymentType === 'payPart'
                      ? 'border-[#0066FF] bg-[#eff6ff] shadow-[0_2px_8px_rgba(0,102,255,0.15)]'
                      : 'border-[#e5e7eb] bg-[#f9fafb] hover:border-[#d1d5db] hover:bg-[#f3f4f6]'
                      }`}>
                      <input
                        type="radio"
                        name="paymentType"
                        value="payPart"
                        checked={formData.paymentType === 'payPart'}
                        onChange={handleChange}
                        className="mt-0.5 cursor-pointer accent-[#0066FF]"
                      />
                      <div className="flex-1 flex flex-col gap-1">
                        <span className="text-base font-semibold text-[#111827]">{t('reservation.payPart')}</span>
                        <span className="text-xl font-bold text-[#0066FF]">
                          {currencySymbol}{' '}
                          {convertPriceSync(calculatePayPartAmountEUR())
                            .toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                        <small className="text-xs text-[#6b7280] leading-snug">{t('reservation.payPartDesc')}</small>
                      </div>
                    </label>
                    <label className={`flex items-start gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${formData.paymentType === 'payFull'
                      ? 'border-[#0066FF] bg-[#eff6ff] shadow-[0_2px_8px_rgba(0,102,255,0.15)]'
                      : 'border-[#e5e7eb] bg-[#f9fafb] hover:border-[#d1d5db] hover:bg-[#f3f4f6]'
                      }`}>
                      <input
                        type="radio"
                        name="paymentType"
                        value="payFull"
                        checked={formData.paymentType === 'payFull'}
                        onChange={handleChange}
                        className="mt-0.5 cursor-pointer accent-[#0066FF]"
                      />
                      <div className="flex-1 flex flex-col gap-1">
                        <span className="text-base font-semibold text-[#111827]">{t('reservation.payFull')}</span>
                        <span className="text-xl font-bold text-[#0066FF]">
                          {currencySymbol} {calculateTotalPrice().toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                        <small className="text-xs text-[#6b7280] leading-snug">{t('reservation.payFullDesc')}</small>
                      </div>
                    </label>
                  </div>
                </div>

              </div>

              <button
                type="submit"
                className="w-full bg-[#EF4444] text-white border-none py-4 px-8 text-base font-semibold rounded-lg cursor-pointer transition-colors hover:bg-[#DC2626] disabled:bg-[#9CA3AF] disabled:cursor-not-allowed"
                disabled={submitting || !formData.pickupDate || !formData.dropoffDate}
              >
                {submitting ? t('reservation.processingReservation') : t('reservation.confirmReservation')}
              </button>
            </form>
          </div>

          <aside className="lg:sticky lg:top-5 h-fit">
            <div className="bg-white p-6 rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.1)] mb-5">
              <h3 className="mb-5 text-[#333]">{t('reservation.reservationSummary')}</h3>
              {formData.pickupDate && formData.dropoffDate ? (
                <>
                  <div className="flex justify-between py-3 border-b border-[#eee] last:border-b-0">
                    <span>{t('reservation.pickupDateLabel')}:</span>
                    <strong>{formatDate(formData.pickupDate)} {formatTime(formData.pickupTime)}</strong>
                  </div>
                  {formData.pickupLocation.city && (
                    <div className="flex justify-between py-3 border-b border-[#eee] last:border-b-0">
                      <span>{t('reservation.pickupLocationLabel')}:</span>
                      <div className="text-right">
                        <strong>{formData.pickupLocation.city}</strong>
                        {formData.pickupLocation.address && (
                          <small className="block text-[#666] text-xs mt-1">
                            {formData.pickupLocation.address}
                          </small>
                        )}
                      </div>
                    </div>
                  )}
                  <div className="flex justify-between py-3 border-b border-[#eee] last:border-b-0">
                    <span>{t('reservation.dropoffDateLabel')}:</span>
                    <strong>{formatDate(formData.dropoffDate)} {formatTime(formData.dropoffTime)}</strong>
                  </div>
                  {formData.dropoffLocation.city && (
                    <div className="flex justify-between py-3 border-b border-[#eee] last:border-b-0">
                      <span>{t('reservation.dropoffLocationLabel')}:</span>
                      <div className="text-right">
                        <strong>{formData.dropoffLocation.city}</strong>
                        {formData.dropoffLocation.address && (
                          <small className="block text-[#666] text-xs mt-1">
                            {formData.dropoffLocation.address}
                          </small>
                        )}
                      </div>
                    </div>
                  )}
                  <div className="flex justify-between py-3 border-b border-[#eee] last:border-b-0">
                    <span>{t('reservation.numberOfDays')}:</span>
                    <strong>{calculateDays()} {t('reservation.days')}</strong>
                  </div>
                  <div className="flex justify-between py-3 border-b border-[#eee] last:border-b-0">
                    <span>{t('reservation.extras')}:</span>
                    <div className="text-right">
                      <strong>
                        {currencySymbol}{' '}
                        {calculateExtrasPrice().toLocaleString('en-US', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2
                        })}
                      </strong>
                    </div>
                  </div>
                  <div className="flex justify-between mt-2.5 pt-4 border-t-2 border-[#ef4444] text-lg">
                    <span>{t('reservation.totalPrice')}:</span>
                    <strong className="text-[#ef4444] text-2xl">{currencySymbol} {calculateTotalPrice().toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>
                  </div>
                  <div className="flex justify-between py-3 border-b border-[#eee] last:border-b-0">
                    <span>{t('reservation.paymentType')}:</span>
                    <strong>{formData.paymentType === 'payPart' ? t('reservation.payPart') : t('reservation.payFull')}</strong>
                  </div>
                  <div className="flex justify-between mt-2.5 pt-4 border-t-2 border-[#ef4444] text-lg">
                    <span>{t('reservation.toPayNow')}:</span>
                    <strong className="text-[#ef4444] text-2xl">{currencySymbol} {calculateAmountToPayNow().toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>
                  </div>
                </>
              ) : (
                <div className="flex justify-between py-3">
                  <span>{t('reservation.pleaseSelectDates')}</span>
                </div>
              )}
            </div>

            <div className="bg-white p-6 rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.1)]">
              <h4 className="mb-4 text-[#333]">{t('reservation.importantInformation')}</h4>
              <ul className="list-disc list-inside space-y-2 text-sm text-[#666]">
                <li>{t('reservation.info1')}</li>
                <li>{t('reservation.info2')}</li>
                <li>{t('reservation.info3')}</li>
                <li>{t('reservation.info4')}</li>
              </ul>
            </div>
          </aside>
        </div>
      </div>

      {showPayment && (
        <div className="fixed top-0 left-0 w-full h-full bg-black/50 flex justify-center items-center z-[1000]">
          <div className="bg-white p-8 rounded-lg w-full max-w-[500px] relative shadow-[0_4px_20px_rgba(0,0,0,0.2)]">
            <button className="absolute top-2.5 right-4 bg-none border-none text-2xl cursor-pointer text-[#666] hover:text-black" onClick={() => setShowPayment(false)}>×</button>
            <h2 className="mt-0 mb-5 text-center text-[#333]">{t('reservation.securePayment')}</h2>
            <PayTRPayment
              user={{
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                phone: formData.phone,
                address: `${formData.pickupLocation.address}, ${formData.pickupLocation.city}`
              }}
              amount={calculateAmountToPayNow()}
              currency={currency}
              reservationReference={`ORD-${Date.now()}`} // Or use real reservation ID if available
              onSuccess={() => handlePaymentSuccess(null)} // Pass null as we don't have stripe paymentIntent
              onFail={(err) => alert(`Payment failed: ${err}`)}
            />
          </div>
        </div>
      )}

    </div>
  )
}

export default Reservation

