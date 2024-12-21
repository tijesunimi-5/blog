'use client'
import React from 'react'

const Card = ({children, styles, onClick}) => {
  return (
    <div onClick={onClick} className={`bg-gray-400 py-5 px-3 rounded-lg shadow-xl overflow-hidden relative text-ellipsis ${styles}`}>
      {children}
    </div>
  )
}

export default Card
