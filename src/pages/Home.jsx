import { useNavigate } from 'react-router-dom'

export default function Home() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-16">

      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-white mb-3">
          Simulador Brasileirão 2026
        </h1>
        <p className="text-gray-400 text-lg">
          Monte Carlo · Poisson · 10.000 simulações por rodada
        </p>
      </div>

      <div className="w-full max-w-sm">
        <button
          onClick={() => navigate('/serie-a')}
          className="w-full bg-gray-900 border border-green-500 rounded-2xl p-8
                     hover:bg-gray-800 hover:border-green-400 transition-all
                     flex flex-col items-center gap-3 group"
        >
          <span className="text-4xl">🏆</span>
          <div className="text-center">
            <p className="text-white font-bold text-2xl">Série A</p>
            <p className="text-gray-400 text-sm mt-1">
              20 times · 38 rodadas
            </p>
          </div>
          <span className="text-green-500 text-sm font-medium
                           group-hover:text-green-400 mt-1">
            Ver simulações →
          </span>
        </button>
      </div>

      <p className="text-gray-600 text-xs mt-16 text-center">
        Iniciação Científica · UFJ · Data Science
      </p>
    </div>
  )
}