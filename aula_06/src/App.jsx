import React from 'react'
import Inicial from './pages/Inicial'
import Afaculdade from './pages/Afaculdade'
import DpoLgpd from './pages/DpoLgpd'
import Noticias from './pages/Noticias'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import VisualizarNoticia from './pages/VisualizarNoticia'
import NoticiasAxios from './pages/NoticiasAxios'
import AdminNoticias from './pages/admin/AdminNoticias'
import CadastroNoticia from './pages/admin/CadastroNoticia'

const App = () => {
  return (
    <>
      <BrowserRouter>
      <img src='uniesp_logo.png' width={100} height={100} />
      <Navbar />
      <br/><br/>
      <Routes>
        <Route path='/' element={<Inicial />} />
        <Route path='/a-faculdade' element={<Afaculdade />} />
        <Route path='/dpo-lgpd' element={<DpoLgpd />} />
        <Route path='/noticias' element={<NoticiasAxios />} />
        <Route path='/visualizar-noticia/:id' element={<VisualizarNoticia />} />
        <Route path='/admin-noticias' element={<AdminNoticias />} />
        <Route path='/cadastrar-noticia' element={<CadastroNoticia />} />
      </Routes>
      </BrowserRouter>
    </>
  )
}

export default App