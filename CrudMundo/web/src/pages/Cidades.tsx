import { useEffect, useState } from 'react';
import axios from 'axios';

interface Pais {
  id: number;
  nome: string;
}

interface Cidade {
  id: number;
  nome: string;
  populacao: number;
  latitude: number;
  longitude: number;
  id_pais: number;
  pais?: Pais; // Vem no include do Prisma!
}

export default function Cidades() {
  const [cidades, setCidades] = useState<Cidade[]>([]);
  const [paises, setPaises] = useState<Pais[]>([]); // Para o dropdown
  
  // Estados do Modal de Criação
  const [modalAberto, setModalAberto] = useState(false);
  const [nomeNovo, setNomeNovo] = useState('');
  const [populacaoNova, setPopulacaoNova] = useState('');
  const [latitudeNova, setLatitudeNova] = useState('');
  const [longitudeNova, setLongitudeNova] = useState('');
  const [idPaisNovo, setIdPaisNovo] = useState('');

  // Estados do Modal de Edição
  const [modalEditAberto, setModalEditAberto] = useState(false);
  const [idEdit, setIdEdit] = useState<number | null>(null);
  const [nomeEdit, setNomeEdit] = useState('');
  const [populacaoEdit, setPopulacaoEdit] = useState('');
  const [latitudeEdit, setLatitudeEdit] = useState('');
  const [longitudeEdit, setLongitudeEdit] = useState('');
  const [idPaisEdit, setIdPaisEdit] = useState('');

  // Estados da API de Clima Externa
  const [modalClimaAberto, setModalClimaAberto] = useState(false);
  const [infoClima, setInfoClima] = useState<any>(null);
  const [carregandoClima, setCarregandoClima] = useState(false);

  useEffect(() => {
    axios.get('http://localhost:3333/cidades').then(res => setCidades(res.data));
    axios.get('http://localhost:3333/paises').then(res => setPaises(res.data));
  }, []);

  const deletarCidade = async (id: number) => {
    if (window.confirm("Tem certeza que deseja excluir esta cidade?")) {
      try {
        await axios.delete(`http://localhost:3333/cidades/${id}`);
        setCidades(cidades.filter(c => c.id !== id));
      } catch (erro) { alert("Erro ao excluir."); }
    }
  };

  const criarCidade = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3333/cidades', { 
        nome: nomeNovo, populacao: Number(populacaoNova), 
        latitude: Number(latitudeNova), longitude: Number(longitudeNova), id_pais: Number(idPaisNovo) 
      });
      const novaLista = await axios.get('http://localhost:3333/cidades');
      setCidades(novaLista.data);
      setNomeNovo(''); setPopulacaoNova(''); setLatitudeNova(''); setLongitudeNova(''); setIdPaisNovo(''); setModalAberto(false);
    } catch (erro) { alert("Erro ao criar cidade."); }
  };

  const abrirModalEdit = (cidade: Cidade) => {
    setIdEdit(cidade.id); setNomeEdit(cidade.nome); setPopulacaoEdit(String(cidade.populacao)); 
    setLatitudeEdit(String(cidade.latitude)); setLongitudeEdit(String(cidade.longitude)); setIdPaisEdit(String(cidade.id_pais));
    setModalEditAberto(true);
  };

  const salvarEdicao = async (e: React.FormEvent) => {
    e.preventDefault();
    if (idEdit === null) return;
    try {
      await axios.put(`http://localhost:3333/cidades/${idEdit}`, { 
        nome: nomeEdit, populacao: Number(populacaoEdit), latitude: Number(latitudeEdit), longitude: Number(longitudeEdit), id_pais: Number(idPaisEdit) 
      });
      const novaLista = await axios.get('http://localhost:3333/cidades');
      setCidades(novaLista.data);
      setModalEditAberto(false);
    } catch (erro) { alert("Erro ao atualizar."); }
  };

  // Função que busca o CLIMA
  const verClima = async (id: number) => {
    setModalClimaAberto(true);
    setCarregandoClima(true);
    setInfoClima(null);
    try {
      const resposta = await axios.get(`http://localhost:3333/cidades/${id}/clima`);
      setInfoClima(resposta.data);
    } catch (erro) {
      alert("Erro ao buscar o clima. A chave da API pode estar inválida ou inativa.");
      setModalClimaAberto(false);
    } finally {
      setCarregandoClima(false);
    }
  };

  return (
    <main className="flex-1 p-8 w-full">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-slate-800">Gerenciar Cidades</h2>
        <button onClick={() => setModalAberto(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition shadow-sm">
          + Nova Cidade
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="p-4 font-semibold text-slate-600">ID</th>
              <th className="p-4 font-semibold text-slate-600">Cidade</th>
              <th className="p-4 font-semibold text-slate-600">País</th>
              <th className="p-4 font-semibold text-slate-600">Coordenadas</th>
              <th className="p-4 font-semibold text-slate-600">Ações</th>
            </tr>
          </thead>
          <tbody>
            {cidades.map((cidade) => (
              <tr key={cidade.id} className="border-b border-gray-50 hover:bg-gray-50 transition">
                <td className="p-4 text-slate-600">#{cidade.id}</td>
                <td className="p-4 font-medium text-slate-800">
                  {cidade.nome} <br/><span className="text-xs text-slate-400 font-normal">Pop: {cidade.populacao.toLocaleString('pt-BR')}</span>
                </td>
                <td className="p-4 text-slate-600">{cidade.pais?.nome}</td>
                <td className="p-4 text-slate-500 text-sm">Lat: {cidade.latitude} <br/> Lon: {cidade.longitude}</td>
                <td className="p-4 flex gap-2 items-center h-full pt-6">
                  {/* Botão de Clima */}
                  <button onClick={() => verClima(cidade.id)} className="text-amber-500 hover:text-amber-700 text-sm font-medium">🌤️ Clima</button>
                  <button onClick={() => abrirModalEdit(cidade)} className="text-blue-600 hover:text-blue-800 text-sm font-medium">Editar</button>
                  <button onClick={() => deletarCidade(cidade.id)} className="text-red-600 hover:text-red-800 text-sm font-medium">Excluir</button>
                </td>
              </tr>
            ))}
            {cidades.length === 0 && <tr><td colSpan={5} className="p-8 text-center text-slate-500">Nenhuma cidade cadastrada.</td></tr>}
          </tbody>
        </table>
      </div>

      {/* MODAL DE CRIAÇÃO */}
      {modalAberto && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
            <h3 className="text-2xl font-bold mb-6 text-slate-800">Nova Cidade</h3>
            <form onSubmit={criarCidade} className="space-y-4">
              <input required type="text" value={nomeNovo} onChange={(e) => setNomeNovo(e.target.value)} className="w-full border border-gray-300 p-2 rounded-lg" placeholder="Nome da Cidade" />
              <input required type="number" value={populacaoNova} onChange={(e) => setPopulacaoNova(e.target.value)} className="w-full border border-gray-300 p-2 rounded-lg" placeholder="População" />
              <div className="flex gap-2">
                <input required type="number" step="any" value={latitudeNova} onChange={(e) => setLatitudeNova(e.target.value)} className="w-1/2 border border-gray-300 p-2 rounded-lg" placeholder="Latitude (ex: -23.1791)" />
                <input required type="number" step="any" value={longitudeNova} onChange={(e) => setLongitudeNova(e.target.value)} className="w-1/2 border border-gray-300 p-2 rounded-lg" placeholder="Longitude (ex: -45.8872)" />
              </div>
              <select required value={idPaisNovo} onChange={(e) => setIdPaisNovo(e.target.value)} className="w-full border border-gray-300 p-2 rounded-lg bg-white">
                <option value="" disabled>Selecione um País...</option>
                {paises.map(p => <option key={p.id} value={p.id}>{p.nome}</option>)}
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
            <h3 className="text-2xl font-bold mb-6 text-slate-800">Editar Cidade</h3>
            <form onSubmit={salvarEdicao} className="space-y-4">
              <input required type="text" value={nomeEdit} onChange={(e) => setNomeEdit(e.target.value)} className="w-full border border-gray-300 p-2 rounded-lg" />
              <input required type="number" value={populacaoEdit} onChange={(e) => setPopulacaoEdit(e.target.value)} className="w-full border border-gray-300 p-2 rounded-lg" />
              <div className="flex gap-2">
                <input required type="number" step="any" value={latitudeEdit} onChange={(e) => setLatitudeEdit(e.target.value)} className="w-1/2 border border-gray-300 p-2 rounded-lg" />
                <input required type="number" step="any" value={longitudeEdit} onChange={(e) => setLongitudeEdit(e.target.value)} className="w-1/2 border border-gray-300 p-2 rounded-lg" />
              </div>
              <select required value={idPaisEdit} onChange={(e) => setIdPaisEdit(e.target.value)} className="w-full border border-gray-300 p-2 rounded-lg bg-white">
                <option value="" disabled>Selecione um País...</option>
                {paises.map(p => <option key={p.id} value={p.id}>{p.nome}</option>)}
              </select>
              <div className="flex justify-end gap-3 pt-4"><button type="button" onClick={() => setModalEditAberto(false)} className="px-4 py-2 text-slate-600">Cancelar</button><button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg">Atualizar</button></div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL DO CLIMA (OPENWEATHERMAP) */}
      {modalClimaAberto && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-sm text-center">
            <h3 className="text-2xl font-bold mb-4 text-slate-800">Tempo Agora</h3>
            
            {carregandoClima ? (
              <p className="text-slate-500 my-8">Consultando satélites... 🛰️</p>
            ) : infoClima ? (
              <div className="flex flex-col items-center gap-2 my-6">
                <h4 className="text-xl font-semibold">{infoClima.cidade}</h4>
                <p className="text-5xl font-bold text-blue-500 my-2">{infoClima.temperatura_atual}</p>
                <p className="text-slate-600 capitalize">{infoClima.clima}</p>
                <div className="flex gap-4 mt-4 text-sm text-slate-500 border-t pt-4 w-full justify-center">
                  <p>Sensação: {infoClima.sensacao_termica}</p>
                  <p>Umidade: {infoClima.umidade}</p>
                </div>
              </div>
            ) : null}

            <div className="flex justify-center pt-4 border-t border-gray-100 mt-2">
              <button onClick={() => setModalClimaAberto(false)} className="bg-slate-200 hover:bg-slate-300 text-slate-800 px-6 py-2 rounded-lg transition font-medium">
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}