import React from 'react'
import Navbar from '../AddItemsNavbar'
import { Outlet } from 'react-router-dom'

const AddItemLayout = () => {
  return (
    <div>
      <Navbar/>
      <Outlet/>
    </div>
  )
}

export default AddItemLayout