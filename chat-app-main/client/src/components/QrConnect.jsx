import React, { useContext, useState } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { AuthContext } from '../../contex/AuthContex'
import { ChatContext } from '../../contex/ChatContext'
import toast from 'react-hot-toast'

const QrConnect = ({ onClose }) => {
  const { authUser, axios } = useContext(AuthContext)
  const { setSelectedUser, getUsers } = useContext(ChatContext)
  const [scannedUsername, setScannedUsername] = useState('')
  const [tab, setTab] = useState('show') // 'show' or 'connect'

  const profileLink = `${window.location.origin}/connect/${authUser.username}`

  const handleConnectByUsername = async () => {
    if (!scannedUsername.trim()) return
    try {
      const { data } = await axios.get(`/api/users/by-username/${scannedUsername.trim()}`)
      if (data.success) {
        setSelectedUser(data.user)
        getUsers()
        onClose()
        toast.success(`Connected with ${data.user.fullName}`)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error("User not found")
    }
  }

  return (
    <div className='fixed inset-0 bg-black/50 flex items-start justify-center pt-20 z-50' onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        className='bg-[#1a1a2e] border border-gray-600 rounded-lg w-full max-w-sm p-5 flex flex-col gap-4'
      >
        <div className='flex items-center justify-between'>
          <h3 className='text-white text-lg font-medium'>QR Connect</h3>
          <span onClick={onClose} className='text-gray-400 cursor-pointer text-sm'>Close</span>
        </div>

        <div className='flex gap-2 text-sm'>
          <span
            onClick={() => setTab('show')}
            className={`cursor-pointer px-3 py-1 rounded-full ${tab === 'show' ? 'bg-violet-600 text-white' : 'text-gray-400'}`}
          >My QR</span>
          <span
            onClick={() => setTab('connect')}
            className={`cursor-pointer px-3 py-1 rounded-full ${tab === 'connect' ? 'bg-violet-600 text-white' : 'text-gray-400'}`}
          >Enter Username</span>
        </div>

        {tab === 'show' && (
          <div className='flex flex-col items-center gap-3 py-4'>
            <div className='bg-white p-4 rounded-lg'>
              <QRCodeSVG value={profileLink} size={180} />
            </div>
            <p className='text-gray-300 text-sm'>@{authUser.username}</p>
            <p className='text-gray-500 text-xs text-center'>Let someone scan this to connect with you instantly</p>
          </div>
        )}

        {tab === 'connect' && (
          <div className='flex flex-col gap-3'>
            <input
              type="text"
              placeholder="Enter their username"
              value={scannedUsername}
              onChange={(e) => setScannedUsername(e.target.value)}
              className='rounded-md border border-gray-500 p-2 text-sm bg-transparent text-white focus:outline-none focus:ring-2 focus:ring-violet-500'
            />
            <button
              onClick={handleConnectByUsername}
              className='p-2 bg-gradient-to-r from-purple-400 to-violet-600 text-white text-sm rounded-full cursor-pointer'
            >
              Connect
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default QrConnect