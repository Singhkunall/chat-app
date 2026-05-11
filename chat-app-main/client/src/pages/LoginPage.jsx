import React, { useState, useEffect } from 'react'
import assets from '../assets/assets'
import { AuthContext } from '../../contex/AuthContex'
import axios from 'axios'
import toast from 'react-hot-toast'
import { Loader2 } from "lucide-react"

const LoginPage = () => {
  const [currState, setCurrState] = useState('Sign Up')
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [bio, setBio] = useState('')
  const [otp, setOtp] = useState('')
  const [otpSent, setOtpSent] = useState(false)
  const [isDataSubmitted, setIsDataSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  // 🔥 resend OTP state
  const [resendTimer, setResendTimer] = useState(0)
  const [resendLoading, setResendLoading] = useState(false)

  const { login } = React.useContext(AuthContext)

  // ⏳ Countdown effect
  useEffect(() => {
    let interval
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [resendTimer])

  // 🔁 resend OTP function
  const resendOtp = async () => {
    try {
      setResendLoading(true)
      const res = await axios.post('/api/auth/resend-otp', { email })

      if (res.data.success) {
        toast.success("OTP resent to your email")
        setResendTimer(30) // restart 30 sec timer
      } else {
        toast.error(res.data.message)
      }
    } catch {
      toast.error("Failed to resend OTP")
    }
    setResendLoading(false)
  }

  const onSubmitHandler = async (event) => {
    event.preventDefault()

    // STEP 1 → user enters basic data
    if (currState === 'Sign Up' && !isDataSubmitted) {
      setIsDataSubmitted(true)
      return
    }

    // STEP 2 → send OTP first time
    if (currState === 'Sign Up' && !otpSent) {
      try {
        setLoading(true)
        const res = await axios.post('/api/auth/signup', {
          fullName,
          email,
          password,
          bio
        })

        if (res.data.success) {
          toast.success("OTP sent to your email")
          setOtpSent(true)
          setResendTimer(30) // start timer
        } else {
          toast.error(res.data.message)
        }
      } catch {
        toast.error("Something went wrong while sending OTP")
      }
      setLoading(false)
      return
    }

    // STEP 3 → verify OTP
    if (currState === 'Sign Up' && otpSent) {
      try {
        setLoading(true)
        const res = await axios.post('/api/auth/verify-otp', {
          email,
          otp,
          password
        })

        if (res.data.success) {
          toast.success("🎉 Account created successfully!")
          login('login', { email, password })
        } else {
          toast.error(res.data.message)
        }
      } catch {
        toast.error("OTP verification failed")
      }
      setLoading(false)
      return
    }

    // LOGIN PROCESS
    login('login', { email, password })
  }

  return (
    <div className='min-h-screen bg-cover flex items-center justify-center gap-8 sm:justify-evenly max-sm:flex-col backdrop-blur-2xl'>
      
      {/* LEFT LOGO */}
      <img src={assets.logo_big} alt='' className='w-[min(30vw,250px)]' />

      {/* RIGHT FORM */}
      <form
        onSubmit={onSubmitHandler}
        className='border-2 bg-white/8 text-white border-gray-500 p-6 flex flex-col gap-6 rounded-lg shadow-lg'
      >
        <h2 className='font-medium text-2xl flex justify-center items-center'>
          {currState}
          {isDataSubmitted && (
            <img
              onClick={() => {
                setIsDataSubmitted(false)
                setOtpSent(false)
                setResendTimer(0)
              }}
              src={assets.arrow_icon}
              alt=''
              className='w-5 cursor-pointer ml-2'
            />
          )}
        </h2>

        {/* Full Name */}
        {currState === 'Sign Up' && !isDataSubmitted && (
          <input
            onChange={(e) => setFullName(e.target.value)}
            value={fullName}
            type='text'
            placeholder='Full Name'
            className='p-2 rounded-md border border-gray-500 focus:outline-none'
            required
          />
        )}

        {/* Email + Password */}
        {!isDataSubmitted && (
          <>
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              type='email'
              placeholder='Email'
              className='p-2 rounded-md border border-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500'
              required
            />
            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              type='password'
              placeholder='Password'
              className='p-2 rounded-md border border-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500'
              required
            />
          </>
        )}

        {/* Bio */}
        {currState === 'Sign Up' && isDataSubmitted && (
          <textarea
            onChange={(e) => setBio(e.target.value)}
            value={bio}
            rows={4}
            placeholder='Bio'
            className='p-2 rounded-md border border-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500'
            required
          />
        )}

        {/* OTP INPUT */}
        {currState === 'Sign Up' && otpSent && (
          <>
            <input
              type='text'
              placeholder='Enter OTP'
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className='p-2 rounded-md border border-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500'
              required
            />

            {/* 🔁 RESEND OTP */}
            <div className='flex justify-between items-center text-sm'>
              {resendTimer > 0 ? (
                <p className='text-gray-400'>Resend OTP in {resendTimer}s</p>
              ) : (
                <button
                  type='button'
                  disabled={resendLoading}
                  onClick={resendOtp}
                  className='text-violet-400 font-medium flex items-center gap-2'
                >
                  {resendLoading ? (
                    <Loader2 className='w-4 h-4 animate-spin' />
                  ) : (
                    "Resend OTP"
                  )}
                </button>
              )}
            </div>
          </>
        )}

        {/* SUBMIT BUTTON */}
        <button
          type='submit'
          disabled={loading && currState === "Sign Up"}
          className='py-3 bg-gradient-to-r from-purple-400 to-violet-600 text-white rounded-md cursor-pointer flex justify-center items-center gap-2'
        >
          {loading ? (
            <Loader2 className='w-5 h-5 animate-spin' />
          ) : (
            currState === 'Sign Up' ? 'Create Account' : 'Login Now'
          )}
        </button>

        {/* Terms */}
        <div className='flex items-center gap-2 text-sm text-gray-500'>
          <input type='checkbox' />
          <p>Agree to the terms and conditions</p>
        </div>

        {/* SWITCH MODE */}
        <div className='flex flex-col gap-2'>
          {currState === 'Sign Up' ? (
            <p className='text-sm text-gray-600'>
              Already have an account?{" "}
              <span
                onClick={() => {
                  setCurrState('Login')
                  setIsDataSubmitted(false)
                  setOtpSent(false)
                  setResendTimer(0)
                }}
                className='text-violet-500 font-medium cursor-pointer'
              >
                Login
              </span>
            </p>
          ) : (
            <p className='text-sm text-gray-600'>
              Don't have an account?{" "}
              <span
                onClick={() => {
                  setCurrState('Sign Up')
                }}
                className='text-violet-500 font-medium cursor-pointer'
              >
                Sign Up
              </span>
            </p>
          )}
        </div>
      </form>
    </div>
  )
}

export default LoginPage
