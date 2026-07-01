import React from 'react'
import {  Routes , Route, Navigate } from 'react-router-dom'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import ProfilePage from './pages/ProfilePage'
import TrustedContactsPage from './pages/TrustedContactsPage'
import SosButton from './components/SosButton'
import {Toaster} from "react-hot-toast"
import { AuthContext } from '../contex/AuthContex'
function App() {
  const{authUser} = React.useContext(AuthContext);
  return (
    <div className='bg-[url("/bgImage.svg")] bg-contain'>
      <Toaster/>
      {authUser && <SosButton />}
      <Routes>
        <Route path="/" element={authUser ? <HomePage />: <Navigate to="/login" />} />
        <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to="/" />} />
        <Route path="/profile" element={authUser ? <ProfilePage /> : <Navigate to="/login" />} />
        <Route path="/trusted-contacts" element={authUser ? <TrustedContactsPage /> : <Navigate to="/login" />} />
      </Routes>

    </div>
  )
}

export default App