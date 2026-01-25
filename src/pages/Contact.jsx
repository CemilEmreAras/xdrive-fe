import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import SEO from '../components/SEO'
import { sendContactForm } from '../services/api'

const isDev = import.meta.env.DEV

function Contact() {
  const { t, i18n } = useTranslation()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    privacyAccepted: false
  })

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
    // Clear success/error messages when user starts typing again
    if (submitSuccess) setSubmitSuccess(false)
    if (submitError) setSubmitError(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setSubmitSuccess(false)
    setSubmitError(null)

    try {
      const response = await sendContactForm({
        ...formData,
        language: i18n.language
      })

      if (response && response.success) {
        setSubmitSuccess(true)
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: '',
          privacyAccepted: false
        })
      } else {
        setSubmitError(response?.message || 'Bir hata oluştu.')
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
        title={t('seo.contact.title')}
        description={t('seo.contact.description')}
        keywords={t('seo.contact.keywords')}
      />
      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="relative min-h-[400px] w-full flex items-center justify-center bg-black bg-[url('/images/contact-hero-mobile.jpg')] md:bg-[url('/images/contact-hero-desktop.jpg')] bg-center bg-cover bg-no-repeat text-white overflow-hidden">
          <div className="absolute top-0 left-0 right-0 bottom-0 bg-black/30 z-[1]"></div>
          <div className="relative z-[2] w-full max-w-[1200px] mx-auto px-5 sm:px-6 md:px-8 lg:px-10">
            <div className="text-center max-w-[800px] mx-auto">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[48px] font-bold mb-5 leading-tight text-white">
                {t('contact.heroTitle')}
              </h1>
              <p className="text-base sm:text-lg md:text-lg text-white/90 leading-relaxed">
                {t('contact.heroSubtitle')}
              </p>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-10 sm:py-12 md:py-16 lg:py-20 bg-white px-5 sm:px-6 md:px-8 lg:px-10">
          <div className="max-w-[1200px] mx-auto">
            <div className="max-w-[800px] mx-auto">
              <div className="text-center mb-10 sm:mb-12 md:mb-15">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#1a1a1a] mb-6">{t('contact.getInTouchTitle')}</h2>
                <p className="text-base text-[#666] leading-relaxed mb-4 last:mb-0">
                  {t('contact.introText1')}
                </p>
                <p className="text-base text-[#666] leading-relaxed mb-4 last:mb-0">
                  {t('contact.introText2')}
                </p>
                <p className="text-base text-[#666] leading-relaxed mb-4 last:mb-0">
                  {t('contact.introText3')}
                </p>
              </div>

              <form className="bg-[#f9fafb] p-6 sm:p-8 md:p-10 rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.05)]" onSubmit={handleSubmit}>

                {submitSuccess && (
                  <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm text-center">
                    {t('contact.successMessage') || 'Mesajınız başarıyla gönderildi!'}
                  </div>
                )}

                {submitError && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm text-center">
                    {submitError}
                  </div>
                )}

                <div className="mb-6">
                  <label htmlFor="name" className="block text-sm font-semibold text-[#1a1a1a] mb-2">{t('contact.formFullName')}</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    onInvalid={handleInvalid}
                    onInput={(e) => e.target.setCustomValidity('')}
                    required
                    placeholder={t('contact.placeholderName')}
                    className="w-full p-3 px-4 border border-[#ddd] rounded-lg text-base transition-colors box-border font-inherit focus:outline-none focus:border-[#EF4444] focus:shadow-[0_0_0_3px_rgba(239,68,68,0.1)]"
                  />
                </div>

                <div className="mb-6">
                  <label htmlFor="email" className="block text-sm font-semibold text-[#1a1a1a] mb-2">{t('contact.formEmail')}</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    onInvalid={handleInvalid}
                    onInput={(e) => e.target.setCustomValidity('')}
                    required
                    placeholder={t('contact.placeholderEmail')}
                    className="w-full p-3 px-4 border border-[#ddd] rounded-lg text-base transition-colors box-border font-inherit focus:outline-none focus:border-[#EF4444] focus:shadow-[0_0_0_3px_rgba(239,68,68,0.1)]"
                  />
                </div>

                <div className="mb-6">
                  <label htmlFor="subject" className="block text-sm font-semibold text-[#1a1a1a] mb-2">{t('contact.formSubject')}</label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    onInvalid={handleInvalid}
                    onInput={(e) => e.target.setCustomValidity('')}
                    required
                    placeholder={t('contact.placeholderSubject')}
                    className="w-full p-3 px-4 border border-[#ddd] rounded-lg text-base transition-colors box-border font-inherit focus:outline-none focus:border-[#EF4444] focus:shadow-[0_0_0_3px_rgba(239,68,68,0.1)]"
                  />
                </div>

                <div className="mb-6">
                  <label htmlFor="message" className="block text-sm font-semibold text-[#1a1a1a] mb-2">{t('contact.formMessage')}</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    onInvalid={handleInvalid}
                    onInput={(e) => e.target.setCustomValidity('')}
                    required
                    rows="6"
                    placeholder={t('contact.placeholderMessage')}
                    className="w-full p-3 px-4 border border-[#ddd] rounded-lg text-base transition-colors box-border font-inherit resize-y min-h-[120px] focus:outline-none focus:border-[#EF4444] focus:shadow-[0_0_0_3px_rgba(239,68,68,0.1)]"
                  ></textarea>
                </div>

                <div className="mb-8">
                  <label className="flex items-start gap-3 cursor-pointer text-sm text-[#666] leading-relaxed">
                    <input
                      type="checkbox"
                      name="privacyAccepted"
                      checked={formData.privacyAccepted}
                      onChange={handleChange}
                      required
                      className="mt-1 w-[18px] h-[18px] cursor-pointer flex-shrink-0 accent-[#EF4444]"
                      onInvalid={handleInvalid}
                      onInput={(e) => e.target.setCustomValidity('')}
                    />
                    <span>{t('contact.formPrivacyAccept')} <a href="/privacy" className="text-[#EF4444] underline transition-colors hover:text-[#DC2626]">{t('contact.privacyPolicy')}</a> *</span>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#EF4444] text-white border-none py-4 px-8 text-base font-semibold rounded-lg cursor-pointer transition-colors flex items-center justify-center gap-2 hover:bg-[#DC2626] disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loading ? 'Gönderiliyor...' : t('contact.sendMessage')}
                </button>
              </form>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}

export default Contact
