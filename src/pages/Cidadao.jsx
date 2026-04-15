import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Info, CheckCircle, Clock, AlertCircle, X, FileText, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const statusConfig = {
  'Novo':       { bg: '#dbeafe', color: '#1d4ed8', icon: <Clock size={16} /> },
  'Em Análise': { bg: '#fef9c3', color: '#a16207', icon: <Clock size={16} /> },
  'Atrasado':   { bg: '#fee2e2', color: '#dc2626', icon: <AlertCircle size={16} /> },
  'Respondido': { bg: '#dcfce7', color: '#15803d', icon: <CheckCircle size={16} /> },
};

export default function Cidadao() {
  const { user, pedidos } = useAuth();
  const [protocolo, setProtocolo] = useState('');
  const [resultado, setResultado] = useState(null); // null | 'nao_encontrado' | objeto pedido
  const [buscado, setBuscado] = useState(false);

  // Filtra pedidos do usuário logado (pelo CPF mascarado ou nome)
  const meusPedidos = (user && user.cpf && Array.isArray(pedidos)) ? pedidos.filter(p => 
    p.cpf === user.cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '***.***.$3-$4') ||
    p.cpf === user.cpf 
  ) : [];

  function consultar(e) {
    e.preventDefault();
    if (!protocolo.trim() || !Array.isArray(pedidos)) return;
    const encontrado = pedidos.find(p => p.id && p.id.toUpperCase() === protocolo.trim().toUpperCase());
    setResultado(encontrado || 'nao_encontrado');
    setBuscado(true);
  }

  function selecionarPedido(pedido) {
    setResultado(pedido);
    setProtocolo(pedido.id);
    setBuscado(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function limpar() {
    setProtocolo('');
    setResultado(null);
    setBuscado(false);
  }

  return (
    <div style={{ background: '#eaf5ee', minHeight: 'calc(100vh - 80px)', padding: '4rem 0' }}>
      <div className="container" style={{ maxWidth: '720px' }}>

        {/* Título */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{ width: '60px', height: '60px', background: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
            <Search size={28} color="#0a4d8c" />
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: '800', color: '#0f172a', marginBottom: '0.5rem' }}>
            Consultar Protocolo
          </h1>
          <p style={{ color: '#64748b', fontSize: '1rem' }}>
            Digite o número do protocolo para acompanhar a situação do seu pedido.
          </p>
        </div>

        {/* Card principal */}
        <div style={{ background: 'white', borderRadius: '1.25rem', padding: '2.5rem', boxShadow: '0 4px 20px rgba(0,0,0,0.07)' }}>

          {/* Formulário de busca */}
          <form onSubmit={consultar}>
            <label style={{ display: 'block', fontWeight: '700', fontSize: '0.95rem', color: '#374151', marginBottom: '0.6rem' }}>
              Número do Protocolo
            </label>
            <div style={{ position: 'relative', marginBottom: '1.25rem' }}>
              <input
                type="text"
                placeholder="Ex: RC-2026-0012"
                value={protocolo}
                onChange={e => setProtocolo(e.target.value)}
                style={{
                  width: '100%', padding: '0.875rem 3rem 0.875rem 1rem',
                  border: '1.5px solid #e2e8f0', borderRadius: '0.75rem',
                  fontSize: '1rem', outline: 'none', boxSizing: 'border-box',
                  transition: 'border-color 0.2s', fontFamily: 'inherit',
                  color: '#0f172a',
                }}
                onFocus={e => e.target.style.borderColor = '#0a4d8c'}
                onBlur={e => e.target.style.borderColor = '#e2e8f0'}
              />
              {protocolo && (
                <button type="button" onClick={limpar}
                  style={{ position: 'absolute', right: '0.875rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', display: 'flex', padding: 0 }}>
                  <X size={18} />
                </button>
              )}
            </div>

            <button type="submit"
              style={{
                width: '100%', padding: '1rem', background: '#0a4d8c', color: 'white',
                border: 'none', borderRadius: '0.75rem', fontWeight: '700', fontSize: '1.05rem',
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                gap: '0.6rem', transition: 'background 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = '#083c6d'}
              onMouseLeave={e => e.currentTarget.style.background = '#0a4d8c'}
            >
              <Search size={20} /> Consultar Situação
            </button>
          </form>

          {/* Divider */}
          <hr style={{ border: 'none', borderTop: '1px solid #f1f5f9', margin: '1.75rem 0' }} />

          {/* Resultado - não encontrado */}
          {buscado && resultado === 'nao_encontrado' && (
            <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '0.75rem', padding: '1.25rem', display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
              <AlertCircle size={20} color="#dc2626" style={{ flexShrink: 0, marginTop: '0.1rem' }} />
              <div>
                <p style={{ fontWeight: '700', color: '#dc2626', margin: '0 0 0.25rem' }}>Protocolo não encontrado</p>
                <p style={{ color: '#7f1d1d', fontSize: '0.875rem', margin: 0 }}>
                  Verifique se o número digitado está correto. O protocolo é gerado no momento do cadastro do pedido.
                </p>
              </div>
            </div>
          )}

          {/* Resultado - encontrado */}
          {buscado && resultado && resultado !== 'nao_encontrado' && (
            <div style={{ border: '1.5px solid #e2e8f0', borderRadius: '1rem', overflow: 'hidden' }}>
              {/* Header do resultado */}
              <div style={{ background: '#0a4d8c', padding: '1.25rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <p style={{ color: 'rgba(255,255,255,0.7)', margin: 0, fontSize: '0.78rem', fontWeight: '700', letterSpacing: '0.5px', textTransform: 'uppercase' }}>Protocolo</p>
                  <p style={{ color: 'white', fontWeight: '800', fontSize: '1.15rem', margin: 0 }}>{resultado.id}</p>
                </div>
                <span style={{
                  background: statusConfig[resultado.status]?.bg,
                  color: statusConfig[resultado.status]?.color,
                  padding: '0.4rem 1rem', borderRadius: '9999px', fontSize: '0.85rem', fontWeight: '700',
                  display: 'flex', alignItems: 'center', gap: '0.4rem'
                }}>
                  {statusConfig[resultado.status]?.icon}
                  {resultado.status}
                </span>
              </div>

              {/* Dados */}
              <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  {[
                    { label: 'Data de Entrada', valor: resultado.data },
                    { label: 'Prazo de Resposta', valor: resultado.prazo },
                    { label: 'Secretaria', valor: resultado.secretaria },
                    { label: 'Solicitante', valor: resultado.cidadao },
                  ].map((item, i) => (
                    <div key={i} style={{ background: '#f8fafc', borderRadius: '0.5rem', padding: '0.75rem 1rem' }}>
                      <p style={{ margin: 0, fontSize: '0.72rem', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{item.label}</p>
                      <p style={{ margin: 0, fontWeight: '600', color: '#0f172a', marginTop: '0.2rem', fontSize: '0.9rem' }}>{item.valor}</p>
                    </div>
                  ))}
                </div>

                <div style={{ background: '#f8fafc', borderRadius: '0.5rem', padding: '1rem' }}>
                  <p style={{ margin: '0 0 0.4rem', fontSize: '0.72rem', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Assunto</p>
                  <p style={{ margin: 0, fontWeight: '600', color: '#0f172a' }}>{resultado.assunto}</p>
                </div>

                {resultado.detalhamento && (
                  <div style={{ background: '#f8fafc', borderRadius: '0.5rem', padding: '1rem' }}>
                    <p style={{ margin: '0 0 0.4rem', fontSize: '0.72rem', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Detalhamento</p>
                    <p style={{ margin: 0, color: '#374151', lineHeight: '1.6', fontSize: '0.9rem' }}>{resultado.detalhamento}</p>
                  </div>
                )}

                {/* Resposta da secretaria */}
                {resultado.resposta ? (
                  <div style={{ background: '#dcfce7', border: '1px solid #86efac', borderRadius: '0.75rem', padding: '1.25rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                      <CheckCircle size={18} color="#15803d" />
                      <p style={{ margin: 0, fontSize: '0.8rem', fontWeight: '700', color: '#15803d' }}>
                        RESPOSTA DA {resultado.secretaria?.toUpperCase()} — {resultado.dataResposta}
                      </p>
                    </div>
                    <p style={{ margin: 0, color: '#166534', lineHeight: '1.7' }}>{resultado.resposta}</p>
                    {resultado.respondidoPor && (
                      <p style={{ margin: '0.75rem 0 0', fontSize: '0.8rem', color: '#15803d', fontWeight: '600' }}>
                        Respondido por: {resultado.respondidoPor}
                      </p>
                    )}
                  </div>
                ) : (
                  <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '0.75rem', padding: '1rem', display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                    <Clock size={18} color="#1d4ed8" style={{ flexShrink: 0, marginTop: '0.1rem' }} />
                    <p style={{ margin: 0, color: '#1e40af', fontSize: '0.875rem', lineHeight: '1.5' }}>
                      Seu pedido está em análise. Você receberá a resposta dentro do prazo legal de até 20 dias.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Aviso de protocolo */}
          {!buscado && (
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
              <Info size={18} color="#0369a1" style={{ flexShrink: 0, marginTop: '0.1rem' }} />
              <p style={{ margin: 0, color: '#0369a1', fontSize: '0.875rem', lineHeight: '1.6' }}>
                O número do protocolo é gerado automaticamente e enviado para o seu e-mail logo após a criação do pedido no sistema.
              </p>
            </div>
          )}
        </div>

        {/* Link fazer pedido */}
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <p style={{ color: '#64748b', fontSize: '0.9rem', margin: '0 0 0.75rem' }}>Deseja registrar uma nova solicitação?</p>
          <Link to="/novo-pedido"
            style={{ background: '#127246', color: 'white', padding: '0.75rem 2rem', borderRadius: '0.5rem', fontWeight: '700', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.95rem' }}>
            <FileText size={18} /> Fazer um Pedido
          </Link>
        </div>

        {/* Lista de Meus Pedidos (Aparece apenas quando não há busca ativa) */}
        {!buscado && user && meusPedidos.length > 0 && (
          <div style={{ marginTop: '3rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <div style={{ background: '#0a4d8c', width: '32px', height: '32px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                <FileText size={18} />
              </div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '800', margin: 0, color: '#0f172a' }}>Meus Pedidos Recentes</h2>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {meusPedidos.map(p => (
                <button 
                  key={p.id} 
                  onClick={() => selecionarPedido(p)}
                  style={{ 
                    background: 'white', border: '1px solid #e2e8f0', borderRadius: '1rem', 
                    padding: '1.25rem 1.5rem', display: 'flex', justifyContent: 'space-between', 
                    alignItems: 'center', cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.04)' 
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = '#0a4d8c';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = '#e2e8f0';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.04)';
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.4rem' }}>
                      <span style={{ fontWeight: '800', color: '#0a4d8c', fontSize: '0.95rem' }}>{p.id}</span>
                      <span style={{ color: '#94a3b8', fontSize: '0.8rem' }}>• {p.data}</span>
                    </div>
                    <p style={{ margin: 0, fontWeight: '600', color: '#0f172a', fontSize: '0.9rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '350px' }}>
                      {p.assunto}
                    </p>
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <span style={{
                      background: statusConfig[p.status]?.bg,
                      color: statusConfig[p.status]?.color,
                      padding: '0.35rem 0.85rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: '700',
                      display: 'flex', alignItems: 'center', gap: '0.35rem', whiteSpace: 'nowrap'
                    }}>
                      {statusConfig[p.status]?.icon}
                      {p.status}
                    </span>
                    <ArrowRight size={18} color="#94a3b8" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
