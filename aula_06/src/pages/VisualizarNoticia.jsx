import React from 'react'
import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { Box, Typography, Paper } from '@mui/material'

const VisualizarNoticia = () => {

    const { id } = useParams()

    const url = `http://localhost:3000/noticias/${id}`

    const [visualizarNoticia, setVisualizarNoticia] = useState({})

    useEffect(() => {
        async function fetchData() {
          const res = await fetch(url)
          const data = await res.json()
    
          setVisualizarNoticia(data)
        }
        fetchData()
      }, [id])

  return (
    <Box sx={{ p: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>{visualizarNoticia.titulo}</Typography>
        <Typography variant="h6" gutterBottom>{visualizarNoticia.subtitulo}</Typography>
        <Typography variant="body1">{visualizarNoticia.texto}</Typography>
      </Paper>
    </Box>
  )
}

export default VisualizarNoticia