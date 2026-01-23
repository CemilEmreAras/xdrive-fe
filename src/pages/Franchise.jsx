import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import SEO from '../components/SEO'

const isDev = import.meta.env.DEV

function Franchise() {
  const { t, i18n } = useTranslation()
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    companyName: '',
    location: '',
    fleetSize: '',
    privacyAccepted: false
  })

  const [activeFaq, setActiveFaq] = useState(null)

  const [loading, setLoading] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [submitError, setSubmitError] = useState(null)

  // Handle HTML5 validation messages in selected language
  const handleInvalid = (e) => {
    if (e.target.validity.valueMissing) {
      e.target.setCustomValidity(t('reservation.fillRequiredFields'))
    } else if (e.target.type === 'email' && (e.target.validity.typeMismatch || e.target.validity.patternMismatch)) {
      e.target.setCustomValidity(t('reservation.invalidEmail'))
    } else {
      e.target.setCustomValidity(t('reservation.fillRequiredFields'))
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
    if (submitSuccess) setSubmitSuccess(false)
    if (submitError) setSubmitError(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setSubmitSuccess(false)
    setSubmitError(null)

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001'
      const response = await fetch(`${API_URL}/api/contact/franchise`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...formData, language: i18n.language }),
      })

      const data = await response.json()

      if (response.ok) {
        setSubmitSuccess(true)
        setFormData({
          fullName: '',
          email: '',
          companyName: '',
          location: '',
          fleetSize: '',
          privacyAccepted: false
        })
      } else {
        setSubmitError(data.error || 'Bir hata oluştu.')
      }
    } catch (error) {
      console.error('Error:', error)
      setSubmitError('Bir bağlantı hatası oluştu. Lütfen tekrar deneyin.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <SEO
        title={t('seo.franchise.title')}
        description={t('seo.franchise.description')}
        keywords={t('seo.franchise.keywords')}
      />
      <div className="min-h-screen bg-white">
        {/* Hero Section (same yapı as Contact) */}
        <section className="relative min-h-[400px] w-full flex items-center justify-center bg-black bg-[url('/images/franchise-hero-bg.jpg')] bg-center bg-contain bg-no-repeat text-white overflow-hidden">
          <div className="absolute top-0 left-0 right-0 bottom-0 bg-black/30 z-[1]"></div>
          <div className="relative z-[2] w-full max-w-[1200px] mx-auto px-5 sm:px-6 md:px-8 lg:px-10">
            <div className="text-center max-w-[800px] mx-auto">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[48px] font-bold mb-5 leading-tight text-white">
                {t('franchise.heroTitle')}
              </h1>
              <p className="text-base sm:text-lg md:text-lg text-white/90 leading-relaxed">
                {t('franchise.heroSubtitle')}
              </p>
              <p className="text-base mt-4 text-white/80 leading-relaxed">
                {t('franchise.heroDescription')}
              </p>
              <div className="flex gap-5 flex-wrap justify-center mt-8">
                <button className="bg-[#EF4444] text-white border-none py-4 px-8 text-base font-semibold rounded-lg cursor-pointer transition-colors hover:bg-[#DC2626]" onClick={() => document.getElementById('application-form')?.scrollIntoView({ behavior: 'smooth' })}>
                  {t('franchise.applyNow')}
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Introduction Section */}
        <section className="py-10 sm:py-12 md:py-16 lg:py-20 bg-white px-5 sm:px-6 md:px-8 lg:px-10">
          <div className="max-w-[1200px] mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-15 items-center">
              <div className="pr-0 md:pr-10">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#1a1a1a] mb-6 text-center md:text-left">{t('franchise.introductionTitle')}</h2>
                <p className="text-base text-[#666] leading-relaxed mb-5">
                  {t('franchise.introductionText1')}
                </p>
                <p className="text-base text-[#666] leading-relaxed mb-5">
                  {t('franchise.introductionText2')}
                </p>
              </div>
              <div className="relative">
                <img
                  src="/images/franchise/office.jpg"
                  alt="Car rental office"
                  className="w-full h-[300px] sm:h-[350px] md:h-[400px] object-cover rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.1)]"
                  onError={(e) => {
                    e.target.style.display = 'none'
                  }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Our Business Model Section */}
        <section className="py-10 sm:py-12 md:py-16 lg:py-20 bg-[#f9fafb] px-5 sm:px-6 md:px-8 lg:px-10">
          <div className="max-w-[1200px] mx-auto">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#1a1a1a] mb-6 text-center">{t('franchise.businessModelTitle')}</h2>
            <div className="max-w-[800px] mx-auto mt-10">
              <div className="flex items-start gap-4 py-4 text-base text-[#1a1a1a] leading-relaxed border-b border-[#e5e7eb] last:border-b-0">
                <span className="text-[#EF4444] text-xl font-bold flex-shrink-0 mt-0.5">●</span>
                <span>{t('franchise.businessModel1')}</span>
              </div>
              <div className="flex items-start gap-4 py-4 text-base text-[#1a1a1a] leading-relaxed border-b border-[#e5e7eb] last:border-b-0">
                <span className="text-[#EF4444] text-xl font-bold flex-shrink-0 mt-0.5">●</span>
                <span>{t('franchise.businessModel2')}</span>
              </div>
              <div className="flex items-start gap-4 py-4 text-base text-[#1a1a1a] leading-relaxed border-b border-[#e5e7eb] last:border-b-0">
                <span className="text-[#EF4444] text-xl font-bold flex-shrink-0 mt-0.5">●</span>
                <span>{t('franchise.businessModel3')}</span>
              </div>
              <div className="flex items-start gap-4 py-4 text-base text-[#1a1a1a] leading-relaxed border-b border-[#e5e7eb] last:border-b-0">
                <span className="text-[#EF4444] text-xl font-bold flex-shrink-0 mt-0.5">●</span>
                <span>{t('franchise.businessModel4')}</span>
              </div>
              <div className="flex items-start gap-4 py-4 text-base text-[#1a1a1a] leading-relaxed border-b border-[#e5e7eb] last:border-b-0">
                <span className="text-[#EF4444] text-xl font-bold flex-shrink-0 mt-0.5">●</span>
                <span>{t('franchise.businessModel5')}</span>
              </div>
              <div className="flex items-start gap-4 py-4 text-base text-[#1a1a1a] leading-relaxed border-b border-[#e5e7eb] last:border-b-0">
                <span className="text-[#EF4444] text-xl font-bold flex-shrink-0 mt-0.5">●</span>
                <span>{t('franchise.businessModel6')}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Why Partner Section */}
        <section className="py-10 sm:py-12 md:py-16 lg:py-20 bg-white px-5 sm:px-6 md:px-8 lg:px-10">
          <div className="max-w-[1200px] mx-auto">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#1a1a1a] mb-6 text-center">{t('franchise.whyPartnerTitle')}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-6 md:gap-8 mt-15">
              <div className="text-center p-10 px-5 bg-white rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.05)] transition-all hover:-translate-y-2 hover:shadow-[0_8px_24px_rgba(0,0,0,0.1)]">
                <h3 className="text-base font-semibold text-[#1a1a1a] m-0 leading-snug">{t('franchise.feature1Title')}</h3>
                <p className="text-sm text-[#666] mt-3 leading-relaxed">
                  {t('franchise.feature1Description')}
                </p>
              </div>
              <div className="text-center p-10 px-5 bg-white rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.05)] transition-all hover:-translate-y-2 hover:shadow-[0_8px_24px_rgba(0,0,0,0.1)]">
                <h3 className="text-base font-semibold text-[#1a1a1a] m-0 leading-snug">{t('franchise.feature2Title')}</h3>
                <p className="text-sm text-[#666] mt-3 leading-relaxed">
                  {t('franchise.feature2Description')}
                </p>
              </div>
              <div className="text-center p-10 px-5 bg-white rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.05)] transition-all hover:-translate-y-2 hover:shadow-[0_8px_24px_rgba(0,0,0,0.1)]">
                <h3 className="text-base font-semibold text-[#1a1a1a] m-0 leading-snug">{t('franchise.feature3Title')}</h3>
                <p className="text-sm text-[#666] mt-3 leading-relaxed">
                  {t('franchise.feature3Description')}
                </p>
              </div>
              <div className="text-center p-10 px-5 bg-white rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.05)] transition-all hover:-translate-y-2 hover:shadow-[0_8px_24px_rgba(0,0,0,0.1)]">
                <h3 className="text-base font-semibold text-[#1a1a1a] m-0 leading-snug">{t('franchise.feature4Title')}</h3>
                <p className="text-sm text-[#666] mt-3 leading-relaxed">
                  {t('franchise.feature4Description')}
                </p>
              </div>
              <div className="text-center p-10 px-5 bg-white rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.05)] transition-all hover:-translate-y-2 hover:shadow-[0_8px_24px_rgba(0,0,0,0.1)]">
                <h3 className="text-base font-semibold text-[#1a1a1a] m-0 leading-snug">{t('franchise.feature5Title')}</h3>
                <p className="text-sm text-[#666] mt-3 leading-relaxed">
                  {t('franchise.feature5Description')}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* What We Offer Section */}
        <section className="py-10 sm:py-12 md:py-16 lg:py-20 bg-[#f9fafb] px-5 sm:px-6 md:px-8 lg:px-10">
          <div className="max-w-[1200px] mx-auto">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#1a1a1a] mb-6 text-center">{t('franchise.whatWeOfferTitle')}</h2>
            <div className="max-w-[800px] mx-auto mt-10">
              <div className="flex items-start gap-4 py-4 text-base text-[#1a1a1a] leading-relaxed border-b border-[#e5e7eb] last:border-b-0">
                <span className="text-[#EF4444] text-xl font-bold flex-shrink-0 mt-0.5">●</span>
                <span>{t('franchise.offer1')}</span>
              </div>
              <div className="flex items-start gap-4 py-4 text-base text-[#1a1a1a] leading-relaxed border-b border-[#e5e7eb] last:border-b-0">
                <span className="text-[#EF4444] text-xl font-bold flex-shrink-0 mt-0.5">●</span>
                <span>{t('franchise.offer2')}</span>
              </div>
              <div className="flex items-start gap-4 py-4 text-base text-[#1a1a1a] leading-relaxed border-b border-[#e5e7eb] last:border-b-0">
                <span className="text-[#EF4444] text-xl font-bold flex-shrink-0 mt-0.5">●</span>
                <span>{t('franchise.offer3')}</span>
              </div>
              <div className="flex items-start gap-4 py-4 text-base text-[#1a1a1a] leading-relaxed border-b border-[#e5e7eb] last:border-b-0">
                <span className="text-[#EF4444] text-xl font-bold flex-shrink-0 mt-0.5">●</span>
                <span>{t('franchise.offer4')}</span>
              </div>
              <div className="flex items-start gap-4 py-4 text-base text-[#1a1a1a] leading-relaxed border-b border-[#e5e7eb] last:border-b-0">
                <span className="text-[#EF4444] text-xl font-bold flex-shrink-0 mt-0.5">●</span>
                <span>{t('franchise.offer5')}</span>
              </div>
              <div className="flex items-start gap-4 py-4 text-base text-[#1a1a1a] leading-relaxed border-b border-[#e5e7eb] last:border-b-0">
                <span className="text-[#EF4444] text-xl font-bold flex-shrink-0 mt-0.5">●</span>
                <span>{t('franchise.offer6')}</span>
              </div>
              <div className="flex items-start gap-4 py-4 text-base text-[#1a1a1a] leading-relaxed border-b border-[#e5e7eb] last:border-b-0">
                <span className="text-[#EF4444] text-xl font-bold flex-shrink-0 mt-0.5">●</span>
                <span>{t('franchise.offer7')}</span>
              </div>
            </div>
          </div>
        </section>

        {/* System Access Section */}
        <section className="relative py-16 sm:py-20 md:py-25 w-full bg-gradient-to-br from-[#f9fafb] to-white bg-[url('/images/franchise/system-bg.jpg')] bg-cover bg-center px-5 sm:px-6 md:px-8 lg:px-10">
          <div className="absolute top-0 left-0 right-0 bottom-0 bg-white/95 z-[1]"></div>
          <div className="relative z-[2] max-w-[1200px] mx-auto">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#1a1a1a] mb-6 text-center">{t('franchise.systemAccessTitle')}</h2>
            <p className="text-lg text-[#666] text-center mb-15 max-w-[800px] mx-auto">
              {t('franchise.systemAccessSubtitle')}
            </p>
            <div className="max-w-[800px] mx-auto mt-10">
              <div className="flex items-start gap-4 py-4 text-base text-[#1a1a1a] leading-relaxed border-b border-[#e5e7eb] last:border-b-0">
                <span className="text-[#EF4444] text-xl font-bold flex-shrink-0 mt-0.5">●</span>
                <span>{t('franchise.system1')}</span>
              </div>
              <div className="flex items-start gap-4 py-4 text-base text-[#1a1a1a] leading-relaxed border-b border-[#e5e7eb] last:border-b-0">
                <span className="text-[#EF4444] text-xl font-bold flex-shrink-0 mt-0.5">●</span>
                <span>{t('franchise.system2')}</span>
              </div>
              <div className="flex items-start gap-4 py-4 text-base text-[#1a1a1a] leading-relaxed border-b border-[#e5e7eb] last:border-b-0">
                <span className="text-[#EF4444] text-xl font-bold flex-shrink-0 mt-0.5">●</span>
                <span>{t('franchise.system3')}</span>
              </div>
              <div className="flex items-start gap-4 py-4 text-base text-[#1a1a1a] leading-relaxed border-b border-[#e5e7eb] last:border-b-0">
                <span className="text-[#EF4444] text-xl font-bold flex-shrink-0 mt-0.5">●</span>
                <span>{t('franchise.system4')}</span>
              </div>
            </div>
            <p className="text-center text-base text-[#666] mt-10 italic max-w-[800px] mx-auto">
              {t('franchise.systemNote')}
            </p>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-10 sm:py-12 md:py-16 lg:py-20 bg-white px-5 sm:px-6 md:px-8 lg:px-10">
          <div className="max-w-[1200px] mx-auto">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#1a1a1a] mb-6 text-center">{t('franchise.howItWorksTitle')}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 sm:gap-6 md:gap-8 mt-15">
              <div className="text-center p-10 px-5 bg-[#f9fafb] rounded-xl transition-all hover:-translate-y-2">
                <div className="w-[60px] h-[60px] rounded-full bg-[#EF4444] text-white flex items-center justify-center text-[28px] font-bold mx-auto mb-5">1</div>
                <h3 className="text-lg font-semibold text-[#1a1a1a] mb-3">{t('franchise.step1Title')}</h3>
                <p className="text-sm text-[#666] leading-relaxed">
                  {t('franchise.step1Description')}
                </p>
              </div>
              <div className="text-center p-10 px-5 bg-[#f9fafb] rounded-xl transition-all hover:-translate-y-2">
                <div className="w-[60px] h-[60px] rounded-full bg-[#EF4444] text-white flex items-center justify-center text-[28px] font-bold mx-auto mb-5">2</div>
                <h3 className="text-lg font-semibold text-[#1a1a1a] mb-3">{t('franchise.step2Title')}</h3>
                <p className="text-sm text-[#666] leading-relaxed">
                  {t('franchise.step2Description')}
                </p>
              </div>
              <div className="text-center p-10 px-5 bg-[#f9fafb] rounded-xl transition-all hover:-translate-y-2">
                <div className="w-[60px] h-[60px] rounded-full bg-[#EF4444] text-white flex items-center justify-center text-[28px] font-bold mx-auto mb-5">3</div>
                <h3 className="text-lg font-semibold text-[#1a1a1a] mb-3">{t('franchise.step3Title')}</h3>
                <p className="text-sm text-[#666] leading-relaxed">
                  {t('franchise.step3Description')}
                </p>
              </div>
              <div className="text-center p-10 px-5 bg-[#f9fafb] rounded-xl transition-all hover:-translate-y-2">
                <div className="w-[60px] h-[60px] rounded-full bg-[#EF4444] text-white flex items-center justify-center text-[28px] font-bold mx-auto mb-5">4</div>
                <h3 className="text-lg font-semibold text-[#1a1a1a] mb-3">{t('franchise.step4Title')}</h3>
                <p className="text-sm text-[#666] leading-relaxed">
                  {t('franchise.step4Description')}
                </p>
              </div>
              <div className="text-center p-10 px-5 bg-[#f9fafb] rounded-xl transition-all hover:-translate-y-2">
                <div className="w-[60px] h-[60px] rounded-full bg-[#EF4444] text-white flex items-center justify-center text-[28px] font-bold mx-auto mb-5">5</div>
                <h3 className="text-lg font-semibold text-[#1a1a1a] mb-3">{t('franchise.step5Title')}</h3>
                <p className="text-sm text-[#666] leading-relaxed">
                  {t('franchise.step5Description')}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Who We Are Looking For Section */}
        <section className="py-10 sm:py-12 md:py-16 lg:py-20 bg-[#f9fafb] px-5 sm:px-6 md:px-8 lg:px-10">
          <div className="max-w-[1200px] mx-auto">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#1a1a1a] mb-6 text-center">{t('franchise.whoWeLookForTitle')}</h2>
            <p className="text-lg text-[#666] text-center mb-10 max-w-[800px] mx-auto">
              {t('franchise.whoWeLookForText')}
            </p>
            <div className="max-w-[800px] mx-auto mt-10">
              <div className="flex items-start gap-4 py-4 text-base text-[#1a1a1a] leading-relaxed border-b border-[#e5e7eb] last:border-b-0">
                <span className="text-[#EF4444] text-xl font-bold flex-shrink-0 mt-0.5">●</span>
                <span>{t('franchise.requirement1')}</span>
              </div>
              <div className="flex items-start gap-4 py-4 text-base text-[#1a1a1a] leading-relaxed border-b border-[#e5e7eb] last:border-b-0">
                <span className="text-[#EF4444] text-xl font-bold flex-shrink-0 mt-0.5">●</span>
                <span>{t('franchise.requirement2')}</span>
              </div>
              <div className="flex items-start gap-4 py-4 text-base text-[#1a1a1a] leading-relaxed border-b border-[#e5e7eb] last:border-b-0">
                <span className="text-[#EF4444] text-xl font-bold flex-shrink-0 mt-0.5">●</span>
                <span>{t('franchise.requirement3')}</span>
              </div>
              <div className="flex items-start gap-4 py-4 text-base text-[#1a1a1a] leading-relaxed border-b border-[#e5e7eb] last:border-b-0">
                <span className="text-[#EF4444] text-xl font-bold flex-shrink-0 mt-0.5">●</span>
                <span>{t('franchise.requirement4')}</span>
              </div>
              <div className="flex items-start gap-4 py-4 text-base text-[#1a1a1a] leading-relaxed border-b border-[#e5e7eb] last:border-b-0">
                <span className="text-[#EF4444] text-xl font-bold flex-shrink-0 mt-0.5">●</span>
                <span>{t('franchise.requirement5')}</span>
              </div>
              <div className="flex items-start gap-4 py-4 text-base text-[#1a1a1a] leading-relaxed border-b border-[#e5e7eb] last:border-b-0">
                <span className="text-[#EF4444] text-xl font-bold flex-shrink-0 mt-0.5">●</span>
                <span>{t('franchise.requirement6')}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Basic Requirements Section */}
        <section className="py-10 sm:py-12 md:py-16 lg:py-20 bg-white px-5 sm:px-6 md:px-8 lg:px-10">
          <div className="max-w-[1200px] mx-auto">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#1a1a1a] mb-6 text-center">{t('franchise.basicRequirementsTitle')}</h2>
            <div className="max-w-[800px] mx-auto mt-10">
              <div className="flex items-start gap-4 py-4 text-base text-[#1a1a1a] leading-relaxed border-b border-[#e5e7eb] last:border-b-0">
                <span className="text-[#EF4444] text-xl font-bold flex-shrink-0 mt-0.5">●</span>
                <span>{t('franchise.basicRequirement1')}</span>
              </div>
              <div className="flex items-start gap-4 py-4 text-base text-[#1a1a1a] leading-relaxed border-b border-[#e5e7eb] last:border-b-0">
                <span className="text-[#EF4444] text-xl font-bold flex-shrink-0 mt-0.5">●</span>
                <span>{t('franchise.basicRequirement2')}</span>
              </div>
              <div className="flex items-start gap-4 py-4 text-base text-[#1a1a1a] leading-relaxed border-b border-[#e5e7eb] last:border-b-0">
                <span className="text-[#EF4444] text-xl font-bold flex-shrink-0 mt-0.5">●</span>
                <span>{t('franchise.basicRequirement3')}</span>
              </div>
              <div className="flex items-start gap-4 py-4 text-base text-[#1a1a1a] leading-relaxed border-b border-[#e5e7eb] last:border-b-0">
                <span className="text-[#EF4444] text-xl font-bold flex-shrink-0 mt-0.5">●</span>
                <span>{t('franchise.basicRequirement4')}</span>
              </div>
              <div className="flex items-start gap-4 py-4 text-base text-[#1a1a1a] leading-relaxed border-b border-[#e5e7eb] last:border-b-0">
                <span className="text-[#EF4444] text-xl font-bold flex-shrink-0 mt-0.5">●</span>
                <span>{t('franchise.basicRequirement5')}</span>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-10 sm:py-12 md:py-16 lg:py-20 bg-[#f9fafb] px-5 sm:px-6 md:px-8 lg:px-10">
          <div className="max-w-[1200px] mx-auto">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#1a1a1a] mb-6 text-center">{t('franchise.faqTitle')}</h2>
            <div className="max-w-[900px] mx-auto mt-10">
              <div className={`bg-white rounded-lg mb-4 overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.05)] ${activeFaq === 'exclusive' ? 'border border-[#EF4444]' : ''}`}>
                <div className="flex justify-between items-center p-5 sm:p-5 md:p-6 cursor-pointer text-base font-semibold text-[#1a1a1a] transition-colors hover:bg-[#f9fafb]" onClick={() => setActiveFaq(activeFaq === 'exclusive' ? null : 'exclusive')}>
                  <span>{t('franchise.faq1Question')}</span>
                  <span className="text-2xl text-[#EF4444] font-bold flex-shrink-0 ml-5">{activeFaq === 'exclusive' ? '−' : '+'}</span>
                </div>
                <div className={`overflow-hidden transition-all ${activeFaq === 'exclusive' ? 'max-h-[500px] p-0 px-6 pb-5' : 'max-h-0 p-0 px-6'}`}>
                  <p className="text-sm text-[#666] leading-relaxed m-0">
                    {t('franchise.faq1Answer')}
                  </p>
                </div>
              </div>
              <div className={`bg-white rounded-lg mb-4 overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.05)] ${activeFaq === 'xml' ? 'border border-[#EF4444]' : ''}`}>
                <div className="flex justify-between items-center p-5 sm:p-5 md:p-6 cursor-pointer text-base font-semibold text-[#1a1a1a] transition-colors hover:bg-[#f9fafb]" onClick={() => setActiveFaq(activeFaq === 'xml' ? null : 'xml')}>
                  <span>{t('franchise.faq2Question')}</span>
                  <span className="text-2xl text-[#EF4444] font-bold flex-shrink-0 ml-5">{activeFaq === 'xml' ? '−' : '+'}</span>
                </div>
                <div className={`overflow-hidden transition-all ${activeFaq === 'xml' ? 'max-h-[500px] p-0 px-6 pb-5' : 'max-h-0 p-0 px-6'}`}>
                  <p className="text-sm text-[#666] leading-relaxed m-0">
                    {t('franchise.faq2Answer')}
                  </p>
                </div>
              </div>
              <div className={`bg-white rounded-lg mb-4 overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.05)] ${activeFaq === 'payments' ? 'border border-[#EF4444]' : ''}`}>
                <div className="flex justify-between items-center p-5 sm:p-5 md:p-6 cursor-pointer text-base font-semibold text-[#1a1a1a] transition-colors hover:bg-[#f9fafb]" onClick={() => setActiveFaq(activeFaq === 'payments' ? null : 'payments')}>
                  <span>{t('franchise.faq3Question')}</span>
                  <span className="text-2xl text-[#EF4444] font-bold flex-shrink-0 ml-5">{activeFaq === 'payments' ? '−' : '+'}</span>
                </div>
                <div className={`overflow-hidden transition-all ${activeFaq === 'payments' ? 'max-h-[500px] p-0 px-6 pb-5' : 'max-h-0 p-0 px-6'}`}>
                  <p className="text-sm text-[#666] leading-relaxed m-0">
                    {t('franchise.faq3Answer')}
                  </p>
                </div>
              </div>
              <div className={`bg-white rounded-lg mb-4 overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.05)] ${activeFaq === 'timeline' ? 'border border-[#EF4444]' : ''}`}>
                <div className="flex justify-between items-center p-5 sm:p-5 md:p-6 cursor-pointer text-base font-semibold text-[#1a1a1a] transition-colors hover:bg-[#f9fafb]" onClick={() => setActiveFaq(activeFaq === 'timeline' ? null : 'timeline')}>
                  <span>{t('franchise.faq4Question')}</span>
                  <span className="text-2xl text-[#EF4444] font-bold flex-shrink-0 ml-5">{activeFaq === 'timeline' ? '−' : '+'}</span>
                </div>
                <div className={`overflow-hidden transition-all ${activeFaq === 'timeline' ? 'max-h-[500px] p-0 px-6 pb-5' : 'max-h-0 p-0 px-6'}`}>
                  <p className="text-sm text-[#666] leading-relaxed m-0">
                    {t('franchise.faq4Answer')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Application Form Section */}
        <section id="application-form" className="relative py-16 sm:py-20 md:py-25 w-full bg-gradient-to-br from-[#f9fafb] to-white bg-[url('/images/franchise/system-bg.jpg')] bg-cover bg-center px-5 sm:px-6 md:px-8 lg:px-10">
          <div className="absolute top-0 left-0 right-0 bottom-0 bg-white/95 z-[1]"></div>
          <div className="relative z-[2] max-w-[1200px] mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-15 items-start">
              <div className="pt-10 md:pt-10">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#1a1a1a] mb-0 text-left md:text-left">{t('franchise.applicationFormTitle')}</h2>
              </div>
              <form className="bg-white p-10 rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.1)]" onSubmit={handleSubmit}>
                {submitSuccess && (
                  <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm text-center">
                    {t('franchise.applicationSuccess') || 'Başvurunuz başarıyla alındı!'}
                  </div>
                )}

                {submitError && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm text-center">
                    {submitError}
                  </div>
                )}
                <div className="mb-6">
                  <label htmlFor="fullName" className="block text-sm font-semibold text-[#1a1a1a] mb-2">{t('franchise.formFullName')}</label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    onInvalid={handleInvalid}
                    onInput={(e) => e.target.setCustomValidity('')}
                    required
                    placeholder={t('franchise.placeholderFullName')}
                    className="w-full p-3 px-4 border border-[#ddd] rounded-lg text-base transition-colors box-border focus:outline-none focus:border-[#EF4444]"
                  />
                </div>
                <div className="mb-6">
                  <label htmlFor="email" className="block text-sm font-semibold text-[#1a1a1a] mb-2">{t('franchise.formEmail')}</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    onInvalid={handleInvalid}
                    onInput={(e) => e.target.setCustomValidity('')}
                    required
                    placeholder={t('franchise.placeholderEmail')}
                    className="w-full p-3 px-4 border border-[#ddd] rounded-lg text-base transition-colors box-border focus:outline-none focus:border-[#EF4444]"
                  />
                </div>
                <div className="mb-6">
                  <label htmlFor="companyName" className="block text-sm font-semibold text-[#1a1a1a] mb-2">{t('franchise.formCompanyName')}</label>
                  <input
                    type="text"
                    id="companyName"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    onInvalid={handleInvalid}
                    onInput={(e) => e.target.setCustomValidity('')}
                    required
                    placeholder={t('franchise.placeholderCompanyName')}
                    className="w-full p-3 px-4 border border-[#ddd] rounded-lg text-base transition-colors box-border focus:outline-none focus:border-[#EF4444]"
                  />
                </div>
                <div className="mb-6">
                  <label htmlFor="location" className="block text-sm font-semibold text-[#1a1a1a] mb-2">{t('franchise.formLocation')}</label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    onInvalid={handleInvalid}
                    onInput={(e) => e.target.setCustomValidity('')}
                    required
                    placeholder={t('franchise.placeholderLocation')}
                    className="w-full p-3 px-4 border border-[#ddd] rounded-lg text-base transition-colors box-border focus:outline-none focus:border-[#EF4444]"
                  />
                </div>
                <div className="mb-6">
                  <label htmlFor="fleetSize" className="block text-sm font-semibold text-[#1a1a1a] mb-2">{t('franchise.formFleetSize')}</label>
                  <input
                    type="text"
                    id="fleetSize"
                    name="fleetSize"
                    value={formData.fleetSize}
                    onChange={handleChange}
                    onInvalid={handleInvalid}
                    onInput={(e) => e.target.setCustomValidity('')}
                    required
                    placeholder={t('franchise.placeholderFleetSize')}
                    className="w-full p-3 px-4 border border-[#ddd] rounded-lg text-base transition-colors box-border focus:outline-none focus:border-[#EF4444]"
                  />
                </div>
                <div className="mb-8">
                  <label className="flex items-start gap-3 cursor-pointer text-sm text-[#666] leading-relaxed">
                    <input
                      type="checkbox"
                      name="privacyAccepted"
                      checked={formData.privacyAccepted}
                      onChange={handleChange}
                      required
                      className="mt-1 w-[18px] h-[18px] cursor-pointer flex-shrink-0"
                      onInvalid={handleInvalid}
                      onInput={(e) => e.target.setCustomValidity('')}
                    />
                    <span>{t('franchise.formPrivacyAccept')} <a href="/privacy" className="text-[#EF4444] underline transition-colors hover:text-[#DC2626]">{t('franchise.privacyPolicy')}</a></span>
                  </label>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#EF4444] text-white border-none py-4 px-8 text-base font-semibold rounded-lg cursor-pointer transition-colors hover:bg-[#DC2626] flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loading ? 'Gönderiliyor...' : t('franchise.submitApplication')}
                </button>
              </form>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}

export default Franchise
