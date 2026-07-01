import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../../contex/AuthContex'
import toast from 'react-hot-toast'

const TrustedContactsPage = () => {
  const { axios } = useContext(AuthContext)
  const navigate = useNavigate()
  const [contacts, setContacts] = useState([])
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [relation, setRelation] = useState('')

  const fetchContacts = async () => {
    try {
      const { data } = await axios.get('/api/trusted-contacts')
      if (data.success) setContacts(data.contacts)
    } catch (error) {
      toast.error("Failed to load trusted contacts")
    }
  }

  useEffect(() => {
    fetchContacts()
  }, [])

  const handleAdd = async (e) => {
    e.preventDefault()
    try {
      const { data } = await axios.post('/api/trusted-contacts', { name, email, relation })
      if (data.success) {
        toast.success("Trusted contact added")
        setName('')
        setEmail('')
        setRelation('')
        fetchContacts()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error("Failed to add contact")
    }
  }

  const handleDelete = async (id) => {
    try {
      const { data } = await axios.delete(`/api/trusted-contacts/${id}`)
      if (data.success) {
        toast.success("Contact removed")
        fetchContacts()
      }
    } catch (error) {
      toast.error("Failed to remove contact")
    }
  }

  return (
    <div className='min-h-screen bg-cover bg-no-repeat flex items-center justify-center p-5'>
      <div className='w-full max-w-md backdrop-blur-2xl text-gray-200 border-2 border-gray-600 rounded-lg p-8 flex flex-col gap-5'>
        <div className='flex items-center justify-between'>
          <h3 className='text-lg font-medium'>Trusted Contacts</h3>
          <span onClick={() => navigate('/')} className='text-sm text-violet-400 cursor-pointer'>Back</span>
        </div>
        <p className='text-xs text-gray-400'>These people will be alerted with your live location when you trigger an SOS.</p>

        <form onSubmit={handleAdd} className='flex flex-col gap-3'>
          <input
            type="text"
            required
            placeholder='Name'
            value={name}
            onChange={(e) => setName(e.target.value)}
            className='rounded-md border border-gray-500 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500'
          />
          <input
            type="email"
            required
            placeholder='Email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className='rounded-md border border-gray-500 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500'
          />
          <input
            type="text"
            placeholder='Relation (optional)'
            value={relation}
            onChange={(e) => setRelation(e.target.value)}
            className='rounded-md border border-gray-500 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500'
          />
          <button type='submit' className='p-2 bg-gradient-to-r from-purple-400 to-violet-600 text-white text-sm rounded-full cursor-pointer'>
            Add Contact
          </button>
        </form>

        <div className='flex flex-col gap-2 mt-2'>
          {contacts.length === 0 && <p className='text-xs text-gray-500'>No trusted contacts added yet.</p>}
          {contacts.map((contact) => (
            <div key={contact._id} className='flex items-center justify-between bg-white/5 rounded-md p-2'>
              <div>
                <p className='text-sm'>{contact.name}</p>
                <p className='text-xs text-gray-400'>{contact.email} {contact.relation && `· ${contact.relation}`}</p>
              </div>
              <span onClick={() => handleDelete(contact._id)} className='text-xs text-red-400 cursor-pointer'>Remove</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default TrustedContactsPage