import { 
  PlusIcon, 
  ChatBubbleLeftIcon, 
  UserGroupIcon,
  StarIcon 
} from '@heroicons/react/24/outline'
import { HandRaisedIcon } from '@heroicons/react/24/solid'

const BottomNavigation = ({ wsService }) => {
  const handleTalk = () => {
    // Implement talk functionality
    console.log('Talk button pressed')
  }

  const handleAddUser = () => {
    // Implement add user functionality
    console.log('Add user pressed')
  }

  const handleOpenChat = () => {
    // Implement chat functionality
    console.log('Chat pressed')
  }

  const handleViewUsers = () => {
    // Implement view users functionality
    console.log('View users pressed')
  }

  const handleStar = () => {
    // Implement star/favorite functionality
    console.log('Star pressed')
  }

  return (
    <div className="sticky bottom-0 z-10 w-full">
      <div className="bg-black/80 p-2 backdrop-blur-sm">
        <div className="flex items-center justify-around gap-2">
          <button 
            onClick={handleAddUser}
            className="flex w-10 h-10 items-center justify-center rounded-full bg-white/20 text-white hover:bg-white/30 transition-colors"
          >
            <PlusIcon className="w-5 h-5" />
          </button>
          
          <button 
            onClick={handleOpenChat}
            className="flex w-10 h-10 items-center justify-center rounded-full bg-white/20 text-white hover:bg-white/30 transition-colors"
          >
            <ChatBubbleLeftIcon className="w-5 h-5" />
          </button>
          
          <button
            onClick={handleTalk}
            className="rounded-full bg-teal-gradient px-8 py-2 font-bold text-white hover:opacity-90 transition-opacity flex items-center gap-2"
          >
            <HandRaisedIcon className="w-5 h-5" />
            Talk
          </button>
          
          <button 
            onClick={handleViewUsers}
            className="flex w-10 h-10 items-center justify-center rounded-full bg-white/20 text-white hover:bg-white/30 transition-colors"
          >
            <UserGroupIcon className="w-5 h-5" />
          </button>
          
          <button 
            onClick={handleStar}
            className="glowing-button flex w-10 h-10 items-center justify-center rounded-full bg-purple-orange-gradient text-white hover:opacity-90 transition-opacity"
          >
            <StarIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
      
      {/* Home indicator */}
      <div className="flex justify-center py-2 bg-black">
        <div className="w-32 h-1 bg-white/30 rounded-full"></div>
      </div>
    </div>
  )
}

export default BottomNavigation