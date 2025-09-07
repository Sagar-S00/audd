import { Cog6ToothIcon, XMarkIcon } from '@heroicons/react/24/outline'

const RoomHeader = ({ title, participantCount, onLeave }) => {
  return (
    <header className="flex items-center justify-between p-4">
      <div className="flex items-center gap-2">
        <span className="rounded-md bg-cafe-teal-start px-2 py-0.5 text-sm font-bold text-white">
          LIVE
        </span>
        <h1 className="font-bold text-white">
          {title} ({participantCount})
        </h1>
      </div>
      
      <div className="flex items-center gap-4">
        <button className="text-white hover:text-cafe-orange transition-colors">
          <Cog6ToothIcon className="w-6 h-6" />
        </button>
        <button 
          onClick={onLeave}
          className="text-white hover:text-red-400 transition-colors"
        >
          <XMarkIcon className="w-6 h-6" />
        </button>
      </div>
    </header>
  )
}

export default RoomHeader