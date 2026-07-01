import React, { useContext, useState } from 'react'
import { AuthContext } from '../../contex/AuthContex'
import { ChatContext } from '../../contex/ChatContext'
import assets from '../assets/assets'
import toast from 'react-hot-toast'

const UserSearch = ({ onClose }) => {
  const { axios } = useContext(AuthContext)
  const { setSelectedUser, getUsers } = useContext(ChatContext)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [searching, setSearching] = useState(false)

  const handleSearch = async (value) => {
    setQuery(value)
    if (!value.trim()) {
      setResults([])
      return
    }
    setSearching(true)
    try {
      const { data } = await axios.get(`/api/users/search?query=${value}`)
      if (data.success) {
        setResults(data.users)
      }
    } catch (error) {
      toast.error("Search failed")
    }
    setSearching(false)
  }

  const handleConnect = (user) => {
    setSelectedUser(user)
    getUsers()
    onClose()
    toast.success(`Connected with ${user.fullName}`)
  }

  return (
    <div className='fixed inset-0 bg-black/50 flex items-start justify-center pt-20 z-50' onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        className='bg-[#1a1a2e] border border-gray-600 rounded-lg w-[90%] sm:w-full max-w-md p-5 flex flex-col gap-4 mx-auto'
      >
        <div className='flex items-center justify-between'>
          <h3 className='text-white text-lg font-medium'>Find People</h3>
          <span onClick={onClose} className='text-gray-400 cursor-pointer text-sm'>Close</span>
        </div>
        <input
          type="text"
          autoFocus
          placeholder='Search by username...'
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          className='rounded-md border border-gray-500 p-2 text-sm bg-transparent text-white focus:outline-none focus:ring-2 focus:ring-violet-500'
        />
        <div className='flex flex-col gap-2 max-h-80 overflow-y-scroll'>
          {searching && <p className='text-xs text-gray-400'>Searching...</p>}
          {!searching && query && results.length === 0 && (
            <p className='text-xs text-gray-400'>No users found with that username.</p>
          )}
          {results.map((user) => (
            <div
              key={user._id}
              onClick={() => handleConnect(user)}
              className='flex items-center gap-3 p-2 rounded cursor-pointer hover:bg-white/5'
            >
              <img src={user.profilePic || assets.avatar_icon} alt="" className='w-10 h-10 rounded-full' />
              <div>
                <p className='text-white text-sm'>{user.fullName}</p>
                <p className='text-gray-400 text-xs'>@{user.username}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default UserSearch