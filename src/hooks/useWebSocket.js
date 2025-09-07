import { useState, useEffect, useRef } from 'react'
import { WebSocketService } from '../services/WebSocketService'

export const useWebSocket = () => {
  const [isConnected, setIsConnected] = useState(false)
  const [participants, setParticipants] = useState([])
  const [messages, setMessages] = useState([])
  const wsServiceRef = useRef(null)

  useEffect(() => {
    const wsService = new WebSocketService()
    wsServiceRef.current = wsService

    wsService.on('connected', () => {
      setIsConnected(true)
    })

    wsService.on('disconnected', () => {
      setIsConnected(false)
    })

    wsService.on('userJoined', (userData) => {
      setParticipants(prev => {
        const exists = prev.find(p => p.id === userData.userId)
        if (exists) return prev
        
        return [...prev, {
          id: userData.userId,
          name: userData.nickname,
          avatar: userData.icon,
          level: userData.level,
          frame: userData.frameurl,
          isOnline: true,
          isActive: false
        }]
      })
    })

    wsService.on('userLeft', (userId) => {
      setParticipants(prev => prev.filter(p => p.id !== userId))
    })

    wsService.on('message', (messageData) => {
      setMessages(prev => [...prev, messageData])
    })

    return () => {
      wsService.disconnect()
    }
  }, [])

  const connectToRoom = async () => {
    if (wsServiceRef.current) {
      await wsServiceRef.current.connect()
    }
  }

  const startVoiceChat = (comId, chatId) => {
    if (wsServiceRef.current) {
      wsServiceRef.current.startVoiceChat(comId, chatId)
    }
  }

  const subscribe = (userId) => {
    if (wsServiceRef.current) {
      wsServiceRef.current.subscribe(userId)
    }
  }

  const unsubscribe = (userId) => {
    if (wsServiceRef.current) {
      wsServiceRef.current.unsubscribe(userId)
    }
  }

  return {
    isConnected,
    participants,
    messages,
    wsService: wsServiceRef.current,
    connectToRoom,
    startVoiceChat,
    subscribe,
    unsubscribe
  }
}