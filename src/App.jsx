import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { CurrencyProvider } from './context/CurrencyContext'
import { LanguageProvider } from './context/LanguageContext'
import ScrollToTop from './components/ScrollToTop'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import CarList from './pages/CarList'
import Reservation from './pages/Reservation'
import ReservationConfirmation from './pages/ReservationConfirmation'
import Locations from './pages/Locations'
import Franchise from './pages/Franchise'
import FAQ from './pages/FAQ'
import Contact from './pages/Contact'
import About from './pages/About'
import Terms from './pages/Terms'
import Privacy from './pages/Privacy'
import PreSaleAgreement from './pages/PreSaleAgreement'
import DeliveryReturnPolicy from './pages/DeliveryReturnPolicy'
import PaymentResult from './pages/PaymentResult'
import NotFound from './pages/NotFound'
import './App.css'

function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <LanguageProvider>
        <CurrencyProvider>
          <ScrollToTop />
          <div className="App">
            <Header />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/cars" element={<CarList />} />
              <Route path="/reservation/:carId" element={<Reservation />} />
              <Route path="/reservation-confirmation/:reservationNumber" element={<ReservationConfirmation />} />
              <Route path="/locations" element={<Locations />} />
              <Route path="/franchise" element={<Franchise />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/about" element={<About />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/pre-sale-agreement" element={<PreSaleAgreement />} />
              <Route path="/delivery-return-policy" element={<DeliveryReturnPolicy />} />
              <Route path="/payment-success" element={<PaymentResult />} />
              <Route path="/payment-fail" element={<PaymentResult />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Footer />
          </div>
        </CurrencyProvider>
      </LanguageProvider>
    </Router>
  )
}

export default App
