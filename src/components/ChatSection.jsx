import { useEffect, useRef } from 'react'

const SystemMessage = ({ message }) => (
  <div className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-cafe-orange to-yellow-500 p-2 mb-4">
    <div className="flex w-6 h-6 items-center justify-center rounded-full bg-cafe-orange">
      <span className="text-sm text-white">↑</span>
    </div>
    <p className="text-sm text-white">{message.content}</p>
  </div>
)

const UserMessage = ({ message }) => (
  <div className="flex items-start gap-3 mb-4">
    <img 
      alt={`${message.author} avatar`}
      className="w-10 h-10 rounded-full object-cover" 
      src={message.avatar || 'https://images.pexels.com/photos/1040882/pexels-photo-1040882.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1'}
    />
    <div className="flex flex-col gap-1 flex-1">
      <div className="flex items-center gap-2 text-sm">
        <span className="font-bold text-white">
          {message.author} 
          {message.zodiac && <span className="text-cafe-purple ml-1">{message.zodiac}</span>}
        </span>
        {message.level && (
          <span className="rounded-full bg-yellow-500 px-2 py-0.5 text-xs font-bold text-black">
            LV{message.level}
          </span>
        )}
      </div>
      <div className="chat-bubble max-w-xs">
        <p className="text-white">{message.content}</p>
      </div>
    </div>
  </div>
)

const ChatSection = ({ messages }) => {
  const chatEndRef = useRef(null)

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  return (
    <div className="space-y-4 p-4 max-h-64 overflow-y-auto">
      {messages.map((message) => (
        <div key={message.id}>
          {message.type === 'system' ? (
            <SystemMessage message={message} />
          ) : (
            <UserMessage message={message} />
          )}
        </div>
      ))}
      <div ref={chatEndRef} />
    </div>
  )
}

export default ChatSection