import { useState } from 'react'

const URLInputPage = ({ onSubmit }) => {
  const [url, setUrl] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!url.trim()) {
      alert('Please enter a URL')
      return
    }
    
    setIsLoading(true)
    try {
      await onSubmit(url)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-cafe-bg bg-cover bg-center bg-no-repeat">
      <div className="absolute inset-0 bg-black/80"></div>
      
      <div className="relative z-10 flex min-h-screen items-center justify-center p-4">
        <div className="w-full max-w-md rounded-2xl bg-black/60 p-8 backdrop-blur-sm">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">
              Virtual Café
            </h1>
            <p className="text-gray-300">
              Enter the room URL to join the conversation
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="url" className="block text-sm font-medium text-white mb-2">
                Room URL
              </label>
              <input
                type="text"
                id="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://aminoapps.com/c/..."
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cafe-orange focus:border-transparent"
                disabled={isLoading}
              />
            </div>
            
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-gradient-to-r from-cafe-orange to-yellow-500 text-white font-bold rounded-lg hover:from-cafe-orange/90 hover:to-yellow-500/90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Connecting...' : 'Join Room'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default URLInputPage