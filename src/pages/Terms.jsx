import { useTranslation } from 'react-i18next'
import SEO from '../components/SEO'

function Terms() {
  const { t } = useTranslation()

  return (
    <>
      <SEO
        title={t('seo.terms.title')}
        description={t('seo.terms.description')}
        keywords={t('seo.terms.keywords')}
      />
      <div className="min-h-screen py-[120px] sm:py-[100px] md:py-[100px] px-5 sm:px-6 md:px-8 lg:px-10 bg-[#f9f9f9]">
        <div className="max-w-[1200px] mx-auto">
          <div className="max-w-[900px] mx-auto bg-white p-10 sm:p-10 md:p-15 rounded-xl shadow-[0_2px_12px_rgba(0,0,0,0.08)]">
            <h1 className="text-3xl sm:text-4xl md:text-[42px] font-bold text-[#333] mb-2.5 leading-tight">{t('termsPage.title')}</h1>

            <section className="mb-10">
              <h2 className="text-2xl sm:text-2xl md:text-[28px] font-bold text-[#333] mb-4 mt-8">{t('termsPage.introTitle')}</h2>
              <p className="text-base sm:text-[15px] md:text-base text-[#666] leading-relaxed mb-4">
                {t('termsPage.introText1')}
              </p>
              <p className="text-base sm:text-[15px] md:text-base text-[#666] leading-relaxed mb-4">
                {t('termsPage.introText2')}
              </p>
              <p className="text-base sm:text-[15px] md:text-base text-[#666] leading-relaxed mb-4">
                {t('termsPage.introText3')}
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl sm:text-2xl md:text-[28px] font-bold text-[#333] mb-4 mt-8">{t('termsPage.roleTitle')}</h2>
              <p className="text-base sm:text-[15px] md:text-base text-[#666] leading-relaxed mb-4">
                {t('termsPage.roleText1')}
              </p>
              <p className="text-base sm:text-[15px] md:text-base text-[#666] leading-relaxed mb-4">
                {t('termsPage.roleText2')}
              </p>
              <p className="text-base sm:text-[15px] md:text-base text-[#666] leading-relaxed mb-4">
                {t('termsPage.roleText3')}
              </p>
              <p className="text-base sm:text-[15px] md:text-base text-[#666] leading-relaxed mb-4">
                {t('termsPage.roleText4')}
              </p>
              <p className="text-base sm:text-[15px] md:text-base text-[#666] leading-relaxed mb-4">
                {t('termsPage.roleText5')}
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl sm:text-2xl md:text-[28px] font-bold text-[#333] mb-4 mt-8">{t('termsPage.useTitle')}</h2>
              <p className="text-base sm:text-[15px] md:text-base text-[#666] leading-relaxed mb-4">{t('termsPage.useText1')}</p>
              <p className="text-base sm:text-[15px] md:text-base text-[#666] leading-relaxed mb-4">{t('termsPage.useText2')}</p>
              <ul className="ml-6 mb-4">
                <li className="text-base sm:text-[15px] md:text-base text-[#666] leading-relaxed mb-2">{t('termsPage.useList1')}</li>
                <li className="text-base sm:text-[15px] md:text-base text-[#666] leading-relaxed mb-2">{t('termsPage.useList2')}</li>
                <li className="text-base sm:text-[15px] md:text-base text-[#666] leading-relaxed mb-2">{t('termsPage.useList3')}</li>
                <li className="text-base sm:text-[15px] md:text-base text-[#666] leading-relaxed mb-2">{t('termsPage.useList4')}</li>
              </ul>
              <p className="text-base sm:text-[15px] md:text-base text-[#666] leading-relaxed mb-4">
                {t('termsPage.useText3')}
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl sm:text-2xl md:text-[28px] font-bold text-[#333] mb-4 mt-8">{t('termsPage.reservationsTitle')}</h2>
              <p className="text-base sm:text-[15px] md:text-base text-[#666] leading-relaxed mb-4">{t('termsPage.reservationsText1')}</p>
              <p className="text-base sm:text-[15px] md:text-base text-[#666] leading-relaxed mb-4">
                {t('termsPage.reservationsText2')}
              </p>
              <p className="text-base sm:text-[15px] md:text-base text-[#666] leading-relaxed mb-4">{t('termsPage.reservationsText3')}</p>
              <p className="text-base sm:text-[15px] md:text-base text-[#666] leading-relaxed mb-4">
                {t('termsPage.reservationsText4')}
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl sm:text-2xl md:text-[28px] font-bold text-[#333] mb-4 mt-8">{t('termsPage.supplierTitle')}</h2>
              <p className="text-base sm:text-[15px] md:text-base text-[#666] leading-relaxed mb-4">
                {t('termsPage.supplierText1')}
              </p>
              <p className="text-base sm:text-[15px] md:text-base text-[#666] leading-relaxed mb-4">
                {t('termsPage.supplierText2')}
              </p>
              <p className="text-base sm:text-[15px] md:text-base text-[#666] leading-relaxed mb-4">
                {t('termsPage.supplierText3')}
              </p>
              <p className="text-base sm:text-[15px] md:text-base text-[#666] leading-relaxed mb-4">
                {t('termsPage.supplierText4')}
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl sm:text-2xl md:text-[28px] font-bold text-[#333] mb-4 mt-8">{t('termsPage.pricesTitle')}</h2>
              <p className="text-base sm:text-[15px] md:text-base text-[#666] leading-relaxed mb-4">{t('termsPage.pricesText1')}</p>
              <h3 className="text-lg sm:text-lg md:text-xl font-semibold text-[#333] mt-5 mb-3">{t('termsPage.pricesSubTitle1')}</h3>
              <p className="text-base sm:text-[15px] md:text-base text-[#666] leading-relaxed mb-4">{t('termsPage.pricesText2')}</p>
              <p className="text-base sm:text-[15px] md:text-base text-[#666] leading-relaxed mb-4">{t('termsPage.pricesText3')}</p>
              <h3 className="text-lg sm:text-lg md:text-xl font-semibold text-[#333] mt-5 mb-3">{t('termsPage.pricesSubTitle2')}</h3>
              <p className="text-base sm:text-[15px] md:text-base text-[#666] leading-relaxed mb-4">{t('termsPage.pricesText4')}</p>
              <p className="text-base sm:text-[15px] md:text-base text-[#666] leading-relaxed mb-4">{t('termsPage.pricesText5')}</p>
              <p className="text-base sm:text-[15px] md:text-base text-[#666] leading-relaxed mb-4">
                {t('termsPage.pricesText6')}
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl sm:text-2xl md:text-[28px] font-bold text-[#333] mb-4 mt-8">{t('termsPage.cancellationTitle')}</h2>
              <p className="text-base sm:text-[15px] md:text-base text-[#666] leading-relaxed mb-4">{t('termsPage.cancellationText1')}</p>
              <h3 className="text-lg sm:text-lg md:text-xl font-semibold text-[#333] mt-5 mb-3">{t('termsPage.cancellationSubTitle1')}</h3>
              <p className="text-base sm:text-[15px] md:text-base text-[#666] leading-relaxed mb-4">
                {t('termsPage.cancellationText2')}
              </p>
              <h3 className="text-lg sm:text-lg md:text-xl font-semibold text-[#333] mt-5 mb-3">{t('termsPage.cancellationSubTitle2')}</h3>
              <p className="text-base sm:text-[15px] md:text-base text-[#666] leading-relaxed mb-4">
                {t('termsPage.cancellationText3')}
              </p>
              <h3 className="text-lg sm:text-lg md:text-xl font-semibold text-[#333] mt-5 mb-3">{t('termsPage.cancellationSubTitle3')}</h3>
              <p className="text-base sm:text-[15px] md:text-base text-[#666] leading-relaxed mb-4">
                {t('termsPage.cancellationText4')}
              </p>
              <h3 className="text-lg sm:text-lg md:text-xl font-semibold text-[#333] mt-5 mb-3">{t('termsPage.cancellationSubTitle4')}</h3>
              <p className="text-base sm:text-[15px] md:text-base text-[#666] leading-relaxed mb-4">
                {t('termsPage.cancellationText5')}
              </p>
              <h3 className="text-lg sm:text-lg md:text-xl font-semibold text-[#333] mt-5 mb-3">{t('termsPage.cancellationSubTitle5')}</h3>
              <p className="text-base sm:text-[15px] md:text-base text-[#666] leading-relaxed mb-4">
                {t('termsPage.cancellationText6')}
              </p>
              <h3 className="text-lg sm:text-lg md:text-xl font-semibold text-[#333] mt-5 mb-3">{t('termsPage.cancellationSubTitle6')}</h3>
              <p className="text-base sm:text-[15px] md:text-base text-[#666] leading-relaxed mb-4">
                {t('termsPage.cancellationText7')}
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl sm:text-2xl md:text-[28px] font-bold text-[#333] mb-4 mt-8">{t('termsPage.driverTitle')}</h2>
              <p className="text-base sm:text-[15px] md:text-base text-[#666] leading-relaxed mb-4">{t('termsPage.driverText1')}</p>
              <ul className="ml-6 mb-4">
                <li className="text-base sm:text-[15px] md:text-base text-[#666] leading-relaxed mb-2">{t('termsPage.driverList1')}</li>
                <li className="text-base sm:text-[15px] md:text-base text-[#666] leading-relaxed mb-2">{t('termsPage.driverList2')}</li>
                <li className="text-base sm:text-[15px] md:text-base text-[#666] leading-relaxed mb-2">{t('termsPage.driverList3')}</li>
              </ul>
              <p className="text-base sm:text-[15px] md:text-base text-[#666] leading-relaxed mb-4">
                {t('termsPage.driverText2')}
              </p>
              <p className="text-base sm:text-[15px] md:text-base text-[#666] leading-relaxed mb-4">
                {t('termsPage.driverText3')}
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl sm:text-2xl md:text-[28px] font-bold text-[#333] mb-4 mt-8">{t('termsPage.vehicleTitle')}</h2>
              <p className="text-base sm:text-[15px] md:text-base text-[#666] leading-relaxed mb-4">{t('termsPage.vehicleText1')}</p>
              <p className="text-base sm:text-[15px] md:text-base text-[#666] leading-relaxed mb-4">{t('termsPage.vehicleText2')}</p>
              <p className="text-base sm:text-[15px] md:text-base text-[#666] leading-relaxed mb-4">
                {t('termsPage.vehicleText3')}
              </p>
              <p className="text-base sm:text-[15px] md:text-base text-[#666] leading-relaxed mb-4">{t('termsPage.vehicleText4')}</p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl sm:text-2xl md:text-[28px] font-bold text-[#333] mb-4 mt-8">{t('termsPage.insuranceTitle')}</h2>
              <p className="text-base sm:text-[15px] md:text-base text-[#666] leading-relaxed mb-4">{t('termsPage.insuranceText1')}</p>
              <p className="text-base sm:text-[15px] md:text-base text-[#666] leading-relaxed mb-4">{t('termsPage.insuranceText2')}</p>
              <p className="text-base sm:text-[15px] md:text-base text-[#666] leading-relaxed mb-4">{t('termsPage.insuranceText3')}</p>
              <p className="text-base sm:text-[15px] md:text-base text-[#666] leading-relaxed mb-4">{t('termsPage.insuranceText4')}</p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl sm:text-2xl md:text-[28px] font-bold text-[#333] mb-4 mt-8">{t('termsPage.liabilityTitle')}</h2>
              <p className="text-base sm:text-[15px] md:text-base text-[#666] leading-relaxed mb-4">{t('termsPage.liabilityText1')}</p>
              <ul className="ml-6 mb-4">
                <li className="text-base sm:text-[15px] md:text-base text-[#666] leading-relaxed mb-2">{t('termsPage.liabilityList1')}</li>
                <li className="text-base sm:text-[15px] md:text-base text-[#666] leading-relaxed mb-2">{t('termsPage.liabilityList2')}</li>
                <li className="text-base sm:text-[15px] md:text-base text-[#666] leading-relaxed mb-2">{t('termsPage.liabilityList3')}</li>
              </ul>
              <p className="text-base sm:text-[15px] md:text-base text-[#666] leading-relaxed mb-4">{t('termsPage.liabilityText2')}</p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl sm:text-2xl md:text-[28px] font-bold text-[#333] mb-4 mt-8">{t('termsPage.indemnificationTitle')}</h2>
              <p className="text-base sm:text-[15px] md:text-base text-[#666] leading-relaxed mb-4">
                {t('termsPage.indemnificationText1')}
              </p>
              <ul className="ml-6 mb-4">
                <li className="text-base sm:text-[15px] md:text-base text-[#666] leading-relaxed mb-2">{t('termsPage.indemnificationList1')}</li>
                <li className="text-base sm:text-[15px] md:text-base text-[#666] leading-relaxed mb-2">{t('termsPage.indemnificationList2')}</li>
                <li className="text-base sm:text-[15px] md:text-base text-[#666] leading-relaxed mb-2">{t('termsPage.indemnificationList3')}</li>
                <li className="text-base sm:text-[15px] md:text-base text-[#666] leading-relaxed mb-2">{t('termsPage.indemnificationList4')}</li>
              </ul>
              <p className="text-base sm:text-[15px] md:text-base text-[#666] leading-relaxed mb-4">{t('termsPage.indemnificationText2')}</p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl sm:text-2xl md:text-[28px] font-bold text-[#333] mb-4 mt-8">{t('termsPage.partnershipTitle')}</h2>
              <p className="text-base sm:text-[15px] md:text-base text-[#666] leading-relaxed mb-4">
                {t('termsPage.partnershipText1')}
              </p>
              <p className="text-base sm:text-[15px] md:text-base text-[#666] leading-relaxed mb-4">
                {t('termsPage.partnershipText2')}
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl sm:text-2xl md:text-[28px] font-bold text-[#333] mb-4 mt-8">{t('termsPage.thirdPartyTitle')}</h2>
              <p className="text-base sm:text-[15px] md:text-base text-[#666] leading-relaxed mb-4">{t('termsPage.thirdPartyText1')}</p>
              <p className="text-base sm:text-[15px] md:text-base text-[#666] leading-relaxed mb-4">{t('termsPage.thirdPartyText2')}</p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl sm:text-2xl md:text-[28px] font-bold text-[#333] mb-4 mt-8">{t('termsPage.ipTitle')}</h2>
              <p className="text-base sm:text-[15px] md:text-base text-[#666] leading-relaxed mb-4">
                {t('termsPage.ipText1')}
              </p>
              <p className="text-base sm:text-[15px] md:text-base text-[#666] leading-relaxed mb-4">{t('termsPage.ipText2')}</p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl sm:text-2xl md:text-[28px] font-bold text-[#333] mb-4 mt-8">{t('termsPage.dataTitle')}</h2>
              <p className="text-base sm:text-[15px] md:text-base text-[#666] leading-relaxed mb-4">
                {t('termsPage.dataText1')}
              </p>
              <p className="text-base sm:text-[15px] md:text-base text-[#666] leading-relaxed mb-4">
                {t('termsPage.dataText2')}
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl sm:text-2xl md:text-[28px] font-bold text-[#333] mb-4 mt-8">{t('termsPage.warrantyTitle')}</h2>
              <p className="text-base sm:text-[15px] md:text-base text-[#666] leading-relaxed mb-4">
                {t('termsPage.warrantyText1')}
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl sm:text-2xl md:text-[28px] font-bold text-[#333] mb-4 mt-8">{t('termsPage.governingTitle')}</h2>
              <p className="text-base sm:text-[15px] md:text-base text-[#666] leading-relaxed mb-4">
                {t('termsPage.governingText1')}
              </p>
              <p className="text-base sm:text-[15px] md:text-base text-[#666] leading-relaxed mb-4">
                {t('termsPage.governingText2')}
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl sm:text-2xl md:text-[28px] font-bold text-[#333] mb-4 mt-8">{t('termsPage.generalTitle')}</h2>
              <p className="text-base sm:text-[15px] md:text-base text-[#666] leading-relaxed mb-4">{t('termsPage.generalText1')}</p>
              <p className="text-base sm:text-[15px] md:text-base text-[#666] leading-relaxed mb-4">{t('termsPage.generalText2')}</p>
              <p className="text-base sm:text-[15px] md:text-base text-[#666] leading-relaxed mb-4">{t('termsPage.generalText3')}</p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl sm:text-2xl md:text-[28px] font-bold text-[#333] mb-4 mt-8">{t('termsPage.contactTitle')}</h2>
              <p className="text-base sm:text-[15px] md:text-base text-[#666] leading-relaxed mb-4">{t('termsPage.contactText1')}</p>
              <p className="text-base sm:text-[15px] md:text-base text-[#666] leading-relaxed mb-4"><a href="mailto:info@xdrivemobility.com" className="text-[#EF4444] no-underline transition-colors hover:text-[#DC2626] hover:underline">info@xdrivemobility.com</a></p>
            </section>
          </div>
        </div>
      </div>
    </>
  )
}

export default Terms
