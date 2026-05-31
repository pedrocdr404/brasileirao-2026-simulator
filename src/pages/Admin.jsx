import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabase.js'
 
const TIMES_SERIE_A = [
  'Atlético Mineiro','Botafogo','Flamengo','Fluminense','Vasco',
  'Palmeiras','São Paulo','Corinthians','Santos','Grêmio',
  'Internacional','Cruzeiro','Atlético-GO','Bahia','Vitória',
  'Ceará','Fortaleza','Mirassol','Remo','Chapecoense'
]
 
const TIMES_SERIE_B = [
  'América-MG','Athletic Club','Atlético-GO','Avaí','Botafogo-SP',
  'CRB','Ceará','Criciúma','Cuiabá','Fortaleza',
  'Goiás','Juventude','Londrina','Náutico','Novorizontino',
  'Operário-PR','Ponte Preta','São Bernardo','Sport','Vila Nova'
]
 
const SENHA = 'ic2026ufj'
 
function makeRows(times) {
  return times.map((time, i) => ({
    time, pos: i + 1, p: 0, j: 0, v: 0, e: 0, d: 0, gp: 0, gc: 0, sg: 0
  }))
}
 
export default function Admin() {
  const navigate = useNavigate()
  const [auth, setAuth] = useState(false)
  const [senha, setSenha] = useState('')
  const [serie, setSerie] = useState('A')
  const [rodada, setRodada] = useState(1)
  const [rows, setRows] = useState(makeRows(TIMES_SERIE_A))
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')
 
  function login() {
    if (senha === SENHA) setAuth(true)
    else setMsg('Senha incorreta.')
  }
 
  function handleSerieChange(s) {
    setSerie(s)
    setRows(makeRows(s === 'A' ? TIMES_SERIE_A : TIMES_SERIE_B))
  }
 
  function updateRow(i, field, val) {
    const updated = [...rows]
    updated[i] = { ...updated[i], [field]: parseInt(val) || 0 }
    updated[i].sg = updated[i].gp - updated[i].gc
    setRows(updated)
  }
 
  function moveRow(i, dir) {
    const updated = [...rows]
    const swap = i + dir
    if (swap < 0 || swap >= updated.length) return
    ;[updated[i], updated[swap]] = [updated[swap], updated[i]]
    updated.forEach((r, idx) => r.pos = idx + 1)
    setRows(updated)
  }
 
  async function save() {
    setSaving(true)
    setMsg('')
    const payload = rows.map(r => ({ ...r, serie, rodada }))
    const { error } = await supabase
      .from('oficial')
      .upsert(payload, { onConflict: 'serie,rodada,time' })
    setSaving(false)
    setMsg(error ? '❌ Erro: ' + error.message : '✅ Salvo com sucesso!')
  }
 
  if (!auth) return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl p-8 w-full max-w-sm">
        <h1 className="text-xl font-bold text-white mb-6 text-center">🔒 Admin</h1>
        <input
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={e => setSenha(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && login()}
          className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white mb-4 focus:outline-none focus:border-green-500"
        />
        <button onClick={login} className="w-full bg-green-600 hover:bg-green-500 text-white font-medium py-3 rounded-lg transition-all">
          Entrar
        </button>
        {msg && <p className="text-red-400 text-sm mt-3 text-center">{msg}</p>}
      </div>
    </div>
  )
 
  return (
    <div className="min-h-screen px-4 py-8 max-w-6xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => navigate('/')} className="text-gray-400 hover:text-white text-sm">← Voltar</button>
        <h1 className="text-2xl font-bold text-white">Admin · Tabela Oficial</h1>
      </div>
 
      <div className="flex flex-wrap gap-4 mb-6">
        <div>
          <label className="text-gray-400 text-sm block mb-1">Série</label>
          <select
            value={serie}
            onChange={e => handleSerieChange(e.target.value)}
            className="bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none"
          >
            <option value="A">Série A</option>
            <option value="B">Série B</option>
          </select>
        </div>
        <div>
          <label className="text-gray-400 text-sm block mb-1">Rodada</label>
          <input
            type="number" min="1" max="38"
            value={rodada}
            onChange={e => setRodada(parseInt(e.target.value) || 1)}
            className="bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 text-white w-24 focus:outline-none"
          />
        </div>
      </div>
 
      <div className="bg-gray-900 rounded-2xl overflow-hidden border border-gray-800 mb-6">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-gray-400 text-xs uppercase tracking-wider border-b border-gray-800">
                <th className="px-3 py-3 text-left">Pos</th>
                <th className="px-3 py-3 text-left">Time</th>
                <th className="px-3 py-3 text-center">P</th>
                <th className="px-3 py-3 text-center">J</th>
                <th className="px-3 py-3 text-center">V</th>
                <th className="px-3 py-3 text-center">E</th>
                <th className="px-3 py-3 text-center">D</th>
                <th className="px-3 py-3 text-center">GP</th>
                <th className="px-3 py-3 text-center">GC</th>
                <th className="px-3 py-3 text-center">SG</th>
                <th className="px-3 py-3 text-center">↕</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={row.time} className="border-t border-gray-800 hover:bg-gray-800/50">
                  <td className="px-3 py-2 text-gray-400 font-mono">{row.pos}</td>
                  <td className="px-3 py-2 font-medium text-white">{row.time}</td>
                  {['p','j','v','e','d','gp','gc'].map(f => (
                    <td key={f} className="px-1 py-1">
                      <input
                        type="number" min="0"
                        value={row[f]}
                        onChange={e => updateRow(i, f, e.target.value)}
                        className="w-14 bg-gray-800 border border-gray-700 rounded px-2 py-1 text-white text-center focus:outline-none focus:border-green-500"
                      />
                    </td>
                  ))}
                  <td className={`px-3 py-2 text-center font-medium ${row.sg > 0 ? 'text-green-400' : row.sg < 0 ? 'text-red-400' : 'text-gray-400'}`}>
                    {row.sg > 0 ? '+' : ''}{row.sg}
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex gap-1">
                      <button onClick={() => moveRow(i, -1)} className="text-gray-400 hover:text-white px-1">↑</button>
                      <button onClick={() => moveRow(i, 1)} className="text-gray-400 hover:text-white px-1">↓</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
 
      <div className="flex items-center gap-4">
        <button
          onClick={save}
          disabled={saving}
          className="bg-green-600 hover:bg-green-500 disabled:bg-gray-700 text-white font-medium px-8 py-3 rounded-lg transition-all"
        >
          {saving ? 'Salvando...' : 'Salvar rodada'}
        </button>
        {msg && <p className={`text-sm ${msg.includes('✅') ? 'text-green-400' : 'text-red-400'}`}>{msg}</p>}
      </div>
    </div>
  )
}