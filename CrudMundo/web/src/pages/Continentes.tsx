import { useEffect, useState } from 'react';
import axios from 'axios';

interface Continente {
  id: number;
  nome: string;
  descricao: string;
}

export default function Continentes() {
  const [continentes, setContinentes] = useState<Continente[]>([]);
  
  const [modalAberto, setModalAberto] = useState(false);
  const [nomeNovo, setNomeNovo] = useState('');
  const [descricaoNova, setDescricaoNova] = useState('');

  const [modalEditAberto, setModalEditAberto] = useState(false);
  const [idEdit, setIdEdit] = useState<number | null>(null);
  const [nomeEdit, setNomeEdit] = useState('');
  const [descricaoEdit, setDescricaoEdit] = useState('');

  useEffect(() => {
    axios.get('http://localhost:3333/continentes')
      .then(resposta => setContinentes(resposta.data))
      .catch(erro => console.error("Erro ao buscar:", erro));
  }, []);

  const deletarContinente = async (id: number) => {
    if (window.confirm("Tem certeza que deseja excluir este continente?")) {
      try {
        await axios.delete(`http://localhost:3333/continentes/${id}`);
        setContinentes(continentes.filter(c => c.id !== id));
      } catch (erro) {
        alert("Erro ao excluir. Verifique se existem países vinculados a ele.");
      }
    }
  };

  const criarContinente = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const resposta = await axios.post('http://localhost:3333/continentes', { nome: nomeNovo, descricao: descricaoNova });
      setContinentes([...continentes, resposta.data]);
      setNomeNovo(''); setDescricaoNova(''); setModalAberto(false);
    } catch (erro) { alert("Erro ao criar continente."); }
  };

  const abrirModalEdit = (continente: Continente) => {
    setIdEdit(continente.id); setNomeEdit(continente.nome); setDescricaoEdit(continente.descricao); setModalEditAberto(true);
  };

  const salvarEdicao = async (e: React.FormEvent) => {
    e.preventDefault();
    if (idEdit === null) return;
    try {
      const resposta = await axios.put(`http://localhost:3333/continentes/${idEdit}`, { nome: nomeEdit, descricao: descricaoEdit });
      setContinentes(continentes.map(c => c.id === idEdit ? resposta.data : c));
      setModalEditAberto(false);
    } catch (erro) { alert("Erro ao atualizar o continente."); }
  };

  return (
    <main className="flex-1 p-8 w-full">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-slate-800">Gerenciar Continentes</h2>
        <button onClick={() => setModalAberto(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition shadow-sm">
          + Novo Continente
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="p-4 font-semibold text-slate-600">ID</th>
              <th className="p-4 font-semibold text-slate-600">Nome</th>
              <th className="p-4 font-semibold text-slate-600">Descrição</th>
              <th className="p-4 font-semibold text-slate-600">Ações</th>
            </tr>
          </thead>
          <tbody>
            {continentes.map((continente) => (
              <tr key={continente.id} className="border-b border-gray-50 hover:bg-gray-50 transition">
                <td className="p-4 text-slate-600">#{continente.id}</td>
                <td className="p-4 font-medium text-slate-800">{continente.nome}</td>
                <td className="p-4 text-slate-500">{continente.descricao}</td>
                <td className="p-4 flex gap-2">
                  <button onClick={() => abrirModalEdit(continente)} className="text-blue-600 hover:text-blue-800 text-sm font-medium">Editar</button>
                  <button onClick={() => deletarContinente(continente.id)} className="text-red-600 hover:text-red-800 text-sm font-medium">Excluir</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL DE CRIAÇÃO */}
      {modalAberto && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
            <h3 className="text-2xl font-bold mb-6 text-slate-800">Novo Continente</h3>
            <form onSubmit={criarContinente} className="space-y-4">
              <input required type="text" value={nomeNovo} onChange={(e) => setNomeNovo(e.target.value)} className="w-full border border-gray-300 p-2 rounded-lg" placeholder="Nome" />
              <textarea required value={descricaoNova} onChange={(e) => setDescricaoNova(e.target.value)} className="w-full border border-gray-300 p-2 rounded-lg" placeholder="Descrição" rows={3} />
              <div className="flex justify-end gap-3 pt-4"><button type="button" onClick={() => setModalAberto(false)} className="px-4 py-2 text-slate-600">Cancelar</button><button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg">Salvar</button></div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL DE EDIÇÃO */}
      {modalEditAberto && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
            <h3 className="text-2xl font-bold mb-6 text-slate-800">Editar Continente</h3>
            <form onSubmit={salvarEdicao} className="space-y-4">
              <input required type="text" value={nomeEdit} onChange={(e) => setNomeEdit(e.target.value)} className="w-full border border-gray-300 p-2 rounded-lg" />
              <textarea required value={descricaoEdit} onChange={(e) => setDescricaoEdit(e.target.value)} className="w-full border border-gray-300 p-2 rounded-lg" rows={3} />
              <div className="flex justify-end gap-3 pt-4"><button type="button" onClick={() => setModalEditAberto(false)} className="px-4 py-2 text-slate-600">Cancelar</button><button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg">Atualizar</button></div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}