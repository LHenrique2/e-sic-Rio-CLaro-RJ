import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, ShieldCheck, ArrowRight, AlertCircle, UserPlus, ArrowLeft, Eye, EyeOff, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

// Formata CPF enquanto digita: 000.000.000-00
function formatarCPF(valor) {
  return valor
    .replace(/\D/g, '')
    .slice(0, 11)
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
}

// Formata telefone: (00) 00000-0000
function formatarTelefone(valor) {
  return valor
    .replace(/\D/g, '')
    .slice(0, 11)
    .replace(/(\d{2})(\d)/, '($1) $2')
    .replace(/(\d{5})(\d)/, '$1-$2');
}

export default function Login() {
  const [modo, setModo] = useState('login'); // 'login' | 'cadastro'
  const [tipoLogin, setTipoLogin] = useState('cidadao');

  // Login
  const [cpf, setCpf] = useState('');
  const [matricula, setMatricula] = useState('');
  const [senha, setSenha] = useState('');
  const [verSenha, setVerSenha] = useState(false);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');

  // Cadastro
  const [cad, setCad] = useState({ nome: '', cpf: '', email: '', telefone: '', senha: '', confirmarSenha: '' });
  const [verSenhaCad, setVerSenhaCad] = useState(false);
  const [cadLoading, setCadLoading] = useState(false);
  const [cadErro, setCadErro] = useState('');

  const navigate = useNavigate();
  const { login, loginCidadao, cadastrarCidadao } = useAuth();

  // ── Submissão de Login ──
  function handleLogin(e) {
    e.preventDefault();
    setErro('');
    setLoading(true);
    setTimeout(() => {
      if (tipoLogin === 'cidadao') {
        const res = loginCidadao(cpf.replace(/\D/g, ''), senha);
        if (res.ok) { navigate('/cidadao'); }
        else { setErro(res.erro); }
      } else {
        const res = login(matricula, senha);
        if (res.ok) {
          if (res.perfil === 'admin') navigate('/painel-admin');
          else navigate('/painel-servidor');
        } else { setErro(res.erro); }
      }
      setLoading(false);
    }, 600);
  }

  // ── Submissão de Cadastro ──
  function handleCadastro(e) {
    e.preventDefault();
    setCadErro('');
    if (cad.senha !== cad.confirmarSenha) { setCadErro('As senhas não conferem.'); return; }
    if (cad.senha.length < 6) { setCadErro('A senha deve ter pelo menos 6 caracteres.'); return; }
    const cpfLimpo = cad.cpf.replace(/\D/g, '');
    if (cpfLimpo.length !== 11) { setCadErro('Digite um CPF válido com 11 dígitos.'); return; }

    setCadLoading(true);
    setTimeout(() => {
      const res = cadastrarCidadao({ ...cad, cpf: cpfLimpo });
      if (res.ok) { navigate('/cidadao'); }
      else { setCadErro(res.erro); }
      setCadLoading(false);
    }, 600);
  }

  // ── MODO CADASTRO ──
  if (modo === 'cadastro') {
    return (
      <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 200px)', padding: '2rem' }}>
        <div className="card" style={{ width: '100%', maxWidth: '540px', padding: '2.5rem' }}>
          <button onClick={() => { setModo('login'); setCadErro(''); }}
            style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '1.5rem', fontWeight: '500', padding: 0 }}>
            <ArrowLeft size={16} /> Voltar para o login
          </button>

          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{ width: '56px', height: '56px', background: '#e0f2fe', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', color: '#0369a1' }}>
              <UserPlus size={26} />
            </div>
            <h2 style={{ margin: '0 0 0.25rem' }}>Criar Conta de Cidadão</h2>
            <p style={{ color: '#64748b', margin: 0, fontSize: '0.9rem' }}>Preencha seus dados para acessar o e-SIC</p>
          </div>

          {cadErro && (
            <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '0.5rem', padding: '0.75rem 1rem', marginBottom: '1.5rem', display: 'flex', gap: '0.5rem', alignItems: 'center', color: '#dc2626', fontSize: '0.875rem' }}>
              <AlertCircle size={16} style={{ flexShrink: 0 }} /> {cadErro}
            </div>
          )}

          <form onSubmit={handleCadastro} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
            <div>
              <label className="form-label">Nome Completo *</label>
              <input className="form-input" type="text" placeholder="Seu nome completo" required
                value={cad.nome} onChange={e => setCad({ ...cad, nome: e.target.value })} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label className="form-label">CPF *</label>
                <input className="form-input" type="text" placeholder="000.000.000-00" required
                  value={cad.cpf}
                  onChange={e => setCad({ ...cad, cpf: formatarCPF(e.target.value) })} />
              </div>
              <div>
                <label className="form-label">Telefone</label>
                <input className="form-input" type="text" placeholder="(00) 00000-0000"
                  value={cad.telefone}
                  onChange={e => setCad({ ...cad, telefone: formatarTelefone(e.target.value) })} />
              </div>
            </div>

            <div>
              <label className="form-label">E-mail *</label>
              <input className="form-input" type="email" placeholder="seu@email.com" required
                value={cad.email} onChange={e => setCad({ ...cad, email: e.target.value })} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label className="form-label">Senha * (mín. 6 caracteres)</label>
                <div style={{ position: 'relative' }}>
                  <input className="form-input" type={verSenhaCad ? 'text' : 'password'} placeholder="••••••••" required
                    style={{ paddingRight: '2.5rem' }}
                    value={cad.senha} onChange={e => setCad({ ...cad, senha: e.target.value })} />
                  <button type="button" onClick={() => setVerSenhaCad(!verSenhaCad)}
                    style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}>
                    {verSenhaCad ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              <div>
                <label className="form-label">Confirmar Senha *</label>
                <input className="form-input" type="password" placeholder="••••••••" required
                  value={cad.confirmarSenha} onChange={e => setCad({ ...cad, confirmarSenha: e.target.value })} />
              </div>
            </div>

            {/* Indicador de senhas coincidindo */}
            {cad.senha && cad.confirmarSenha && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: cad.senha === cad.confirmarSenha ? '#15803d' : '#dc2626' }}>
                {cad.senha === cad.confirmarSenha ? <Check size={14} /> : <AlertCircle size={14} />}
                {cad.senha === cad.confirmarSenha ? 'Senhas coincidem' : 'Senhas não coincidem'}
              </div>
            )}

            <p style={{ fontSize: '0.78rem', color: '#94a3b8', margin: 0 }}>
              Ao se cadastrar, você concorda com a utilização dos seus dados de acordo com a <strong>LGPD</strong> para fins de atendimento das solicitações via e-SIC.
            </p>

            <button type="submit" disabled={cadLoading}
              style={{ background: '#0a4d8c', color: 'white', border: 'none', borderRadius: '0.5rem', padding: '0.875rem', fontWeight: '700', fontSize: '1rem', cursor: cadLoading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', opacity: cadLoading ? 0.7 : 1, marginTop: '0.5rem' }}>
              {cadLoading ? 'Criando conta...' : <><UserPlus size={18} /> Criar Minha Conta</>}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ── MODO LOGIN ──
  return (
    <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 200px)', padding: '2rem' }}>
      <div className="card" style={{ width: '100%', maxWidth: '450px', padding: '2.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <img src="/src/image/brasao.png" alt="Brasão de Rio Claro" style={{ width: '56px', height: '56px', objectFit: 'contain', margin: '0 auto 0.5rem', display: 'block' }} />
          <h2 style={{ marginBottom: '0.25rem', marginTop: '0.5rem' }}>Acesso ao Sistema</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>Selecione o seu perfil para continuar</p>
        </div>

        {/* Seleção de perfil */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
          <button type="button" onClick={() => { setTipoLogin('cidadao'); setErro(''); }}
            style={{ padding: '1rem', borderRadius: 'var(--border-radius-md)', border: `2px solid ${tipoLogin === 'cidadao' ? 'var(--primary)' : 'var(--border-color)'}`, background: tipoLogin === 'cidadao' ? 'rgba(10,77,140,0.06)' : 'white', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', transition: 'var(--transition)' }}>
            <User size={28} color={tipoLogin === 'cidadao' ? 'var(--primary)' : 'var(--text-muted)'} />
            <span style={{ fontWeight: '600', fontSize: '0.9rem', color: tipoLogin === 'cidadao' ? 'var(--primary)' : 'var(--text-main)' }}>Cidadão</span>
          </button>
          <button type="button" onClick={() => { setTipoLogin('servidor'); setErro(''); }}
            style={{ padding: '1rem', borderRadius: 'var(--border-radius-md)', border: `2px solid ${tipoLogin === 'servidor' ? 'var(--secondary)' : 'var(--border-color)'}`, background: tipoLogin === 'servidor' ? 'rgba(18,114,70,0.06)' : 'white', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', transition: 'var(--transition)' }}>
            <ShieldCheck size={28} color={tipoLogin === 'servidor' ? 'var(--secondary)' : 'var(--text-muted)'} />
            <span style={{ fontWeight: '600', fontSize: '0.9rem', color: tipoLogin === 'servidor' ? 'var(--secondary)' : 'var(--text-main)' }}>Servidor</span>
          </button>
        </div>

        {/* Aviso servidor */}
        {tipoLogin === 'servidor' && (
          <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '0.5rem', padding: '0.75rem 1rem', marginBottom: '1.5rem', fontSize: '0.85rem', color: '#1e40af' }}>
            🔑 <strong>Acesso de teste:</strong> matrícula <code>admin</code> / senha <code>admin123</code>
          </div>
        )}

        {/* Erro */}
        {erro && (
          <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '0.5rem', padding: '0.75rem 1rem', marginBottom: '1.5rem', display: 'flex', gap: '0.5rem', alignItems: 'center', color: '#dc2626', fontSize: '0.875rem' }}>
            <AlertCircle size={16} style={{ flexShrink: 0 }} /> {erro}
          </div>
        )}

        <form onSubmit={handleLogin}>
          {tipoLogin === 'cidadao' ? (
            <>
              <div className="form-group">
                <label className="form-label">CPF</label>
                <input type="text" className="form-input" placeholder="000.000.000-00" required
                  value={cpf} onChange={e => setCpf(formatarCPF(e.target.value))} />
              </div>
              <div className="form-group">
                <label className="form-label">Senha</label>
                <div style={{ position: 'relative' }}>
                  <input type={verSenha ? 'text' : 'password'} className="form-input" placeholder="••••••••" required
                    style={{ paddingRight: '2.5rem' }}
                    value={senha} onChange={e => setSenha(e.target.value)} />
                  <button type="button" onClick={() => setVerSenha(!verSenha)}
                    style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}>
                    {verSenha ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="form-group">
                <label className="form-label">Matrícula</label>
                <input type="text" className="form-input" placeholder="Ex: admin" required
                  value={matricula} onChange={e => setMatricula(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Senha Funcional</label>
                <input type="password" className="form-input" placeholder="••••••••" required
                  value={senha} onChange={e => setSenha(e.target.value)} />
              </div>
            </>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', cursor: 'pointer' }}>
              <input type="checkbox" /> Lembrar-me
            </label>
            <a href="#" style={{ fontSize: '0.875rem', color: 'var(--primary)', fontWeight: '500' }}>Esqueceu a senha?</a>
          </div>

          <button type="submit" disabled={loading}
            style={{ width: '100%', padding: '0.875rem', borderRadius: 'var(--border-radius-md)', background: tipoLogin === 'cidadao' ? 'var(--primary)' : 'var(--secondary)', color: 'white', fontWeight: '700', fontSize: '1rem', border: 'none', cursor: loading ? 'not-allowed' : 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', opacity: loading ? 0.7 : 1, transition: 'var(--transition)' }}>
            {loading ? 'Verificando...' : <> Entrar no Portal <ArrowRight size={18} /></>}
          </button>
        </form>

        {tipoLogin === 'cidadao' && (
          <div style={{ textAlign: 'center', marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)' }}>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', margin: '0 0 0.75rem' }}>
              Ainda não tem conta?
            </p>
            <button onClick={() => { setModo('cadastro'); setErro(''); }}
              style={{ background: 'transparent', border: '2px solid var(--primary)', color: 'var(--primary)', borderRadius: 'var(--border-radius-md)', padding: '0.625rem 1.5rem', fontWeight: '700', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', transition: 'var(--transition)' }}>
              <UserPlus size={18} /> Criar Conta Gratuita
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
