export class APIService {
  static async checkURL(url) {
    try {
      const response = await fetch('/url', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          url: url,
          type: 'music'
        })
      })
      
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
      
      return await response.json()
    } catch (error) {
      console.error('API Error:', error)
      throw error
    }
  }

  static async getUserId(url) {
    try {
      const response = await fetch('/get_uid', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          url: url,
          type: 'music'
        })
      })
      
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
      
      return await response.text()
    } catch (error) {
      console.error('API Error:', error)
      throw error
    }
  }

  static async getSid() {
    try {
      const response = await fetch('https://proxy-gamma-bice.vercel.app/get-sid/yato')
      
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
      
      const data = await response.json()
      return data.sid
    } catch (error) {
      console.error('API Error:', error)
      throw error
    }
  }
}