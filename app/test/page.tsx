import React from 'react'
import Script from 'next/script'

const page = () => {
  return (
    <div>
      <Script src="http://localhost:3000/widget.js" data-id="8813fc47-d931-4181-aa7e-6b62d125eb7e" defer></Script>
    </div>
  )
}

export default page