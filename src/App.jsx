import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Serie from './pages/Serie'
import Admin from './pages/Admin'

export default function App() {
  return (
    <Routes>
      <Route path="/"        element={<Home />} />
      <Route path="/serie-a" element={<Serie />} />
      <Route path="/admin"   element={<Admin />} />
    </Routes>
  )
}