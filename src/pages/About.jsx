import { useTranslation } from 'react-i18next'
import SEO from '../components/SEO'

function About() {
  const { t } = useTranslation()

  return (
    <>
      <SEO
        title={t('seo.about.title')}
        description={t('seo.about.description')}
        keywords={t('seo.about.keywords')}
      />
      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="relative min-h-[400px] w-full flex items-center justify-center bg-black bg-[url('/images/about-hero-mobile.jpg')] md:bg-[url('/images/about-hero-desktop.jpg')] bg-center bg-cover bg-no-repeat text-white overflow-hidden">
          <div className="absolute top-0 left-0 right-0 bottom-0 bg-black/30 z-[1]"></div>
          <div className="relative z-[2] w-full max-w-[1200px] mx-auto px-5 sm:px-6 md:px-8 lg:px-10">
            <div className="text-center max-w-[800px] mx-auto">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[48px] font-bold mb-5 leading-tight text-white">
                {t('about.heroTitle')}
              </h1>
              <p className="text-base sm:text-lg md:text-lg text-white/90 leading-relaxed">
                {t('about.heroSubtitle')}
              </p>
            </div>
          </div>
        </section>

        {/* Introduction Section */}
        <section className="py-10 sm:py-12 md:py-16 lg:py-20 bg-white px-5 sm:px-6 md:px-8 lg:px-10">
          <div className="max-w-[1200px] mx-auto">
            <p className="text-base sm:text-base md:text-lg text-[#666666] leading-relaxed max-w-[900px] mx-auto text-center">
              {t('about.introductionText')}
            </p>
          </div>
        </section>

        {/* About Section */}
        <section className="py-10 sm:py-12 md:py-16 lg:py-20 bg-white px-5 sm:px-6 md:px-8 lg:px-10">
          <div className="max-w-[1200px] mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-[1.4fr_1.6fr] gap-6 md:gap-8 lg:gap-10 items-stretch">
              {/* Left: Key benefits */}
              <div className="flex flex-col gap-5">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#1a1a1a] mb-6 md:mb-8">
                  {t('about.whyTitle')}
                </h2>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#ff6b35] flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-lg font-bold">✓</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base font-bold text-[#1a1a1a] mb-1.5 m-0">
                      {t('about.benefit1Title')}
                    </h3>
                    <p className="text-sm text-[#666666] leading-relaxed m-0">
                      {t('about.benefit1Description')}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#ff6b35] flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-lg font-bold">✓</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base font-bold text-[#1a1a1a] mb-1.5 m-0">
                      {t('about.benefit2Title')}
                    </h3>
                    <p className="text-sm text-[#666666] leading-relaxed m-0">
                      {t('about.benefit2Description')}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#ff6b35] flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-lg font-bold">✓</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base font-bold text-[#1a1a1a] mb-1.5 m-0">
                      {t('about.benefit3Title')}
                    </h3>
                    <p className="text-sm text-[#666666] leading-relaxed m-0">
                      {t('about.benefit3Description')}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#ff6b35] flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-lg font-bold">✓</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base font-bold text-[#1a1a1a] mb-1.5 m-0">
                      {t('about.benefit4Title')}
                    </h3>
                    <p className="text-sm text-[#666666] leading-relaxed m-0">
                      {t('about.benefit4Description')}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#ff6b35] flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-lg font-bold">✓</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base font-bold text-[#1a1a1a] mb-1.5 m-0">
                      {t('about.benefit5Title')}
                    </h3>
                    <p className="text-sm text-[#666666] leading-relaxed m-0">
                      {t('about.benefit5Description')}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#ff6b35] flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-lg font-bold">✓</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base font-bold text-[#1a1a1a] mb-1.5 m-0">
                      {t('about.benefit6Title')}
                    </h3>
                    <p className="text-sm text-[#666666] leading-relaxed m-0">
                      {t('about.benefit6Description')}
                    </p>
                  </div>
                </div>
              </div>

              {/* Right: Image */}
              <div className="rounded-2xl overflow-hidden shadow-[0_12px_40px_rgba(0,0,0,0.18)]">
                <img
                  src="/images/about-hero-car.jpg"
                  alt="Friends enjoying a road trip with a rental car"
                  className="w-full h-full object-cover block"
                />
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}

export default About
