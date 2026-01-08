import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { getCars } from '../services/api'
import './CarList.css'

function CarList() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [cars, setCars] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    category: '',
    transmission: '',
    minPrice: '',
    maxPrice: '',
    sortBy: 'price',
    order: 'asc'
  })

  useEffect(() => {
    fetchCars()
  }, [searchParams, filters])

  const fetchCars = async () => {
    try {
      setLoading(true)
      const params = {
        pickupId: searchParams.get('pickupId') || '',
        dropoffId: searchParams.get('dropoffId') || '',
        pickupDate: searchParams.get('pickupDate') || '',
        dropoffDate: searchParams.get('dropoffDate') || '',
        currency: 'EURO',
        ...filters
      }
      
      // API service'i kullan (production'da doğru URL'i kullanır)
      const carsData = await getCars(params)
      
      // Debug: İlk araç verisini kontrol et - rezervasyon için gerekli alanlar
      if (carsData && carsData.length > 0) {
        const firstCar = carsData[0];
        console.log('🔍 CarList: İlk araç verisi:', {
          rezId: firstCar.rezId,
          carsParkId: firstCar.carsParkId,
          groupId: firstCar.groupId,
          brand: firstCar.brand,
          model: firstCar.model,
          pricePerDay: firstCar.pricePerDay,
          hasAllFields: !!(firstCar.rezId && firstCar.carsParkId && firstCar.groupId),
          car: firstCar
        });
        
        // Eğer eksik alanlar varsa uyar
        if (!firstCar.rezId || !firstCar.carsParkId || !firstCar.groupId) {
          console.error('❌ CarList: İlk araçta rezervasyon için gerekli alanlar eksik!', {
            rezId: firstCar.rezId,
            carsParkId: firstCar.carsParkId,
            groupId: firstCar.groupId,
            car: firstCar
          });
        }
      }
      
      setCars(carsData || [])
    } catch (error) {
      console.error('Araçlar yüklenirken hata:', error)
      setCars([])
      
      // API hatasını kullanıcıya göster
      // getCars fonksiyonu error'u throw etmiyor, boş array döndürüyor
      // Ama yine de hata mesajı göstermek için kontrol edelim
      if (error && error.response) {
        const status = error.response.status
        const errorData = error.response.data || {}
        const errorMsg = String(errorData.error || errorData.message || 'Bilinmeyen hata')
        const details = String(errorData.details || '')
        
        // 404 Not Found
        if (status === 404) {
          alert('⚠️ Endpoint Bulunamadı\n\n' +
                'Backend endpoint\'i bulunamadı. Lütfen:\n' +
                '• Backend\'in deploy edildiğinden emin olun\n' +
                '• Sayfayı yenileyin\n' +
                '• Sorun devam ederse backend\'i kontrol edin')
        }
        // 500 Internal Server Error
        else if (status === 500) {
          alert('⚠️ Sunucu Hatası\n\n' +
                'Sunucuda bir hata oluştu. Lütfen:\n' +
                '• Sayfayı yenileyin\n' +
                '• Birkaç dakika sonra tekrar deneyin\n' +
                '• Sorun devam ederse API sağlayıcısı ile iletişime geçin: 0312 870 10 35\n\n' +
                'Hata: ' + errorMsg)
        }
        // 400 Bad Request veya diğer hatalar
        else if (typeof errorMsg === 'string' && errorMsg.includes('Man Süresi')) {
          alert('⚠️ Minimum Kiralama Süresi Hatası\n\n' +
                'Seçtiğiniz tarih aralığı için araç bulunamadı.\n\n' +
                'Bu durumun nedenleri:\n' +
                '• Minimum kiralama süresi gereksinimi\n' +
                '• API sisteminde tarife ayarları eksik\n\n' +
                'Lütfen:\n' +
                '• Farklı tarih aralığı deneyin\n' +
                '• API sağlayıcısı ile iletişime geçin: 0312 870 10 35')
        } else {
          alert(errorMsg + (details ? '\n\n' + details : ''))
        }
      } else if (error && error.request) {
        // İstek gönderildi ama yanıt alınamadı
        alert('⚠️ Bağlantı Hatası\n\n' +
              'Sunucuya bağlanılamadı. Lütfen:\n' +
              '• İnternet bağlantınızı kontrol edin\n' +
              '• Backend sunucusunun çalıştığından emin olun\n' +
              '• Sayfayı yenileyin')
      } else if (error) {
        // İstek hazırlanırken hata oluştu
        alert('⚠️ Hata\n\n' +
              'Araçlar yüklenirken bir hata oluştu: ' + (error.message || 'Bilinmeyen hata') + '\n\n' +
              'Lütfen tekrar deneyin.')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (key, value) => {
    setFilters({ ...filters, [key]: value })
  }

  if (loading) {
    return <div className="container"><div className="loading">Yükleniyor...</div></div>
  }

  return (
    <div className="car-list-page">
      <div className="container">
        <h1 className="page-title">Müsait Araçlar</h1>
        
        <div className="car-list-layout">
          <aside className="filters">
            <h3>Filtreler</h3>
            
            <div className="filter-group">
              <label>Kategori</label>
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
              >
                <option value="">Tümü</option>
                <option value="Economy">Economy</option>
                <option value="Compact">Compact</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Standard">Standard</option>
                <option value="Full Size">Full Size</option>
                <option value="Premium">Premium</option>
                <option value="Luxury">Luxury</option>
                <option value="SUV">SUV</option>
                <option value="Van">Van</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Vites</label>
              <select
                value={filters.transmission}
                onChange={(e) => handleFilterChange('transmission', e.target.value)}
              >
                <option value="">Tümü</option>
                <option value="Manual">Manuel</option>
                <option value="Automatic">Otomatik</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Fiyat Aralığı</label>
              <div className="price-range">
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.minPrice}
                  onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                />
                <span>-</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.maxPrice}
                  onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                />
              </div>
            </div>

            <div className="filter-group">
              <label>Sıralama</label>
              <select
                value={`${filters.sortBy}-${filters.order}`}
                onChange={(e) => {
                  const [sortBy, order] = e.target.value.split('-')
                  setFilters({ ...filters, sortBy, order })
                }}
              >
                <option value="price-asc">Fiyat: Düşükten Yükseğe</option>
                <option value="price-desc">Fiyat: Yüksekten Düşüğe</option>
                <option value="rating-desc">En Yüksek Puan</option>
              </select>
            </div>
          </aside>

          <main className="cars-grid">
            {cars.length === 0 ? (
              <div className="no-cars">
                <h3>Araç bulunamadı</h3>
                <p>Seçtiğiniz tarih ve lokasyon için müsait araç bulunmuyor.</p>
                <p style={{fontSize: '14px', color: '#666', marginTop: '10px'}}>
                  Not: API sisteminde tarife ayarları yapılması gerekiyor. 
                  Lütfen API sağlayıcısı ile iletişime geçin: 0312 870 10 35
                </p>
              </div>
            ) : (
              cars.map((car, index) => (
                <div key={car._id || car.externalId || index} className="car-card">
                  <img 
                    src={(() => {
                      // Backend'den gelen image field'ını öncelikle kullan
                      if (car.image && car.image.trim() !== '' && !car.image.includes('data:image/svg+xml')) {
                        // Backend zaten normalize etmiş, direkt kullan
                        return car.image;
                      }
                      
                      // Eğer backend'den image gelmediyse, diğer alanları kontrol et
                      const possibleImages = [
                        car.Image_Path,
                        car.image_Path,
                        car.image_path,
                        car.IMAGE_PATH,
                        car.Image,
                        car.image,
                        car.IMG,
                        car.img
                      ];
                      
                      for (const img of possibleImages) {
                        if (img && img.trim() !== '' && img !== 'null' && img !== 'undefined' && !img.includes('data:image/svg+xml')) {
                          // Eğer tam URL değilse ve base64 değilse, base URL ekle
                          if (img.startsWith('data:') || img.startsWith('https://')) {
                            return img;
                          } else if (img.startsWith('http://')) {
                            return img.replace('http://', 'https://');
                          } else if (img.startsWith('/')) {
                            return `https://xdrivejson.turevsistem.com${img}`;
                          } else {
                            return `https://xdrivejson.turevsistem.com/${img}`;
                          }
                        }
                      }
                      
                      // Hiç resim yoksa placeholder
                      return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iI2Y1ZjVmNSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjAiIGZpbGw9IiM5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5BcmHDpyBSZXNtaTwvdGV4dD48L3N2Zz4=';
                    })()}
                    alt={`${car.brand || car.Brand} ${car.model || car.Car_Name}`} 
                    onError={(e) => {
                      // Resim yüklenemezse placeholder göster
                      console.warn('🖼️ CarList: Resim yüklenemedi:', e.target.src);
                      
                      // Eğer hata sayısı 3'ten azsa, alternatif URL'leri dene
                      const errorCount = parseInt(e.target.dataset.errorCount || '0');
                      if (errorCount < 3 && !e.target.src.includes('data:image/svg+xml')) {
                        const currentSrc = e.target.src;
                        const baseUrl = 'https://xdrivejson.turevsistem.com';
                        const carWebId = car.car_web_id || car.Car_Web_ID || '4';
                        const groupId = car.groupId || car.group_id || '395';
                        const rezId = (car.rezId || car.rez_id || '').replace(/^XML-/, '').replace(/^xml-/i, '');
                        
                        // Alternatif URL'leri sırayla dene
                        const alternatives = [
                          `${baseUrl}/images/car_${carWebId}.png`,
                          `${baseUrl}/cars/${carWebId}.jpg`,
                          `${baseUrl}/arac/${carWebId}.jpg`,
                          `${baseUrl}/images/group_${groupId}.jpg`,
                          `${baseUrl}/groups/${groupId}.jpg`,
                          `${baseUrl}/images/rez_${rezId}.jpg`,
                          `${baseUrl}/cars/${rezId}.jpg`
                        ];
                        
                        // Şu anki URL alternatiflerden biri mi kontrol et
                        const currentIndex = alternatives.indexOf(currentSrc);
                        if (currentIndex >= 0 && currentIndex < alternatives.length - 1) {
                          // Bir sonraki alternatifi dene
                          e.target.src = alternatives[currentIndex + 1];
                          e.target.dataset.errorCount = String(errorCount + 1);
                          return;
                        } else if (currentIndex === -1 && alternatives.length > 0) {
                          // İlk alternatifi dene
                          e.target.src = alternatives[0];
                          e.target.dataset.errorCount = '1';
                          return;
                        }
                      }
                      
                      // Tüm alternatifler denendi, placeholder göster
                      if (!e.target.src.includes('data:image/svg+xml')) {
                        e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iI2Y1ZjVmNSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjAiIGZpbGw9IiM5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5BcmHDpyBSZXNtaTwvdGV4dD48L3N2Zz4=';
                      }
                    }}
                    onLoad={() => {
                      // Resim başarıyla yüklendiğinde logla (debug için)
                      if (index === 0) {
                        console.log('✅ İlk araç resmi yüklendi:', car.image || car.Image_Path);
                      }
                    }}
                    loading="lazy"
                  />
                  <div className="car-card-content">
                    <h3>{(car.brand || car.Brand || 'Araç')} {(car.model || car.Car_Name || car.Model || 'Bilinmiyor')}</h3>
                    <p className="car-year">{car.year || new Date().getFullYear()}</p>
                    <div className="car-details">
                      <span>{car.category || car.Car_Name || 'Standard'}</span>
                      <span>•</span>
                      <span>{car.transmission || car.Transmission || 'Otomatik'}</span>
                      <span>•</span>
                      <span>{(car.seats || car.Chairs || 5)} Koltuk</span>
                    </div>
                    <div className="car-rating">
                      <span className="stars">★★★★★</span>
                      <span>{(car.rating || 4.5).toFixed(1)} ({(car.reviewCount || 0)} değerlendirme)</span>
                    </div>
                    <div className="car-price">
                      <span className="price">
                        {(car.currency || 'EURO')} {
                          (() => {
                            // Gün sayısını hesapla
                            const pickupDate = searchParams.get('pickupDate');
                            const dropoffDate = searchParams.get('dropoffDate');
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
                          })()
                        }
                      </span>
                      <span className="price-label">
                        {(() => {
                          const pickupDate = searchParams.get('pickupDate');
                          const dropoffDate = searchParams.get('dropoffDate');
                          let days = 1;
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
                    <Link 
                      to={`/cars/${car._id || car.externalId || car.rezId || car.carsParkId || 'unknown'}`} 
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
                        searchParams: Object.fromEntries(searchParams) 
                      }} 
                      className="btn btn-primary"
                      onClick={() => {
                        // CarDetail'e geçmeden önce car objesini kontrol et
                        console.log('🔍 CarList: CarDetail\'e geçiliyor, car objesi:', {
                          rezId: car.rezId || car.Rez_ID || car.rez_ID || car.RezID,
                          carsParkId: car.carsParkId || car.Cars_Park_ID || car.cars_Park_ID || car.CarsParkID,
                          groupId: car.groupId || car.Group_ID || car.group_ID || car.GroupID,
                          hasAllFields: !!(car.rezId || car.Rez_ID || car.rez_ID || car.RezID) && 
                                        !!(car.carsParkId || car.Cars_Park_ID || car.cars_Park_ID || car.CarsParkID) && 
                                        !!(car.groupId || car.Group_ID || car.group_ID || car.GroupID),
                          car: car
                        });
                      }}
                    >
                      Detayları Gör
                    </Link>
                  </div>
                </div>
              ))
            )}
          </main>
        </div>
      </div>
    </div>
  )
}

export default CarList

