import React, { useState } from 'react'

const HookMegaSena = () => {
    
    const [numeroSorteado, setNumeroSorteado] = useState()
  
    const [numerosSorteados, setNumerosSorteados] = useState([])

    function sortearNumero() {
        if (numerosSorteados.length >= 6 ) {
            alert('Já temos 6 números sorteados!')
            return
        }

        let novoNumeroSorteado
        do {
            novoNumeroSorteado = Math.floor(Math.random() * 60) + 1;
        } while (numerosSorteados.includes(novoNumeroSorteado))

        setNumeroSorteado (novoNumeroSorteado)
        setNumerosSorteados([...numerosSorteados, novoNumeroSorteado])
    }

    return (
    <div>
        <h1>Sorteador da Mega em React!</h1>
        <button onClick={sortearNumero}>Sortear Número</button>
        <h1>Último número sorteado: {numeroSorteado}</h1>
        <h1>Números Sorteados: {numerosSorteados.join(' - ')}</h1>
    </div>
  )
}

export default HookMegaSena