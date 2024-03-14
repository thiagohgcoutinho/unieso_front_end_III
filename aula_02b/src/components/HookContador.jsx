import React, { useState } from 'react'


const HookContador = () => {
  
    const [count, setCount] = useState(1)

    function incrementarContador() {
        setCount(count + 1)
    }

    return (
    <div>
        <h1>Contador com useState</h1>
        <button onClick={incrementarContador}>Incrementar Contador</button>
        <h2>O contador está em {count}</h2>
    </div>
  )
}

export default HookContador