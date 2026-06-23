import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Footer from './Footer'
import Navbar from './Navbar'
import Sidebar from './Sidebar'

export default function DashboardLayout() {
  const [open, setOpen] = useState(false)
  return (
    <div className="min-h-screen bg-slate-50 lg:grid lg:grid-cols-[288px_1fr]">
      <Sidebar open={open} onClose={() => setOpen(false)} onToggle={() => setOpen(true)} />
      <div className="min-w-0">
        <Navbar />
        <main className="mx-auto max-w-7xl px-5 py-6">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  )
}
