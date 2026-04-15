import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Send, ArrowLeft, LogIn, UserPlus, ShieldCheck, FileText } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function NovoPedido() {
  const navigate = useNavigate();
  const { user, criarPedido, SECRETARIAS } = useAuth();
  const [formData, setFormData] = useState({
    secretaria: '',
    assunto: '',
    detalhamento: ''
  });
  const [enviando, setEnviando] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setEnviando(true);

    // Simula um delay de processamento
    setTimeout(() => {
      const novo = criarPedido({
        ...formData,
        cidadao: user.nome,
        cpf: user.cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '***.***.$3-$4') // Mascarado
      });
      
      setEnviando(false);
      alert(`Pedido criado com sucesso! O Protocolo é: ${novo.id}`);
      navigate('/cidadao');
    }, 800);
  };

  // ─── Usuário não logado: tela de bloqueio ───
  if (!user) {
    return (
      <div style={{ background: '#f1f5f9', minHeight: 'calc(100vh - 80px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <div style={{ maxWidth: '560px', width: '100%', textAlign: 'center' }}>

          {/* Ícone */}
          <div style={{ width: '80px', height: '80px', background: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
            <FileText size={36} color="#0a4d8c" />
          </div>

          {/* Título */}
          <h1 style={{ fontSize: '1.75rem', fontWeight: '800', color: '#0f172a', marginBottom: '0.75rem' }}>
            Identificação Necessária
          </h1>
          <p style={{ color: '#64748b', fontSize: '1.05rem', lineHeight: '1.6', marginBottom: '2.5rem' }}>
            Para registrar um pedido de informação no e-SIC, você precisa estar logado ou criar uma conta de cidadão.
          </p>

          {/* Aviso legal */}
          <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '0.75rem', padding: '1rem 1.25rem', marginBottom: '2rem', display: 'flex', gap: '0.75rem', alignItems: 'flex-start', textAlign: 'left' }}>
            <ShieldCheck size={20} color="#1d4ed8" style={{ flexShrink: 0, marginTop: '0.1rem' }} />
            <p style={{ margin: 0, fontSize: '0.875rem', color: '#1e40af', lineHeight: '1.5' }}>
              <strong>Por que preciso me identificar?</strong><br />
              A identificação é necessária para que você possa acompanhar o andamento do seu pedido e receber a resposta do órgão público. Seus dados ficam protegidos conforme a LGPD.
            </p>
          </div>

          {/* Botões */}
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/login"
              style={{ background: '#0a4d8c', color: 'white', padding: '0.875rem 2rem', borderRadius: '0.5rem', fontWeight: '700', fontSize: '1rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', transition: 'all 0.2s' }}>
              <LogIn size={20} /> Entrar na Conta
            </Link>
            <Link to="/login"
              style={{ background: 'white', color: '#0a4d8c', border: '2px solid #0a4d8c', padding: '0.875rem 2rem', borderRadius: '0.5rem', fontWeight: '700', fontSize: '1rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', transition: 'all 0.2s' }}>
              <UserPlus size={20} /> Criar uma Conta
            </Link>
          </div>

          <Link to="/"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#64748b', textDecoration: 'none', marginTop: '2rem', fontSize: '0.9rem', fontWeight: '500' }}>
            <ArrowLeft size={16} /> Voltar para a página inicial
          </Link>

        </div>
      </div>
    );
  }

  // ─── Usuário logado: exibe o formulário ───
  return (
    <div className="container" style={{ marginTop: '3rem', maxWidth: '800px', paddingBottom: '4rem' }}>
      <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)', marginBottom: '1.5rem', fontWeight: '500' }}>
        <ArrowLeft size={18} /> Voltar
      </Link>

      {/* Identificação do usuário logado */}
      <div style={{ background: '#dcfce7', border: '1px solid #86efac', borderRadius: '0.75rem', padding: '0.875rem 1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <ShieldCheck size={20} color="#15803d" style={{ flexShrink: 0 }} />
        <p style={{ margin: 0, fontSize: '0.9rem', color: '#15803d', fontWeight: '600' }}>
          Logado como <strong>{user.nome}</strong> — seu pedido será vinculado à sua conta.
        </p>
      </div>

      <div className="card">
        <h2>Novo Pedido de Informação (e-SIC)</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
          Preencha o formulário institucional abaixo para registrar seu pedido de informação junto à Prefeitura Municipal de Rio Claro RJ.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="grid-cols-3" style={{ gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Órgão Solicitado</label>
              <select 
                className="form-input" 
                required 
                value={formData.secretaria}
                onChange={e => setFormData({...formData, secretaria: e.target.value})}
              >
                <option value="">Selecione a Secretaria...</option>
                {SECRETARIAS.map(sec => (
                  <option key={sec} value={sec}>{sec}</option>
                ))}
              </select>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Assunto</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="Ex: Licitação da praça, Gastos do mês..." 
                required 
                value={formData.assunto}
                onChange={e => setFormData({...formData, assunto: e.target.value})}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Detalhamento do Pedido</label>
            <textarea
              className="form-input"
              rows="6"
              placeholder="Descreva a informação pública que deseja obter de forma clara e objetiva para facilitar o atendimento..."
              required
              value={formData.detalhamento}
              onChange={e => setFormData({...formData, detalhamento: e.target.value})}
            ></textarea>
            <p style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              É proibido exigir motivos para a solicitação de informação de interesse público (Art. 10, §3º da LAI).
            </p>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem' }}>
            <Link to="/" className="btn btn-outline" style={{ border: 'none', color: 'var(--text-muted)' }}>Cancelar</Link>
            <button type="submit" className="btn btn-primary" disabled={enviando}>
              <Send size={18} /> {enviando ? 'Enviando...' : 'Enviar Pedido'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
