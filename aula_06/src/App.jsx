import React from 'react'
import { BrowserRouter, Routes, Route} from 'react-router-dom'
import Inicial from './pages/Inicial'
import Afaculdade from './pages/Afaculdade'
import DpoLgpd from './pages/DpoLgpd'
import Noticias from './pages/Noticias'
import Navbar from './components/Navbar'

const App = () => {
  return (
    <>
    <BrowserRouter>
    <img src='./uniesp_logo.png' />
    <Navbar />
    <br/><br/>
    <Routes>
      <Route path="/" element={<Inicial />} />
      <Route path="/a-faculdade" element={<Afaculdade />} />
      <Route path="/dpo-lgpd" element={<DpoLgpd />} />
      <Route path="/noticias" element={<Noticias />} />
    </Routes>
    </BrowserRouter>
    </>
  )
}

export default App