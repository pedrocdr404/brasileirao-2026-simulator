import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Serie from './pages/Serie.jsx'
import Admin from './pages/Admin.jsx'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/serie-a" element={<Serie serie="A" />} />
      <Route path="/serie-b" element={<Serie serie="B" />} />
      <Route path="/admin" element={<Admin />} />
    </Routes>
  )
}