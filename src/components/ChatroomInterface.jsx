import { useState, useEffect } from 'react'
import StatusBar from './StatusBar'
import RoomHeader from './RoomHeader'
import HostSection from './HostSection'
import ParticipantGrid from './ParticipantGrid'
import ChatSection from './ChatSection'
import RulesBox from './RulesBox'
import BottomNavigation from './BottomNavigation'
import AdBanner from './AdBanner'

const ChatroomInterface = ({ roomData, wsService, onLeave }) => {
  const [participants, setParticipants] = useState([])
  const [messages, setMessages] = useState([])
  const [hostInfo, setHostInfo] = useState(null)
  const [onlineCount, setOnlineCount] = useState(0)

  useEffect(() => {
    if (!wsService) return

    // Listen for WebSocket events
    const handleUserJoined = (userData) => {
      setParticipants(prev => [...prev, userData])
      setOnlineCount(prev => prev + 1)
    }

    const handleUserLeft = (userId) => {
      setParticipants(prev => prev.filter(p => p.id !== userId))
      setOnlineCount(prev => Math.max(0, prev - 1))
    }

    const handleMessage = (messageData) => {
      setMessages(prev => [...prev, messageData])
    }

    const handleHostUpdate = (hostData) => {
      setHostInfo(hostData)
    }

    // Set up event listeners
    wsService.on('userJoined', handleUserJoined)
    wsService.on('userLeft', handleUserLeft)
    wsService.on('message', handleMessage)
    wsService.on('hostUpdate', handleHostUpdate)

    // Initialize with welcome message
    setMessages([
      {
        id: 'welcome',
        type: 'system',
        content: 'へようこそ！☕ .-. ...',
        timestamp: Date.now()
      }
    ])

    return () => {
      wsService.off('userJoined', handleUserJoined)
      wsService.off('userLeft', handleUserLeft)
      wsService.off('message', handleMessage)
      wsService.off('hostUpdate', handleHostUpdate)
    }
  }, [wsService])

  return (
    <div className="relative mx-auto flex h-screen max-w-sm flex-col bg-black font-plus-jakarta">
      {/* Background */}
      <div 
        className="absolute inset-0 bg-center bg-no-repeat bg-cover blur-sm"
        style={{
          backgroundImage: 'url("https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1")'
        }}
      />
      <div className="absolute inset-0 bg-black/80" />
      
      {/* Content */}
      <div className="relative z-10 flex flex-col h-full text-white">
        <StatusBar />
        
        <RoomHeader 
          title={roomData?.title || 'Virtual Café'}
          participantCount={onlineCount}
          onLeave={onLeave}
        />
        
        <HostSection 
          host={hostInfo}
          onlineCount={onlineCount}
        />
        
        <ParticipantGrid 
          participants={participants}
          wsService={wsService}
        />
        
        <div className="flex-1 overflow-hidden">
          <ChatSection messages={messages} />
          <RulesBox />
        </div>
        
        <AdBanner />
        <BottomNavigation wsService={wsService} />
      </div>
    </div>
  )
}

export default ChatroomInterface