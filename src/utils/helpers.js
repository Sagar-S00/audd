export const formatTime = (timestamp) => {
  const date = new Date(timestamp)
  return date.toLocaleTimeString('en-US', { 
    hour: 'numeric', 
    minute: '2-digit',
    hour12: false 
  })
}

export const truncateText = (text, maxLength = 20) => {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

export const getRandomAvatar = () => {
  const avatars = [
    'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1',
    'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1',
    'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1',
    'https://images.pexels.com/photos/1040881/pexels-photo-1040881.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1',
    'https://images.pexels.com/photos/1043473/pexels-photo-1043473.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1',
    'https://images.pexels.com/photos/1040882/pexels-photo-1040882.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1'
  ]
  
  return avatars[Math.floor(Math.random() * avatars.length)]
}

export const generateUserId = () => {
  return Math.random().toString(36).substr(2, 9)
}

export const validateURL = (url) => {
  try {
    new URL(url)
    return url.includes('aminoapps.com')
  } catch {
    return false
  }
}