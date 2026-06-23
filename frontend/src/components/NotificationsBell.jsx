import { Bell } from 'lucide-react'
import { useEffect, useState } from 'react'
import { notificationService } from '../services/notificationService'

export default function NotificationsBell() {
  const [open, setOpen] = useState(false)
  const [notifications, setNotifications] = useState([])

  useEffect(() => {
    notificationService.list().then(setNotifications).catch(() => setNotifications([]))
  }, [])

  const unread = notifications.filter((item) => !item.is_read).length

  const markRead = async (id) => {
    const updated = await notificationService.markRead(id)
    setNotifications(notifications.map((item) => (item.id === id ? updated : item)))
  }

  return (
    <div className="relative">
      <button className="relative rounded-xl border border-slate-200 bg-white p-2" onClick={() => setOpen(!open)}>
        <Bell className="h-5 w-5 text-slate-600" />
        {unread > 0 && <span className="absolute -right-1 -top-1 rounded-full bg-red-600 px-1.5 text-xs font-bold text-white">{unread}</span>}
      </button>
      {open && (
        <div className="absolute right-0 z-50 mt-2 w-80 rounded-2xl border border-slate-200 bg-white p-3 shadow-soft">
          <p className="mb-2 font-bold text-slate-950">Notifications</p>
          <div className="max-h-80 space-y-2 overflow-auto">
            {notifications.length === 0 ? <p className="text-sm text-slate-500">Aucune notification.</p> : notifications.map((item) => (
              <button key={item.id} className={`w-full rounded-xl p-3 text-left text-sm ${item.is_read ? 'bg-slate-50 text-slate-500' : 'bg-primary-50 text-slate-900'}`} onClick={() => markRead(item.id)}>
                <span className="block font-semibold">{item.title}</span>
                <span>{item.message}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
