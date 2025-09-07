import { useState } from 'react'
import { MicrophoneIcon } from '@heroicons/react/24/solid'

const ParticipantAvatar = ({ participant, onToggleMute }) => {
  const [isMuted, setIsMuted] = useState(false)

  const handleClick = () => {
    setIsMuted(!isMuted)
    onToggleMute?.(participant.id, !isMuted)
  }

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative cursor-pointer" onClick={handleClick}>
        <div className="avatar-frame">
          {participant.frame && (
            <img 
              src={participant.frame}
              alt="Avatar frame"
              className="absolute inset-0 w-full h-full object-cover z-10 pointer-events-none"
            />
          )}
          <img 
            alt={participant.name} 
            className={`w-20 h-20 rounded-full object-cover ${
              participant.isActive ? 'ring-2 ring-yellow-400' : 'ring-2 ring-transparent'
            }`}
            src={participant.avatar}
          />
          {participant.badge && (
            <div className="absolute -top-2 -right-2 text-2xl">
              {participant.badge}
            </div>
          )}
          {participant.isOnline && (
            <div className="status-indicator bg-green-500"></div>
          )}
          {isMuted && (
            <div className="mute-overlay">
              <MicrophoneIcon className="w-6 h-6 text-red-500" />
            </div>
          )}
        </div>
      </div>
      <span className="text-sm text-white text-center max-w-20 truncate">
        {participant.name}
      </span>
    </div>
  )
}

const ParticipantGrid = ({ participants, wsService }) => {
  const handleToggleMute = (participantId, muted) => {
    if (wsService) {
      if (muted) {
        wsService.unsubscribe(participantId)
      } else {
        wsService.subscribe(participantId)
      }
    }
  }

  // Sample participants for demo
  const sampleParticipants = [
    {
      id: '1',
      name: 'Philomathilus',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1',
      badge: '🎂',
      isActive: true,
      isOnline: true,
      frame: null
    },
    {
      id: '2',
      name: '파란색',
      avatar: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1',
      isActive: false,
      isOnline: true,
      frame: null
    },
    {
      id: '3',
      name: '田中 (Peruere)',
      avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1',
      isActive: false,
      isOnline: false,
      frame: null
    },
    {
      id: '4',
      name: 'Kenji',
      avatar: 'https://images.pexels.com/photos/1040881/pexels-photo-1040881.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1',
      isActive: false,
      isOnline: true,
      frame: null
    },
    {
      id: '5',
      name: 'mon ami 黒鬼',
      avatar: 'https://images.pexels.com/photos/1043473/pexels-photo-1043473.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1',
      isActive: true,
      isOnline: true,
      frame: null
    },
    {
      id: '6',
      name: 'Jazz',
      avatar: 'https://images.pexels.com/photos/1040882/pexels-photo-1040882.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1',
      badge: '♋',
      isActive: false,
      isOnline: true,
      frame: null
    }
  ]

  const allParticipants = [...sampleParticipants, ...participants]

  return (
    <div className="grid grid-cols-3 gap-4 p-4">
      {allParticipants.map((participant) => (
        <ParticipantAvatar
          key={participant.id}
          participant={participant}
          onToggleMute={handleToggleMute}
        />
      ))}
    </div>
  )
}

export default ParticipantGrid