const HostSection = ({ host, onlineCount }) => {
  const defaultHost = {
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1',
    name: 'Host',
    isOnline: true
  }

  const hostData = host || defaultHost

  return (
    <div className="px-4 pb-2">
      <div className="flex items-center gap-2">
        <div className="relative">
          <img 
            alt="Host avatar" 
            className="w-10 h-10 rounded-full object-cover ring-2 ring-cafe-orange" 
            src={hostData.avatar}
          />
          <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 rounded-full bg-gray-600 px-2 text-xs text-white">
            Host
          </span>
          {hostData.isOnline && (
            <div className="status-indicator bg-green-500"></div>
          )}
        </div>
        
        <div className="flex items-center gap-1 text-white">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span className="text-sm font-medium">{onlineCount}</span>
        </div>
      </div>
    </div>
  )
}

export default HostSection