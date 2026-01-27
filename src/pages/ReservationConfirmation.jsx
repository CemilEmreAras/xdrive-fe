import { useState, useEffect } from 'react'
import { useParams, Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { getReservation } from '../services/api'

const isDev = import.meta.env.DEV

function ReservationConfirmation() {
  const { t } = useTranslation()
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
        if (isDev) {
          console.error('LocalStorage rezervasyon parse hatası:', e)
        }
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
      if (isDev) {
        console.error('Rezervasyon bilgileri yüklenirken hata:', error)
      }
      // API hatası varsa, localStorage'dan tekrar dene
      const savedReservation = localStorage.getItem(`reservation_${reservationNumber}`)
      if (savedReservation) {
        try {
          setReservation(JSON.parse(savedReservation))
        } catch (e) {
          if (isDev) {
            console.error('LocalStorage rezervasyon parse hatası:', e)
          }
        }
      }
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="max-w-[1200px] mx-auto px-5"><div className="text-center py-[60px] text-lg text-[#666]">{t('reservationConfirmation.loading')}</div></div>
  }

  if (!reservation) {
    return (
      <div className="max-w-[1200px] mx-auto px-5">
        <div className="text-center py-[60px] text-lg text-red-600">{t('reservationConfirmation.notFound')}</div>
      </div>
    )
  }

  const car = reservation.car

  // Araç kategorisi (group_str) ve şanzıman / koltuk bilgilerini API'den gelen veriye göre ve i18n ile hazırla
  const categoryRaw = (car.group_str || car.groupStr || car.Group_Str || car.category || '').trim().toUpperCase()
  const categoryMap = {
    'STANDARD': t('common.standard'),
    'MINI': t('common.mini'),
    'ECONOMY': t('common.economy'),
    'COMPACT': t('common.compact'),
    'INTERMEDIATE': t('common.intermediate'),
    'MIDSIZE': t('common.midsize')
  }
  const categoryTag = categoryMap[categoryRaw] || categoryRaw.charAt(0) + categoryRaw.slice(1).toLowerCase() || t('common.standard')

  const transmissionStr = (car.transmission || car.Transmission || '').toLowerCase()
  const isManual = transmissionStr.includes('manuel') || transmissionStr.includes('manual') || transmissionStr === 'm'
  const transmissionText = isManual ? t('common.manual') : t('common.automatic')

  const seats = car.seats || car.Seats || car.chairs || car.Chairs || 5

  return (
    <div className="py-10 sm:py-10 md:py-10 min-h-[80vh]">
      <div className="max-w-[1200px] mx-auto px-5 sm:px-6 md:px-8 lg:px-10">
        <div className="max-w-[800px] mx-auto bg-white p-8 sm:p-10 md:p-12 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.1)] text-center">
          <div className="w-16 sm:w-20 h-16 sm:h-20 bg-[#28a745] text-white rounded-full flex items-center justify-center text-3xl sm:text-4xl md:text-[48px] mx-auto mb-8">✓</div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl text-[#333] mb-4">{t('reservationConfirmation.title')}</h1>
          <p className="text-base sm:text-lg md:text-lg text-[#666] mb-10">
            {t('reservationConfirmation.reservationNo')}: <strong className="text-[#ef4444] text-lg sm:text-xl md:text-xl">{reservation.externalRezId || reservation.reservationNumber}</strong>
          </p>

          <div className="text-left mb-10">
            <div className="mb-8 pb-6 border-b-2 border-[#f0f0f0] last:border-b-0">
              <h3 className="text-lg sm:text-xl md:text-xl text-[#333] mb-5">{t('reservationConfirmation.carInformation')}</h3>
              <div className="flex flex-col sm:flex-row gap-5 p-5 bg-[#f8f9fa] rounded-lg">
                <img
                  src={(() => {
                    // Backend'den gelen image field'ını direkt kullan (artık direkt https://t1.trvcar.com/XDriveDzn/ formatında)
                    if (car.image && car.image.trim() !== '' && !car.image.includes('data:image/svg+xml')) {
                      // Backend artık direkt https://t1.trvcar.com/XDriveDzn/{image_path} formatında URL döndürüyor
                      const imageUrl = car.image;

                      // Resim URL'ini logla (sadece development)
                      if (isDev) {
                        console.log(`🖼️ ReservationConfirmation: ${car.brand || car.Brand} ${car.model || car.Car_Name}`)
                        console.log(`  🔗 Image URL:`, imageUrl)
                      }

                      return imageUrl;
                    }

                    // Hiç resim yoksa placeholder
                    if (isDev) {
                      console.warn(`⚠️ ReservationConfirmation: ${car.brand || car.Brand} ${car.model || car.Car_Name} - Resim yok, placeholder kullanılıyor`)
                    }
                    return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iI2Y1ZjVmNSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjAiIGZpbGw9IiM5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5BcmHDpyBSZXNtaTwvdGV4dD48L3N2Zz4=';
                  })()}
                  alt={`${car.brand || car.Brand} ${car.model || car.Car_Name}`}
                  className="w-full sm:w-[150px] h-auto sm:h-[100px] object-cover rounded-md"
                  onError={(e) => {
                    if (!e.target.src.includes('data:image/svg+xml')) {
                      e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iI2Y1ZjVmNSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjAiIGZpbGw9IiM5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5BcmHDpyBSZXNtaTwvdGV4dD48L3N2Zz4=';
                    }
                  }}
                />
                <div className="text-center sm:text-left">
                  <h4 className="mb-1.5 text-[#333]">{(car.brand || car.Brand)} {(car.model || car.Car_Name)} {car.year || new Date().getFullYear()}</h4>
                  <p className="text-[#666] text-sm capitalize">
                    {categoryTag} • {transmissionText} • {seats} {t('reservationConfirmation.seats')}
                  </p>
                </div>
              </div>
            </div>

            <div className="mb-8 pb-6 border-b-2 border-[#f0f0f0] last:border-b-0">
              <h3 className="text-lg sm:text-xl md:text-xl text-[#333] mb-5">{t('reservationConfirmation.reservationDetails')}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <strong className="text-[#555] text-sm">{t('reservationConfirmation.pickupDate')}:</strong>
                  <span className="text-[#333] text-base">{new Date(reservation.pickupDate).toLocaleDateString('en-US')}</span>
                </div>
                <div className="flex flex-col gap-1.5">
                  <strong className="text-[#555] text-sm">{t('reservationConfirmation.dropoffDate')}:</strong>
                  <span className="text-[#333] text-base">{new Date(reservation.dropoffDate).toLocaleDateString('en-US')}</span>
                </div>
                <div className="flex flex-col gap-1.5">
                  <strong className="text-[#555] text-sm">{t('reservationConfirmation.pickupLocation')}:</strong>
                  <span className="text-[#333] text-base">{reservation.pickupLocation?.city}, {reservation.pickupLocation?.address}</span>
                </div>
                {!reservation.dropoffLocation?.sameLocation && (
                  <div className="flex flex-col gap-1.5">
                    <strong className="text-[#555] text-sm">{t('reservationConfirmation.dropoffLocation')}:</strong>
                    <span className="text-[#333] text-base">{reservation.dropoffLocation?.city}, {reservation.dropoffLocation?.address}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="mb-8 pb-6 border-b-2 border-[#f0f0f0] last:border-b-0">
              <h3 className="text-lg sm:text-xl md:text-xl text-[#333] mb-5">{t('reservationConfirmation.personalInformation')}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <strong className="text-[#555] text-sm">{t('reservationConfirmation.fullName')}:</strong>
                  <span className="text-[#333] text-base">{reservation.user.firstName} {reservation.user.lastName}</span>
                </div>
                <div className="flex flex-col gap-1.5">
                  <strong className="text-[#555] text-sm">{t('reservationConfirmation.email')}:</strong>
                  <span className="text-[#333] text-base">{reservation.user.email}</span>
                </div>
                <div className="flex flex-col gap-1.5">
                  <strong className="text-[#555] text-sm">{t('reservationConfirmation.phone')}:</strong>
                  <span className="text-[#333] text-base">{reservation.user.phone}</span>
                </div>
              </div>
            </div>

            <div className="mb-8 pb-6 border-b-2 border-[#f0f0f0] last:border-b-0">
              <h3 className="text-lg sm:text-xl md:text-xl text-[#333] mb-5">{t('reservationConfirmation.paymentInformation')}</h3>
              <div className="p-5 bg-[#f8f9fa] rounded-lg">
                {reservation.basePrice && (
                  <div className="flex justify-between items-center py-3 border-b border-[#ddd] last:border-b-0">
                    <span>{t('reservationConfirmation.carRental')}:</span>
                    <strong className="text-2xl text-[#ef4444]">{reservation.currency} {reservation.basePrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>
                  </div>
                )}
                <div className="flex justify-between items-center py-3 border-b border-[#ddd] last:border-b-0">
                  <span>{t('reservationConfirmation.totalAmount')}:</span>
                  <strong className="text-2xl text-[#ef4444]">{reservation.currency} {(reservation.totalPrice || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>
                </div>
                {reservation.paymentAmount && (
                  <div className="flex justify-between items-center py-3 border-b border-[#ddd] last:border-b-0">
                    <span>{t('reservationConfirmation.amountToPay')}:</span>
                    <div className="text-right">
                      <strong className="text-2xl text-[#ef4444]">{reservation.currency} {reservation.paymentAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>
                      <small className="block text-[#666] text-xs mt-1">
                        ({t('reservationConfirmation.partialPaymentNote')})
                      </small>
                    </div>
                  </div>
                )}
                <div className="flex justify-between items-center py-3 border-b border-[#ddd] last:border-b-0">
                  <span>{t('reservationConfirmation.status')}:</span>
                  <span className={`px-3 py-1.5 rounded-md text-sm font-semibold ${reservation.status === 'pending' ? 'bg-[#fff3cd] text-[#856404]' :
                    reservation.status === 'confirmed' ? 'bg-[#d4edda] text-[#155724]' :
                      reservation.status === 'cancelled' ? 'bg-[#f8d7da] text-[#721c24]' :
                        'bg-[#d1ecf1] text-[#0c5460]'
                    }`}>
                    {reservation.status === 'pending' && t('reservationConfirmation.statusPending')}
                    {reservation.status === 'confirmed' && t('reservationConfirmation.statusConfirmed')}
                    {reservation.status === 'cancelled' && t('reservationConfirmation.statusCancelled')}
                    {reservation.status === 'completed' && t('reservationConfirmation.statusCompleted')}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link to="/" className="bg-[#EF4444] text-white border-none py-3 px-6 text-base font-semibold rounded-lg cursor-pointer transition-colors hover:bg-[#DC2626] text-center no-underline">
              {t('reservationConfirmation.backToHome')}
            </Link>
            <button
              onClick={() => window.print()}
              className="bg-white text-[#1a1a1a] border border-[#e5e7eb] py-3 px-6 text-base font-semibold rounded-lg cursor-pointer transition-colors hover:bg-[#f3f4f6]"
            >
              {t('reservationConfirmation.print')}
            </button>
          </div>

          <div className="p-5 bg-[#e7f3ff] rounded-lg border-l-4 border-[#ef4444]">
            <p className="text-[#004085] leading-relaxed m-0">
              <strong>{t('reservationConfirmation.note')}:</strong>{' '}
              {
                (reservation.extras?.extendedCancellation || reservation.extras?.selected?.extendedCancellation)
                  ? `Your reservation confirmation has been sent to ${reservation.user.email}. You can cancel your reservation free of charge even during the final 72 hours before the vehicle pick-up time.`
                  : t('reservationConfirmation.noteText', { email: reservation.user.email })
              }
            </p>
          </div>
        </div>
      </div>
    </div >
  )
}

export default ReservationConfirmation

