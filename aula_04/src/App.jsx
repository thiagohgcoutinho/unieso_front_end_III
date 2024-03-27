
import React from 'react'
import Exerc_01 from './components/Exerc_01'
import Exerc_02 from './components/Exerc_02'
import Campanha from './components/Campanha'

const App = () => {
  return (
    <div>
      <Exerc_01 />
      <Exerc_02 />
      <Campanha mes="setembro" />
      <Campanha mes="outubro" />
      <Campanha mes="novembro" />
    </div>
  )
}

export default App