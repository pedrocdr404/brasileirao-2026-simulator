import { useNavigate } from 'react-router-dom'

export default function Home() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      
      {/* Header */}
      <div className="text-center mb-16">
        <div className="text-5xl mb-4">🇧🇷</div>
        <h1 className="text-4xl font-bold text-white mb-3">
          Brasileirão 2026
        </h1>
        <p className="text-gray-400 text-lg">
          Simulador Monte Carlo · Projeções por rodada
        </p>
      </div>

      {/* Cards */}
      <div className="flex flex-col sm:flex-row gap-6 w-full max-w-2xl">
        
        <button
          onClick={() => navigate('/serie-a')}
          className="flex-1 bg-gray-900 border border-gray-700 hover:border-green-500 hover:bg-gray-800 rounded-2xl p-8 text-center transition-all duration-200 cursor-pointer group"
        >
          <div className="text-4xl mb-4">🏆</div>
          <h2 className="text-2xl font-bold text-white mb-2">Série A</h2>
          <p className="text-gray-400 text-sm">
            20 times · 38 rodadas
          </p>
          <div className="mt-6 text-green-400 text-sm font-medium group-hover:text-green-300">
            Ver simulação →
          </div>
        </button>

        <button
          onClick={() => navigate('/serie-b')}
          className="flex-1 bg-gray-900 border border-gray-700 hover:border-yellow-500 hover:bg-gray-800 rounded-2xl p-8 text-center transition-all duration-200 cursor-pointer group"
        >
          <div className="text-4xl mb-4">⚽</div>
          <h2 className="text-2xl font-bold text-white mb-2">Série B</h2>
          <p className="text-gray-400 text-sm">
            20 times · 38 rodadas
          </p>
          <div className="mt-6 text-yellow-400 text-sm font-medium group-hover:text-yellow-300">
            Ver simulação →
          </div>
        </button>

      </div>

      {/* Footer */}
      <p className="text-gray-600 text-xs mt-16">
        Iniciação Científica · UFJ · Data Science
      </p>

    </div>
  )
}