import { useState, useEffect, useRef } from 'react'
import Swal from 'sweetalert2'
import { questionBank } from '../data/questions'

const themeConfig = {
  y2k: {
      iconSuccess: '💅', iconFail: '🥀',
      titleSuccess: 'เริ่ดมากตัวมารดา!', titleFail: 'ช็อตฟีลเวอร์แม่!',
      msgSuccess: ['ปังไม่ไหว!', 'ทำถึงมาก!', 'สวย เริ่ด เชิด ตอบถูก!', 'เต็มสิบไม่หัก!'],
      msgFail: ['สภาพพพ ลองใหม่นะ', 'อย่าเพิ่งวีน เอาใหม่!', 'แอบบ้งนะวิ เอาใหม่ๆ']
  },
  gamer: {
      iconSuccess: '🎮', iconFail: '💀',
      titleSuccess: 'MVP ไปเลยจารย์!', titleFail: 'โดน First Blood!',
      msgSuccess: ['ยิงเข้าหัวคมๆ!', 'คอมโบนี้อย่างตึง!', 'GGWP ตอบถูก!', 'ฟาร์มมาดีมาก!'],
      msgFail: ['ปิงพุ่งหรอจารย์?', 'อย่าเพิ่งปาเมาส์!', 'โดนดักพุ่ม เอาใหม่ๆ']
  },
  idol: {
      iconSuccess: '🌟', iconFail: '💧',
      titleSuccess: 'เซนเตอร์วงมาเอง!', titleFail: 'โดนคัดออกหรอ!',
      msgSuccess: ['วิชวลสุดๆ', 'เตรียมเดบิวต์เลย!', 'ออลคิลทะลุชาร์ต!', 'ได้แอร์ไทม์เต็มๆ!'],
      msgFail: ['ลืมเนื้อร้องหรอ?', 'กล้องไม่จับเลย เอาใหม่!', 'คะแนนโหวตตกนะวิ!']
  },
  cafe: {
      iconSuccess: '☕', iconFail: '🌧️',
      titleSuccess: 'มู้ดดี เทสดีสุดๆ', titleFail: 'ขมปร่าเหมือนอเมริกาโน่',
      msgSuccess: ['ละมุนมากกก', 'มุมนี้ถ่ายรูปสวยแถมตอบถูก', 'หอมกรุ่นเลยจ้า'],
      msgFail: ['กาแฟหกใส่มือถือหรอ?', 'มู้ดบูดเลย เอาใหม่นะ', 'ชิลไปนิด คิดใหม่ๆ']
  },
  meme: {
      iconSuccess: '🔥', iconFail: '🤡',
      titleSuccess: 'ตึงจัดดดด!', titleFail: 'สู้เขาสิวะอีหญิง!',
      msgSuccess: ['อย่างเอาอะจารย์!', 'ชายแท้สุดๆ!', 'ตัวตึงเยาวราชปะเนี่ย!'],
      msgFail: ['นี่คือ... สภาพพพ', 'อย่างกาวเลยจารย์', 'สมองไหลละ เอาใหม่!']
  },
  default: {
      iconSuccess: '✅', iconFail: '❌',
      titleSuccess: 'ถูกต้อง!', titleFail: 'ผิดพลาด!',
      msgSuccess: ['เก่งมาก!', 'ทำได้ดี!'],
      msgFail: ['พยายามใหม่นะ!']
  }
}

export default function PlayingScreen({ studentName, theme, onFinish, onGiveUp }) {
  const [questions, setQuestions] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(90)
  const timerRef = useRef(null)

  // Initialization
  useEffect(() => {
    // Shuffle and pick 30 questions (or max available)
    const shuffled = [...questionBank].sort(() => 0.5 - Math.random())
    const selected = shuffled.slice(0, Math.min(30, shuffled.length))
    setQuestions(selected)
    startTimer()
    return () => clearInterval(timerRef.current)
  }, [])

  const startTimer = () => {
    setTimeLeft(90)
    if (timerRef.current) clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current)
          handleTimeUp()
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  const handleTimeUp = async () => {
    const config = themeConfig[theme] || themeConfig.default
    await Swal.fire({
      icon: 'warning',
      title: 'หมดเวลา!',
      text: config.msgFail[Math.floor(Math.random() * config.msgFail.length)],
      confirmButtonText: 'ข้อต่อไป ⏭️'
    })
    nextQuestion()
  }

  const handleAnswer = async (index) => {
    clearInterval(timerRef.current)
    const currentQ = questions[currentIndex]
    const isCorrect = index === currentQ.ans
    const config = themeConfig[theme] || themeConfig.default

    if (isCorrect) {
      setScore(s => s + 1)
      await Swal.fire({
        icon: 'success',
        title: `${config.iconSuccess} ${config.titleSuccess}`,
        text: config.msgSuccess[Math.floor(Math.random() * config.msgSuccess.length)] + `\n\nคำอธิบาย: ${currentQ.exp}`,
        confirmButtonText: 'ลุยต่อ! 🚀',
        confirmButtonColor: '#3b82f6'
      })
    } else {
      await Swal.fire({
        icon: 'error',
        title: `${config.iconFail} ${config.titleFail}`,
        text: config.msgFail[Math.floor(Math.random() * config.msgFail.length)] + `\n\nคำอธิบาย: ${currentQ.exp}`,
        confirmButtonText: 'เข้าใจแล้ว 💡',
        confirmButtonColor: '#ef4444'
      })
    }

    nextQuestion()
  }

  const nextQuestion = () => {
    if (currentIndex + 1 >= questions.length) {
      finishQuiz()
    } else {
      setCurrentIndex(c => c + 1)
      startTimer()
    }
  }

  const finishQuiz = () => {
    // Generate a random 5-digit code
    const code = Math.floor(10000 + Math.random() * 90000).toString()
    onFinish(score, questions.length, code)
  }

  const confirmGiveUp = () => {
    Swal.fire({
      title: 'แน่ใจหรอ?',
      text: "คะแนนจะไม่ถูกบันทึกนะ!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'ใช่, ขอยอมแพ้ 🏳️',
      cancelButtonText: 'สู้ต่อ! ⚔️'
    }).then((result) => {
      if (result.isConfirmed) {
        onGiveUp()
      }
    })
  }

  if (questions.length === 0) return <div className="text-xl font-bold">กำลังโหลดคำถาม...</div>

  const currentQ = questions[currentIndex]
  const progressPercent = (timeLeft / 90) * 100

  return (
    <div className="glass-panel p-6 max-w-3xl w-full relative animate-fade-in">
      <div className="flex justify-between items-center mb-4 border-b border-gray-200/30 pb-4">
        <div className="flex flex-col">
          <span className="bg-blue-100/80 text-blue-800 text-sm font-semibold px-4 py-1.5 rounded-full inline-block">
            ข้อที่ {currentIndex + 1} / {questions.length}
          </span>
        </div>
        <div className="text-right">
          <span className="bg-yellow-100/80 text-yellow-800 text-lg font-bold px-4 py-1.5 rounded-full">
            ⭐ {score}
          </span>
        </div>
      </div>
      
      <div className="w-full bg-gray-200/50 rounded-full h-4 mb-2 overflow-hidden relative">
        <div 
          className={`h-full rounded-full transition-all duration-1000 ease-linear ${progressPercent > 50 ? 'bg-green-500' : progressPercent > 20 ? 'bg-yellow-500' : 'bg-red-500'}`} 
          style={{ width: `${progressPercent}%` }}
        ></div>
      </div>
      <div className="text-right text-sm font-bold mb-6 opacity-80">
        ⏳ เวลา: {timeLeft} วินาที
      </div>

      <div className="bg-white/80 dark:bg-slate-800/80 p-6 rounded-2xl shadow-sm border border-gray-200/30 mb-6 min-h-[120px] flex items-center justify-center">
        <h2 className="text-lg md:text-xl font-semibold text-center leading-relaxed">
          {currentQ.q}
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {currentQ.options.map((opt, i) => (
          <button 
            key={i} 
            onClick={() => handleAnswer(i)}
            className="btn-cute bg-white dark:bg-slate-700 hover:bg-blue-50 dark:hover:bg-slate-600 border-2 border-gray-200/50 dark:border-slate-500 rounded-xl p-4 text-left font-medium transition-colors"
          >
            <span className="inline-block bg-gray-100 dark:bg-slate-800 rounded-full w-8 h-8 text-center leading-8 mr-3 font-bold text-gray-500 dark:text-gray-300">
              {String.fromCharCode(65 + i)}
            </span>
            {opt}
          </button>
        ))}
      </div>

      <div className="text-center mt-6">
        <button 
          onClick={confirmGiveUp} 
          className="text-red-400 text-sm underline hover:text-red-600 font-medium transition cursor-pointer"
        >
          🏳️ ออกจากการทดสอบ
        </button>
      </div>
    </div>
  )
}
