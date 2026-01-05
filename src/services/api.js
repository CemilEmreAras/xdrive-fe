import axios from 'axios'

// Production'da Vercel backend URL'i, development'ta localhost
const API_BASE_URL = import.meta.env.PROD 
  ? 'https://xdrive-be.vercel.app/api'
  : import.meta.env.VITE_API_URL || '/api'

// Debug: API base URL'i logla
console.log('🔗 API Base URL:', API_BASE_URL);
console.log('🔗 Environment:', import.meta.env.MODE);
console.log('🔗 Is Production:', import.meta.env.PROD);

// Lokasyonları getir
export const getLocations = async () => {
  try {
    const url = `${API_BASE_URL}/cars/meta/locations`;
    console.log('🌐 Lokasyon API isteği:', url);
    const response = await axios.get(url)
    console.log('✅ Lokasyon API yanıtı:', response.data?.length || 0, 'lokasyon');
    return response.data || []
  } catch (error) {
    console.error('❌ Lokasyon getirme hatası:', error)
    console.error('❌ Hata URL:', error.config?.url)
    console.error('❌ Hata status:', error.response?.status)
    console.error('❌ Hata data:', error.response?.data)
    return []
  }
}

// Grupları getir
export const getGroups = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/cars/meta/groups`)
    return response.data
  } catch (error) {
    console.error('Grup getirme hatası:', error)
    return []
  }
}

// Araçları getir
export const getCars = async (params) => {
  try {
    const url = `${API_BASE_URL}/cars`;
    console.log('🚗 Araç API isteği:', url, params);
    const response = await axios.get(url, { params })
    console.log('✅ Araç API yanıtı:', response.data?.length || 0, 'araç');
    return response.data || []
  } catch (error) {
    console.error('❌ Araç getirme hatası:', error)
    console.error('❌ Hata URL:', error.config?.url)
    console.error('❌ Hata status:', error.response?.status)
    console.error('❌ Hata data:', error.response?.data)
    // Error'u throw et ki CarList.jsx'te handle edilebilsin
    throw error
  }
}

// Belirli bir araç getir
export const getCar = async (carId) => {
  try {
    const url = `${API_BASE_URL}/cars/${carId}`;
    console.log('🚗 Araç detay API isteği:', url);
    const response = await axios.get(url)
    console.log('✅ Araç detay API yanıtı:', response.data);
    return response.data
  } catch (error) {
    console.error('❌ Araç detay getirme hatası:', error)
    console.error('❌ Hata URL:', error.config?.url)
    console.error('❌ Hata status:', error.response?.status)
    console.error('❌ Hata data:', error.response?.data)
    throw error
  }
}

// Rezervasyon oluştur
export const createReservation = async (reservationData) => {
  try {
    const url = `${API_BASE_URL}/reservations`;
    console.log('📝 Rezervasyon API isteği:', url);
    console.log('📝 Rezervasyon verisi:', {
      pickupId: reservationData.pickupId,
      dropoffId: reservationData.dropoffId,
      rezId: reservationData.rezId,
      carsParkId: reservationData.carsParkId,
      groupId: reservationData.groupId
    });
    const response = await axios.post(url, reservationData)
    console.log('✅ Rezervasyon API yanıtı:', response.data);
    return response.data
  } catch (error) {
    console.error('❌ Rezervasyon oluşturma hatası:', error)
    console.error('❌ Hata URL:', error.config?.url)
    console.error('❌ Hata status:', error.response?.status)
    console.error('❌ Hata data:', error.response?.data)
    console.error('❌ Hata data (stringified):', JSON.stringify(error.response?.data, null, 2))
    console.error('❌ Hata message:', error.message)
    
    // Error'u daha açıklayıcı hale getir
    if (error.response?.data) {
      const errorData = error.response.data;
      if (errorData.error) {
        error.message = String(errorData.error);
      } else if (typeof errorData === 'string') {
        error.message = errorData;
      }
    }
    
    throw error
  }
}

// Rezervasyon getir
export const getReservation = async (reservationNumber) => {
  try {
    const url = `${API_BASE_URL}/reservations/${reservationNumber}`;
    console.log('📋 Rezervasyon getirme API isteği:', url);
    const response = await axios.get(url)
    console.log('✅ Rezervasyon getirme API yanıtı:', response.data);
    return response.data
  } catch (error) {
    console.error('❌ Rezervasyon getirme hatası:', error)
    console.error('❌ Hata URL:', error.config?.url)
    console.error('❌ Hata status:', error.response?.status)
    console.error('❌ Hata data:', error.response?.data)
    throw error
  }
}

