import { useEffect, useState } from 'react';
import axios from 'axios';

interface Continente {
  id: number;
  nome: string;
}

interface Pais {
  id: number;
  nome: string;
  populacao: number;
  idioma_oficial: string;
  moeda: string;
  id_continente: number;
  continente?: Continente; // Vem no include do Prisma!
}

export default function Paises() {
  const [paises, setPaises] = useState<Pais[]>([]);
  const [continentes, setContinentes] = useState<Continente[]>([]); // Para o dropdown
  
  // Estados do Modal de Criação
  const [modalAberto, setModalAberto] = useState(false);
  const [nomeNovo, setNomeNovo] = useState('');
  const [populacaoNova, setPopulacaoNova] = useState('');
  const [idiomaNovo, setIdiomaNovo] = useState('');
  const [moedaNova, setMoedaNova] = useState('');
  const [idContinenteNovo, setIdContinenteNovo] = useState('');

  // Estados do Modal de Edição
  const [modalEditAberto, setModalEditAberto] = useState(false);
  const [idEdit, setIdEdit] = useState<number | null>(null);
  const [nomeEdit, setNomeEdit] = useState('');
  const [populacaoEdit, setPopulacaoEdit] = useState('');
  const [idiomaEdit, setIdiomaEdit] = useState('');
  const [moedaEdit, setMoedaEdit] = useState('');
  const [idContinenteEdit, setIdContinenteEdit] = useState('');

  // Estados do Modal de Info da API Externa
  const [modalInfoAberto, setModalInfoAberto] = useState(false);
  const [infoPais, setInfoPais] = useState<any>(null);
  const [carregandoInfo, setCarregandoInfo] = useState(false);

  // Busca inicial
  useEffect(() => {
    // Busca os países
    axios.get('http://localhost:3333/paises')
      .then(resposta => setPaises(resposta.data))
      .catch(erro => console.error("Erro ao buscar países:", erro));
      
    // Busca os continentes para preencher a caixinha de seleção (Select)
    axios.get('http://localhost:3333/continentes')
      .then(resposta => setContinentes(resposta.data))
      .catch(erro => console.error("Erro ao buscar continentes:", erro));
  }, []);

  const deletarPais = async (id: number) => {
    if (window.confirm("Tem certeza que deseja excluir este país?")) {
      try {
        await axios.delete(`http://localhost:3333/paises/${id}`);
        setPaises(paises.filter(p => p.id !== id));
      } catch (erro) {
        alert("Erro ao excluir. Verifique se existem cidades vinculadas a ele.");
      }
    }
  };

  const criarPais = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
       await axios.post('http://localhost:3333/paises', { 
        nome: nomeNovo, 
        populacao: Number(populacaoNova), 
        idioma_oficial: idiomaNovo, 
        moeda: moedaNova, 
        id_continente: Number(idContinenteNovo) 
      });
      // Como a API de criação não traz o continente aninhado, a gente recarrega a lista para a tabela ficar bonitinha
      const novaLista = await axios.get('http://localhost:3333/paises');
      setPaises(novaLista.data);
      
      setNomeNovo(''); setPopulacaoNova(''); setIdiomaNovo(''); setMoedaNova(''); setIdContinenteNovo('');
      setModalAberto(false);
    } catch (erro) { alert("Erro ao criar país."); }
  };

  const abrirModalEdit = (pais: Pais) => {
    setIdEdit(pais.id); setNomeEdit(pais.nome); setPopulacaoEdit(String(pais.populacao)); 
    setIdiomaEdit(pais.idioma_oficial); setMoedaEdit(pais.moeda); setIdContinenteEdit(String(pais.id_continente));
    setModalEditAberto(true);
  };

  const salvarEdicao = async (e: React.FormEvent) => {
    e.preventDefault();
    if (idEdit === null) return;
    try {
      await axios.put(`http://localhost:3333/paises/${idEdit}`, { 
        nome: nomeEdit, populacao: Number(populacaoEdit), idioma_oficial: idiomaEdit, moeda: moedaEdit, id_continente: Number(idContinenteEdit) 
      });
      const novaLista = await axios.get('http://localhost:3333/paises');
      setPaises(novaLista.data);
      setModalEditAberto(false);
    } catch (erro) { alert("Erro ao atualizar o país."); }
  };

  const verInfoExtra = async (id: number) => {
    setModalInfoAberto(true);
    setCarregandoInfo(true);
    setInfoPais(null);
    try {
      const resposta = await axios.get(`http://localhost:3333/paises/${id}/info`);
      setInfoPais(resposta.data);
    } catch (erro) {
      alert("Erro ao buscar dados na API externa. O nome do país precisa ser válido.");
      setModalInfoAberto(false);
    } finally {
      setCarregandoInfo(false);
    }
  };

  return (
    <main className="flex-1 p-8 w-full">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-slate-800">Gerenciar Países</h2>
        <button onClick={() => setModalAberto(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition shadow-sm">
          + Novo País
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="p-4 font-semibold text-slate-600">ID</th>
              <th className="p-4 font-semibold text-slate-600">País</th>
              <th className="p-4 font-semibold text-slate-600">Continente</th>
              <th className="p-4 font-semibold text-slate-600">População</th>
              <th className="p-4 font-semibold text-slate-600">Ações</th>
            </tr>
          </thead>
          <tbody>
            {paises.map((pais) => (
              <tr key={pais.id} className="border-b border-gray-50 hover:bg-gray-50 transition">
                <td className="p-4 text-slate-600">#{pais.id}</td>
                <td className="p-4 font-medium text-slate-800">
                  {pais.nome} <br/><span className="text-xs text-slate-400 font-normal">{pais.idioma_oficial} • {pais.moeda}</span>
                </td>
                {/* Aqui o React exibe o nome do continente puxado pelo Prisma! */}
                <td className="p-4 text-slate-600">{pais.continente?.nome}</td>
                <td className="p-4 text-slate-600">{pais.populacao.toLocaleString('pt-BR')}</td>
                <td className="p-4 flex gap-2 items-center h-full pt-6">
                  <button onClick={() => verInfoExtra(pais.id)} className="text-emerald-600 hover:text-emerald-800 text-sm font-medium">Bandeira</button>
                  <button onClick={() => abrirModalEdit(pais)} className="text-blue-600 hover:text-blue-800 text-sm font-medium">Editar</button>
                  <button onClick={() => deletarPais(pais.id)} className="text-red-600 hover:text-red-800 text-sm font-medium">Excluir</button>
                </td>
              </tr>
            ))}
            {paises.length === 0 && (
              <tr><td colSpan={5} className="p-8 text-center text-slate-500">Nenhum país cadastrado.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL DE CRIAÇÃO */}
      {modalAberto && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
            <h3 className="text-2xl font-bold mb-6 text-slate-800">Novo País</h3>
            <form onSubmit={criarPais} className="space-y-4">
              <input required type="text" value={nomeNovo} onChange={(e) => setNomeNovo(e.target.value)} className="w-full border border-gray-300 p-2 rounded-lg" placeholder="Nome do País" />
              <input required type="number" value={populacaoNova} onChange={(e) => setPopulacaoNova(e.target.value)} className="w-full border border-gray-300 p-2 rounded-lg" placeholder="População (apenas números)" />
              <div className="flex gap-2">
                <input required type="text" value={idiomaNovo} onChange={(e) => setIdiomaNovo(e.target.value)} className="w-1/2 border border-gray-300 p-2 rounded-lg" placeholder="Idioma" />
                <input required type="text" value={moedaNova} onChange={(e) => setMoedaNova(e.target.value)} className="w-1/2 border border-gray-300 p-2 rounded-lg" placeholder="Moeda" />
              </div>
              <select required value={idContinenteNovo} onChange={(e) => setIdContinenteNovo(e.target.value)} className="w-full border border-gray-300 p-2 rounded-lg bg-white">
                <option value="" disabled>Selecione um Continente...</option>
                {continentes.map(c => (
                  <option key={c.id} value={c.id}>{c.nome}</option>
                ))}
              </select>
              <div className="flex justify-end gap-3 pt-4"><button type="button" onClick={() => setModalAberto(false)} className="px-4 py-2 text-slate-600">Cancelar</button><button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg">Salvar</button></div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL DE EDIÇÃO */}
      {modalEditAberto && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
            <h3 className="text-2xl font-bold mb-6 text-slate-800">Editar País</h3>
            <form onSubmit={salvarEdicao} className="space-y-4">
              <input required type="text" value={nomeEdit} onChange={(e) => setNomeEdit(e.target.value)} className="w-full border border-gray-300 p-2 rounded-lg" />
              <input required type="number" value={populacaoEdit} onChange={(e) => setPopulacaoEdit(e.target.value)} className="w-full border border-gray-300 p-2 rounded-lg" />
              <div className="flex gap-2">
                <input required type="text" value={idiomaEdit} onChange={(e) => setIdiomaEdit(e.target.value)} className="w-1/2 border border-gray-300 p-2 rounded-lg" />
                <input required type="text" value={moedaEdit} onChange={(e) => setMoedaEdit(e.target.value)} className="w-1/2 border border-gray-300 p-2 rounded-lg" />
              </div>
              <select required value={idContinenteEdit} onChange={(e) => setIdContinenteEdit(e.target.value)} className="w-full border border-gray-300 p-2 rounded-lg bg-white">
                <option value="" disabled>Selecione um Continente...</option>
                {continentes.map(c => (
                  <option key={c.id} value={c.id}>{c.nome}</option>
                ))}
              </select>
              <div className="flex justify-end gap-3 pt-4"><button type="button" onClick={() => setModalEditAberto(false)} className="px-4 py-2 text-slate-600">Cancelar</button><button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg">Atualizar</button></div>
            </form>
          </div>
        </div>
      )}
      {/* MODAL DE INFO EXTERNA (REST COUNTRIES) */}
      {modalInfoAberto && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-sm text-center">
            <h3 className="text-2xl font-bold mb-4 text-slate-800">Dados Globais do País</h3>
            
            {carregandoInfo ? (
              <p className="text-slate-500 my-8">Consultando API externa...</p>
            ) : infoPais ? (
              <div className="flex flex-col items-center gap-3 my-6">
                <img src={infoPais.bandeira_url} alt={`Bandeira`} className="w-32 h-auto rounded shadow-sm border border-gray-200" />
                <p className="text-lg font-semibold mt-2">{infoPais.pais_local}</p>
                <p className="text-slate-600"><strong>Capital:</strong> {infoPais.capital}</p>
                <p className="text-slate-600"><strong>Região:</strong> {infoPais.regiao_global}</p>
              </div>
            ) : null}

            <div className="flex justify-center pt-4 border-t border-gray-100 mt-2">
              <button onClick={() => setModalInfoAberto(false)} className="bg-slate-200 hover:bg-slate-300 text-slate-800 px-6 py-2 rounded-lg transition font-medium">
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}