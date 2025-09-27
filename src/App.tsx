import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { LandingPage, QuizFlow, Results, SlotMachine } from './components'
import { IngredientSpotlight } from './components/features/IngredientSpotlight'
import { QuizProvider } from './context/QuizContext'
import PWAInstallPrompt from './components/ui/PWAInstallPrompt'
import { useEffect } from 'react'
import { trackPageView } from './services'

function RouteAnalytics() {
  const location = useLocation()
  useEffect(() => {
    trackPageView(location.pathname, document.title)
  }, [location])
  return null
}

function App() {
  return (
    <QuizProvider>
      <Router>
        <div className="min-h-screen bg-premium-black">
          <RouteAnalytics />
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/quiz" element={<QuizFlow />} />
            <Route path="/shuffle" element={<SlotMachine />} />
            <Route path="/results" element={<Results />} />
            <Route path="/ingredients" element={<IngredientSpotlight />} />
          </Routes>
          <PWAInstallPrompt />
        </div>
      </Router>
    </QuizProvider>
  )
}

export default App