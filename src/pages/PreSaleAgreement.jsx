import React from 'react';
import { useTranslation } from 'react-i18next';

function PreSaleAgreement() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen py-[120px] sm:py-[100px] md:py-[100px] px-5 sm:px-6 md:px-8 lg:px-10 bg-[#f9f9f9]">
      <div className="max-w-[1200px] mx-auto">
        <div className="max-w-[900px] mx-auto bg-white p-10 sm:p-10 md:p-15 rounded-xl shadow-[0_2px_12px_rgba(0,0,0,0.08)]">
          <h1 className="text-3xl sm:text-4xl md:text-[42px] font-bold text-[#333] mb-5 leading-tight">{t('preSaleAgreementPage.title')}</h1>
          <p className="text-base sm:text-[15px] md:text-base text-[#666] leading-relaxed mb-4 italic">
            {t('preSaleAgreementPage.introText1')}
          </p>
          <p className="text-base sm:text-[15px] md:text-base text-[#666] leading-relaxed mb-4 italic">
            {t('preSaleAgreementPage.introText2')}
          </p>

          <section className="mb-10">
            <h2 className="text-2xl sm:text-2xl md:text-[28px] font-bold text-[#333] mb-4 mt-8">{t('preSaleAgreementPage.roleTitle')}</h2>
            <p className="text-base sm:text-[15px] md:text-base text-[#666] leading-relaxed mb-4">
              {t('preSaleAgreementPage.roleText1')}
            </p>
            <p className="text-base sm:text-[15px] md:text-base text-[#666] leading-relaxed mb-4">
              {t('preSaleAgreementPage.roleText2')}
            </p>
            <p className="text-base sm:text-[15px] md:text-base text-[#666] leading-relaxed mb-4">
              {t('preSaleAgreementPage.roleText3')}
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl sm:text-2xl md:text-[28px] font-bold text-[#333] mb-4 mt-8">{t('preSaleAgreementPage.paymentTitle')}</h2>
            <p className="text-base sm:text-[15px] md:text-base text-[#666] leading-relaxed mb-4">{t('preSaleAgreementPage.paymentText1')}</p>
            <p className="text-base sm:text-[15px] md:text-base text-[#666] leading-relaxed mb-4">
              <strong className="text-[#333] font-semibold">a)</strong> {t('preSaleAgreementPage.paymentSubTitle1')}
            </p>
            <p className="text-base sm:text-[15px] md:text-base text-[#666] leading-relaxed mb-4">
              <strong className="text-[#333] font-semibold">b)</strong> {t('preSaleAgreementPage.paymentSubTitle2')}
            </p>
            <p className="text-base sm:text-[15px] md:text-base text-[#666] leading-relaxed mb-4">
              {t('preSaleAgreementPage.paymentText2')}
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl sm:text-2xl md:text-[28px] font-bold text-[#333] mb-4 mt-8">{t('preSaleAgreementPage.confirmationTitle')}</h2>
            <p className="text-base sm:text-[15px] md:text-base text-[#666] leading-relaxed mb-4">
              {t('preSaleAgreementPage.confirmationText1')}
            </p>
            <p className="text-base sm:text-[15px] md:text-base text-[#666] leading-relaxed mb-4">
              {t('preSaleAgreementPage.confirmationText2')}
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl sm:text-2xl md:text-[28px] font-bold text-[#333] mb-4 mt-8">{t('preSaleAgreementPage.cancellationTitle')}</h2>
            <p className="text-base sm:text-[15px] md:text-base text-[#666] leading-relaxed mb-4">{t('preSaleAgreementPage.cancellationText1')}</p>
            <ul className="ml-6 mb-4">
              <li className="text-base sm:text-[15px] md:text-base text-[#666] leading-relaxed mb-2">
                {t('preSaleAgreementPage.cancellationList1')}
              </li>
              <li className="text-base sm:text-[15px] md:text-base text-[#666] leading-relaxed mb-2">
                {t('preSaleAgreementPage.cancellationList2')}
              </li>
              <li className="text-base sm:text-[15px] md:text-base text-[#666] leading-relaxed mb-2">
                {t('preSaleAgreementPage.cancellationList3')}
              </li>
              <li className="text-base sm:text-[15px] md:text-base text-[#666] leading-relaxed mb-2">
                {t('preSaleAgreementPage.cancellationList4')}
              </li>
              <li className="text-base sm:text-[15px] md:text-base text-[#666] leading-relaxed mb-2">
                {t('preSaleAgreementPage.cancellationList5')}
              </li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl sm:text-2xl md:text-[28px] font-bold text-[#333] mb-4 mt-8">{t('preSaleAgreementPage.changesTitle')}</h2>
            <p className="text-base sm:text-[15px] md:text-base text-[#666] leading-relaxed mb-4">
              {t('preSaleAgreementPage.changesText1')}
            </p>
            <p className="text-base sm:text-[15px] md:text-base text-[#666] leading-relaxed mb-4">
              {t('preSaleAgreementPage.changesText2')}
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl sm:text-2xl md:text-[28px] font-bold text-[#333] mb-4 mt-8">{t('preSaleAgreementPage.deliveryTitle')}</h2>
            <p className="text-base sm:text-[15px] md:text-base text-[#666] leading-relaxed mb-4">
              {t('preSaleAgreementPage.deliveryText1')}
            </p>
            <p className="text-base sm:text-[15px] md:text-base text-[#666] leading-relaxed mb-4">
              {t('preSaleAgreementPage.deliveryText2')}
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl sm:text-2xl md:text-[28px] font-bold text-[#333] mb-4 mt-8">{t('preSaleAgreementPage.liabilityTitle')}</h2>
            <p className="text-base sm:text-[15px] md:text-base text-[#666] leading-relaxed mb-4">{t('preSaleAgreementPage.liabilityText1')}</p>
            <ul className="ml-6 mb-4">
              <li className="text-base sm:text-[15px] md:text-base text-[#666] leading-relaxed mb-2">{t('preSaleAgreementPage.liabilityList1')}</li>
              <li className="text-base sm:text-[15px] md:text-base text-[#666] leading-relaxed mb-2">{t('preSaleAgreementPage.liabilityList2')}</li>
              <li className="text-base sm:text-[15px] md:text-base text-[#666] leading-relaxed mb-2">{t('preSaleAgreementPage.liabilityList3')}</li>
              <li className="text-base sm:text-[15px] md:text-base text-[#666] leading-relaxed mb-2">{t('preSaleAgreementPage.liabilityList4')}</li>
              <li className="text-base sm:text-[15px] md:text-base text-[#666] leading-relaxed mb-2">{t('preSaleAgreementPage.liabilityList5')}</li>
            </ul>
            <p className="text-base sm:text-[15px] md:text-base text-[#666] leading-relaxed mb-4">
              {t('preSaleAgreementPage.liabilityText2')}
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl sm:text-2xl md:text-[28px] font-bold text-[#333] mb-4 mt-8">{t('preSaleAgreementPage.responsibilitiesTitle')}</h2>
            <p className="text-base sm:text-[15px] md:text-base text-[#666] leading-relaxed mb-4">
              {t('preSaleAgreementPage.responsibilitiesText1')}
            </p>
            <p className="text-base sm:text-[15px] md:text-base text-[#666] leading-relaxed mb-4">
              {t('preSaleAgreementPage.responsibilitiesText2')}
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl sm:text-2xl md:text-[28px] font-bold text-[#333] mb-4 mt-8">{t('preSaleAgreementPage.governingTitle')}</h2>
            <p className="text-base sm:text-[15px] md:text-base text-[#666] leading-relaxed mb-4">
              {t('preSaleAgreementPage.governingText1')}
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl sm:text-2xl md:text-[28px] font-bold text-[#333] mb-4 mt-8">{t('preSaleAgreementPage.finalTitle')}</h2>
            <p className="text-base sm:text-[15px] md:text-base text-[#666] leading-relaxed mb-4">
              {t('preSaleAgreementPage.finalText1')}
            </p>
            <p className="text-base sm:text-[15px] md:text-base text-[#666] leading-relaxed mb-4">
              {t('preSaleAgreementPage.finalText2')}
            </p>
          </section>
        </div>
      </div >
    </div >
  )
}

export default PreSaleAgreement
