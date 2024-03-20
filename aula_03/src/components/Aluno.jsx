import React from 'react'

const Aluno = ({nome, email, curso, media}) => {
  return (
    <>
        <p><b>Nome:</b> {nome}</p>
        <p><b>E-mail:</b> {email}</p>
        <p><b>Curso:</b> {curso}</p>
        <p><b>Status:</b> {media>=7 ? <span>APROVADO</span> : <span>REPROVADO</span>}</p>
        <p>-----------------</p>
    </>
  )
}

export default Aluno