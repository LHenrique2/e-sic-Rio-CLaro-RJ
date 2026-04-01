import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LogOut, User, FileText, Search, Filter,
  CheckCircle, Clock, AlertCircle, MessageSquare, X, Send, Eye
} from 'lucide-react';

const statusConfig = {
  'Novo':       { bg: '#dbeafe', color: '#1d4ed8' },
  'Em Análise': { bg: '#fef9c3', color: '#a16207' },
  'Atrasado':   { bg: '#fee2e2', color: '#dc2626' },
  'Respondido': { bg: '#dcfce7', color: '#15803d' },
};

export default function PainelServidor() {
  const { user, logout, pedidos, responderPedido, atualizarStatusPedido } = useAuth();
  const navigate = useNavigate();

  const [busca, setBusca] = useState('');
  const [filtroStatus, setFiltroStatus] = useState('Todos');
  const [modalPedido, setModalPedido] = useState(null); // pedido selecionado
  const [modoModal, setModoModal] = useState('ver'); // 'ver' | 'responder'
  const [textoResposta, setTextoResposta] = useState('');
  const [enviando, setEnviando] = useState(false);

  // Filtra apenas pedidos da secretaria do servidor logado
  const pedidosDaSecretaria = pedidos.filter(p => p.secretaria === user?.secretaria);

  const pedidosFiltrados = pedidosDaSecretaria.filter(p => {
    const matchBusca = p.id.toLowerCase().includes(busca.toLowerCase()) ||
                       p.cidadao.toLowerCase().includes(busca.toLowerCase()) ||
                       p.assunto.toLowerCase().includes(busca.toLowerCase());
    const matchStatus = filtroStatus === 'Todos' || p.status === filtroStatus;
    return matchBusca && matchStatus;
  });

  const stats = {
    total: pedidosDaSecretaria.length,
    novos: pedidosDaSecretaria.filter(p => p.status === 'Novo').length,
    emAnalise: pedidosDaSecretaria.filter(p => p.status === 'Em Análise').length,
    atrasados: pedidosDaSecretaria.filter(p => p.status === 'Atrasado').length,
    respondidos: pedidosDaSecretaria.filter(p => p.status === 'Respondido').length,
  };

  function abrirPedido(pedido, modo = 'ver') {
    setModalPedido(pedido);
    setModoModal(modo);
    setTextoResposta('');
  }

  function enviarResposta() {
    if (!textoResposta.trim()) return;
    setEnviando(true);
    setTimeout(() => {
      responderPedido(modalPedido.id, textoResposta.trim(), user.nome);
      setEnviando(false);
      setModalPedido(null);
    }, 600);
  }

  function handleLogout() {
    logout();
    navigate('/');
  }

  return (
    <div style={{ background: '#f1f5f9', minHeight: 'calc(100vh - 80px)' }}>

      {/* Barra do painel */}
      <div style={{ background: 'var(--secondary)', padding: '1.5rem 0' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ color: 'white', margin: 0, fontSize: '1.4rem', fontWeight: '800' }}>
              Painel do Servidor — e-SIC
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.8)', margin: 0, fontSize: '0.875rem', marginTop: '0.2rem' }}>
              {user?.secretaria}
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.15)', borderRadius: '2rem', padding: '0.5rem 1rem' }}>
              <User size={16} color="white" />
              <span style={{ color: 'white', fontWeight: '600', fontSize: '0.875rem' }}>{user?.nome}</span>
            </div>
            <button onClick={handleLogout}
              style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)', color: 'white', borderRadius: '0.5rem', padding: '0.5rem 1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '600', fontSize: '0.875rem' }}>
              <LogOut size={15} /> Sair
            </button>
          </div>
        </div>
      </div>

      <div className="container" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.25rem', marginBottom: '2rem' }}>
          {[
            { label: 'Total na Secretaria', valor: stats.total, icon: <FileText size={22} />, bg: '#e0e7ff', cor: '#4338ca' },
            { label: 'Novos', valor: stats.novos, icon: <Clock size={22} />, bg: '#dbeafe', cor: '#1d4ed8' },
            { label: 'Atrasados', valor: stats.atrasados, icon: <AlertCircle size={22} />, bg: '#fee2e2', cor: '#dc2626' },
            { label: 'Respondidos', valor: stats.respondidos, icon: <CheckCircle size={22} />, bg: '#dcfce7', cor: '#15803d' },
          ].map((s, i) => (
            <div key={i} style={{ background: 'white', borderRadius: '1rem', padding: '1.25rem', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <div style={{ background: s.bg, color: s.cor, padding: '0.65rem', borderRadius: '10px', display: 'flex' }}>{s.icon}</div>
              <div>
                <p style={{ color: '#64748b', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', margin: 0, letterSpacing: '0.5px' }}>{s.label}</p>
                <p style={{ fontSize: '1.875rem', fontWeight: '800', color: '#0f172a', margin: 0, lineHeight: 1.1 }}>{s.valor}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Tabela de pedidos */}
        <div style={{ background: 'white', borderRadius: '1rem', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
          {/* Header */}
          <div style={{ padding: '1.25rem 1.75rem', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <h3 style={{ margin: 0, fontWeight: '800', fontSize: '1.1rem', color: '#0f172a' }}>
              Solicitações da {user?.secretaria}
            </h3>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', border: '1px solid #e2e8f0', borderRadius: '0.5rem', padding: '0.5rem 0.75rem', background: '#f8fafc' }}>
                <Search size={15} color="#94a3b8" />
                <input type="text" placeholder="Buscar..." value={busca} onChange={e => setBusca(e.target.value)}
                  style={{ border: 'none', background: 'none', outline: 'none', fontSize: '0.85rem', width: '180px', color: '#0f172a' }} />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', border: '1px solid #e2e8f0', borderRadius: '0.5rem', padding: '0.5rem 0.75rem', background: '#f8fafc' }}>
                <Filter size={15} color="#94a3b8" />
                <select value={filtroStatus} onChange={e => setFiltroStatus(e.target.value)}
                  style={{ border: 'none', background: 'none', outline: 'none', fontSize: '0.85rem', color: '#0f172a', cursor: 'pointer' }}>
                  <option value="Todos">Todos</option>
                  <option value="Novo">Novo</option>
                  <option value="Em Análise">Em Análise</option>
                  <option value="Atrasado">Atrasado</option>
                  <option value="Respondido">Respondido</option>
                </select>
              </div>
            </div>
          </div>

          {/* Tabela */}
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '2px solid #f1f5f9' }}>
                  {['Protocolo', 'Cidadão', 'Assunto', 'Data', 'Prazo', 'Status', 'Ações'].map(h => (
                    <th key={h} style={{ padding: '0.875rem 1.25rem', color: '#64748b', fontWeight: '700', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {pedidosFiltrados.length === 0 ? (
                  <tr><td colSpan={7} style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>
                    <FileText size={40} style={{ marginBottom: '0.75rem', opacity: 0.3 }} />
                    <br />Nenhuma solicitação encontrada.
                  </td></tr>
                ) : pedidosFiltrados.map(p => {
                  const st = statusConfig[p.status] || {};
                  const diasCor = p.diasRestantes < 0 ? '#dc2626' : p.diasRestantes <= 5 ? '#d97706' : '#15803d';
                  return (
                    <tr key={p.id} style={{ borderBottom: '1px solid #f1f5f9' }}
                      onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                      <td style={{ padding: '1rem 1.25rem', fontWeight: '700', color: '#127246', fontSize: '0.85rem' }}>{p.id}</td>
                      <td style={{ padding: '1rem 1.25rem' }}>
                        <p style={{ margin: 0, fontWeight: '600', fontSize: '0.875rem', color: '#0f172a' }}>{p.cidadao}</p>
                        <p style={{ margin: 0, fontSize: '0.75rem', color: '#94a3b8' }}>{p.cpf}</p>
                      </td>
                      <td style={{ padding: '1rem 1.25rem', fontSize: '0.875rem', color: '#475569', maxWidth: '200px' }}>{p.assunto}</td>
                      <td style={{ padding: '1rem 1.25rem', fontSize: '0.8rem', color: '#64748b', whiteSpace: 'nowrap' }}>{p.data}</td>
                      <td style={{ padding: '1rem 1.25rem', fontWeight: '700', color: diasCor, whiteSpace: 'nowrap', fontSize: '0.85rem' }}>
                        {p.diasRestantes < 0 ? `${Math.abs(p.diasRestantes)}d vencido` : p.diasRestantes === 0 ? 'Encerrado' : `${p.diasRestantes}d`}
                      </td>
                      <td style={{ padding: '1rem 1.25rem' }}>
                        <span style={{ background: st.bg, color: st.color, padding: '0.3rem 0.75rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: '700' }}>{p.status}</span>
                      </td>
                      <td style={{ padding: '1rem 1.25rem' }}>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button onClick={() => abrirPedido(p, 'ver')} title="Ver detalhes"
                            style={{ background: '#f1f5f9', border: 'none', borderRadius: '0.4rem', padding: '0.4rem 0.75rem', cursor: 'pointer', color: '#475569', display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem', fontWeight: '600' }}>
                            <Eye size={14} /> Ver
                          </button>
                          {p.status !== 'Respondido' && (
                            <button onClick={() => abrirPedido(p, 'responder')} title="Responder"
                              style={{ background: '#127246', border: 'none', borderRadius: '0.4rem', padding: '0.4rem 0.75rem', cursor: 'pointer', color: 'white', display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem', fontWeight: '600' }}>
                              <MessageSquare size={14} /> Responder
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal de detalhes / resposta */}
      {modalPedido && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}
          onClick={e => { if (e.target === e.currentTarget) setModalPedido(null); }}>
          <div style={{ background: 'white', borderRadius: '1rem', width: '100%', maxWidth: '640px', boxShadow: '0 20px 60px rgba(0,0,0,0.2)', overflow: 'hidden' }}>

            {/* Header do modal */}
            <div style={{ background: modoModal === 'responder' ? '#127246' : '#0a4d8c', padding: '1.5rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ color: 'rgba(255,255,255,0.7)', margin: 0, fontSize: '0.8rem', fontWeight: '600' }}>{modalPedido.id}</p>
                <h3 style={{ color: 'white', margin: 0, fontSize: '1.15rem', fontWeight: '800' }}>
                  {modoModal === 'responder' ? 'Responder Solicitação' : 'Detalhes da Solicitação'}
                </h3>
              </div>
              <button onClick={() => setModalPedido(null)}
                style={{ background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '0.5rem', padding: '0.5rem', cursor: 'pointer', color: 'white', display: 'flex' }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ padding: '2rem', overflowY: 'auto', maxHeight: '70vh' }}>
              {/* Info do pedido */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                {[
                  { label: 'Cidadão', valor: modalPedido.cidadao },
                  { label: 'CPF', valor: modalPedido.cpf },
                  { label: 'Data de Entrada', valor: modalPedido.data },
                  { label: 'Prazo de Resposta', valor: modalPedido.prazo },
                ].map((item, i) => (
                  <div key={i} style={{ background: '#f8fafc', borderRadius: '0.5rem', padding: '0.75rem 1rem' }}>
                    <p style={{ margin: 0, fontSize: '0.75rem', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{item.label}</p>
                    <p style={{ margin: 0, fontWeight: '600', color: '#0f172a', marginTop: '0.25rem' }}>{item.valor}</p>
                  </div>
                ))}
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <p style={{ fontSize: '0.8rem', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px', margin: '0 0 0.5rem' }}>Assunto</p>
                <p style={{ fontWeight: '700', color: '#0f172a', margin: 0, fontSize: '1rem' }}>{modalPedido.assunto}</p>
              </div>

              <div style={{ background: '#f8fafc', borderRadius: '0.75rem', padding: '1.25rem', marginBottom: '1.5rem' }}>
                <p style={{ fontSize: '0.8rem', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px', margin: '0 0 0.75rem' }}>Detalhamento do Pedido</p>
                <p style={{ color: '#374151', lineHeight: '1.7', margin: 0 }}>{modalPedido.detalhamento}</p>
              </div>

              {/* Resposta já enviada */}
              {modalPedido.resposta && (
                <div style={{ background: '#dcfce7', border: '1px solid #86efac', borderRadius: '0.75rem', padding: '1.25rem', marginBottom: '1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                    <CheckCircle size={18} color="#15803d" />
                    <p style={{ fontSize: '0.8rem', fontWeight: '700', color: '#15803d', margin: 0 }}>
                      RESPONDIDO POR {modalPedido.respondidoPor?.toUpperCase()} EM {modalPedido.dataResposta}
                    </p>
                  </div>
                  <p style={{ color: '#166534', lineHeight: '1.7', margin: 0 }}>{modalPedido.resposta}</p>
                </div>
              )}

              {/* Campo de resposta */}
              {modoModal === 'responder' && modalPedido.status !== 'Respondido' && (
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '700', color: '#374151', marginBottom: '0.5rem' }}>
                    Sua Resposta ao Cidadão *
                  </label>
                  <textarea
                    rows={5}
                    placeholder="Escreva aqui a resposta oficial da secretaria para este pedido de informação..."
                    value={textoResposta}
                    onChange={e => setTextoResposta(e.target.value)}
                    style={{ width: '100%', padding: '0.875rem', border: '1px solid #e2e8f0', borderRadius: '0.5rem', fontSize: '0.9rem', lineHeight: '1.6', resize: 'vertical', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit' }}
                  />
                  <p style={{ fontSize: '0.75rem', color: '#94a3b8', margin: '0.5rem 0 0' }}>
                    Após enviada, a resposta ficará visível ao cidadão na área de acompanhamento.
                  </p>
                </div>
              )}
            </div>

            {/* Footer do modal */}
            <div style={{ padding: '1.25rem 2rem', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', background: '#fafafa' }}>
              {modoModal === 'ver' && modalPedido.status !== 'Respondido' && (
                <button onClick={() => setModoModal('responder')}
                  style={{ background: '#127246', color: 'white', border: 'none', borderRadius: '0.5rem', padding: '0.75rem 1.5rem', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <MessageSquare size={16} /> Responder
                </button>
              )}
              {modoModal === 'responder' && modalPedido.status !== 'Respondido' && (
                <>
                  <button onClick={() => setModoModal('ver')}
                    style={{ background: '#f1f5f9', color: '#475569', border: 'none', borderRadius: '0.5rem', padding: '0.75rem 1.25rem', fontWeight: '600', cursor: 'pointer' }}>
                    Cancelar
                  </button>
                  <button onClick={enviarResposta} disabled={!textoResposta.trim() || enviando}
                    style={{ background: textoResposta.trim() ? '#127246' : '#94a3b8', color: 'white', border: 'none', borderRadius: '0.5rem', padding: '0.75rem 1.5rem', fontWeight: '700', cursor: textoResposta.trim() ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Send size={16} /> {enviando ? 'Enviando...' : 'Enviar Resposta'}
                  </button>
                </>
              )}
              <button onClick={() => setModalPedido(null)}
                style={{ background: '#f1f5f9', color: '#475569', border: 'none', borderRadius: '0.5rem', padding: '0.75rem 1.25rem', fontWeight: '600', cursor: 'pointer' }}>
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
