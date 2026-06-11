import { useState } from 'react';
import Continentes from './pages/Continentes';
import Paises from './pages/Paises';
import Cidades from './pages/Cidades';
import Login from './pages/Login';

export default function App() {
  // Estado para sabermos qual botão do menu está selecionado
  const [abaAtiva, setAbaAtiva] = useState('continentes');
  const [autenticado, setAutenticado] = useState(false);
// Se não estiver autenticado, a tela inteira vira a tela de Login!
  if (!autenticado) {
    return <Login onLogin={() => setAutenticado(true)} />;
  }
  return (
    <div className="min-h-screen bg-gray-50 flex relative">
      
      {/* Menu Lateral que controla as Abas */}
      <aside className="w-64 bg-slate-800 text-white p-6">
        <h1 className="text-2xl font-bold mb-8 flex items-center gap-2">🌍 CRUD Mundo</h1>
        <nav className="space-y-2">
          <button 
            onClick={() => setAbaAtiva('continentes')} 
            className={`w-full text-left p-3 rounded-lg font-medium transition ${abaAtiva === 'continentes' ? 'bg-slate-700 text-white' : 'text-slate-300 hover:bg-slate-700'}`}
          >
            Continentes
          </button>
          <button 
            onClick={() => setAbaAtiva('paises')} 
            className={`w-full text-left p-3 rounded-lg font-medium transition ${abaAtiva === 'paises' ? 'bg-slate-700 text-white' : 'text-slate-300 hover:bg-slate-700'}`}
          >
            Países
          </button>
          <button 
            onClick={() => setAbaAtiva('cidades')} 
            className={`w-full text-left p-3 rounded-lg font-medium transition ${abaAtiva === 'cidades' ? 'bg-slate-700 text-white' : 'text-slate-300 hover:bg-slate-700'}`}
          >
            Cidades

            
          </button>
          
        </nav>
        
        {/* Botão de Sair no final do Menu */}
        <div className="absolute bottom-6 w-52">
          <button 
            onClick={() => setAutenticado(false)} 
            className="w-full text-left p-3 rounded-lg font-medium text-red-400 hover:bg-slate-700 hover:text-red-300 transition"
          >
            🚪 Sair do Sistema
          </button>
        </div>
      </aside>

      {/* Aqui a mágica acontece: chamamos as telas dependendo de qual aba está ativa! */}
      {abaAtiva === 'continentes' && <Continentes />}
      
      {abaAtiva === 'paises' && <Paises />}

      {abaAtiva === 'cidades' && <Cidades />}

    </div>
  );
}