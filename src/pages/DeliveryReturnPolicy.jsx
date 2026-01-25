import { useTranslation } from 'react-i18next'
import SEO from '../components/SEO'

function DeliveryReturnPolicy() {
    const { t } = useTranslation()

    return (
        <>
            <SEO
                title={`${t('deliveryReturnPolicy.title')} - XDrive Mobility`}
                description={t('deliveryReturnPolicy.title')}
            />
            <div className="min-h-screen py-[120px] sm:py-[100px] md:py-[100px] px-5 sm:px-6 md:px-8 lg:px-10 bg-[#f9f9f9]">
                <div className="max-w-[1200px] mx-auto">
                    <div className="max-w-[900px] mx-auto bg-white p-10 sm:p-10 md:p-15 rounded-xl shadow-[0_2px_12px_rgba(0,0,0,0.08)]">
                        <h1 className="text-3xl sm:text-4xl md:text-[42px] font-bold text-[#333] mb-8 leading-tight">{t('deliveryReturnPolicy.title')}</h1>

                        <section className="mb-10">
                            <h2 className="text-2xl sm:text-2xl md:text-[28px] font-bold text-[#333] mb-4 mt-8">{t('deliveryReturnPolicy.deliveryPolicyTitle')}</h2>
                            <ul className="ml-6 list-disc marker:text-[#EF4444]">
                                <li className="text-base sm:text-[15px] md:text-base text-[#666] leading-relaxed mb-2 pl-2">{t('deliveryReturnPolicy.deliveryPolicy1')}</li>
                                <li className="text-base sm:text-[15px] md:text-base text-[#666] leading-relaxed mb-2 pl-2">{t('deliveryReturnPolicy.deliveryPolicy2')}</li>
                                <li className="text-base sm:text-[15px] md:text-base text-[#666] leading-relaxed mb-2 pl-2">{t('deliveryReturnPolicy.deliveryPolicy3')}</li>
                                <li className="text-base sm:text-[15px] md:text-base text-[#666] leading-relaxed mb-2 pl-2">{t('deliveryReturnPolicy.deliveryPolicy4')}</li>
                            </ul>
                        </section>

                        <section className="mb-10">
                            <h2 className="text-2xl sm:text-2xl md:text-[28px] font-bold text-[#333] mb-4 mt-8">{t('deliveryReturnPolicy.returnPolicyTitle')}</h2>
                            <ul className="ml-6 list-disc marker:text-[#EF4444]">
                                <li className="text-base sm:text-[15px] md:text-base text-[#666] leading-relaxed mb-2 pl-2">{t('deliveryReturnPolicy.returnPolicy1')}</li>
                                <li className="text-base sm:text-[15px] md:text-base text-[#666] leading-relaxed mb-2 pl-2">{t('deliveryReturnPolicy.returnPolicy2')}</li>
                                <li className="text-base sm:text-[15px] md:text-base text-[#666] leading-relaxed mb-2 pl-2">{t('deliveryReturnPolicy.returnPolicy3')}</li>
                                <li className="text-base sm:text-[15px] md:text-base text-[#666] leading-relaxed mb-2 pl-2">{t('deliveryReturnPolicy.returnPolicy4')}</li>
                                <li className="text-base sm:text-[15px] md:text-base text-[#666] leading-relaxed mb-2 pl-2">{t('deliveryReturnPolicy.returnPolicy5')}</li>
                            </ul>
                        </section>

                        <section className="mb-10">
                            <h2 className="text-2xl sm:text-2xl md:text-[28px] font-bold text-[#333] mb-4 mt-8">{t('deliveryReturnPolicy.cancellationTitle')}</h2>
                            <ul className="ml-6 list-disc marker:text-[#EF4444]">
                                <li className="text-base sm:text-[15px] md:text-base text-[#666] leading-relaxed mb-2 pl-2">{t('deliveryReturnPolicy.cancellation1')}</li>
                                <li className="text-base sm:text-[15px] md:text-base text-[#666] leading-relaxed mb-2 pl-2">{t('deliveryReturnPolicy.cancellation2')}</li>
                                <li className="text-base sm:text-[15px] md:text-base text-[#666] leading-relaxed mb-2 pl-2">{t('deliveryReturnPolicy.cancellation3')}</li>
                            </ul>
                        </section>
                    </div>
                </div>
            </div>
        </>
    )
}

export default DeliveryReturnPolicy
