import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { Search, LogOut, Trash2 } from 'lucide-react'
import Swal from 'sweetalert2'

export default function AdminScreen({ onBack }) {
  const [results, setResults] = useState([])
  const [searchCode, setSearchCode] = useState('')
  const [loading, setLoading] = useState(false)

  const fetchResults = async (code = null) => {
    setLoading(true)
    try {
      let query = supabase.from('quiz_results').select('*').order('created_at', { ascending: false })
      
      if (code) {
        query = query.eq('reference_code', code)
      }

      const { data, error } = await query
      if (error) throw error
      setResults(data)
    } catch (error) {
      console.error('Error fetching results:', error.message)
      Swal.fire('Error', 'ไม่สามารถโหลดข้อมูลได้', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = () => {
    if (searchCode.trim()) {
      fetchResults(searchCode.trim())
    }
  }

  const clearAllData = async () => {
    const { isConfirmed } = await Swal.fire({
      title: 'ลบข้อมูลทั้งหมด?',
      text: "คุณแน่ใจหรือไม่ว่าต้องการลบข้อมูลทั้งหมด ข้อมูลที่ถูกลบจะไม่สามารถกู้คืนได้!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'ใช่, ลบเลย!',
      cancelButtonText: 'ยกเลิก'
    })

    if (isConfirmed) {
      setLoading(true)
      try {
        // Warning: This requires appropriate Supabase RLS policies to allow delete operations
        // If RLS is enabled, you need to configure policies or use a service key in an edge function.
        // For simplicity, assuming RLS allows it for this demo.
        const { error } = await supabase.from('quiz_results').delete().neq('id', '00000000-0000-0000-0000-000000000000') // Deletes all
        if (error) throw error
        setResults([])
        Swal.fire('ลบแล้ว!', 'ข้อมูลทั้งหมดถูกลบแล้ว', 'success')
      } catch (error) {
        Swal.fire('Error', error.message, 'error')
      } finally {
        setLoading(false)
      }
    }
  }

  return (
    <div className="glass-panel p-8 max-w-2xl w-full text-gray-800 dark:text-gray-200 relative animate-fade-in">
      <div className="flex justify-between items-center mb-6 border-b pb-4 border-gray-200/50">
        <h1 className="text-2xl font-bold">⚙️ ระบบตรวจผลสอบ (Admin)</h1>
        <button 
          onClick={onBack} 
          className="text-blue-500 hover:text-blue-700 font-bold underline px-4 py-2 bg-blue-50 dark:bg-slate-800 rounded-lg flex items-center gap-2"
        >
          <LogOut size={16} /> ออก
        </button>
      </div>

      <div className="flex gap-3 mb-6">
        <input 
          type="text" 
          value={searchCode}
          onChange={(e) => setSearchCode(e.target.value)}
          placeholder="กรอกรหัส 5 หลัก..." 
          className="flex-1 px-4 py-3 border-2 border-gray-300 dark:border-slate-600 dark:bg-slate-700 rounded-xl font-mono text-xl text-center outline-none" 
          maxLength="5"
        />
        <button 
          onClick={handleSearch} 
          className="bg-blue-600 text-white px-8 py-3 rounded-xl hover:bg-blue-700 font-bold btn-cute text-lg flex items-center gap-2"
        >
          <Search size={20} /> ค้นหา
        </button>
      </div>
      
      <div className="mb-4 text-center">
        <button onClick={() => fetchResults(null)} className="text-sm text-gray-500 dark:text-gray-400 hover:text-blue-600 font-medium underline">
          ดูทั้งหมด
        </button>
      </div>

      <div className="bg-white/80 dark:bg-slate-800/80 p-6 rounded-2xl min-h-[250px] max-h-[400px] overflow-y-auto border border-gray-200/50 space-y-4">
        {loading ? (
          <div className="text-center text-gray-400 mt-10">กำลังโหลดข้อมูล...</div>
        ) : results.length > 0 ? (
          results.map((record) => (
            <div key={record.id} className="border-b border-gray-100 dark:border-slate-700 pb-3 mb-3 last:border-0 last:mb-0 last:pb-0 flex justify-between items-center">
              <div>
                <p className="font-bold text-lg">{record.student_name}</p>
                <div className="flex gap-3 text-sm text-gray-500 dark:text-gray-400">
                  <span className="font-mono text-blue-500 bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded">
                    Code: {record.reference_code}
                  </span>
                  <span>{new Date(record.created_at).toLocaleString('th-TH')}</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-black text-blue-600 dark:text-blue-400">
                  {record.score} <span className="text-sm text-gray-400">/ {record.total_questions}</span>
                </p>
                <span className={`text-xs font-bold px-2 py-1 rounded ${record.score / record.total_questions >= 0.5 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {record.score / record.total_questions >= 0.5 ? 'ผ่าน' : 'ไม่ผ่าน'}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-400 mt-10">
            {searchCode ? 'ไม่พบข้อมูลที่ค้นหา' : "กรุณากด 'ดูทั้งหมด' หรือกรอกรหัสค้นหา"}
          </div>
        )}
      </div>

      <div className="mt-6 text-right">
        <button 
          onClick={clearAllData} 
          className="text-red-500 text-sm hover:underline font-bold bg-red-50 dark:bg-red-900/20 px-3 py-1 rounded flex items-center justify-end gap-1 ml-auto"
        >
          <Trash2 size={14} /> ลบข้อมูลทั้งหมด
        </button>
      </div>
    </div>
  )
}
