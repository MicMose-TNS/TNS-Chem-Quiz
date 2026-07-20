import { useState } from 'react'
import { Settings } from 'lucide-react'
import Swal from 'sweetalert2'

export default function StartScreen({ onStart, onAdminClick, onThemeChange }) {
  const [name, setName] = useState('')
  const [theme, setTheme] = useState('y2k')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!name.trim()) return
    onStart(name, theme)
  }

  const handleAdminPrompt = async () => {
    const { value: password } = await Swal.fire({
      title: 'Admin Login',
      input: 'password',
      inputPlaceholder: 'Enter admin password',
      showCancelButton: true
    })
    
    // Simple mock password for demo (e.g. 'admin123')
    if (password === 'admin123') {
      onAdminClick()
    } else if (password) {
      Swal.fire('Error', 'Incorrect password', 'error')
    }
  }

  const handleThemeSelect = (e) => {
    setTheme(e.target.value)
    onThemeChange(e.target.value)
  }

  return (
    <div className="glass-panel p-8 max-w-md w-full text-center relative animate-fade-in">
      <div className="text-6xl mb-4 animate-bounce">🧪</div>
      <h1 className="text-3xl font-bold mb-2">Pre-test เคมี ม.5</h1>
      <p className="mb-2 text-sm font-semibold text-blue-600">อัตราการเกิดปฏิกิริยาเคมี | TNS</p>
      <p className="mb-6 text-sm opacity-80">(สุ่ม 30 ข้อ / เวลาข้อละ 90 วินาที)</p>
      
      <form onSubmit={handleSubmit} className="space-y-5 text-left">
        <div>
          <label className="block text-sm font-semibold mb-1">ชื่อ-นามสกุล / ชื่อเล่น</label>
          <input 
            type="text" 
            required 
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="block w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-blue-500 focus:border-blue-500 text-gray-800" 
            placeholder="พิมพ์ชื่อตรงนี้เลยย..." 
          />
        </div>
        
        <div>
          <label className="block text-sm font-semibold mb-1">เลือก Theme สไตล์คุณ ✨</label>
          <select 
            value={theme}
            onChange={handleThemeSelect}
            className="block w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-gray-800 font-medium cursor-pointer"
          >
            <option value="y2k">💅 Y2K / ตัวมารดา (เริ่ดๆ ปังๆ)</option>
            <option value="gamer">🎮 E-Sports (สายเกมเมอร์ ตีป้อม)</option>
            <option value="idol">🌟 K-Pop Idol (สายติ่ง เตรียมเดบิวต์)</option>
            <option value="cafe">☕ Cafe Hopping (แนวมินิมอล ชิลๆ)</option>
            <option value="meme">👻 Meme / ปั่นๆ (สู้เขาสิวะอีหญิง!)</option>
          </select>
        </div>

        <button type="submit" className="w-full btn-cute bg-blue-600 text-white font-bold py-4 rounded-xl mt-4 text-xl hover:bg-blue-700">
          เริ่มลุยเลย! 🚀
        </button>
      </form>

      <div className="mt-8 border-t border-gray-300 pt-4">
        <button 
          type="button" 
          onClick={handleAdminPrompt} 
          className="opacity-60 hover:opacity-100 text-sm font-semibold transition flex items-center justify-center w-full gap-2 text-gray-700"
        >
          <Settings size={16} /> ระบบ Admin สำหรับครู
        </button>
      </div>
    </div>
  )
}
