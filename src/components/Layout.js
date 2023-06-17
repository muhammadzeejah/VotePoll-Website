import React from 'react'
import Navbar from './Navbar'
import Footer from './Footer'
import { useDispatch } from 'react-redux';

const Layout = ({ children }) => {
  return (
    <div>
      <Navbar />
      {children}
      <Footer />
    </div>
  )
}

export default Layout