import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  CheckCircle, Clock, AlertCircle, LogOut,
  FileText, Search, User, Filter, Users
} from 'lucide-react';
import GerenciarServidores from './GerenciarServidores';

const pedidos = [
  { id: 'RC-2026-0014', cidadao: 'João Silva', cpf: '***.***.456-78', assunto: 'Licitações de Obras Públicas', data: '28/03/2026', prazo: '18/04/2026', diasRestantes: 17, status: 'Novo', secretaria: 'Secretaria de Obras e Infraestrutura' },
  { id: 'RC-2026-0013', cidadao: 'Maria Oliveira', cpf: '***.***.123-90', assunto: 'Folha de Pagamento dos Servidores', data: '25/03/2026', prazo: '04/04/2026', diasRestantes: 3, status: 'Em Análise', secretaria: 'Secretaria de Administração' },
  { id: 'RC-2026-0012', cidadao: 'Carlos Souza', cpf: '***.***.789-11', assunto: 'Contratos de Saúde Municipal', data: '20/03/2026', prazo: '30/03/2026', diasRestantes: -2, status: 'Atrasado', secretaria: 'Secretaria de Saúde' },
  { id: 'RC-2026-0011', cidadao: 'Ana Ferreira', cpf: '***.***.321-44', assunto: 'Gastos com Merenda Escolar', data: '15/03/2026', prazo: '25/03/2026', diasRestantes: 0, status: 'Respondido', secretaria: 'Secretaria de Educação' },
  { id: 'RC-2026-0010', cidadao: 'Pedro Lima', cpf: '***.***.654-22', assunto: 'Obras de Pavimentação da Rua XV', data: '10/03/2026', prazo: '20/03/2026', diasRestantes: 0, status: 'Respondido', secretaria: 'Secretaria de Obras e Infraestrutura' },
];

const statusConfig = {
  'Novo':       { bg: '#dbeafe', color: '#1d4ed8' },
  'Em Análise': { bg: '#fef9c3', color: '#a16207' },
  'Atrasado':   { bg: '#fee2e2', color: '#dc2626' },
  'Respondido': { bg: '#dcfce7', color: '#15803d' },
};

export default function PainelAdmin() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [aba, setAba] = useState('pedidos'); // 'pedidos' | 'servidores'
  const [filtro, setFiltro] = useState('Todos');
  const [busca, setBusca] = useState('');

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const pedidosFiltrados = pedidos.filter(p => {
    const matchFiltro = filtro === 'Todos' || p.status === filtro;
    const matchBusca = p.id.toLowerCase().includes(busca.toLowerCase()) ||
                       p.cidadao.toLowerCase().includes(busca.toLowerCase()) ||
                       p.assunto.toLowerCase().includes(busca.toLowerCase());
    return matchFiltro && matchBusca;
  });

  const stats = {
    total: pedidos.length,
    novos: pedidos.filter(p => p.status === 'Novo').length,
    atrasados: pedidos.filter(p => p.status === 'Atrasado').length,
    respondidos: pedidos.filter(p => p.status === 'Respondido').length,
  };

  return (
    <div style={{ background: '#f1f5f9', minHeight: 'calc(100vh - 80px)' }}>
      {/* Barra azul do painel */}
      <div style={{ background: '#0a4d8c', padding: '1.5rem 0' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ color: 'white', margin: 0, fontSize: '1.5rem', fontWeight: '800' }}>
              Painel Administrativo — E-SIC
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.7)', margin: 0, fontSize: '0.9rem', marginTop: '0.25rem' }}>
              Prefeitura Municipal de Rio Claro - RJ
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.15)', borderRadius: '2rem', padding: '0.5rem 1rem' }}>
              <User size={18} color="white" />
              <span style={{ color: 'white', fontWeight: '600', fontSize: '0.9rem' }}>{user?.nome}</span>
            </div>
            <button onClick={handleLogout}
              style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)', color: 'white', borderRadius: '0.5rem', padding: '0.5rem 1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '600', fontSize: '0.9rem' }}>
              <LogOut size={16} /> Sair
            </button>
          </div>
        </div>
      </div>

      {/* Abas de navegação */}
      <div style={{ background: 'white', borderBottom: '1px solid #e2e8f0' }}>
        <div className="container" style={{ display: 'flex', gap: '0' }}>
          {[
            { id: 'pedidos', label: 'Pedidos', icon: <FileText size={16} /> },
            { id: 'servidores', label: 'Servidores', icon: <Users size={16} /> },
          ].map(tab => (
            <button key={tab.id} onClick={() => setAba(tab.id)}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                padding: '1rem 1.5rem', fontWeight: '700', fontSize: '0.9rem',
                display: 'flex', alignItems: 'center', gap: '0.5rem',
                color: aba === tab.id ? '#0a4d8c' : '#64748b',
                borderBottom: aba === tab.id ? '3px solid #0a4d8c' : '3px solid transparent',
                transition: 'all 0.15s',
              }}>
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="container" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>

        {/* ─── ABA PEDIDOS ─── */}
        {aba === 'pedidos' && (
          <>
            {/* Cards de estatísticas */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.25rem', marginBottom: '2rem' }}>
              {[
                { label: 'Total de Pedidos', valor: stats.total, icon: <FileText size={24} />, bg: '#e0e7ff', cor: '#4338ca' },
                { label: 'Novos', valor: stats.novos, icon: <Clock size={24} />, bg: '#dbeafe', cor: '#1d4ed8' },
                { label: 'Atrasados', valor: stats.atrasados, icon: <AlertCircle size={24} />, bg: '#fee2e2', cor: '#dc2626' },
                { label: 'Respondidos', valor: stats.respondidos, icon: <CheckCircle size={24} />, bg: '#dcfce7', cor: '#15803d' },
              ].map((s, i) => (
                <div key={i} style={{ background: 'white', borderRadius: '1rem', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <div style={{ background: s.bg, color: s.cor, padding: '0.75rem', borderRadius: '10px', display: 'flex' }}>{s.icon}</div>
                  <div>
                    <p style={{ color: '#64748b', fontSize: '0.78rem', fontWeight: '700', textTransform: 'uppercase', margin: 0, letterSpacing: '0.5px' }}>{s.label}</p>
                    <p style={{ fontSize: '2rem', fontWeight: '800', color: '#0f172a', margin: 0, lineHeight: 1.2 }}>{s.valor}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Tabela de pedidos */}
            <div style={{ background: 'white', borderRadius: '1rem', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
              <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                <h3 style={{ margin: 0, fontWeight: '800', fontSize: '1.15rem', color: '#0f172a' }}>Gerenciar Pedidos</h3>
                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', border: '1px solid #e2e8f0', borderRadius: '0.5rem', padding: '0.5rem 0.75rem', background: '#f8fafc' }}>
                    <Search size={16} color="#94a3b8" />
                    <input type="text" placeholder="Buscar protocolo, cidadão..." value={busca}
                      onChange={e => setBusca(e.target.value)}
                      style={{ border: 'none', background: 'none', outline: 'none', fontSize: '0.875rem', width: '200px', color: '#0f172a' }} />
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', border: '1px solid #e2e8f0', borderRadius: '0.5rem', padding: '0.5rem 0.75rem', background: '#f8fafc' }}>
                    <Filter size={16} color="#94a3b8" />
                    <select value={filtro} onChange={e => setFiltro(e.target.value)}
                      style={{ border: 'none', background: 'none', outline: 'none', fontSize: '0.875rem', color: '#0f172a', cursor: 'pointer' }}>
                      <option value="Todos">Todos os status</option>
                      <option value="Novo">Novo</option>
                      <option value="Em Análise">Em Análise</option>
                      <option value="Atrasado">Atrasado</option>
                      <option value="Respondido">Respondido</option>
                    </select>
                  </div>
                </div>
              </div>

              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ background: '#f8fafc', borderBottom: '2px solid #f1f5f9' }}>
                      {['Protocolo', 'Cidadão', 'Assunto', 'Secretaria', 'Prazo', 'Dias', 'Status', 'Ação'].map(h => (
                        <th key={h} style={{ padding: '1rem 1.25rem', color: '#64748b', fontWeight: '700', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {pedidosFiltrados.length === 0 ? (
                      <tr><td colSpan={8} style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>Nenhum pedido encontrado.</td></tr>
                    ) : pedidosFiltrados.map(p => {
                      const st = statusConfig[p.status] || {};
                      const diasCor = p.diasRestantes < 0 ? '#dc2626' : p.diasRestantes <= 5 ? '#d97706' : '#15803d';
                      return (
                        <tr key={p.id} style={{ borderBottom: '1px solid #f1f5f9' }}
                          onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                          <td style={{ padding: '1rem 1.25rem', fontWeight: '700', color: '#0a4d8c', fontSize: '0.85rem' }}>{p.id}</td>
                          <td style={{ padding: '1rem 1.25rem' }}>
                            <p style={{ margin: 0, fontWeight: '600', fontSize: '0.9rem', color: '#0f172a' }}>{p.cidadao}</p>
                            <p style={{ margin: 0, fontSize: '0.78rem', color: '#94a3b8' }}>{p.cpf}</p>
                          </td>
                          <td style={{ padding: '1rem 1.25rem', fontSize: '0.875rem', color: '#475569', maxWidth: '180px' }}>{p.assunto}</td>
                          <td style={{ padding: '1rem 1.25rem', fontSize: '0.8rem', color: '#0369a1', fontWeight: '600', maxWidth: '160px' }}>{p.secretaria}</td>
                          <td style={{ padding: '1rem 1.25rem', fontSize: '0.85rem', color: '#64748b', whiteSpace: 'nowrap' }}>{p.prazo}</td>
                          <td style={{ padding: '1rem 1.25rem', fontWeight: '700', color: diasCor, whiteSpace: 'nowrap' }}>
                            {p.diasRestantes < 0 ? `${Math.abs(p.diasRestantes)}d vencido` : p.diasRestantes === 0 ? 'Encerrado' : `${p.diasRestantes}d`}
                          </td>
                          <td style={{ padding: '1rem 1.25rem' }}>
                            <span style={{ background: st.bg, color: st.color, padding: '0.3rem 0.8rem', borderRadius: '9999px', fontSize: '0.78rem', fontWeight: '700' }}>{p.status}</span>
                          </td>
                          <td style={{ padding: '1rem 1.25rem' }}>
                            <button style={{ background: '#0a4d8c', color: 'white', border: 'none', borderRadius: '0.4rem', padding: '0.4rem 0.9rem', fontSize: '0.8rem', fontWeight: '600', cursor: 'pointer' }}>
                              Tramitar
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* ─── ABA SERVIDORES ─── */}
        {aba === 'servidores' && <GerenciarServidores />}
      </div>
    </div>
  );
}
