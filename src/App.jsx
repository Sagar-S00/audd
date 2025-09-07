import { useState, useEffect } from 'react'
import URLInputPage from './components/URLInputPage'
import ChatroomInterface from './components/ChatroomInterface'
import { WebSocketService } from './services/WebSocketService'
import { APIService } from './services/APIService'

function App() {
  const [currentPage, setCurrentPage] = useState('input') // 'input' or 'chatroom'
  const [roomData, setRoomData] = useState(null)
  const [wsService, setWsService] = useState(null)

  const handleURLSubmit = async (url) => {
    try {
      const response = await APIService.checkURL(url)
      
      if (response.status === 'joined') {
        const { cid, chat } = response
        
        // Initialize WebSocket service
        const ws = new WebSocketService()
        await ws.connect()
        
        // Start voice chat
        ws.startVoiceChat(cid, chat)
        
        setRoomData({ cid, chat, title: 'Paradise Kapé Tiam ★' })
        setWsService(ws)
        setCurrentPage('chatroom')
      } else {
        alert(response.status)
      }
    } catch (error) {
      console.error('Failed to join room:', error)
      alert('Failed to join room. Please try again.')
    }
  }

  const handleLeaveRoom = () => {
    if (wsService) {
      wsService.disconnect()
      setWsService(null)
    }
    setRoomData(null)
    setCurrentPage('input')
  }

  return (
    <div className="h-screen bg-black">
      {currentPage === 'input' ? (
        <URLInputPage onSubmit={handleURLSubmit} />
      ) : (
        <ChatroomInterface 
          roomData={roomData}
          wsService={wsService}
          onLeave={handleLeaveRoom}
        />
      )}
    </div>
  )
}

export default App