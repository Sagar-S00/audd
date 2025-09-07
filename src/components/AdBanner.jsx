const AdBanner = () => {
  return (
    <div className="mx-4 mb-2">
      <div className="flex items-center justify-between bg-white p-2 rounded-lg">
        <div className="flex items-center gap-2">
          <img 
            alt="Amazon logo" 
            className="h-8 w-auto" 
            src="https://images.pexels.com/photos/6214479/pexels-photo-6214479.jpeg?auto=compress&cs=tinysrgb&w=100&h=50&dpr=1"
          />
          <div>
            <p className="text-xs font-bold text-black">Acquista prodotti essenziali</p>
            <p className="text-xs text-green-600">Acquista ora &gt;</p>
          </div>
        </div>
        <div className="flex gap-1">
          <img 
            alt="Product image" 
            className="h-10 w-10 object-cover rounded" 
            src="https://images.pexels.com/photos/6214479/pexels-photo-6214479.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&dpr=1"
          />
          <img 
            alt="Product image" 
            className="h-10 w-10 object-cover rounded" 
            src="https://images.pexels.com/photos/6214480/pexels-photo-6214480.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&dpr=1"
          />
        </div>
      </div>
    </div>
  )
}

export default AdBanner