import React from 'react'
import Coldplay from '../assets/Coldplay.jpeg'


const TrabalhadoComImagens = () => {
  return (
    <div>
        <img src='The_Killers.jpeg' alt='The Killers'/>
        <img src={Coldplay} alt='Coldplay'/>
    </div>
  )
}

export default TrabalhadoComImagens