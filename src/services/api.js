import axios from 'axios'

// Production'da Vercel backend URL'i, development'ta localhost
const API_BASE_URL = import.meta.env.PROD 
  ? 'https://xdrive-e04d1acw9-cemil-emre-aras-projects.vercel.app/api'
  : '/api'

// Lokasyonları getir
export const getLocations = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/cars/meta/locations`)
    return response.data
  } catch (error) {
    console.error('Lokasyon getirme hatası:', error)
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
    const response = await axios.get(`${API_BASE_URL}/cars`, { params })
    return response.data
  } catch (error) {
    console.error('Araç getirme hatası:', error)
    return []
  }
}

// Rezervasyon oluştur
export const createReservation = async (reservationData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/reservations`, reservationData)
    return response.data
  } catch (error) {
    throw error
  }
}

// Rezervasyon getir
export const getReservation = async (reservationNumber) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/reservations/${reservationNumber}`)
    return response.data
  } catch (error) {
    throw error
  }
}

