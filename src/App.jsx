import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Home from './pages/Home'
import CarList from './pages/CarList'
import CarDetail from './pages/CarDetail'
import Reservation from './pages/Reservation'
import ReservationConfirmation from './pages/ReservationConfirmation'
import Locations from './pages/Locations'
import './App.css'

function App() {
  return (
        <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <div className="App">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cars" element={<CarList />} />
          <Route path="/cars/:id" element={<CarDetail />} />
          <Route path="/reservation/:carId" element={<Reservation />} />
          <Route path="/reservation-confirmation/:reservationNumber" element={<ReservationConfirmation />} />
          <Route path="/locations" element={<Locations />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App

