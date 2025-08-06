import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from '../components/home/home'
import AdminPanel from '../Admin/AdminPanel'
import AdminLogin from '../Admin/AdminLogin'
import ProtectedRoute from './ProtectedRoute'

const MyRoutes = () => {
  return (
        <BrowserRouter>
     
        <Routes>
            <Route path="/" element={<Home/>} />
            <Route path="/adminlogin" element={<AdminLogin />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminPanel />
              </ProtectedRoute>
            } />
             {/* <Route
            path="/admin"

            element={<AdminPanel/>}/> */}

        </Routes>
    </BrowserRouter>
  ) 
}

export default MyRoutes
