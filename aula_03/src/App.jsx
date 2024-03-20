import React from 'react'
import EstouConseguindoAprenderReact from './components/EstouConseguindoAprenderReact'
import Aluno from './components/Aluno'

const App = () => {
  return (
    <div>
      <EstouConseguindoAprenderReact estouConseguindo={false}/>
      
      {
        [
        {nome: "Thiago", email: "thiagohgcoutinho@gmail.com", curso: "Sistemas para Internet", media: 8},
        {nome: "Luiz", email: "luiz@gmail.com", curso: "Engenharia Civil", media: 5},
        {nome: "Felipe", email: "felipe@gmail.com", curso: "Direito", media: 7}
        ].map((aluno) =>
          <Aluno nome={aluno.nome} curso={aluno.curso} email={aluno.email} media={aluno.media}/>
        )
        
      }

    </div>
  )
}

export default App