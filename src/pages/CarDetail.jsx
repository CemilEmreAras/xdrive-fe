import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link, useSearchParams, useLocation } from 'react-router-dom'
import { getCar } from '../services/api'
import './CarDetail.css'

function CarDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const [car, setCar] = useState(location.state?.car || null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Önce localStorage'dan car'ı yükle
    const savedCar = localStorage.getItem('xdrive_carDetail')
    const savedCarId = localStorage.getItem('xdrive_carDetailId')
    
    // Eğer state'den car geldiyse, onu kullan ve localStorage'a kaydet
    if (location.state?.car) {
      const stateCar = location.state.car;
      // Car objesinin tüm alanlarını kontrol et
      console.log('🔍 CarDetail: State\'den gelen car objesi:', {
        rezId: stateCar.rezId,
        carsParkId: stateCar.carsParkId,
        groupId: stateCar.groupId,
        location: stateCar.location,
        hasAllFields: !!(stateCar.rezId && stateCar.carsParkId && stateCar.groupId)
      });
      
      // TÜM car objesi alanlarını göster
      console.log('🔍 CarDetail: Car objesi TÜM alanları:', {
        allKeys: Object.keys(stateCar),
        allValues: stateCar,
        rezIdVariants: {
          rezId: stateCar.rezId,
          Rez_ID: stateCar.Rez_ID,
          rez_ID: stateCar.rez_ID,
          RezID: stateCar.RezID
        },
        carsParkIdVariants: {
          carsParkId: stateCar.carsParkId,
          Cars_Park_ID: stateCar.Cars_Park_ID,
          cars_Park_ID: stateCar.cars_Park_ID,
          CarsParkID: stateCar.CarsParkID
        },
        groupIdVariants: {
          groupId: stateCar.groupId,
          Group_ID: stateCar.Group_ID,
          group_ID: stateCar.group_ID,
          GroupID: stateCar.GroupID
        }
      });
      
      // Eğer gerekli alanlar eksikse uyar
      if (!stateCar.rezId || !stateCar.carsParkId || !stateCar.groupId) {
        console.error('❌ CarDetail: Car objesinde rezId, carsParkId veya groupId eksik!', {
          rezId: stateCar.rezId,
          carsParkId: stateCar.carsParkId,
          groupId: stateCar.groupId,
          car: stateCar,
          allKeys: Object.keys(stateCar)
        });
      }
      
      setCar(stateCar)
      // localStorage'a kaydet
      localStorage.setItem('xdrive_carDetail', JSON.stringify(stateCar))
      if (id) {
        localStorage.setItem('xdrive_carDetailId', id)
      }
      setLoading(false)
      return
    }
    
    // Eğer state'den car gelmediyse, localStorage'dan yükle
    if (savedCar && savedCarId === id) {
      try {
        const parsed = JSON.parse(savedCar)
        setCar(parsed)
        setLoading(false)
        console.log('✅ CarDetail: localStorage\'dan car yüklendi')
        // Yine de arka planda güncel veriyi çek
        if (id && id !== 'undefined') {
          fetchCar()
        }
        return
      } catch (error) {
        console.error('Error loading saved car:', error)
      }
    }
    
    if (id && id !== 'undefined') {
      fetchCar()
    } else {
      setLoading(false)
      console.error('Araç ID bulunamadı')
    }
  }, [id, location.state])

  const fetchCar = async () => {
    if (!id || id === 'undefined') {
      setLoading(false)
      return
    }
    
    try {
      // API service fonksiyonunu kullan (production'da doğru URL'i kullanır)
      const carData = await getCar(id)
      setCar(carData)
      // localStorage'a kaydet
      localStorage.setItem('xdrive_carDetail', JSON.stringify(carData))
      localStorage.setItem('xdrive_carDetailId', id)
      console.log('✅ CarDetail: Car localStorage\'a kaydedildi')
    } catch (error) {
      console.error('Araç detayları yüklenirken hata:', error)
      // Eğer API'den bulunamazsa, state'den gelen car'ı kullan
      if (location.state?.car) {
        setCar(location.state.car)
        localStorage.setItem('xdrive_carDetail', JSON.stringify(location.state.car))
        localStorage.setItem('xdrive_carDetailId', id)
      }
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="container"><div className="loading">Yükleniyor...</div></div>
  }

  if (!car) {
    return <div className="container"><div className="error">Araç bulunamadı</div></div>
  }

  return (
    <div className="car-detail-page">
      <div className="container">
        <button onClick={() => navigate(-1)} className="back-btn">← Geri</button>
        
        <div className="car-detail-layout">
          <div className="car-detail-main">
            <img 
              src={(() => {
                // Backend'den gelen image field'ını öncelikle kullan
                if (car.image && car.image.trim() !== '' && !car.image.includes('data:image/svg+xml')) {
                  let imageUrl = car.image;
                  
                  // Eğer relative path ise (proxy URL), API base URL ekle
                  if (imageUrl.startsWith('/api/images/proxy')) {
                    const apiBaseUrl = import.meta.env.PROD 
                      ? 'https://xdrive-be.vercel.app'
                      : import.meta.env.VITE_API_URL || 'http://localhost:5001';
                    imageUrl = `${apiBaseUrl}${imageUrl}`;
                  }
                  
                  // Resim URL'ini logla
                  console.log(`🖼️ CarDetail: ${car.brand || car.Brand} ${car.model || car.Car_Name}`);
                  console.log(`  📋 Backend image:`, car.image);
                  console.log(`  🔗 Final image URL:`, imageUrl);
                  
                  return imageUrl;
                }
                
                // Hiç resim yoksa placeholder
                console.warn(`⚠️ CarDetail: ${car.brand || car.Brand} ${car.model || car.Car_Name} - Resim yok, placeholder kullanılıyor`);
                return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iI2Y1ZjVmNSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjAiIGZpbGw9IiM5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5BcmHDpyBSZXNtaTwvdGV4dD48L3N2Zz4=';
              })()}
              alt={`${car.brand || car.Brand} ${car.model || car.Car_Name}`} 
              className="car-detail-image"
              onError={(e) => {
                // Resim yüklenemezse placeholder göster
                console.warn(`🖼️ CarDetail: Resim yüklenemedi - ${car.brand || car.Brand} ${car.model || car.Car_Name}`);
                console.warn(`  ❌ Hatalı URL:`, e.target.src);
                if (!e.target.src.includes('data:image/svg+xml')) {
                  e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iI2Y1ZjVmNSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjAiIGZpbGw9IiM5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5BcmHDpyBSZXNtaTwvdGV4dD48L3N2Zz4=';
                }
              }}
              onLoad={(e) => {
                console.log(`✅ CarDetail: Resim yüklendi - ${car.brand || car.Brand} ${car.model || car.Car_Name}`);
                console.log(`  🔗 URL:`, e.target.src);
              }}
            />
            
            <div className="car-info">
              <h1>{(car.brand || car.Brand || 'Araç')} {(car.model || car.Car_Name || car.Model || 'Bilinmiyor')} {car.year || new Date().getFullYear()}</h1>
              
              <div className="car-specs">
                <div className="spec-item">
                  <strong>Kategori:</strong> {car.category || car.Car_Name || 'Standard'}
                </div>
                <div className="spec-item">
                  <strong>Vites:</strong> {car.transmission || car.Transmission || 'Otomatik'}
                </div>
                <div className="spec-item">
                  <strong>Koltuk Sayısı:</strong> {car.seats || car.Chairs || 5}
                </div>
                <div className="spec-item">
                  <strong>Lokasyon:</strong> {car.location?.city || 'Belirtilmemiş'}
                </div>
              </div>

              {car.features && car.features.length > 0 && (
                <div className="car-features">
                  <h3>Özellikler</h3>
                  <ul>
                    {car.features.map((feature, index) => (
                      <li key={index}>{feature}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="car-rating-detail">
                <div className="rating-stars">★★★★★</div>
                <div>
                  <strong>{car.rating}</strong> / 5.0
                  <span className="review-count"> ({car.reviewCount} değerlendirme)</span>
                </div>
              </div>
            </div>
          </div>

          <aside className="reservation-sidebar">
            <div className="price-box">
              <div className="price-large">
                <span className="currency">{car.currency || 'EURO'}</span>
                <span className="amount">
                  {(() => {
                    // Gün sayısını hesapla
                    const pickupDate = searchParams.get('pickupDate') || location.state?.searchParams?.pickupDate;
                    const dropoffDate = searchParams.get('dropoffDate') || location.state?.searchParams?.dropoffDate;
                    let days = car.days || car.Days || 1;
                    
                    // Eğer gün sayısı yoksa, tarihlerden hesapla
                    if (pickupDate && dropoffDate) {
                      const pickup = new Date(pickupDate);
                      const dropoff = new Date(dropoffDate);
                      const diffTime = Math.abs(dropoff - pickup);
                      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                      if (diffDays > 0) {
                        days = diffDays;
                      }
                    }
                    
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
                    
                    return totalPriceValue > 0
                      ? totalPriceValue.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                      : 'Fiyat bilgisi yok';
                  })()}
                </span>
                <span className="period">
                  {(() => {
                    const pickupDate = searchParams.get('pickupDate') || location.state?.searchParams?.pickupDate;
                    const dropoffDate = searchParams.get('dropoffDate') || location.state?.searchParams?.dropoffDate;
                    let days = car.days || car.Days || 1;
                    if (pickupDate && dropoffDate) {
                      const pickup = new Date(pickupDate);
                      const dropoff = new Date(dropoffDate);
                      const diffTime = Math.abs(dropoff - pickup);
                      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                      if (diffDays > 0) {
                        days = diffDays;
                      }
                    }
                    return `(${days} gün)`;
                  })()}
                </span>
              </div>
              <p className="price-note">Tüm vergiler dahil</p>
            </div>

            <Link 
              to={`/reservation/${car._id || car.externalId || car.rezId || car.carsParkId || car.id || 'unknown'}`}
              state={{ 
                car: {
                  ...car,
                  // Tüm gerekli alanları koru ve normalize et
                  rezId: car.rezId || car.Rez_ID || car.rez_ID || car.RezID,
                  carsParkId: car.carsParkId || car.Cars_Park_ID || car.cars_Park_ID || car.CarsParkID,
                  groupId: car.groupId || car.Group_ID || car.group_ID || car.GroupID,
                  location: car.location || {
                    pickupId: searchParams.get('pickupId'),
                    dropoffId: searchParams.get('dropoffId')
                  }
                }, 
                searchParams: {
                  pickupId: searchParams.get('pickupId'),
                  dropoffId: searchParams.get('dropoffId'),
                  pickupDate: searchParams.get('pickupDate'),
                  dropoffDate: searchParams.get('dropoffDate')
                }
              }}
              className="btn btn-primary btn-large"
              onClick={() => {
                // Rezervasyon sayfasına geçmeden önce car objesini kontrol et
                const carId = car._id || car.externalId || car.rezId || car.carsParkId || car.id || 'unknown';
                const normalizedCar = {
                  ...car,
                  rezId: car.rezId || car.Rez_ID || car.rez_ID || car.RezID,
                  carsParkId: car.carsParkId || car.Cars_Park_ID || car.cars_Park_ID || car.CarsParkID,
                  groupId: car.groupId || car.Group_ID || car.group_ID || car.GroupID
                };
                
                console.log('🔍 CarDetail: Rezervasyon sayfasına geçiliyor:', {
                  carId: carId,
                  rezId: normalizedCar.rezId,
                  carsParkId: normalizedCar.carsParkId,
                  groupId: normalizedCar.groupId,
                  hasAllFields: !!(normalizedCar.rezId && normalizedCar.carsParkId && normalizedCar.groupId),
                  car: normalizedCar,
                  originalCar: car,
                  allCarKeys: Object.keys(car)
                });
                
                // Eğer eksik alanlar varsa uyar
                if (!normalizedCar.rezId || !normalizedCar.carsParkId || !normalizedCar.groupId) {
                  console.error('❌ CarDetail: Rezervasyon için gerekli alanlar eksik!', {
                    rezId: normalizedCar.rezId,
                    carsParkId: normalizedCar.carsParkId,
                    groupId: normalizedCar.groupId,
                    car: normalizedCar,
                    originalCar: car,
                    allKeys: Object.keys(car),
                    allValues: car
                  });
                }
              }}
            >
              Rezervasyon Yap
            </Link>

            <div className="info-box">
              <h4>Rezervasyon Bilgileri</h4>
              <ul>
                <li>✓ Ücretsiz iptal (48 saat öncesine kadar)</li>
                <li>✓ Tüm zorunlu ücretler dahil</li>
                <li>✓ 24/7 müşteri desteği</li>
                <li>✓ Anında onay</li>
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}

export default CarDetail

