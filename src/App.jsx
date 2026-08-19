import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Serie from './pages/Serie'
import Admin from './pages/Admin'
 
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"        element={<Home />} />
        <Route path="/serie-a" element={<Serie serie="A" />} />
        <Route path="/admin"   element={<Admin />} />
      </Routes>
    </BrowserRouter>
  )
}
 