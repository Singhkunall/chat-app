import React, { useContext, useState } from 'react'
import { AuthContext } from '../../contex/AuthContex'
import toast from 'react-hot-toast'

const SosButton = () => {
  const { axios } = useContext(AuthContext)
  const [sending, setSending] = useState(false)

  const handleSOS = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation not supported on this device")
      return
    }

    const confirmed = window.confirm("Send an emergency alert with your live location to your trusted contacts?")
    if (!confirmed) return

    setSending(true)
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords
          const { data } = await axios.post('/api/sos/trigger', {
            lat: latitude,
            lng: longitude
          })
          if (data.success) {
            toast.success("SOS alert sent to your trusted contacts")
          } else {
            toast.error(data.message)
          }
        } catch (error) {
          toast.error("Failed to send SOS alert")
        }
        setSending(false)
      },
      () => {
        toast.error("Unable to get your location. Please enable location access.")
        setSending(false)
      }
    )
  }

  return (
    <button
      onClick={handleSOS}
      disabled={sending}
      className='fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-50 bg-red-600 hover:bg-red-700 text-white font-medium text-xs sm:text-sm px-4 sm:px-5 py-2.5 sm:py-3 rounded-full shadow-lg cursor-pointer flex items-center gap-1.5 sm:gap-2'
    >
      🚨 {sending ? "..." : "SOS"}
    </button>
  )
}

export default SosButton