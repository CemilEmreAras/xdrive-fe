import { useState, useEffect } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { createReservation, getCar, getLocations } from '../services/api'
import './Reservation.css'

function Reservation() {
  const { carId } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const [car, setCar] = useState(location.state?.car || null)
  const [searchParams] = useState(location.state?.searchParams || {})
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    licenseNumber: '',
    age: '',
    country: '',
    pickupDate: '',
    dropoffDate: '',
    pickupLocation: {
      city: '',
      address: ''
    },
    sameLocation: true,
    dropoffLocation: {
      city: '',
      address: ''
    }
  })

  useEffect(() => {
    fetchCar()
    loadLocationData()
  }, [carId])

  const loadLocationData = async () => {
    try {
      // searchParams'tan pickupId ve dropoffId al
      const pickupId = searchParams.pickupId || location.state?.searchParams?.pickupId
      const dropoffId = searchParams.dropoffId || location.state?.searchParams?.dropoffId
      const pickupDate = searchParams.pickupDate || location.state?.searchParams?.pickupDate
      const dropoffDate = searchParams.dropoffDate || location.state?.searchParams?.dropoffDate

      // Tarihleri set et
      if (pickupDate || dropoffDate) {
        setFormData(prev => ({
          ...prev,
          pickupDate: pickupDate || prev.pickupDate,
          dropoffDate: dropoffDate || prev.dropoffDate
        }))
      }

      // Eğer pickupId varsa, location bilgilerini çek
      if (pickupId) {
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
          const city = pickupLocation.Location_Name || pickupLocation.location_name || pickupLocation.name || ''
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

        // Eğer dropoffId varsa ve sameLocation false ise, dropoff location'ı da çek
        if (dropoffId && !searchParams.sameLocation) {
          const dropoffLocation = locations.find(loc => 
            loc.Location_ID === dropoffId || 
            loc.location_id === dropoffId || 
            loc.id === dropoffId ||
            String(loc.Location_ID) === String(dropoffId) ||
            String(loc.location_id) === String(dropoffId) ||
            String(loc.id) === String(dropoffId)
          )

          if (dropoffLocation) {
            const dropoffCity = dropoffLocation.Location_Name || dropoffLocation.location_name || dropoffLocation.name || ''
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
      }
    } catch (error) {
      console.error('Lokasyon bilgileri yüklenirken hata:', error)
    }
  }

  const fetchCar = async () => {
    try {
      // Eğer state'den car geldiyse, onu kullan (CarDetail'den geçirilen)
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
          }
        };
        
        // Normalize edilmiş car objesini set et
        setCar(normalizedCar);
        
        // Debug: Car objesini kontrol et - TÜM alanları göster
        console.log('🔍 Reservation: Car objesi state\'den geldi:', {
          rezId: normalizedCar.rezId,
          carsParkId: normalizedCar.carsParkId,
          groupId: normalizedCar.groupId,
          location: normalizedCar.location,
          hasAllFields: !!(normalizedCar.rezId && normalizedCar.carsParkId && normalizedCar.groupId),
          originalCar: car
        });
        
        // TÜM car objesi alanlarını göster (debug için)
        console.log('🔍 Reservation: Car objesi TÜM alanları:', {
          allKeys: Object.keys(car),
          allValues: car,
          normalizedKeys: Object.keys(normalizedCar),
          normalizedValues: normalizedCar
        });
        
        // Eğer hala eksik alanlar varsa uyar ve TÜM alanları göster
        if (!normalizedCar.rezId || !normalizedCar.carsParkId || !normalizedCar.groupId) {
          console.error('❌ Reservation: Car objesinde hala eksik alanlar var!', {
            rezId: normalizedCar.rezId,
            carsParkId: normalizedCar.carsParkId,
            groupId: normalizedCar.groupId,
            car: normalizedCar
          });
          
          // Orijinal car objesindeki TÜM alanları göster
          console.error('❌ Orijinal car objesi TÜM alanları:', JSON.stringify(car, null, 2));
          console.error('❌ Orijinal car objesi keys:', Object.keys(car));
          
          // Tüm key'leri ve değerlerini göster
          console.error('❌ Orijinal car objesi - Tüm key-value çiftleri:');
          Object.keys(car).forEach(key => {
            console.error(`  ${key}:`, car[key], `(tip: ${typeof car[key]})`);
          });
          
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
          });
          
          // Rez_ID, Cars_Park_ID, Group_ID içeren tüm key'leri bul
          const rezIdKeys = Object.keys(car).filter(key => 
            key.toLowerCase().includes('rez') || key.toLowerCase().includes('id')
          );
          const carsParkIdKeys = Object.keys(car).filter(key => 
            key.toLowerCase().includes('park') || key.toLowerCase().includes('cars')
          );
          const groupIdKeys = Object.keys(car).filter(key => 
            key.toLowerCase().includes('group')
          );
          
          console.error('❌ Rez_ID içeren key\'ler:', rezIdKeys);
          console.error('❌ Cars_Park_ID içeren key\'ler:', carsParkIdKeys);
          console.error('❌ Group_ID içeren key\'ler:', groupIdKeys);
        }
        
        setFormData(prev => ({
          ...prev,
          pickupDate: searchParams.pickupDate || prev.pickupDate,
          dropoffDate: searchParams.dropoffDate || prev.dropoffDate,
          pickupLocation: {
            city: normalizedCar.location?.city || '',
            address: normalizedCar.location?.address || ''
          }
        }));
        setLoading(false);
        return;
      }
      
      // Car objesi yoksa, API'den çekmeyi dene (ama bu durumda rezId, carsParkId, groupId olmayabilir)
      // Not: MongoDB olmadığında bu endpoint 404 döndürür, bu yüzden state'den car objesi geçirilmeli
      if (!car && carId) {
        console.warn('⚠️ Reservation: Car objesi state\'den gelmedi, API\'den çekmeyi deniyoruz...');
        try {
          // API service fonksiyonunu kullan (production'da doğru URL'i kullanır)
          const fetchedCar = await getCar(carId);
          setCar(fetchedCar);
          
          // Debug: API'den gelen car objesini kontrol et
          console.log('🔍 API\'den gelen car objesi:', {
            rezId: fetchedCar.rezId,
            carsParkId: fetchedCar.carsParkId,
            groupId: fetchedCar.groupId,
            location: fetchedCar.location,
            car: fetchedCar
          });
          
          // Eğer API'den gelen car objesinde de bu alanlar yoksa, uyar
          if (!fetchedCar.rezId || !fetchedCar.carsParkId || !fetchedCar.groupId) {
            console.error('❌ API\'den gelen car objesinde rezId, carsParkId veya groupId eksik!');
            console.error('Car objesi:', fetchedCar);
            alert('⚠️ Araç bilgileri eksik. Lütfen araç listesinden tekrar seçin.');
          }
        } catch (apiError) {
          // 404 hatası beklenen bir durum (MongoDB yoksa)
          if (apiError.response?.status === 404) {
            console.warn('⚠️ API\'den araç bulunamadı (404). Car objesi state ile geçirilmeli.');
            console.warn('Lütfen araç listesinden tekrar seçin veya sayfayı yenileyin.');
            alert('⚠️ Araç bilgileri yüklenemedi.\n\nLütfen araç listesinden tekrar seçin.');
          } else {
            console.error('❌ API hatası:', apiError);
            alert('⚠️ Araç bilgileri yüklenirken bir hata oluştu.\n\nLütfen sayfayı yenileyin.');
          }
        }
      }
      
      // Varsayılan lokasyon bilgilerini doldur
      if (car) {
        setFormData(prev => ({
          ...prev,
          pickupDate: searchParams.pickupDate || prev.pickupDate,
          dropoffDate: searchParams.dropoffDate || prev.dropoffDate,
          pickupLocation: {
            city: car.location?.city || '',
            address: car.location?.address || ''
          }
        }));
      }
    } catch (error) {
      console.error('Araç bilgileri yüklenirken hata:', error)
    } finally {
      setLoading(false)
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

  const calculateCommission = () => {
    const basePrice = calculateBasePrice();
    return basePrice * 0.10; // %10 komisyon
  }

  const calculateTotalPrice = () => {
    const basePrice = calculateBasePrice();
    const commission = calculateCommission();
    return basePrice + commission;
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)

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
        console.warn('⚠️ Car objesinde rezId/carsParkId yok, carId kullanılıyor:', carId);
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
        alert(`Rezervasyon yapılamıyor. Eksik bilgiler: ${missingParams.join(', ')}\n\nLütfen araç detay sayfasından tekrar deneyin.`);
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
          licenseNumber: formData.licenseNumber,
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
        extras: {},
        // Fiyat bilgileri
        basePrice: calculateBasePrice(),
        commission: calculateCommission(),
        totalPrice: calculateTotalPrice(), // Toplam (araç + komisyon)
        paymentAmount: calculateCommission(), // Ödenecek tutar (sadece komisyon)
        currency: car?.currency || 'EURO',
        days: calculateDays()
      }
      
      console.log('📤 Rezervasyon gönderiliyor:', {
        pickupId,
        dropoffId,
        rezId,
        carsParkId,
        groupId
      });

      // API service fonksiyonunu kullan (production'da doğru URL'i kullanır)
      // createReservation zaten response.data döndürüyor
      console.log('📤 Rezervasyon gönderiliyor...');
      const reservationResponse = await createReservation(reservationData)
      console.log('✅ Rezervasyon başarılı! Response:', reservationResponse);
      
      // Response kontrolü
      if (!reservationResponse) {
        throw new Error('Rezervasyon yanıtı alınamadı');
      }
      
      // Reservation number kontrolü
      const reservationNumber = reservationResponse.reservationNumber || 
        reservationResponse.reservation_number || 
        `RES-${Date.now()}`;
      
      console.log('✅ Rezervasyon numarası:', reservationNumber);
      
      // Rezervasyon bilgilerini localStorage'a kaydet (MongoDB olmadığında kullanmak için)
      const reservationInfo = {
        ...reservationResponse,
        reservationNumber, // Normalize edilmiş reservation number
        car: car // Araç bilgilerini de ekle
      }
      
      console.log('💾 Rezervasyon bilgileri localStorage\'a kaydediliyor...');
      localStorage.setItem(`reservation_${reservationNumber}`, JSON.stringify(reservationInfo))
      
      // External API hatası varsa uyarı göster ama rezervasyonu tamamla
      if (reservationResponse.externalApiError) {
        console.warn('⚠️ External API hatası:', reservationResponse.externalApiError);
        // Uyarı mesajı göster ama rezervasyonu tamamla
        alert(`⚠️ Rezervasyon kaydedildi ancak external API'ye gönderilemedi.\n\n${reservationResponse.externalApiError}\n\nRezervasyon numaranız: ${reservationNumber}\n\nLütfen API sağlayıcısı ile iletişime geçin: 0312 870 10 35`);
      }
      
      console.log('🚀 Rezervasyon onay sayfasına yönlendiriliyor...');
      navigate(`/reservation-confirmation/${reservationNumber}`, {
        state: { reservation: reservationInfo }
      })
    } catch (error) {
      console.error('❌ Rezervasyon hatası:', error);
      console.error('❌ Error response:', error.response);
      console.error('❌ Error response data:', error.response?.data);
      console.error('❌ Error message:', error.message);
      console.error('❌ Error stack:', error.stack);
      
      // Detaylı hata mesajı göster
      let errorMessage = 'Rezervasyon yapılırken bir hata oluştu.';
      
      if (error.response) {
        // Backend'den gelen hata mesajı
        const errorData = error.response.data;
        console.error('❌ Backend hata data:', errorData);
        
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
      
      alert(errorMessage);
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return <div className="container"><div className="loading">Yükleniyor...</div></div>
  }

  if (!car) {
    return <div className="container"><div className="error">Araç bulunamadı</div></div>
  }

  return (
    <div className="reservation-page">
      <div className="container">
        <h1 className="page-title">Rezervasyon Yap</h1>
        
        <div className="reservation-layout">
          <div className="reservation-form-container">
            <form onSubmit={handleSubmit} className="reservation-form">
              <section className="form-section">
                <h2>Araç Bilgileri</h2>
                <div className="car-summary">
                  <img 
                    src={(() => {
                      // Tüm olası resim alanlarını kontrol et
                      const possibleImages = [
                        car.image,
                        car.Image_Path,
                        car.image_Path,
                        car.image_path,
                        car.IMAGE_PATH
                      ];
                      
                      for (const img of possibleImages) {
                        if (img && img.trim() !== '' && img !== 'data:image/svg+xml') {
                          // Eğer tam URL değilse ve base64 değilse, base URL ekle
                          if (img.startsWith('data:') || img.startsWith('http://') || img.startsWith('https://')) {
                            return img;
                          } else if (img.startsWith('/')) {
                            return `http://xdrivejson.turevsistem.com${img}`;
                          } else {
                            return `http://xdrivejson.turevsistem.com/${img}`;
                          }
                        }
                      }
                      
                      // Hiç resim yoksa placeholder
                      return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iI2Y1ZjVmNSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjAiIGZpbGw9IiM5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5BcmHDpyBSZXNtaTwvdGV4dD48L3N2Zz4=';
                    })()}
                    alt={`${car.brand || car.Brand} ${car.model || car.Car_Name}`}
                    onError={(e) => {
                      // Resim yüklenemezse placeholder göster
                      if (!e.target.src.includes('data:image/svg+xml')) {
                        e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iI2Y1ZjVmNSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjAiIGZpbGw9IiM5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5BcmHDpyBSZXNtaTwvdGV4dD48L3N2Zz4=';
                      }
                    }}
                    loading="lazy"
                  />
                  <div>
                    <h3>{car.brand} {car.model} {car.year}</h3>
                    <p>{car.category} • {car.transmission} • {car.seats} Koltuk</p>
                  </div>
                </div>
              </section>

              <section className="form-section">
                <h2>Kişisel Bilgiler</h2>
                <div className="form-row">
                  <div className="form-group">
                    <label>Ad *</label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Soyad *</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>E-posta *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Telefon *</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Ehliyet Numarası *</label>
                  <input
                    type="text"
                    name="licenseNumber"
                    value={formData.licenseNumber}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Yaş *</label>
                    <input
                      type="number"
                      name="age"
                      value={formData.age}
                      onChange={handleChange}
                      min="18"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Ülke *</label>
                    <input
                      type="text"
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
              </section>

              <section className="form-section">
                <h2>Tarih ve Lokasyon</h2>
                <div className="form-row">
                  <div className="form-group">
                    <label>Alış Tarihi *</label>
                    <input
                      type="date"
                      name="pickupDate"
                      value={formData.pickupDate}
                      onChange={handleChange}
                      min={new Date().toISOString().split('T')[0]}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Teslim Tarihi *</label>
                    <input
                      type="date"
                      name="dropoffDate"
                      value={formData.dropoffDate}
                      onChange={handleChange}
                      min={formData.pickupDate || new Date().toISOString().split('T')[0]}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>
                    <input
                      type="checkbox"
                      name="sameLocation"
                      checked={formData.sameLocation}
                      onChange={handleChange}
                    />
                    {' '}Aynı lokasyona teslim
                  </label>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Alış Şehri *</label>
                    <input
                      type="text"
                      name="pickupLocation.city"
                      value={formData.pickupLocation.city}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Alış Adresi *</label>
                    <input
                      type="text"
                      name="pickupLocation.address"
                      value={formData.pickupLocation.address}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                {!formData.sameLocation && (
                  <div className="form-row">
                    <div className="form-group">
                      <label>Teslim Şehri *</label>
                      <input
                        type="text"
                        name="dropoffLocation.city"
                        value={formData.dropoffLocation.city}
                        onChange={handleChange}
                        required={!formData.sameLocation}
                      />
                    </div>
                    <div className="form-group">
                      <label>Teslim Adresi *</label>
                      <input
                        type="text"
                        name="dropoffLocation.address"
                        value={formData.dropoffLocation.address}
                        onChange={handleChange}
                        required={!formData.sameLocation}
                      />
                    </div>
                  </div>
                )}
              </section>

              <div className="payment-section">
                <h2>Ödeme</h2>
                <div className="payment-summary">
                  <div className="payment-item">
                    <span>Araç Kiralama:</span>
                    <span>{(car.currency || 'EURO')} {calculateBasePrice().toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    <small>(Alış sırasında ödenecek)</small>
                  </div>
                  <div className="payment-item">
                    <span>Komisyon (%10):</span>
                    <span><strong>{(car.currency || 'EURO')} {calculateCommission().toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong></span>
                    <small>(Şimdi ödenecek)</small>
                  </div>
                  <div className="payment-item total">
                    <span>Ödenecek Tutar:</span>
                    <span><strong>{(car.currency || 'EURO')} {calculateCommission().toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong></span>
                  </div>
                </div>
                <p className="payment-info">
                  <strong>Not:</strong> Sadece komisyon ücreti şimdi ödenecektir. Araç kiralama ücreti alış sırasında ödenecektir.
                </p>
                <p className="payment-info" style={{fontSize: '12px', color: '#666', marginTop: '10px'}}>
                  Ödeme entegrasyonu yakında eklenecektir. Şu anda rezervasyon sadece API'ye kaydedilecektir.
                </p>
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-large"
                disabled={submitting || !formData.pickupDate || !formData.dropoffDate}
              >
                {submitting ? 'Rezervasyon Yapılıyor...' : 'Rezervasyonu Onayla'}
              </button>
            </form>
          </div>

          <aside className="reservation-summary">
            <div className="summary-box">
              <h3>Rezervasyon Özeti</h3>
              {formData.pickupDate && formData.dropoffDate && (
                <>
                  <div className="summary-item">
                    <span>Gün Sayısı:</span>
                    <strong>{calculateDays()} gün</strong>
                  </div>
                  <div className="summary-item">
                    <span>Araç Kiralama:</span>
                    <strong>{(car.currency || 'EURO')} {calculateBasePrice().toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>
                    <small style={{display: 'block', color: '#666', fontSize: '12px', marginTop: '4px'}}>
                      (Araç kiralama ücreti alış sırasında ödenecektir)
                    </small>
                  </div>
                  <div className="summary-item">
                    <span>Komisyon (%10):</span>
                    <strong>{(car.currency || 'EURO')} {calculateCommission().toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>
                  </div>
                  <div className="summary-item total">
                    <span>Şimdi Ödenecek:</span>
                    <strong>{(car.currency || 'EURO')} {calculateCommission().toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>
                    <small style={{display: 'block', color: '#666', fontSize: '12px', marginTop: '4px'}}>
                      (Sadece komisyon ücreti)
                    </small>
                  </div>
                </>
              )}
              {(!formData.pickupDate || !formData.dropoffDate) && (
                <div className="summary-item">
                  <span>Lütfen tarih seçin</span>
                </div>
              )}
            </div>

            <div className="info-box">
              <h4>Önemli Bilgiler</h4>
              <ul>
                <li>Rezervasyon 48 saat öncesine kadar ücretsiz iptal edilebilir</li>
                <li>Alış sırasında kredi kartı ve ehliyet gerekli</li>
                <li>Depozito alış sırasında alınacaktır</li>
                <li>Rezervasyon onayı e-posta ile gönderilecektir</li>
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}

export default Reservation

