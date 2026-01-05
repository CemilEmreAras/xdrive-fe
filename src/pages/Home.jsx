import { useState, useEffect } from 'react'
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
    dropoffDate: '',
    sameLocation: true
  })

  useEffect(() => {
    loadLocations()
  }, [])

  const loadLocations = async () => {
    try {
      const locs = await getLocations()
      setLocations(locs)
    } catch (error) {
      console.error('Lokasyon yükleme hatası:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!searchData.pickupId || !searchData.pickupDate || !searchData.dropoffDate) {
      alert('Lütfen tüm alanları doldurun')
      return
    }

    const params = new URLSearchParams({
      pickupId: searchData.pickupId,
      dropoffId: searchData.sameLocation ? searchData.pickupId : searchData.dropoffId,
      pickupDate: searchData.pickupDate,
      dropoffDate: searchData.dropoffDate
    })
    navigate(`/cars?${params.toString()}`)
  }

  return (
    <div className="home">
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h1>%70'e Varan İndirimlerle Araç Kiralama</h1>
            <p className="hero-subtitle">Şeffaf fiyatlar, sürpriz yok</p>
            <p className="hero-tagline">7M+ gezgin tarafından güvenilir • 24/7 Destek • Ücretsiz İptal</p>
          </div>
        </div>
      </section>

      <section className="search-section">
        <div className="container">
          <div className="search-card">
            <form onSubmit={handleSubmit} className="search-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Alış Lokasyonu *</label>
                  {loading ? (
                    <select disabled>
                      <option>Yükleniyor...</option>
                    </select>
                  ) : (
                    <select
                      value={searchData.pickupId}
                      onChange={(e) => setSearchData({ ...searchData, pickupId: e.target.value })}
                      required
                    >
                      <option value="">Lokasyon seçin</option>
                      {locations.map((loc) => (
                        <option key={loc.location_id || loc.Location_ID} value={loc.location_id || loc.Location_ID}>
                          {loc.location_name || loc.Location_Name} - {loc.address || loc.Address || ''}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
                <div className="form-group">
                  <label>
                    <input
                      type="checkbox"
                      checked={searchData.sameLocation}
                      onChange={(e) => setSearchData({ ...searchData, sameLocation: e.target.checked })}
                    />
                    {' '}Aynı lokasyona teslim
                  </label>
                  {!searchData.sameLocation && (
                    <select
                      value={searchData.dropoffId}
                      onChange={(e) => setSearchData({ ...searchData, dropoffId: e.target.value })}
                      className="mt-2"
                      required={!searchData.sameLocation}
                    >
                      <option value="">Teslim lokasyonu seçin</option>
                      {locations.map((loc) => (
                        <option key={loc.location_id || loc.Location_ID} value={loc.location_id || loc.Location_ID}>
                          {loc.location_name || loc.Location_Name} - {loc.address || loc.Address || ''}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Alış Tarihi *</label>
                  <input
                    type="date"
                    value={searchData.pickupDate}
                    onChange={(e) => setSearchData({ ...searchData, pickupDate: e.target.value })}
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Teslim Tarihi *</label>
                  <input
                    type="date"
                    value={searchData.dropoffDate}
                    onChange={(e) => setSearchData({ ...searchData, dropoffDate: e.target.value })}
                    min={searchData.pickupDate || new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>
              </div>

              <button type="submit" className="btn btn-primary search-btn">
                Araçları Ara
              </button>
            </form>
          </div>
        </div>
      </section>

      <section className="features">
        <div className="container">
          <div className="features-grid">
            <div className="feature-card">
              <h3>Gizli Ücret Yok</h3>
              <p>Tüm zorunlu ücretler, vergiler ve ekstralar fiyata dahil</p>
            </div>
            <div className="feature-card">
              <h3>24/7 Çok Dilli Destek</h3>
              <p>Her zaman yanınızdayız, her dilde</p>
            </div>
            <div className="feature-card">
              <h3>Ücretsiz İptal</h3>
              <p>48 saat öncesine kadar ücretsiz iptal</p>
            </div>
            <div className="feature-card">
              <h3>Güvenilir Bilgi</h3>
              <p>Müşteri yorumları ve şeffaf bilgiler</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
