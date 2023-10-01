import React from 'react'
import { CirclesWithBar } from 'react-loader-spinner'

const Loading = () => {
  return (
    <div className='h-screen w-screen flex items-center justify-center'>
        <CirclesWithBar height={100} width={100} color='#4f46e5' ariaLabel='circles-with-bar-loader' />
    </div>
  )
}

export default Loading