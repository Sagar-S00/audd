import { useState, useEffect } from 'react'

const StatusBar = () => {
  const [currentTime, setCurrentTime] = useState('')

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      setCurrentTime(now.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: false 
      }))
    }

    updateTime()
    const interval = setInterval(updateTime, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex items-center justify-between px-4 py-2 text-white text-sm font-medium">
      <div className="flex items-center gap-1">
        <span>{currentTime}</span>
      </div>
      
      <div className="flex items-center gap-1">
        {/* Signal bars */}
        <div className="flex items-end gap-0.5">
          <div className="w-1 h-1 bg-white rounded-full"></div>
          <div className="w-1 h-2 bg-white rounded-full"></div>
          <div className="w-1 h-3 bg-white rounded-full"></div>
          <div className="w-1 h-4 bg-white rounded-full"></div>
        </div>
        
        {/* WiFi icon */}
        <svg className="w-4 h-4 ml-1" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M17.778 8.222c-4.296-4.296-11.26-4.296-15.556 0A1 1 0 01.808 6.808c5.076-5.077 13.308-5.077 18.384 0a1 1 0 01-1.414 1.414zM14.95 11.05a7 7 0 00-9.9 0 1 1 0 01-1.414-1.414 9 9 0 0112.728 0 1 1 0 01-1.414 1.414zM12.12 13.88a3 3 0 00-4.24 0 1 1 0 01-1.415-1.414 5 5 0 017.07 0 1 1 0 01-1.415 1.414zM9 16a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
        </svg>
        
        {/* Battery */}
        <div className="flex items-center ml-1">
          <div className="relative">
            <div className="w-6 h-3 border border-white rounded-sm">
              <div className="w-4/5 h-full bg-white rounded-sm"></div>
            </div>
            <div className="absolute -right-0.5 top-0.5 w-0.5 h-2 bg-white rounded-r-sm"></div>
          </div>
          <span className="ml-1 text-xs">76</span>
        </div>
      </div>
    </div>
  )
}

export default StatusBar