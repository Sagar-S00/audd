import { APIService } from './APIService'

export class WebSocketService {
  constructor() {
    this.ws = null
    this.eventListeners = new Map()
    this.userDict = {}
    this.isConnected = false
  }

  async connect() {
    try {
      const sid = await APIService.getSid()
      const wsUrl = `wss://yoee.2o8bynlc5s.workers.dev?sid=${sid}`
      
      this.ws = new WebSocket(wsUrl)
      
      this.ws.onopen = () => {
        console.log('WebSocket connected')
        this.isConnected = true
        this.emit('connected')
      }
      
      this.ws.onmessage = (event) => {
        this.handleMessage(JSON.parse(event.data))
      }
      
      this.ws.onclose = () => {
        console.log('WebSocket disconnected')
        this.isConnected = false
        this.emit('disconnected')
        
        // Attempt to reconnect after 4 seconds
        setTimeout(() => {
          if (!this.isConnected) {
            this.connect()
          }
        }, 4000)
      }
      
      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error)
        this.emit('error', error)
      }

      // Send ping every 30 seconds to keep connection alive
      setInterval(() => {
        if (this.isConnected) {
          this.send('ping')
        }
      }, 30000)

    } catch (error) {
      console.error('Failed to connect to WebSocket:', error)
      throw error
    }
  }

  handleMessage(data) {
    console.log('WebSocket message:', data)
    
    // Handle user list updates
    if (data.t === 102 || data.t === 101) {
      data.o.userList?.forEach(user => {
        this.userDict[user.channelUid] = {
          nickname: user.userProfile.nickname,
          icon: user.userProfile.icon,
          userId: user.userProfile.uid,
          level: user.userProfile.level,
          frameurl: user.userProfile.avatarFrame?.resourceUrl || null
        }
      })
      this.emit('userListUpdate', this.userDict)
    }
    
    // Handle individual user join/leave
    if (data.t === 106 || data.t === 107) {
      if (data.o.user) {
        const user = data.o.user
        this.userDict[user.channelUid] = {
          nickname: user.userProfile.nickname || null,
          icon: user.userProfile.icon || null,
          userId: user.userProfile.uid || null,
          level: user.userProfile.level || null,
          frameurl: user.userProfile.avatarFrame?.resourceUrl || null
        }
        
        if (data.t === 106) {
          this.emit('userJoined', this.userDict[user.channelUid])
        } else {
          this.emit('userLeft', user.channelUid)
        }
      }
    }
    
    // Handle voice chat token
    if (data.t === 201) {
      const vcData = data.o
      this.emit('voiceChatReady', {
        appid: "d544b053e3e94dd2a8f51c6668522372",
        channel: vcData.channelName,
        uid: vcData.channelUid,
        token: vcData.channelKey
      })
    }
    
    // Handle chat messages
    if (data.t === 1000) {
      const message = data.o.chatMessage
      this.emit('message', {
        id: message.messageId,
        type: 'user',
        content: message.content,
        author: message.author.nickname,
        avatar: message.author.icon,
        level: message.author.level,
        timestamp: message.createdTime
      })
    }
  }

  startVoiceChat(comId, chatId, joinType = 2) {
    const joinData = {
      o: {
        ndcId: comId,
        threadId: chatId,
        joinRole: joinType,
        id: "72446"
      },
      t: 112
    }
    
    const tokenData = {
      o: {
        ndcId: comId,
        threadId: chatId,
        id: "337496"
      },
      t: 200
    }
    
    const endData = {
      o: {
        ndcId: comId,
        threadId: chatId,
        id: "1433472"
      },
      t: 103
    }
    
    const actionsData = {
      o: {
        actions: ["Chatting"],
        target: `ndc://x${comId}/chat-thread/${chatId}`,
        ndcId: parseInt(comId),
        params: {
          topicIds: [6572, 14482, 62028, 62024, 2892, 349, 112, 62362, 30915],
          threadType: 2,
          membershipStatus: 0
        },
        id: "1057495"
      },
      t: 304
    }
    
    const statusData = {
      o: {
        ndcId: comId,
        threadId: chatId,
        id: "1057083"
      },
      t: 100
    }

    this.send(JSON.stringify(joinData))
    this.send(JSON.stringify(tokenData))
    this.send(JSON.stringify(endData))
    this.send(JSON.stringify(actionsData))
    this.send(JSON.stringify(statusData))
  }

  send(data) {
    if (this.ws && this.isConnected) {
      this.ws.send(data)
    }
  }

  on(event, callback) {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, [])
    }
    this.eventListeners.get(event).push(callback)
  }

  off(event, callback) {
    if (this.eventListeners.has(event)) {
      const listeners = this.eventListeners.get(event)
      const index = listeners.indexOf(callback)
      if (index > -1) {
        listeners.splice(index, 1)
      }
    }
  }

  emit(event, data) {
    if (this.eventListeners.has(event)) {
      this.eventListeners.get(event).forEach(callback => {
        try {
          callback(data)
        } catch (error) {
          console.error('Event listener error:', error)
        }
      })
    }
  }

  disconnect() {
    if (this.ws) {
      this.isConnected = false
      this.ws.close()
      this.ws = null
    }
  }

  subscribe(userId) {
    // Implement audio subscription logic
    console.log('Subscribing to user:', userId)
  }

  unsubscribe(userId) {
    // Implement audio unsubscription logic
    console.log('Unsubscribing from user:', userId)
  }
}