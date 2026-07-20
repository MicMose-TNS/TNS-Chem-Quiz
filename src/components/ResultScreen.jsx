import { useEffect, useState } from 'react'
import confetti from 'canvas-confetti'
import { supabase } from '../lib/supabase'
import { CheckCircle2, RotateCcw } from 'lucide-react'

export default function ResultScreen({ studentName, score, total, refCode, theme, onReset }) {
  const [isSaved, setIsSaved] = useState(false)
  const percent = Math.round((score / total) * 100)
  const isPass = percent >= 50

  useEffect(() => {
    // Fire confetti
    if (isPass) {
      const duration = 3000
      const end = Date.now() + duration
      const frame = () => {
        confetti({
          particleCount: 5,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#26ccff', '#a25afd', '#ff5e7e', '#88ff5a', '#fcff42', '#ffa62d', '#ff36ff']
        })
        confetti({
          particleCount: 5,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#26ccff', '#a25afd', '#ff5e7e', '#88ff5a', '#fcff42', '#ffa62d', '#ff36ff']
        })
        if (Date.now() < end) requestAnimationFrame(frame)
      }
      frame()
    }

    // Save to Supabase
    const saveData = async () => {
      try {
        const { error } = await supabase
          .from('quiz_results')
          .insert([
            {
              student_name: studentName,
              score,
              total_questions: total,
              theme,
              reference_code: refCode
            }
          ])
        
        if (error) throw error
        setIsSaved(true)
      } catch (error) {
        console.error('Error saving result:', error.message)
      }
    }

    saveData()
  }, [studentName, score, total, theme, refCode, isPass])

  return (
    <div className="glass-panel p-8 max-w-md w-full text-center relative animate-fade-in">
      <div className="text-6xl mb-4">{isPass ? '🏆' : '😅'}</div>
      <h1 className={`text-3xl font-bold mb-2 ${isPass ? 'text-green-500' : 'text-red-500'}`}>
        {isPass ? 'ปังมาก!' : 'พยายามเข้านะ!'}
      </h1>
      
      <div className="bg-black/5 dark:bg-black/20 rounded-2xl p-5 mt-6 mb-4 shadow-inner text-left">
        <p className="font-bold text-xl mb-3">{studentName}</p>
        <div className="text-center bg-white/90 dark:bg-slate-800/90 p-4 rounded-xl shadow-sm">
          <div className="text-5xl font-extrabold text-blue-500 mb-2">
            <span>{score}</span> <span className="text-2xl text-gray-400">/ <span>{total}</span></span>
          </div>
          <p className="text-base font-semibold mb-3 text-gray-700 dark:text-gray-300">คิดเป็น {percent}%</p>
          
          <span className={`inline-block text-sm font-bold px-6 py-2 rounded-full ${isPass ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            สถานะ: {isPass ? 'ผ่าน ✅' : 'ไม่ผ่าน ❌'}
          </span>
        </div>
      </div>

      <div className="mb-6 p-5 bg-blue-50/50 dark:bg-blue-900/20 border-2 border-dashed border-blue-300 rounded-2xl text-gray-800 dark:text-gray-200">
        <p className="text-sm font-bold mb-2">🔑 รหัสอ้างอิงส่งครู</p>
        <p className="text-5xl font-mono font-black text-blue-600 dark:text-blue-400 tracking-widest my-2">
          {refCode}
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-400 font-medium my-2 bg-white/80 dark:bg-slate-800/80 px-3 py-1 rounded-full border border-gray-200/50 inline-block">
          {new Date().toLocaleString('th-TH')}
        </p>
        <p className="text-xs text-red-500 font-medium mt-2">* แคปหน้าจอนี้ไว้เพื่อตรวจสอบสถานะ *</p>
        
        {isSaved ? (
          <p className="text-xs text-green-600 font-bold mt-3 flex items-center justify-center gap-1">
            <CheckCircle2 size={14} /> บันทึกข้อมูลลงระบบแล้ว
          </p>
        ) : (
          <p className="text-xs text-yellow-600 font-bold mt-3">กำลังบันทึกข้อมูล...</p>
        )}
      </div>

      <button 
        onClick={onReset} 
        className="btn-cute bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 border-2 border-blue-200 dark:border-slate-600 font-bold py-4 px-8 rounded-xl hover:bg-blue-50 dark:hover:bg-slate-600 w-full text-lg flex items-center justify-center gap-2"
      >
        <RotateCcw size={20} /> กลับหน้าแรก
      </button>
    </div>
  )
}
