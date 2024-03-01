import React from 'react'
import Exercicio1Adicao from './components/Exercicio1Adicao'
import Exercicio1Subtracao from './components/Exercicio1Subtracao'
import Exercicio1Multiplicacao from './components/Exercicio1Multiplicacao'
import Exercicio1Divisao from './components/Exercicio1Divisao'
import PrecisoEstudar from './components/PrecisoEstudar'

const App = () => {
  return (
    <div>
      <Exercicio1Adicao num1={2} num2={3}/>
      <Exercicio1Subtracao num1={5} num2={2}/>
      <Exercicio1Multiplicacao num1={3} num2={6}/>
      <Exercicio1Divisao num1={15} num2={3}/>
      <PrecisoEstudar nomeDaTecnologia={"React"}/>
    </div>
  )
}

export default App