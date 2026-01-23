import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import './LoadingOverlay.css'

function LoadingOverlay() {
  const { t } = useTranslation()
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    // Simulate progress animation
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) {
          return prev
        }
        return prev + Math.random() * 10
      })
    }, 200)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="loading-overlay">
      <div className="loading-overlay-content">
        <div className="loading-video-container">
          <video
            className="loading-video"
            autoPlay
            loop
            muted
            playsInline
          >
            <source src="/video/loading.mp4" type="video/mp4" />
          </video>
        </div>
        <h2 className="loading-text">
          {t('home.searchingCars', 'Searching for available cars…')}
        </h2>
        <div className="loading-progress-container">
          <div className="loading-progress-bar" style={{ width: `${Math.min(progress, 90)}%` }}></div>
        </div>
      </div>
    </div>
  )
}

export default LoadingOverlay