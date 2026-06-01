import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabase.js'
 
function getStyle(status) {
  if (!status) return { bg: '', text: 'text-gray-300', border: '' }
  if (status.includes('Campeão'))           return { bg: 'bg-yellow-400/20', text: 'text-yellow-300', border: 'border-l-4 border-yellow-400' }
  if (status.includes('Acesso Direto'))     return { bg: 'bg-green-400/10',  text: 'text-green-300',  border: 'border-l-4 border-green-500' }
  if (status.includes('Play-offs'))         return { bg: 'bg-blue-400/10',   text: 'text-blue-300',   border: 'border-l-4 border-blue-500'  }
  if (status.includes('Libertadores'))      return { bg: 'bg-green-400/10',  text: 'text-green-300',  border: 'border-l-4 border-green-500' }
  if (status.includes('Pré-Libertadores'))  return { bg: 'bg-yellow-400/10', text: 'text-yellow-200', border: 'border-l-4 border-yellow-500' }
  if (status.includes('Sul-Americana'))     return { bg: 'bg-blue-400/10',   text: 'text-blue-300',   border: 'border-l-4 border-blue-500'  }
  if (status.includes('Rebaixamento'))      return { bg: 'bg-red-400/10',    text: 'text-red-300',    border: 'border-l-4 border-red-500'   }
  return { bg: '', text: 'text-gray-300', border: '' }
}
 
function pct(val) {
  if (val == null) return '—'
  return (val * 100).toFixed(1) + '%'
}
 
export default function Serie({ serie }) {
  const navigate = useNavigate()
  const [rodadas, setRodadas] = useState([])
  const [rodadaSel, setRodadaSel] = useState(null)
  const [oficial, setOficial] = useState([])
  const [projecao, setProjecao] = useState([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('oficial')
 
  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from('oficial')
        .select('rodada')
        .eq('serie', serie)
        .order('rodada', { ascending: true })
      if (data && data.length > 0) {
        const unique = [...new Set(data.map(r => r.rodada))]
        setRodadas(unique)
        setRodadaSel(unique[unique.length - 1])
      }
      setLoading(false)
    }
    load()
  }, [serie])
 
  useEffect(() => {
    if (!rodadaSel) return
    async function load() {
      setLoading(true)
      const [{ data: of }, { data: pr }] = await Promise.all([
        supabase.from('oficial').select('*').eq('serie', serie).eq('rodada', rodadaSel).order('pos'),
        supabase.from('projecao').select('*').eq('serie', serie).eq('rodada', rodadaSel).order('pos'),
      ])
      setOficial(of || [])
      setProjecao(pr || [])
      setLoading(false)
    }
    load()
  }, [rodadaSel, serie])
 
  const accentBorder = serie === 'A' ? 'border-green-500' : 'border-yellow-500'
  const isB = serie === 'B'
 
  return (
    <div className="min-h-screen px-4 py-8 max-w-5xl mx-auto">
 
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => navigate('/')} className="text-gray-400 hover:text-white text-sm">← Voltar</button>
        <h1 className="text-2xl font-bold text-white">Brasileirão Série {serie} 2026</h1>
      </div>
 
      <div className="mb-8">
        <p className="text-gray-400 text-sm mb-3">Selecione a rodada:</p>
        <div className="flex flex-wrap gap-2">
          {rodadas.map(r => (
            <button
              key={r}
              onClick={() => setRodadaSel(r)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all border ${
                rodadaSel === r
                  ? `bg-gray-800 ${accentBorder} text-white`
                  : 'bg-gray-900 border-gray-700 text-gray-400 hover:text-white hover:border-gray-500'
              }`}
            >
              R{r}
            </button>
          ))}
        </div>
      </div>
 
      {!loading && rodadas.length === 0 && (
        <div className="text-center py-24 text-gray-500">
          <p className="text-4xl mb-4">📭</p>
          <p>Nenhuma rodada disponível ainda.</p>
          <p className="text-sm mt-2">Adicione dados no painel admin.</p>
        </div>
      )}
 
      {rodadaSel && (
        <>
          <div className="flex gap-1 mb-6 bg-gray-900 rounded-xl p-1 w-fit">
            {['oficial', 'projecao'].map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
                  tab === t ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                {t === 'oficial' ? '📋 Tabela Oficial' : '🔮 Projeção Monte Carlo'}
              </button>
            ))}
          </div>
 
          {loading ? (
            <div className="text-center py-24 text-gray-500">Carregando...</div>
          ) : (
            <>
              {tab === 'oficial' && (
                <div className="bg-gray-900 rounded-2xl overflow-hidden border border-gray-800">
                  <div className="px-6 py-4 border-b border-gray-800">
                    <h2 className="font-semibold text-white">Classificação Oficial · Rodada {rodadaSel}</h2>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-gray-400 text-xs uppercase tracking-wider">
                          <th className="px-4 py-3 text-left w-10">#</th>
                          <th className="px-4 py-3 text-left">Time</th>
                          <th className="px-4 py-3 text-center">P</th>
                          <th className="px-4 py-3 text-center">J</th>
                          <th className="px-4 py-3 text-center">V</th>
                          <th className="px-4 py-3 text-center">E</th>
                          <th className="px-4 py-3 text-center">D</th>
                          <th className="px-4 py-3 text-center">GP</th>
                          <th className="px-4 py-3 text-center">GC</th>
                          <th className="px-4 py-3 text-center">SG</th>
                        </tr>
                      </thead>
                      <tbody>
                        {oficial.map((row) => {
                          const isChamp   = row.pos === 1
                          const isAccess  = isB ? row.pos === 2 : (row.pos >= 2 && row.pos <= 4)
                          const isPreLib  = !isB && row.pos === 5
                          const isSulAm   = !isB && row.pos >= 6 && row.pos <= 12
                          const isPlayoff = isB && row.pos >= 3 && row.pos <= 6
                          const isRel     = row.pos >= 17
                          const rowBg      = isChamp ? 'bg-yellow-400/5' : isAccess ? 'bg-green-400/5' : isPreLib ? 'bg-yellow-400/5' : isSulAm ? 'bg-blue-400/5' : isPlayoff ? 'bg-blue-400/5' : isRel ? 'bg-red-400/5' : ''
                          const leftBorder = isChamp ? 'border-l-4 border-yellow-400' : isAccess ? 'border-l-4 border-green-500' : isPreLib ? 'border-l-4 border-yellow-500' : isSulAm ? 'border-l-4 border-blue-500' : isPlayoff ? 'border-l-4 border-blue-500' : isRel ? 'border-l-4 border-red-500' : 'border-l-4 border-transparent'
                          return (
                            <tr key={row.time} className={`border-t border-gray-800 ${rowBg} ${leftBorder}`}>
                              <td className="px-4 py-3 text-gray-400 font-mono">{row.pos}</td>
                              <td className="px-4 py-3 font-medium text-white">{row.time}</td>
                              <td className="px-4 py-3 text-center font-bold text-white">{row.p}</td>
                              <td className="px-4 py-3 text-center text-gray-300">{row.j}</td>
                              <td className="px-4 py-3 text-center text-gray-300">{row.v}</td>
                              <td className="px-4 py-3 text-center text-gray-300">{row.e}</td>
                              <td className="px-4 py-3 text-center text-gray-300">{row.d}</td>
                              <td className="px-4 py-3 text-center text-gray-300">{row.gp}</td>
                              <td className="px-4 py-3 text-center text-gray-300">{row.gc}</td>
                              <td className={`px-4 py-3 text-center font-medium ${row.sg > 0 ? 'text-green-400' : row.sg < 0 ? 'text-red-400' : 'text-gray-400'}`}>
                                {row.sg > 0 ? '+' : ''}{row.sg}
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                  <div className="px-6 py-3 border-t border-gray-800 flex flex-wrap gap-4 text-xs text-gray-400">
                    <span><span className="inline-block w-2 h-2 rounded-full bg-yellow-400 mr-1"></span>Campeão</span>
                    {isB ? <>
                      <span><span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-1"></span>Acesso direto (2º)</span>
                      <span><span className="inline-block w-2 h-2 rounded-full bg-blue-500 mr-1"></span>Play-offs (3º–6º)</span>
                    </> : <>
                      <span><span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-1"></span>Libertadores (2º–4º)</span>
                      <span><span className="inline-block w-2 h-2 rounded-full bg-yellow-500 mr-1"></span>Pré-Libertadores (5º)</span>
                      <span><span className="inline-block w-2 h-2 rounded-full bg-blue-500 mr-1"></span>Sul-Americana (6º–12º)</span>
                    </>}
                    <span><span className="inline-block w-2 h-2 rounded-full bg-red-500 mr-1"></span>Rebaixamento (17º–20º)</span>
                  </div>
                </div>
              )}
 
              {tab === 'projecao' && (
                <div className="bg-gray-900 rounded-2xl overflow-hidden border border-gray-800">
                  <div className="px-6 py-4 border-b border-gray-800">
                    <h2 className="font-semibold text-white">Projeção Monte Carlo · Rodada {rodadaSel}</h2>
                    <p className="text-gray-400 text-xs mt-1">10.000 simulações · Poisson + Gaussian Phase Factor</p>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-gray-400 text-xs uppercase tracking-wider">
                          <th className="px-4 py-3 text-left w-10">#</th>
                          <th className="px-4 py-3 text-left">Time</th>
                          <th className="px-4 py-3 text-center">Pts Reais</th>
                          <th className="px-4 py-3 text-center">Pts Proj.</th>
                          <th className="px-4 py-3 text-center">Status</th>
                          <th className="px-4 py-3 text-center">% Título</th>
                          <th className="px-4 py-3 text-center">{isB ? '% Acesso' : '% Libert.'}</th>
                          {isB && <th className="px-4 py-3 text-center">% Play-offs</th>}
                          <th className="px-4 py-3 text-center">% Queda</th>
                        </tr>
                      </thead>
                      <tbody>
                        {projecao.map(row => {
                          const style = getStyle(row.status)
                          return (
                            <tr key={row.time} className={`border-t border-gray-800 ${style.bg} ${style.border}`}>
                              <td className="px-4 py-3 text-gray-400 font-mono">{row.pos}</td>
                              <td className={`px-4 py-3 font-medium ${style.text}`}>{row.time}</td>
                              <td className="px-4 py-3 text-center text-gray-300">{row.pts_reais}</td>
                              <td className="px-4 py-3 text-center font-bold text-white">{row.pts_proj?.toFixed(1)}</td>
                              <td className="px-4 py-3 text-center text-xs">{row.status}</td>
                              <td className="px-4 py-3 text-center text-yellow-300">{pct(row.p_campeao)}</td>
                              <td className="px-4 py-3 text-center text-green-300">{pct(row.p_acesso)}</td>
                              {isB && <td className="px-4 py-3 text-center text-blue-300">{pct(row.p_playoffs)}</td>}
                              <td className="px-4 py-3 text-center text-red-300">{pct(row.p_rebaixamento)}</td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  )
}