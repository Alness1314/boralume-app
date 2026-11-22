import React from 'react'
import ReactDOM from 'react-dom/client'
import '@fontsource-variable/manrope'
import './styles.css'
import { App } from './app/App'

const root = document.getElementById('root')
if (!root) throw new Error('No se encontró el punto de entrada de BoraLume.')

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
