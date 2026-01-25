import { useTranslation } from 'react-i18next'
import SEO from '../components/SEO'

function Privacy() {
  const { t } = useTranslation()

  return (
    <>
      <SEO
        title={t('seo.privacy.title')}
        description={t('seo.privacy.description')}
        keywords={t('seo.privacy.keywords')}
      />
      <div className="min-h-screen py-[120px] sm:py-[100px] md:py-[100px] px-5 sm:px-6 md:px-8 lg:px-10 bg-[#f9f9f9]">
        <div className="max-w-[1200px] mx-auto">
          <div className="max-w-[900px] mx-auto bg-white p-10 sm:p-10 md:p-15 rounded-xl shadow-[0_2px_12px_rgba(0,0,0,0.08)]">
            <h1 className="text-3xl sm:text-4xl md:text-[42px] font-bold text-[#333] mb-10 leading-tight">{t('privacyPage.title')}</h1>

            <section className="mb-10">
              <h2 className="text-2xl sm:text-2xl md:text-[28px] font-bold text-[#333] mb-4 mt-8">{t('privacyPage.introTitle')}</h2>
              <p className="text-base sm:text-[15px] md:text-base text-[#666] leading-relaxed mb-4">
                {t('privacyPage.introText1')}
              </p>
              <p className="text-base sm:text-[15px] md:text-base text-[#666] leading-relaxed mb-4">
                {t('privacyPage.introText2')}
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl sm:text-2xl md:text-[28px] font-bold text-[#333] mb-4 mt-8">{t('privacyPage.controllerTitle')}</h2>
              <p className="text-base sm:text-[15px] md:text-base text-[#666] leading-relaxed mb-4">
                {t('privacyPage.controllerText1')}
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl sm:text-2xl md:text-[28px] font-bold text-[#333] mb-4 mt-8">{t('privacyPage.collectTitle')}</h2>
              <p className="text-base sm:text-[15px] md:text-base text-[#666] leading-relaxed mb-4">{t('privacyPage.collectText1')}</p>
              <ul className="ml-6 mb-4">
                <li className="text-base sm:text-[15px] md:text-base text-[#666] leading-relaxed mb-2">{t('privacyPage.collectList1')}</li>
                <li className="text-base sm:text-[15px] md:text-base text-[#666] leading-relaxed mb-2">{t('privacyPage.collectList2')}</li>
                <li className="text-base sm:text-[15px] md:text-base text-[#666] leading-relaxed mb-2">{t('privacyPage.collectList3')}</li>
                <li className="text-base sm:text-[15px] md:text-base text-[#666] leading-relaxed mb-2">{t('privacyPage.collectList4')}</li>
                <li className="text-base sm:text-[15px] md:text-base text-[#666] leading-relaxed mb-2">{t('privacyPage.collectList5')}</li>
              </ul>
              <p className="text-base sm:text-[15px] md:text-base text-[#666] leading-relaxed mb-4">
                {t('privacyPage.collectText2')}
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl sm:text-2xl md:text-[28px] font-bold text-[#333] mb-4 mt-8">{t('privacyPage.purposeTitle')}</h2>
              <p className="text-base sm:text-[15px] md:text-base text-[#666] leading-relaxed mb-4">{t('privacyPage.purposeText1')}</p>
              <ul className="ml-6 mb-4">
                <li className="text-base sm:text-[15px] md:text-base text-[#666] leading-relaxed mb-2">{t('privacyPage.purposeList1')}</li>
                <li className="text-base sm:text-[15px] md:text-base text-[#666] leading-relaxed mb-2">{t('privacyPage.purposeList2')}</li>
                <li className="text-base sm:text-[15px] md:text-base text-[#666] leading-relaxed mb-2">{t('privacyPage.purposeList3')}</li>
                <li className="text-base sm:text-[15px] md:text-base text-[#666] leading-relaxed mb-2">{t('privacyPage.purposeList4')}</li>
                <li className="text-base sm:text-[15px] md:text-base text-[#666] leading-relaxed mb-2">{t('privacyPage.purposeList5')}</li>
                <li className="text-base sm:text-[15px] md:text-base text-[#666] leading-relaxed mb-2">{t('privacyPage.purposeList6')}</li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl sm:text-2xl md:text-[28px] font-bold text-[#333] mb-4 mt-8">{t('privacyPage.basisTitle')}</h2>
              <p className="text-base sm:text-[15px] md:text-base text-[#666] leading-relaxed mb-4">{t('privacyPage.basisText1')}</p>
              <ul className="ml-6 mb-4">
                <li className="text-base sm:text-[15px] md:text-base text-[#666] leading-relaxed mb-2">{t('privacyPage.basisList1')}</li>
                <li className="text-base sm:text-[15px] md:text-base text-[#666] leading-relaxed mb-2">{t('privacyPage.basisList2')}</li>
                <li className="text-base sm:text-[15px] md:text-base text-[#666] leading-relaxed mb-2">{t('privacyPage.basisList3')}</li>
                <li className="text-base sm:text-[15px] md:text-base text-[#666] leading-relaxed mb-2">{t('privacyPage.basisList4')}</li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl sm:text-2xl md:text-[28px] font-bold text-[#333] mb-4 mt-8">{t('privacyPage.sharingTitle')}</h2>
              <p className="text-base sm:text-[15px] md:text-base text-[#666] leading-relaxed mb-4">{t('privacyPage.sharingText1')}</p>
              <ul className="ml-6 mb-4">
                <li className="text-base sm:text-[15px] md:text-base text-[#666] leading-relaxed mb-2">{t('privacyPage.sharingList1')}</li>
                <li className="text-base sm:text-[15px] md:text-base text-[#666] leading-relaxed mb-2">{t('privacyPage.sharingList2')}</li>
                <li className="text-base sm:text-[15px] md:text-base text-[#666] leading-relaxed mb-2">{t('privacyPage.sharingList3')}</li>
                <li className="text-base sm:text-[15px] md:text-base text-[#666] leading-relaxed mb-2">{t('privacyPage.sharingList4')}</li>
              </ul>
              <p className="text-base sm:text-[15px] md:text-base text-[#666] leading-relaxed mb-4">
                {t('privacyPage.sharingText2')}
              </p>
              <p className="text-base sm:text-[15px] md:text-base text-[#666] leading-relaxed mb-4">
                {t('privacyPage.sharingText3')}
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl sm:text-2xl md:text-[28px] font-bold text-[#333] mb-4 mt-8">{t('privacyPage.retentionTitle')}</h2>
              <p className="text-base sm:text-[15px] md:text-base text-[#666] leading-relaxed mb-4">
                {t('privacyPage.retentionText1')}
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl sm:text-2xl md:text-[28px] font-bold text-[#333] mb-4 mt-8">{t('privacyPage.rightsTitle')}</h2>
              <p className="text-base sm:text-[15px] md:text-base text-[#666] leading-relaxed mb-4">{t('privacyPage.rightsText1')}</p>
              <ul className="ml-6 mb-4">
                <li className="text-base sm:text-[15px] md:text-base text-[#666] leading-relaxed mb-2">{t('privacyPage.rightsList1')}</li>
                <li className="text-base sm:text-[15px] md:text-base text-[#666] leading-relaxed mb-2">{t('privacyPage.rightsList2')}</li>
                <li className="text-base sm:text-[15px] md:text-base text-[#666] leading-relaxed mb-2">{t('privacyPage.rightsList3')}</li>
                <li className="text-base sm:text-[15px] md:text-base text-[#666] leading-relaxed mb-2">{t('privacyPage.rightsList4')}</li>
                <li className="text-base sm:text-[15px] md:text-base text-[#666] leading-relaxed mb-2">{t('privacyPage.rightsList5')}</li>
              </ul>
              <p className="text-base sm:text-[15px] md:text-base text-[#666] leading-relaxed mb-4">
                {t('privacyPage.rightsText2')}
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl sm:text-2xl md:text-[28px] font-bold text-[#333] mb-4 mt-8">{t('privacyPage.cookiesTitle')}</h2>
              <p className="text-base sm:text-[15px] md:text-base text-[#666] leading-relaxed mb-4">
                {t('privacyPage.cookiesText1')}
              </p>
              <p className="text-base sm:text-[15px] md:text-base text-[#666] leading-relaxed mb-4">
                {t('privacyPage.cookiesText2')}
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl sm:text-2xl md:text-[28px] font-bold text-[#333] mb-4 mt-8">{t('privacyPage.securityTitle')}</h2>
              <p className="text-base sm:text-[15px] md:text-base text-[#666] leading-relaxed mb-4">
                {t('privacyPage.securityText1')}
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl sm:text-2xl md:text-[28px] font-bold text-[#333] mb-4 mt-8">{t('privacyPage.thirdPartyTitle')}</h2>
              <p className="text-base sm:text-[15px] md:text-base text-[#666] leading-relaxed mb-4">
                {t('privacyPage.thirdPartyText1')}
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl sm:text-2xl md:text-[28px] font-bold text-[#333] mb-4 mt-8">{t('privacyPage.changesTitle')}</h2>
              <p className="text-base sm:text-[15px] md:text-base text-[#666] leading-relaxed mb-4">
                {t('privacyPage.changesText1')}
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl sm:text-2xl md:text-[28px] font-bold text-[#333] mb-4 mt-8">{t('privacyPage.contactTitle')}</h2>
              <p className="text-base sm:text-[15px] md:text-base text-[#666] leading-relaxed mb-4">
                {t('privacyPage.contactText1')}
              </p>
              <p className="text-base sm:text-[15px] md:text-base text-[#666] leading-relaxed mb-4"><a href="mailto:info@xdrivemobility.com" className="text-[#EF4444] no-underline transition-colors hover:text-[#DC2626] hover:underline">info@xdrivemobility.com</a></p>
            </section>
          </div>
        </div>
      </div>
    </>
  )
}

export default Privacy
