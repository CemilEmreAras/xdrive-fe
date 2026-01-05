import { useState, useEffect } from 'react'
import { useParams, Link, useLocation } from 'react-router-dom'
import { getReservation } from '../services/api'
import './ReservationConfirmation.css'

function ReservationConfirmation() {
  const { reservationNumber } = useParams()
  const location = useLocation()
  const [reservation, setReservation] = useState(location.state?.reservation || null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Eğer state'den rezervasyon geldiyse, API'ye gerek yok
    if (location.state?.reservation) {
      setReservation(location.state.reservation)
      setLoading(false)
      return
    }
    
    // State yoksa, önce localStorage'dan kontrol et
    const savedReservation = localStorage.getItem(`reservation_${reservationNumber}`)
    if (savedReservation) {
      try {
        setReservation(JSON.parse(savedReservation))
        setLoading(false)
        return
      } catch (e) {
        console.error('LocalStorage rezervasyon parse hatası:', e)
      }
    }
    
    // LocalStorage'da da yoksa API'den çek
    fetchReservation()
  }, [reservationNumber, location.state])

  const fetchReservation = async () => {
    try {
      // API service fonksiyonunu kullan (production'da doğru URL'i kullanır)
      const reservationData = await getReservation(reservationNumber)
      setReservation(reservationData)
      // API'den geldiyse localStorage'a kaydet
      localStorage.setItem(`reservation_${reservationNumber}`, JSON.stringify(reservationData))
    } catch (error) {
      console.error('Rezervasyon bilgileri yüklenirken hata:', error)
      // API hatası varsa, localStorage'dan tekrar dene
      const savedReservation = localStorage.getItem(`reservation_${reservationNumber}`)
      if (savedReservation) {
        try {
          setReservation(JSON.parse(savedReservation))
        } catch (e) {
          console.error('LocalStorage rezervasyon parse hatası:', e)
        }
      }
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="container"><div className="loading">Yükleniyor...</div></div>
  }

  if (!reservation) {
    return (
      <div className="container">
        <div className="error">Rezervasyon bulunamadı</div>
      </div>
    )
  }

  const car = reservation.car

  return (
    <div className="confirmation-page">
      <div className="container">
        <div className="confirmation-card">
          <div className="success-icon">✓</div>
          <h1>Rezervasyonunuz Onaylandı!</h1>
          <p className="reservation-number">
            Rezervasyon No: <strong>{reservation.reservationNumber}</strong>
          </p>

          <div className="confirmation-details">
            <div className="detail-section">
              <h3>Araç Bilgileri</h3>
              <div className="car-info-confirm">
                <img 
                  src={(() => {
                    const possibleImages = [
                      car.image,
                      car.Image_Path,
                      car.image_Path,
                      car.image_path
                    ];
                    for (const img of possibleImages) {
                      if (img && img.trim() !== '' && img !== 'data:image/svg+xml') {
                        if (img.startsWith('data:') || img.startsWith('http://') || img.startsWith('https://')) {
                          return img;
                        } else if (img.startsWith('/')) {
                          return `http://xdrivejson.turevsistem.com${img}`;
                        } else {
                          return `http://xdrivejson.turevsistem.com/${img}`;
                        }
                      }
                    }
                    return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iI2Y1ZjVmNSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjAiIGZpbGw9IiM5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5BcmHDpyBSZXNtaTwvdGV4dD48L3N2Zz4=';
                  })()}
                  alt={`${car.brand || car.Brand} ${car.model || car.Car_Name}`}
                  onError={(e) => {
                    if (!e.target.src.includes('data:image/svg+xml')) {
                      e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iI2Y1ZjVmNSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjAiIGZpbGw9IiM5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5BcmHDpyBSZXNtaTwvdGV4dD48L3N2Zz4=';
                    }
                  }}
                />
                <div>
                  <h4>{(car.brand || car.Brand)} {(car.model || car.Car_Name)} {car.year || new Date().getFullYear()}</h4>
                  <p>{car.category || car.Car_Name || 'Standard'} • {car.transmission || 'Otomatik'} • {car.seats || car.Chairs || 5} Koltuk</p>
                </div>
              </div>
            </div>

            <div className="detail-section">
              <h3>Rezervasyon Detayları</h3>
              <div className="detail-grid">
                <div className="detail-item">
                  <strong>Alış Tarihi:</strong>
                  <span>{new Date(reservation.pickupDate).toLocaleDateString('tr-TR')}</span>
                </div>
                <div className="detail-item">
                  <strong>Teslim Tarihi:</strong>
                  <span>{new Date(reservation.dropoffDate).toLocaleDateString('tr-TR')}</span>
                </div>
                <div className="detail-item">
                  <strong>Alış Lokasyonu:</strong>
                  <span>{reservation.pickupLocation?.city}, {reservation.pickupLocation?.address}</span>
                </div>
                {!reservation.dropoffLocation?.sameLocation && (
                  <div className="detail-item">
                    <strong>Teslim Lokasyonu:</strong>
                    <span>{reservation.dropoffLocation?.city}, {reservation.dropoffLocation?.address}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="detail-section">
              <h3>Kişisel Bilgiler</h3>
              <div className="detail-grid">
                <div className="detail-item">
                  <strong>Ad Soyad:</strong>
                  <span>{reservation.user.firstName} {reservation.user.lastName}</span>
                </div>
                <div className="detail-item">
                  <strong>E-posta:</strong>
                  <span>{reservation.user.email}</span>
                </div>
                <div className="detail-item">
                  <strong>Telefon:</strong>
                  <span>{reservation.user.phone}</span>
                </div>
              </div>
            </div>

            <div className="detail-section">
              <h3>Ödeme Bilgileri</h3>
              <div className="price-summary">
                {reservation.basePrice && (
                  <div className="price-item">
                    <span>Araç Kiralama:</span>
                    <strong>{reservation.currency} {reservation.basePrice.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>
                  </div>
                )}
                {reservation.commission && (
                  <div className="price-item">
                    <span>Komisyon (%10):</span>
                    <strong>{reservation.currency} {reservation.commission.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>
                  </div>
                )}
                <div className="price-item">
                  <span>Toplam Tutar:</span>
                  <strong>{reservation.currency} {(reservation.totalPrice || 0).toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>
                </div>
                {reservation.paymentAmount && (
                  <div className="price-item">
                    <span>Ödenecek Tutar:</span>
                    <strong>{reservation.currency} {reservation.paymentAmount.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>
                    <small style={{display: 'block', color: '#666', fontSize: '12px', marginTop: '4px'}}>
                      (Sadece komisyon - araç kiralama alış sırasında ödenecek)
                    </small>
                  </div>
                )}
                <div className="price-item">
                  <span>Durum:</span>
                  <span className={`status status-${reservation.status}`}>
                    {reservation.status === 'pending' && 'Beklemede'}
                    {reservation.status === 'confirmed' && 'Onaylandı'}
                    {reservation.status === 'cancelled' && 'İptal Edildi'}
                    {reservation.status === 'completed' && 'Tamamlandı'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="confirmation-actions">
            <Link to="/" className="btn btn-primary">
              Ana Sayfaya Dön
            </Link>
            <button
              onClick={() => window.print()}
              className="btn btn-secondary"
            >
              Yazdır
            </button>
          </div>

          <div className="confirmation-note">
            <p>
              <strong>Not:</strong> Rezervasyon onayınız {reservation.user.email} adresine gönderilmiştir.
              Rezervasyonunuzu 48 saat öncesine kadar ücretsiz iptal edebilirsiniz.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ReservationConfirmation

