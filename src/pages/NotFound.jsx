import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import SEO from '../components/SEO'

function NotFound() {
  const { t } = useTranslation()

  return (
    <>
      <SEO 
        title="404 - Page Not Found"
        description="The page you are looking for does not exist or has been moved."
        noindex={true}
      />
      <div className="min-h-screen bg-white flex items-center justify-center px-5 sm:px-6 md:px-8 lg:px-10">
      <div className="max-w-[600px] mx-auto text-center">
        <div className="mb-8">
          <h1 className="text-8xl sm:text-9xl md:text-[120px] font-bold text-[#EF4444] mb-4">
            404
          </h1>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#1a1a1a] mb-4">
            {t('notFound.title')}
          </h2>
          <p className="text-base sm:text-lg text-[#666] mb-8 leading-relaxed">
            {t('notFound.description')}
          </p>
        </div>
        
        <Link
          to="/"
          className="inline-flex items-center gap-2 bg-[#EF4444] text-white px-6 py-3 rounded-lg font-semibold text-base hover:bg-[#DC2626] transition-colors"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 19L3 12M3 12L10 5M3 12H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          {t('notFound.backToHome')}
        </Link>
      </div>
    </div>
    </>
  )
}

export default NotFound
