import { useState, useEffect } from 'react'
import StartScreen from './components/StartScreen'
import PlayingScreen from './components/PlayingScreen'
import ResultScreen from './components/ResultScreen'
import AdminScreen from './components/AdminScreen'

function App() {
  const [screen, setScreen] = useState('start') // start, playing, result, admin
  const [theme, setTheme] = useState('default')
  const [studentName, setStudentName] = useState('')
  const [finalScore, setFinalScore] = useState(0)
  const [totalQuestions, setTotalQuestions] = useState(30)
  const [refCode, setRefCode] = useState('')

  useEffect(() => {
    document.body.className = `theme-${theme}`
  }, [theme])

  const startGame = (name, selectedTheme) => {
    setStudentName(name)
    setTheme(selectedTheme)
    setScreen('playing')
  }

  const finishGame = (score, total, generatedCode) => {
    setFinalScore(score)
    setTotalQuestions(total)
    setRefCode(generatedCode)
    setScreen('result')
  }

  const resetGame = () => {
    setStudentName('')
    setFinalScore(0)
    setRefCode('')
    setTheme('default')
    setScreen('start')
  }

  return (
    <div className="min-h-screen relative p-4 flex items-center justify-center">
      {screen === 'start' && (
        <StartScreen 
          onStart={startGame} 
          onAdminClick={() => setScreen('admin')} 
          onThemeChange={setTheme} 
        />
      )}
      
      {screen === 'playing' && (
        <PlayingScreen 
          studentName={studentName}
          theme={theme}
          onFinish={finishGame}
          onGiveUp={resetGame}
        />
      )}

      {screen === 'result' && (
        <ResultScreen
          studentName={studentName}
          score={finalScore}
          total={totalQuestions}
          refCode={refCode}
          theme={theme}
          onReset={resetGame}
        />
      )}

      {screen === 'admin' && (
        <AdminScreen onBack={() => setScreen('start')} />
      )}
    </div>
  )
}

export default App
