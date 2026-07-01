import React, { useContext, useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { AuthContext } from '../../contex/AuthContex'
import { ChatContext } from '../../contex/ChatContext'
import assets from '../assets/assets'
import toast from 'react-hot-toast'

const ConnectPage = () => {
  const { username } = useParams()
  const { authUser, axios } = useContext(AuthContext)
  const { setSelectedUser, getUsers } = useContext(ChatContext)
  const navigate = useNavigate()
  const [targetUser, setTargetUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!authUser) {
      navigate('/login')
      return
    }
    const fetchUser = async () => {
      try {
        const { data } = await axios.get(`/api/users/by-username/${username}`)
        if (data.success) {
          setTargetUser(data.user)
        } else {
          toast.error("User not found")
          navigate('/')
        }
      } catch (error) {
        toast.error("User not found")
        navigate('/')
      }
      setLoading(false)
    }
    fetchUser()
  }, [authUser])

  const handleConnect = () => {
    setSelectedUser(targetUser)
    getUsers()
    navigate('/')
    toast.success(`Connected with ${targetUser.fullName}`)
  }

  if (loading) return <div className='min-h-screen flex items-center justify-center text-white'>Loading...</div>

  return (
    <div className='min-h-screen flex items-center justify-center p-5'>
      <div className='bg-[#1a1a2e] border border-gray-600 rounded-lg p-8 flex flex-col items-center gap-4 max-w-sm w-full'>
        <img src={targetUser?.profilePic || assets.avatar_icon} alt="" className='w-20 h-20 rounded-full' />
        <p className='text-white text-lg'>{targetUser?.fullName}</p>
        <p className='text-gray-400 text-sm'>@{targetUser?.username}</p>
        <button
          onClick={handleConnect}
          className='p-2 px-8 bg-gradient-to-r from-purple-400 to-violet-600 text-white text-sm rounded-full cursor-pointer'
        >
          Start Chat
        </button>
      </div>
    </div>
  )
}

export default ConnectPage