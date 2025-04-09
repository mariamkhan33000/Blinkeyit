import React, { useState } from 'react'
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa'
import toast from 'react-hot-toast'
import axios from 'axios'
import Axios from '../utils/Axios'

import SummaryApi from '../common/SummaryApi'
import { Link, useNavigate } from 'react-router-dom'
import AxiosToastError from '../utils/AxiosToastError'

const Register = () => {

    const [data, setData] = useState({
        name : "",
        email : "",
        password : "",
        confirmPassword : ""
    })

    const [showPassword, setShowPassword] = useState(false)
    const [confirmShowPassword, setConfirmShowPassword] = useState(false)
    const navigate = useNavigate()

    const handleChange = (e) => {
        const {name, value} = e.target

        setData((preve) => {
            return {
                ...preve, [name] : value
            }
        })
    }
    
    const valideValue = Object.values(data).every(el => el)


    const handleOnSubmit = async (e) => {
        e.preventDefault()
        if(data.password !== data.confirmPassword) {
            toast.error("Password and confirm Password must be same")
            return
        }

        try {
            const response = await Axios({
                ...SummaryApi.register ,
                data : data
            })

            if(response.data.error) {
                toast.error(response.data.message)
            }

            if(response.data.success) {
                toast.success(response.data.message)
                setData({
                    name: "",
                    email : "",
                    password : "",
                    confirmPassword : ""
                })
                navigate("/login")
            }
        } catch (error) {
            AxiosToastError(error)
        }
    }
  return (
    <section className='w-full container mx-auto px-2'>
        <div className='bg-white my-4 w-full max-w-lg mx-auto rounded p-7'>
            <p>Welcome to Binkeyit</p>

            <form onSubmit={handleOnSubmit} className='grid gap-2 mt-6'>
            <div className='grid gap-1'>
                <label htmlFor="name">Name : </label>
                <input type="text" id='name' autoFocus className='bg-blue-50 p-2 rounded outline-none focus:border-primary-200' value={data.name} onChange={handleChange} name='name' placeholder='Enter Your Name . . . .'/>
            </div>

            <div className='grid gap-1'>
                <label htmlFor="email">Email : </label>
                <input type="email" id='email' className='bg-blue-50 p-2 rounded outline-none focus:border-primary-200' value={data.email} onChange={handleChange} name='email' placeholder='Enter Your Email . . . . .' />
            </div>

            <div className='grid gap-1'>
                <label htmlFor="password">Password : </label>
                <div className='bg-blue-50 p-2 rounded flex items-center'>
                <input type= {showPassword ? 'text' : 'password' } id='password' className='w-full outline-none focus:border-primary-200' value={data.password} onChange={handleChange} name='password' placeholder='Enter Your Password . . .  .'/>
                <div onClick={() => setShowPassword(preve => !preve)} className='cursor-pointer'>
                     {
                    showPassword ? ( <FaRegEye/>) : (<FaRegEyeSlash/>)
                    }
                    
                </div>
                </div>
            </div>

            <div className='grid gap-1'>
                <label htmlFor="confirmPassword"> Confirm Password : </label>
                <div className='bg-blue-50 p-2 rounded flex items-center'>
                <input type= {confirmShowPassword ? 'text' : 'confirmPassword' } id='confirmPassword' className='w-full outline-none focus:border-primary-200' value={data.confirmPassword} onChange={handleChange} name='confirmPassword' placeholder='Enter Your confirmPassword . . .  .'/>
                <div onClick={() => setConfirmShowPassword(preve => !preve)} className='cursor-pointer'>
                     {
                    confirmShowPassword ? ( <FaRegEye/>) : (<FaRegEyeSlash/>)
                    }
                    
                </div>
                </div>
            </div>

            <button disabled={!valideValue} className={` ${valideValue ? "bg-green-800" : "bg-gray-500"}  text-white py-2 rounded font-semibold cursor-pointer hover:bg-green-900 my-3 tracking-wide `}>Register</button>

        </form>
        <p>
            Already have account ? <Link to={'/login'} className='font-semibold text-green-700 hover:text-green-800'>Login</Link>
        </p>
        </div>
        
    </section>
  )
}

export default Register