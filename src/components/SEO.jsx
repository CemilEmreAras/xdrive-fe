import { Helmet } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router-dom'

function SEO({ 
  title, 
  description, 
  keywords, 
  image, 
  type = 'website',
  noindex = false 
}) {
  const { i18n } = useTranslation()
  const location = useLocation()
  
  const siteUrl = 'https://www.xdrivemobility.com'
  const currentUrl = `${siteUrl}${location.pathname}`
  const lang = i18n.language || 'en'
  
  // Default values
  const defaultTitle = 'Xdrive Mobility - Car Rental Platform'
  const defaultDescription = 'Rent a car with Xdrive Mobility. Find the perfect vehicle for your journey with competitive prices and reliable service.'
  const defaultImage = `${siteUrl}/images/logo.svg`
  
  const seoTitle = title ? `${title} | ${defaultTitle}` : defaultTitle
  const seoDescription = description || defaultDescription
  const seoImage = image || defaultImage
  const seoKeywords = keywords || 'car rental, rent a car, vehicle rental, car hire, mobility, xdrive'

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <html lang={lang} />
      <title>{seoTitle}</title>
      <meta name="description" content={seoDescription} />
      <meta name="keywords" content={seoKeywords} />
      <link rel="canonical" href={currentUrl} />
      
      {/* Robots */}
      {noindex && <meta name="robots" content="noindex, nofollow" />}
      {!noindex && <meta name="robots" content="index, follow" />}
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:title" content={seoTitle} />
      <meta property="og:description" content={seoDescription} />
      <meta property="og:image" content={seoImage} />
      <meta property="og:locale" content={lang === 'tr' ? 'tr_TR' : lang === 'de' ? 'de_DE' : 'en_US'} />
      <meta property="og:site_name" content="Xdrive Mobility" />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={currentUrl} />
      <meta name="twitter:title" content={seoTitle} />
      <meta name="twitter:description" content={seoDescription} />
      <meta name="twitter:image" content={seoImage} />
      
      {/* Additional Meta Tags */}
      <meta name="author" content="Xdrive Mobility" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
      
      {/* Alternate Languages */}
      <link rel="alternate" hreflang="en" href={`${siteUrl}${location.pathname}?lang=en`} />
      <link rel="alternate" hreflang="tr" href={`${siteUrl}${location.pathname}?lang=tr`} />
      <link rel="alternate" hreflang="de" href={`${siteUrl}${location.pathname}?lang=de`} />
      <link rel="alternate" hreflang="x-default" href={`${siteUrl}${location.pathname}`} />
    </Helmet>
  )
}

export default SEO
