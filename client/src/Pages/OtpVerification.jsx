


import React, { useRef, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import Axios from '../utils/Axios'

import SummaryApi from '../common/SummaryApi'
import { Link, useLocation, useNavigate,  } from 'react-router-dom'
import AxiosToastError from '../utils/AxiosToastError'

const OtpVerification = () => {

    const [data, setData] = useState(["","","","","", ""])
    const navigation = useNavigate()

    const location = useLocation()

    console.log('location')

    useEffect(() => {
      if(!location?.state?.email) {
        navigation('/forgot-password')
      }
    }, [])
    

    // const navigate = useNavigate()

    
    const valideValue = data.every(el => el)

    const inputRef = useRef([null])


    const handleOnSubmit = async (e) => {
        e.preventDefault()

        try {
            const response = await Axios({
                ...SummaryApi.forgot_password_otp_verification ,
                data : {
                    otp : data.join(""),
                    email : location?.state?.email
                }
            })

            if(response.data.error) {
                toast.error(response.data.message)
            }

            if(response.data.success) {
                toast.success(response.data.message)
                setData(["","","","","",""])
                navigation("/reset-password", {
                    state : {
                        data : response.data,
                        email : location?.state?.email
                    }
                })
            }
        } catch (error) {
            AxiosToastError(error)
        }
    }
  return (
    <section className='w-full container mx-auto px-2'>
        <div className='bg-white my-4 w-full max-w-lg mx-auto rounded p-7'>

            <p className='font-semibold text-lg'>ENTER OTP</p>

            <form onSubmit={handleOnSubmit} className='grid gap-2 py-4'>

            <div className='grid gap-1'>
                <label htmlFor="otp">Enter Your Otp : </label>
                <div className='flex items-center gap-3 justify-between mt-3'>
                {
                                data.map((element,index)=>{
                                    return(
                                        <input
                                            key={"otp"+index}
                                            type='text'
                                            id='otp'
                                            ref={(ref)=>{
                                                inputRef.current[index] = ref
                                                return ref 
                                            }}
                                            value={data[index]}
                                            onChange={(e)=>{
                                                const value =  e.target.value
                                                console.log("value",value)

                                                const newData = [...data]
                                                newData[index] = value
                                                setData(newData)

                                                if(value && index < 5){
                                                    inputRef.current[index+1].focus()
                                                }


                                            }}
                                            maxLength={1}
                                            className='bg-blue-50 w-full max-w-16 p-2 border rounded outline-none focus:border-primary-200 text-center font-semibold'
                                        />
                                    )
                                })
                            }
                </div>
            </div>



            <button disabled={!valideValue} className={` ${valideValue ? "bg-green-800" : "bg-gray-500"}  text-white py-2 rounded font-semibold cursor-pointer hover:bg-green-900 my-3 tracking-wide `}>Verify Otp</button>

        </form>
        <p>
            Already have Account ? <Link to={'/login'} className='font-semibold text-green-700 hover:text-green-800'>Login</Link>
        </p>
        </div>
        
    </section>
  )
}

export default OtpVerification;