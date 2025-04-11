import React, { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import  { Toaster } from 'react-hot-toast';
import FetchUserDetails from './utils/FetchUserDetail';
import { useDispatch } from 'react-redux';
import { setUserDetails } from './store/userSlilce';

const App = () => {
  const dispatch = useDispatch()

  const fetchUser = async () => {
    const userData = await FetchUserDetails()
    dispatch(setUserDetails(userData.data))
  }

  useEffect(() => {
    fetchUser()
  },[])
  return (
    <>
    <Header/>
    <main className='min-h-[78vh]'>
      <Outlet/>
    </main>
    <Footer/>
    <Toaster/>
    </>
  )
}

export default App