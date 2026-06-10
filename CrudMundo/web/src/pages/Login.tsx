import { useState } from 'react';

// Tipagem para receber a função que libera o acesso lá do App.tsx
interface LoginProps {
  onLogin: () => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState(false);

  const fazerLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simulação rápida de autenticação (Hardcoded)
    if (usuario === 'admin' && senha === '1234') {
      onLogin(); // Chama a função que libera a tela
    } else {
      setErro(true);
      setSenha(''); // Limpa a senha se errar
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-slate-100">
        <div className="text-center mb-8">
          <h1 className="text-4xl text-blue-600 mb-2">🌍</h1>
          <h2 className="text-2xl font-bold text-slate-800">CRUD Mundo</h2>
          <p className="text-slate-500 text-sm mt-1">Faça login para acessar o painel</p>
        </div>

        <form onSubmit={fazerLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Usuário</label>
            <input 
              required 
              type="text" 
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              placeholder="Digite 'admin'"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Senha</label>
            <input 
              required 
              type="password" 
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              placeholder="Digite '1234'"
            />
          </div>

          {erro && (
            <p className="text-red-500 text-sm text-center font-medium bg-red-50 p-2 rounded">
              Usuário ou senha incorretos!
            </p>
          )}

          <button 
            type="submit" 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold p-3 rounded-lg transition shadow-md mt-4"
          >
            Entrar no Sistema
          </button>
        </form>
      </div>
    </div>
  );
}