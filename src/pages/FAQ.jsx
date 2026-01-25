import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import SEO from '../components/SEO'

function FAQ() {
  const { t } = useTranslation()
  const [activeFaq, setActiveFaq] = useState(null)

  return (
    <>
      <SEO
        title={t('seo.faq.title')}
        description={t('seo.faq.description')}
        keywords={t('seo.faq.keywords')}
      />
      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="relative min-h-[400px] w-full flex items-center justify-center bg-black bg-[url('/images/faq-hero-mobile.jpg')] md:bg-[url('/images/faq-hero-desktop.jpg')] bg-center bg-cover bg-no-repeat text-white overflow-hidden">
          <div className="absolute top-0 left-0 right-0 bottom-0 bg-black/30 z-[1]"></div>
          <div className="relative z-[2] w-full max-w-[1200px] mx-auto px-5 sm:px-6 md:px-8 lg:px-10">
            <div className="text-center max-w-[800px] mx-auto">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[48px] font-bold mb-5 leading-tight text-white">
                {t('faq.heroTitle')}
              </h1>
              <p className="text-base sm:text-lg md:text-lg text-white/90 leading-relaxed">
                {t('faq.heroSubtitle')}
              </p>
            </div>
          </div>
        </section>

        <section className="py-10 sm:py-12 md:py-16 lg:py-20 bg-white px-5 sm:px-6 md:px-8 lg:px-10">
          <div className="max-w-[1200px] mx-auto">
            <div className="mb-12 md:mb-12">
              <h3 className="text-xl sm:text-2xl md:text-2xl font-bold text-[#333] mb-6 pb-3 border-b-2 border-[#EF4444]">{t('faq.category1Title')}</h3>
              <div className="flex flex-col gap-3">
                <div className={`bg-[#F9F9F9] rounded-lg overflow-hidden transition-colors border ${activeFaq === 'payment-process' ? 'bg-[#F5F5F5] border-[#EF4444]' : 'border-[#E5E5E5]'}`}>
                  <div className="flex justify-between items-center p-5 sm:p-5 md:p-6 cursor-pointer text-base sm:text-base md:text-base font-semibold text-[#333] select-none transition-colors hover:bg-[#F0F0F0]" onClick={() => setActiveFaq(activeFaq === 'payment-process' ? null : 'payment-process')}>
                    <span>{t('faq.paymentProcessQ')}</span>
                    <span className={`text-2xl font-light text-[#EF4444] transition-transform flex-shrink-0 ml-4 ${activeFaq === 'payment-process' ? 'rotate-45' : ''}`}>{activeFaq === 'payment-process' ? '−' : '+'}</span>
                  </div>
                  <div className={`overflow-hidden transition-all ${activeFaq === 'payment-process' ? 'max-h-[1000px] p-0 px-6 pb-5' : 'max-h-0 p-0 px-6'}`}>
                    <div className="text-[15px] text-[#666] leading-relaxed">
                      {t('faq.paymentProcessA')}
                    </div>
                  </div>
                </div>

                <div className={`bg-[#F9F9F9] rounded-lg overflow-hidden transition-colors border ${activeFaq === 'pay-part' ? 'bg-[#F5F5F5] border-[#EF4444]' : 'border-[#E5E5E5]'}`}>
                  <div className="flex justify-between items-center p-5 sm:p-5 md:p-6 cursor-pointer text-base sm:text-base md:text-base font-semibold text-[#333] select-none transition-colors hover:bg-[#F0F0F0]" onClick={() => setActiveFaq(activeFaq === 'pay-part' ? null : 'pay-part')}>
                    <span>{t('faq.payPartQ')}</span>
                    <span className={`text-2xl font-light text-[#EF4444] transition-transform flex-shrink-0 ml-4 ${activeFaq === 'pay-part' ? 'rotate-45' : ''}`}>{activeFaq === 'pay-part' ? '−' : '+'}</span>
                  </div>
                  <div className={`overflow-hidden transition-all ${activeFaq === 'pay-part' ? 'max-h-[1000px] p-0 px-6 pb-5' : 'max-h-0 p-0 px-6'}`}>
                    <div className="text-[15px] text-[#666] leading-relaxed">
                      {t('faq.payPartA')}
                    </div>
                  </div>
                </div>

                <div className={`bg-[#F9F9F9] rounded-lg overflow-hidden transition-colors border ${activeFaq === 'pay-full' ? 'bg-[#F5F5F5] border-[#EF4444]' : 'border-[#E5E5E5]'}`}>
                  <div className="flex justify-between items-center p-5 sm:p-5 md:p-6 cursor-pointer text-base sm:text-base md:text-base font-semibold text-[#333] select-none transition-colors hover:bg-[#F0F0F0]" onClick={() => setActiveFaq(activeFaq === 'pay-full' ? null : 'pay-full')}>
                    <span>{t('faq.payFullQ')}</span>
                    <span className={`text-2xl font-light text-[#EF4444] transition-transform flex-shrink-0 ml-4 ${activeFaq === 'pay-full' ? 'rotate-45' : ''}`}>{activeFaq === 'pay-full' ? '−' : '+'}</span>
                  </div>
                  <div className={`overflow-hidden transition-all ${activeFaq === 'pay-full' ? 'max-h-[1000px] p-0 px-6 pb-5' : 'max-h-0 p-0 px-6'}`}>
                    <div className="text-[15px] text-[#666] leading-relaxed">
                      {t('faq.payFullA')}
                    </div>
                  </div>
                </div>

                <div className={`bg-[#F9F9F9] rounded-lg overflow-hidden transition-colors border ${activeFaq === 'payment-methods' ? 'bg-[#F5F5F5] border-[#EF4444]' : 'border-[#E5E5E5]'}`}>
                  <div className="flex justify-between items-center p-5 sm:p-5 md:p-6 cursor-pointer text-base sm:text-base md:text-base font-semibold text-[#333] select-none transition-colors hover:bg-[#F0F0F0]" onClick={() => setActiveFaq(activeFaq === 'payment-methods' ? null : 'payment-methods')}>
                    <span>{t('faq.paymentMethodsQ')}</span>
                    <span className={`text-2xl font-light text-[#EF4444] transition-transform flex-shrink-0 ml-4 ${activeFaq === 'payment-methods' ? 'rotate-45' : ''}`}>{activeFaq === 'payment-methods' ? '−' : '+'}</span>
                  </div>
                  <div className={`overflow-hidden transition-all ${activeFaq === 'payment-methods' ? 'max-h-[1000px] p-0 px-6 pb-5' : 'max-h-0 p-0 px-6'}`}>
                    <div className="text-[15px] text-[#666] leading-relaxed">
                      {t('faq.paymentMethodsA')}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-12 md:mb-12">
              <h3 className="text-xl sm:text-2xl md:text-2xl font-bold text-[#333] mb-6 pb-3 border-b-2 border-[#EF4444]">{t('faq.category2Title')}</h3>
              <div className="flex flex-col gap-3">
                <div className={`bg-[#F9F9F9] rounded-lg overflow-hidden transition-colors border ${activeFaq === 'rental-price' ? 'bg-[#F5F5F5] border-[#EF4444]' : 'border-[#E5E5E5]'}`}>
                  <div className="flex justify-between items-center p-5 sm:p-5 md:p-6 cursor-pointer text-base sm:text-base md:text-base font-semibold text-[#333] select-none transition-colors hover:bg-[#F0F0F0]" onClick={() => setActiveFaq(activeFaq === 'rental-price' ? null : 'rental-price')}>
                    <span>{t('faq.rentalPriceQ')}</span>
                    <span className={`text-2xl font-light text-[#EF4444] transition-transform flex-shrink-0 ml-4 ${activeFaq === 'rental-price' ? 'rotate-45' : ''}`}>{activeFaq === 'rental-price' ? '−' : '+'}</span>
                  </div>
                  <div className={`overflow-hidden transition-all ${activeFaq === 'rental-price' ? 'max-h-[1000px] p-0 px-6 pb-5' : 'max-h-0 p-0 px-6'}`}>
                    <div className="text-[15px] text-[#666] leading-relaxed">
                      {t('faq.rentalPriceA')}
                    </div>
                  </div>
                </div>

                <div className={`bg-[#F9F9F9] rounded-lg overflow-hidden transition-colors border ${activeFaq === 'additional-fees' ? 'bg-[#F5F5F5] border-[#EF4444]' : 'border-[#E5E5E5]'}`}>
                  <div className="flex justify-between items-center p-5 sm:p-5 md:p-6 cursor-pointer text-base sm:text-base md:text-base font-semibold text-[#333] select-none transition-colors hover:bg-[#F0F0F0]" onClick={() => setActiveFaq(activeFaq === 'additional-fees' ? null : 'additional-fees')}>
                    <span>{t('faq.additionalFeesQ')}</span>
                    <span className={`text-2xl font-light text-[#EF4444] transition-transform flex-shrink-0 ml-4 ${activeFaq === 'additional-fees' ? 'rotate-45' : ''}`}>{activeFaq === 'additional-fees' ? '−' : '+'}</span>
                  </div>
                  <div className={`overflow-hidden transition-all ${activeFaq === 'additional-fees' ? 'max-h-[1000px] p-0 px-6 pb-5' : 'max-h-0 p-0 px-6'}`}>
                    <div className="text-[15px] text-[#666] leading-relaxed">
                      {t('faq.additionalFeesA')}
                    </div>
                  </div>
                </div>

                <div className={`bg-[#F9F9F9] rounded-lg overflow-hidden transition-colors border ${activeFaq === 'security-deposit' ? 'bg-[#F5F5F5] border-[#EF4444]' : 'border-[#E5E5E5]'}`}>
                  <div className="flex justify-between items-center p-5 sm:p-5 md:p-6 cursor-pointer text-base sm:text-base md:text-base font-semibold text-[#333] select-none transition-colors hover:bg-[#F0F0F0]" onClick={() => setActiveFaq(activeFaq === 'security-deposit' ? null : 'security-deposit')}>
                    <span>{t('faq.securityDepositQ')}</span>
                    <span className={`text-2xl font-light text-[#EF4444] transition-transform flex-shrink-0 ml-4 ${activeFaq === 'security-deposit' ? 'rotate-45' : ''}`}>{activeFaq === 'security-deposit' ? '−' : '+'}</span>
                  </div>
                  <div className={`overflow-hidden transition-all ${activeFaq === 'security-deposit' ? 'max-h-[1000px] p-0 px-6 pb-5' : 'max-h-0 p-0 px-6'}`}>
                    <div className="text-[15px] text-[#666] leading-relaxed">
                      {t('faq.securityDepositA')}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-12 md:mb-12">
              <h3 className="text-xl sm:text-2xl md:text-2xl font-bold text-[#333] mb-6 pb-3 border-b-2 border-[#EF4444]">{t('faq.category3Title')}</h3>
              <div className="flex flex-col gap-3">
                <div className={`bg-[#F9F9F9] rounded-lg overflow-hidden transition-colors border ${activeFaq === 'modify-booking' ? 'bg-[#F5F5F5] border-[#EF4444]' : 'border-[#E5E5E5]'}`}>
                  <div className="flex justify-between items-center p-5 sm:p-5 md:p-6 cursor-pointer text-base sm:text-base md:text-base font-semibold text-[#333] select-none transition-colors hover:bg-[#F0F0F0]" onClick={() => setActiveFaq(activeFaq === 'modify-booking' ? null : 'modify-booking')}>
                    <span>{t('faq.modifyBookingQ')}</span>
                    <span className={`text-2xl font-light text-[#EF4444] transition-transform flex-shrink-0 ml-4 ${activeFaq === 'modify-booking' ? 'rotate-45' : ''}`}>{activeFaq === 'modify-booking' ? '−' : '+'}</span>
                  </div>
                  <div className={`overflow-hidden transition-all ${activeFaq === 'modify-booking' ? 'max-h-[1000px] p-0 px-6 pb-5' : 'max-h-0 p-0 px-6'}`}>
                    <div className="text-[15px] text-[#666] leading-relaxed">
                      {t('faq.modifyBookingA')}
                    </div>
                  </div>
                </div>

                <div className={`bg-[#F9F9F9] rounded-lg overflow-hidden transition-colors border ${activeFaq === 'cancel-booking' ? 'bg-[#F5F5F5] border-[#EF4444]' : 'border-[#E5E5E5]'}`}>
                  <div className="flex justify-between items-center p-5 sm:p-5 md:p-6 cursor-pointer text-base sm:text-base md:text-base font-semibold text-[#333] select-none transition-colors hover:bg-[#F0F0F0]" onClick={() => setActiveFaq(activeFaq === 'cancel-booking' ? null : 'cancel-booking')}>
                    <span>{t('faq.cancelBookingQ')}</span>
                    <span className={`text-2xl font-light text-[#EF4444] transition-transform flex-shrink-0 ml-4 ${activeFaq === 'cancel-booking' ? 'rotate-45' : ''}`}>{activeFaq === 'cancel-booking' ? '−' : '+'}</span>
                  </div>
                  <div className={`overflow-hidden transition-all ${activeFaq === 'cancel-booking' ? 'max-h-[1000px] p-0 px-6 pb-5' : 'max-h-0 p-0 px-6'}`}>
                    <div className="text-[15px] text-[#666] leading-relaxed">
                      {t('faq.cancelBookingA')}
                    </div>
                  </div>
                </div>

                <div className={`bg-[#F9F9F9] rounded-lg overflow-hidden transition-colors border ${activeFaq === 'flight-delayed' ? 'bg-[#F5F5F5] border-[#EF4444]' : 'border-[#E5E5E5]'}`}>
                  <div className="flex justify-between items-center p-5 sm:p-5 md:p-6 cursor-pointer text-base sm:text-base md:text-base font-semibold text-[#333] select-none transition-colors hover:bg-[#F0F0F0]" onClick={() => setActiveFaq(activeFaq === 'flight-delayed' ? null : 'flight-delayed')}>
                    <span>{t('faq.flightDelayedQ')}</span>
                    <span className={`text-2xl font-light text-[#EF4444] transition-transform flex-shrink-0 ml-4 ${activeFaq === 'flight-delayed' ? 'rotate-45' : ''}`}>{activeFaq === 'flight-delayed' ? '−' : '+'}</span>
                  </div>
                  <div className={`overflow-hidden transition-all ${activeFaq === 'flight-delayed' ? 'max-h-[1000px] p-0 px-6 pb-5' : 'max-h-0 p-0 px-6'}`}>
                    <div className="text-[15px] text-[#666] leading-relaxed">
                      {t('faq.flightDelayedA')}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-12 md:mb-12">
              <h3 className="text-xl sm:text-2xl md:text-2xl font-bold text-[#333] mb-6 pb-3 border-b-2 border-[#EF4444]">{t('faq.category4Title')}</h3>
              <div className="flex flex-col gap-3">
                <div className={`bg-[#F9F9F9] rounded-lg overflow-hidden transition-colors border ${activeFaq === 'documents-required' ? 'bg-[#F5F5F5] border-[#EF4444]' : 'border-[#E5E5E5]'}`}>
                  <div className="flex justify-between items-center p-5 sm:p-5 md:p-6 cursor-pointer text-base sm:text-base md:text-base font-semibold text-[#333] select-none transition-colors hover:bg-[#F0F0F0]" onClick={() => setActiveFaq(activeFaq === 'documents-required' ? null : 'documents-required')}>
                    <span>{t('faq.documentsRequiredQ')}</span>
                    <span className={`text-2xl font-light text-[#EF4444] transition-transform flex-shrink-0 ml-4 ${activeFaq === 'documents-required' ? 'rotate-45' : ''}`}>{activeFaq === 'documents-required' ? '−' : '+'}</span>
                  </div>
                  <div className={`overflow-hidden transition-all ${activeFaq === 'documents-required' ? 'max-h-[1000px] p-0 px-6 pb-5' : 'max-h-0 p-0 px-6'}`}>
                    <div className="text-[15px] text-[#666] leading-relaxed">
                      {t('faq.documentsRequiredA')}
                    </div>
                  </div>
                </div>

                <div className={`bg-[#F9F9F9] rounded-lg overflow-hidden transition-colors border ${activeFaq === 'cash-payment' ? 'bg-[#F5F5F5] border-[#EF4444]' : 'border-[#E5E5E5]'}`}>
                  <div className="flex justify-between items-center p-5 sm:p-5 md:p-6 cursor-pointer text-base sm:text-base md:text-base font-semibold text-[#333] select-none transition-colors hover:bg-[#F0F0F0]" onClick={() => setActiveFaq(activeFaq === 'cash-payment' ? null : 'cash-payment')}>
                    <span>{t('faq.cashPaymentQ')}</span>
                    <span className={`text-2xl font-light text-[#EF4444] transition-transform flex-shrink-0 ml-4 ${activeFaq === 'cash-payment' ? 'rotate-45' : ''}`}>{activeFaq === 'cash-payment' ? '−' : '+'}</span>
                  </div>
                  <div className={`overflow-hidden transition-all ${activeFaq === 'cash-payment' ? 'max-h-[1000px] p-0 px-6 pb-5' : 'max-h-0 p-0 px-6'}`}>
                    <div className="text-[15px] text-[#666] leading-relaxed">
                      {t('faq.cashPaymentA')}
                    </div>
                  </div>
                </div>

                <div className={`bg-[#F9F9F9] rounded-lg overflow-hidden transition-colors border ${activeFaq === 'additional-driver' ? 'bg-[#F5F5F5] border-[#EF4444]' : 'border-[#E5E5E5]'}`}>
                  <div className="flex justify-between items-center p-5 sm:p-5 md:p-6 cursor-pointer text-base sm:text-base md:text-base font-semibold text-[#333] select-none transition-colors hover:bg-[#F0F0F0]" onClick={() => setActiveFaq(activeFaq === 'additional-driver' ? null : 'additional-driver')}>
                    <span>{t('faq.additionalDriverQ')}</span>
                    <span className={`text-2xl font-light text-[#EF4444] transition-transform flex-shrink-0 ml-4 ${activeFaq === 'additional-driver' ? 'rotate-45' : ''}`}>{activeFaq === 'additional-driver' ? '−' : '+'}</span>
                  </div>
                  <div className={`overflow-hidden transition-all ${activeFaq === 'additional-driver' ? 'max-h-[1000px] p-0 px-6 pb-5' : 'max-h-0 p-0 px-6'}`}>
                    <div className="text-[15px] text-[#666] leading-relaxed">
                      {t('faq.additionalDriverA')}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-12 md:mb-12">
              <h3 className="text-xl sm:text-2xl md:text-2xl font-bold text-[#333] mb-6 pb-3 border-b-2 border-[#EF4444]">{t('faq.category5Title')}</h3>
              <div className="flex flex-col gap-3">
                <div className={`bg-[#F9F9F9] rounded-lg overflow-hidden transition-colors border ${activeFaq === 'rental-service' ? 'bg-[#F5F5F5] border-[#EF4444]' : 'border-[#E5E5E5]'}`}>
                  <div className="flex justify-between items-center p-5 sm:p-5 md:p-6 cursor-pointer text-base sm:text-base md:text-base font-semibold text-[#333] select-none transition-colors hover:bg-[#F0F0F0]" onClick={() => setActiveFaq(activeFaq === 'rental-service' ? null : 'rental-service')}>
                    <span>{t('faq.rentalServiceQ')}</span>
                    <span className={`text-2xl font-light text-[#EF4444] transition-transform flex-shrink-0 ml-4 ${activeFaq === 'rental-service' ? 'rotate-45' : ''}`}>{activeFaq === 'rental-service' ? '−' : '+'}</span>
                  </div>
                  <div className={`overflow-hidden transition-all ${activeFaq === 'rental-service' ? 'max-h-[1000px] p-0 px-6 pb-5' : 'max-h-0 p-0 px-6'}`}>
                    <div className="text-[15px] text-[#666] leading-relaxed">
                      {t('faq.rentalServiceA')}
                    </div>
                  </div>
                </div>

                <div className={`bg-[#F9F9F9] rounded-lg overflow-hidden transition-colors border ${activeFaq === 'contact-issue' ? 'bg-[#F5F5F5] border-[#EF4444]' : 'border-[#E5E5E5]'}`}>
                  <div className="flex justify-between items-center p-5 sm:p-5 md:p-6 cursor-pointer text-base sm:text-base md:text-base font-semibold text-[#333] select-none transition-colors hover:bg-[#F0F0F0]" onClick={() => setActiveFaq(activeFaq === 'contact-issue' ? null : 'contact-issue')}>
                    <span>{t('faq.contactIssueQ')}</span>
                    <span className={`text-2xl font-light text-[#EF4444] transition-transform flex-shrink-0 ml-4 ${activeFaq === 'contact-issue' ? 'rotate-45' : ''}`}>{activeFaq === 'contact-issue' ? '−' : '+'}</span>
                  </div>
                  <div className={`overflow-hidden transition-all ${activeFaq === 'contact-issue' ? 'max-h-[1000px] p-0 px-6 pb-5' : 'max-h-0 p-0 px-6'}`}>
                    <div className="text-[15px] text-[#666] leading-relaxed">
                      {t('faq.contactIssueA')}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-12 md:mb-12">
              <h3 className="text-xl sm:text-2xl md:text-2xl font-bold text-[#333] mb-6 pb-3 border-b-2 border-[#EF4444]">{t('faq.category6Title')}</h3>
              <div className="flex flex-col gap-3">
                <div className={`bg-[#F9F9F9] rounded-lg overflow-hidden transition-colors border ${activeFaq === 'insurance' ? 'bg-[#F5F5F5] border-[#EF4444]' : 'border-[#E5E5E5]'}`}>
                  <div className="flex justify-between items-center p-5 sm:p-5 md:p-6 cursor-pointer text-base sm:text-base md:text-base font-semibold text-[#333] select-none transition-colors hover:bg-[#F0F0F0]" onClick={() => setActiveFaq(activeFaq === 'insurance' ? null : 'insurance')}>
                    <span>{t('faq.insuranceQ')}</span>
                    <span className={`text-2xl font-light text-[#EF4444] transition-transform flex-shrink-0 ml-4 ${activeFaq === 'insurance' ? 'rotate-45' : ''}`}>{activeFaq === 'insurance' ? '−' : '+'}</span>
                  </div>
                  <div className={`overflow-hidden transition-all ${activeFaq === 'insurance' ? 'max-h-[1000px] p-0 px-6 pb-5' : 'max-h-0 p-0 px-6'}`}>
                    <div className="text-[15px] text-[#666] leading-relaxed">
                      {t('faq.insuranceA')}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-12 md:mb-12">
              <h3 className="text-xl sm:text-2xl md:text-2xl font-bold text-[#333] mb-6 pb-3 border-b-2 border-[#EF4444]">{t('faq.category7Title')}</h3>
              <div className="flex flex-col gap-3">
                <div className={`bg-[#F9F9F9] rounded-lg overflow-hidden transition-colors border ${activeFaq === 'payment-secure' ? 'bg-[#F5F5F5] border-[#EF4444]' : 'border-[#E5E5E5]'}`}>
                  <div className="flex justify-between items-center p-5 sm:p-5 md:p-6 cursor-pointer text-base sm:text-base md:text-base font-semibold text-[#333] select-none transition-colors hover:bg-[#F0F0F0]" onClick={() => setActiveFaq(activeFaq === 'payment-secure' ? null : 'payment-secure')}>
                    <span>{t('faq.paymentSecureQ')}</span>
                    <span className={`text-2xl font-light text-[#EF4444] transition-transform flex-shrink-0 ml-4 ${activeFaq === 'payment-secure' ? 'rotate-45' : ''}`}>{activeFaq === 'payment-secure' ? '−' : '+'}</span>
                  </div>
                  <div className={`overflow-hidden transition-all ${activeFaq === 'payment-secure' ? 'max-h-[1000px] p-0 px-6 pb-5' : 'max-h-0 p-0 px-6'}`}>
                    <div className="text-[15px] text-[#666] leading-relaxed">
                      {t('faq.paymentSecureA')}
                    </div>
                  </div>
                </div>

                <div className={`bg-[#F9F9F9] rounded-lg overflow-hidden transition-colors border ${activeFaq === 'rental-terms' ? 'bg-[#F5F5F5] border-[#EF4444]' : 'border-[#E5E5E5]'}`}>
                  <div className="flex justify-between items-center p-5 sm:p-5 md:p-6 cursor-pointer text-base sm:text-base md:text-base font-semibold text-[#333] select-none transition-colors hover:bg-[#F0F0F0]" onClick={() => setActiveFaq(activeFaq === 'rental-terms' ? null : 'rental-terms')}>
                    <span>{t('faq.rentalTermsQ')}</span>
                    <span className={`text-2xl font-light text-[#EF4444] transition-transform flex-shrink-0 ml-4 ${activeFaq === 'rental-terms' ? 'rotate-45' : ''}`}>{activeFaq === 'rental-terms' ? '−' : '+'}</span>
                  </div>
                  <div className={`overflow-hidden transition-all ${activeFaq === 'rental-terms' ? 'max-h-[1000px] p-0 px-6 pb-5' : 'max-h-0 p-0 px-6'}`}>
                    <div className="text-[15px] text-[#666] leading-relaxed">
                      {t('faq.rentalTermsA')}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}

export default FAQ
