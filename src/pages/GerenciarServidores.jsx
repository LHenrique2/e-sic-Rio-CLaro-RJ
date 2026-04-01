import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  UserPlus, Users, Pencil, Trash2, ToggleLeft, ToggleRight,
  X, Check, Shield, AlertCircle, Search
} from 'lucide-react';

const SECRETARIAS = [
  'Secretaria de Administração',
  'Secretaria de Educação',
  'Secretaria de Saúde',
  'Secretaria de Obras e Infraestrutura',
  'Secretaria de Finanças',
  'Secretaria de Meio Ambiente',
  'Secretaria de Assistência Social',
  'Secretaria de Transporte',
  'Secretaria de Cultura e Turismo',
  'Secretaria de Esporte e Lazer',
  'Gabinete do Prefeito',
  'Controladoria Geral',
];

const FORM_VAZIO = { nome: '', matricula: '', senha: '', secretaria: '', email: '' };

export default function GerenciarServidores() {
  const { servidores, cadastrarServidor, editarServidor, toggleServidorAtivo, removerServidor } = useAuth();

  const [modalAberto, setModalAberto] = useState(false);
  const [modoEdicao, setModoEdicao] = useState(null); // id do servidor sendo editado
  const [form, setForm] = useState(FORM_VAZIO);
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');
  const [busca, setBusca] = useState('');
  const [filtroSecretaria, setFiltroSecretaria] = useState('Todas');
  const [confirmRemover, setConfirmRemover] = useState(null);

  const servidoresFiltrados = servidores.filter(s => {
    const matchBusca = s.nome.toLowerCase().includes(busca.toLowerCase()) ||
                       s.matricula.toLowerCase().includes(busca.toLowerCase());
    const matchSec = filtroSecretaria === 'Todas' || s.secretaria === filtroSecretaria;
    return matchBusca && matchSec;
  });

  function abrirCadastro() {
    setForm(FORM_VAZIO);
    setModoEdicao(null);
    setErro('');
    setModalAberto(true);
  }

  function abrirEdicao(servidor) {
    setForm({ nome: servidor.nome, matricula: servidor.matricula, senha: '', secretaria: servidor.secretaria, email: servidor.email });
    setModoEdicao(servidor.id);
    setErro('');
    setModalAberto(true);
  }

  function fecharModal() {
    setModalAberto(false);
    setErro('');
    setModoEdicao(null);
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.nome || !form.matricula || !form.secretaria || !form.email) {
      setErro('Preencha todos os campos obrigatórios.'); return;
    }
    if (!modoEdicao && !form.senha) {
      setErro('Informe uma senha para o novo servidor.'); return;
    }
    let resultado;
    if (modoEdicao) {
      const dados = { nome: form.nome, secretaria: form.secretaria, email: form.email };
      if (form.senha) dados.senha = form.senha;
      resultado = editarServidor(modoEdicao, dados);
    } else {
      resultado = cadastrarServidor(form);
    }
    if (!resultado.ok) { setErro(resultado.erro); return; }
    setSucesso(modoEdicao ? 'Servidor atualizado com sucesso!' : 'Servidor cadastrado com sucesso!');
    fecharModal();
    setTimeout(() => setSucesso(''), 3000);
  }

  return (
    <div>
      {/* Cabeçalho da seção */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ margin: 0, fontWeight: '800', fontSize: '1.5rem', color: '#0f172a' }}>Servidores Cadastrados</h2>
          <p style={{ margin: 0, color: '#64748b', fontSize: '0.9rem', marginTop: '0.25rem' }}>
            {servidores.length} servidor(es) · {servidores.filter(s => s.ativo).length} ativo(s)
          </p>
        </div>
        <button
          onClick={abrirCadastro}
          style={{ background: '#0a4d8c', color: 'white', border: 'none', borderRadius: '0.5rem', padding: '0.75rem 1.5rem', fontWeight: '700', fontSize: '0.95rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <UserPlus size={18} /> Cadastrar Servidor
        </button>
      </div>

      {/* Mensagem de sucesso */}
      {sucesso && (
        <div style={{ background: '#dcfce7', border: '1px solid #86efac', borderRadius: '0.75rem', padding: '0.75rem 1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#15803d', fontWeight: '600' }}>
          <Check size={18} /> {sucesso}
        </div>
      )}

      {/* Filtros */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', border: '1px solid #e2e8f0', borderRadius: '0.5rem', padding: '0.5rem 0.75rem', background: 'white', flex: 1, minWidth: '220px' }}>
          <Search size={16} color="#94a3b8" />
          <input
            type="text"
            placeholder="Buscar por nome ou matrícula..."
            value={busca}
            onChange={e => setBusca(e.target.value)}
            style={{ border: 'none', outline: 'none', fontSize: '0.875rem', color: '#0f172a', background: 'none', width: '100%' }}
          />
        </div>
        <select
          value={filtroSecretaria}
          onChange={e => setFiltroSecretaria(e.target.value)}
          style={{ border: '1px solid #e2e8f0', borderRadius: '0.5rem', padding: '0.5rem 0.75rem', background: 'white', fontSize: '0.875rem', color: '#0f172a', cursor: 'pointer' }}
        >
          <option value="Todas">Todas as secretarias</option>
          {SECRETARIAS.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {/* Tabela */}
      <div style={{ background: 'white', borderRadius: '1rem', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
        {servidoresFiltrados.length === 0 ? (
          <div style={{ padding: '4rem', textAlign: 'center', color: '#94a3b8' }}>
            <Users size={48} style={{ marginBottom: '1rem', opacity: 0.4 }} />
            <p style={{ margin: 0, fontWeight: '600' }}>Nenhum servidor encontrado.</p>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '2px solid #f1f5f9' }}>
                {['Servidor', 'Matrícula', 'Secretaria', 'E-mail', 'Status', 'Ações'].map(h => (
                  <th key={h} style={{ padding: '1rem 1.25rem', color: '#64748b', fontWeight: '700', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {servidoresFiltrados.map(s => (
                <tr key={s.id}
                  style={{ borderBottom: '1px solid #f1f5f9' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <td style={{ padding: '1rem 1.25rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#e0f2fe', color: '#0369a1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '0.9rem', flexShrink: 0 }}>
                        {s.nome.charAt(0)}
                      </div>
                      <span style={{ fontWeight: '600', color: '#0f172a', fontSize: '0.9rem' }}>{s.nome}</span>
                    </div>
                  </td>
                  <td style={{ padding: '1rem 1.25rem', fontWeight: '700', color: '#0a4d8c', fontSize: '0.85rem' }}>{s.matricula}</td>
                  <td style={{ padding: '1rem 1.25rem' }}>
                    <span style={{ background: '#e0f2fe', color: '#0369a1', padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.78rem', fontWeight: '600' }}>
                      {s.secretaria}
                    </span>
                  </td>
                  <td style={{ padding: '1rem 1.25rem', color: '#64748b', fontSize: '0.85rem' }}>{s.email}</td>
                  <td style={{ padding: '1rem 1.25rem' }}>
                    <span style={{ background: s.ativo ? '#dcfce7' : '#f1f5f9', color: s.ativo ? '#15803d' : '#94a3b8', padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.78rem', fontWeight: '700' }}>
                      {s.ativo ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                  <td style={{ padding: '1rem 1.25rem' }}>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button onClick={() => abrirEdicao(s)} title="Editar"
                        style={{ background: '#f1f5f9', border: 'none', borderRadius: '0.4rem', padding: '0.4rem 0.6rem', cursor: 'pointer', color: '#475569', display: 'flex' }}>
                        <Pencil size={15} />
                      </button>
                      <button onClick={() => toggleServidorAtivo(s.id)} title={s.ativo ? 'Desativar' : 'Ativar'}
                        style={{ background: s.ativo ? '#fef3c7' : '#dcfce7', border: 'none', borderRadius: '0.4rem', padding: '0.4rem 0.6rem', cursor: 'pointer', color: s.ativo ? '#d97706' : '#15803d', display: 'flex' }}>
                        {s.ativo ? <ToggleRight size={15} /> : <ToggleLeft size={15} />}
                      </button>
                      <button onClick={() => setConfirmRemover(s.id)} title="Remover"
                        style={{ background: '#fee2e2', border: 'none', borderRadius: '0.4rem', padding: '0.4rem 0.6rem', cursor: 'pointer', color: '#dc2626', display: 'flex' }}>
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal de Cadastro/Edição */}
      {modalAberto && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}
          onClick={e => { if (e.target === e.currentTarget) fecharModal(); }}>
          <div style={{ background: 'white', borderRadius: '1rem', padding: '2.5rem', width: '100%', maxWidth: '520px', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.3rem', fontWeight: '800', color: '#0f172a' }}>
                  {modoEdicao ? 'Editar Servidor' : 'Cadastrar Servidor'}
                </h3>
                <p style={{ margin: 0, color: '#64748b', fontSize: '0.85rem', marginTop: '0.25rem' }}>
                  {modoEdicao ? 'Atualize os dados do servidor' : 'Preencha os dados do novo servidor'}
                </p>
              </div>
              <button onClick={fecharModal} style={{ background: '#f1f5f9', border: 'none', borderRadius: '0.5rem', padding: '0.5rem', cursor: 'pointer', display: 'flex', color: '#64748b' }}>
                <X size={20} />
              </button>
            </div>

            {erro && (
              <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '0.5rem', padding: '0.75rem 1rem', marginBottom: '1.5rem', display: 'flex', gap: '0.5rem', alignItems: 'center', color: '#dc2626', fontSize: '0.9rem' }}>
                <AlertCircle size={16} /> {erro}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', fontWeight: '600', fontSize: '0.85rem', color: '#374151', marginBottom: '0.4rem' }}>Nome Completo *</label>
                <input type="text" className="form-input" placeholder="Ex: João da Silva" value={form.nome} onChange={e => setForm({ ...form, nome: e.target.value })} required />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontWeight: '600', fontSize: '0.85rem', color: '#374151', marginBottom: '0.4rem' }}>Matrícula *</label>
                  <input type="text" className="form-input" placeholder="Ex: S004" value={form.matricula}
                    onChange={e => setForm({ ...form, matricula: e.target.value })}
                    disabled={!!modoEdicao}
                    style={{ opacity: modoEdicao ? 0.6 : 1 }}
                    required />
                </div>
                <div>
                  <label style={{ display: 'block', fontWeight: '600', fontSize: '0.85rem', color: '#374151', marginBottom: '0.4rem' }}>
                    Senha {modoEdicao ? '(deixe em branco para manter)' : '*'}
                  </label>
                  <input type="password" className="form-input" placeholder="••••••••" value={form.senha} onChange={e => setForm({ ...form, senha: e.target.value })} />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontWeight: '600', fontSize: '0.85rem', color: '#374151', marginBottom: '0.4rem' }}>Secretaria *</label>
                <select className="form-input" value={form.secretaria} onChange={e => setForm({ ...form, secretaria: e.target.value })} required style={{ cursor: 'pointer' }}>
                  <option value="">Selecione a secretaria...</option>
                  {SECRETARIAS.map(sec => <option key={sec} value={sec}>{sec}</option>)}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontWeight: '600', fontSize: '0.85rem', color: '#374151', marginBottom: '0.4rem' }}>E-mail Funcional *</label>
                <input type="email" className="form-input" placeholder="servidor@rioclaro.rj.gov.br" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
              </div>

              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                <button type="button" onClick={fecharModal}
                  style={{ background: '#f1f5f9', color: '#475569', border: 'none', borderRadius: '0.5rem', padding: '0.75rem 1.5rem', fontWeight: '600', cursor: 'pointer' }}>
                  Cancelar
                </button>
                <button type="submit"
                  style={{ background: '#0a4d8c', color: 'white', border: 'none', borderRadius: '0.5rem', padding: '0.75rem 1.5rem', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Shield size={16} /> {modoEdicao ? 'Salvar Alterações' : 'Cadastrar Servidor'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de confirmação de remoção */}
      {confirmRemover && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ background: 'white', borderRadius: '1rem', padding: '2rem', maxWidth: '400px', width: '100%', textAlign: 'center' }}>
            <div style={{ background: '#fee2e2', width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem', color: '#dc2626' }}>
              <Trash2 size={28} />
            </div>
            <h3 style={{ margin: '0 0 0.5rem', color: '#0f172a' }}>Remover Servidor?</h3>
            <p style={{ color: '#64748b', margin: '0 0 2rem', fontSize: '0.9rem' }}>Esta ação não pode ser desfeita. O servidor perderá acesso ao sistema.</p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button onClick={() => setConfirmRemover(null)}
                style={{ background: '#f1f5f9', color: '#475569', border: 'none', borderRadius: '0.5rem', padding: '0.75rem 1.5rem', fontWeight: '600', cursor: 'pointer' }}>
                Cancelar
              </button>
              <button onClick={() => { removerServidor(confirmRemover); setConfirmRemover(null); }}
                style={{ background: '#dc2626', color: 'white', border: 'none', borderRadius: '0.5rem', padding: '0.75rem 1.5rem', fontWeight: '700', cursor: 'pointer' }}>
                Remover
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
