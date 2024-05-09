import React from 'react'

import { Link } from 'react-router-dom'

const Navbar = () => {
  return (
    <div>
        <Link to="/">Inicial</Link><br/>
        <Link to="/a-faculdade">Afaculdade</Link><br/>
        <Link to="/dpo-lgpd">DpoLgpd</Link><br/>
        <Link to="/noticias">Noticias</Link><br/>
    </div>
  )
}

export default Navbar