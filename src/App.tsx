import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { LandingPage, QuizFlow, Results } from './components'
import { QuizProvider } from './context/QuizContext'

function App() {
  return (
    <QuizProvider>
      <Router>
        <div className="min-h-screen bg-premium-black">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/quiz" element={<QuizFlow />} />
            <Route path="/results" element={<Results />} />
          </Routes>
        </div>
      </Router>
    </QuizProvider>
  )
}

export default App