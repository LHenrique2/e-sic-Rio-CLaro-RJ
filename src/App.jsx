import { Outlet, Link, useLocation } from 'react-router-dom';
import { Shield, FileText, Search, Scale, User, LogOut } from 'lucide-react';
import { useAuth } from './context/AuthContext';
import brasao from './image/brasao.png';

function App() {
  const location = useLocation();
  const { user, logout } = useAuth();

  return (
    <>
      <header style={{ borderBottom: '1px solid var(--border-color)', background: 'white' }}>
        <div className="container header-inner">
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
            <img src={brasao} alt="Brasão de Rio Claro" style={{ width: '52px', height: '52px', objectFit: 'contain' }} />
            <div style={{ display: 'flex', flexDirection: 'column', lineHeight: '1.2' }}>
              <span style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--primary)', maxWidth: '250px' }}>
                Prefeitura Municipal de Rio Claro - RJ
              </span>
              <span style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--secondary)' }}>
                E-SIC - Serviço de Informação ao Cidadão
              </span>
            </div>
          </Link>

          <nav className="nav-links">
            <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active-pill' : ''}`}>
              <Shield size={18} /> Início
            </Link>
            <Link to="/novo-pedido" className={`nav-link ${location.pathname.includes('/novo-pedido') ? 'active-pill' : ''}`}>
              <FileText size={18} /> Novo Pedido
            </Link>
            <Link to="/cidadao" className={`nav-link ${location.pathname.includes('/cidadao') ? 'active-pill' : ''}`}>
              <Search size={18} /> Consultar
            </Link>
            <Link to="/admin" className={`nav-link ${location.pathname.includes('/admin') ? 'active-pill' : ''}`}>
              <Scale size={18} /> Lei de Acesso
            </Link>
            <div style={{ paddingLeft: '1rem', borderLeft: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              {user ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-main)', lineHeight: '1' }}>{user.nome}</span>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '800' }}>{user.perfil}</span>
                  </div>
                  
                  {user.perfil === 'admin' && (
                    <Link to="/painel-admin" style={{ background: '#0a4d8c', color: 'white', padding: '0.4rem 0.8rem', borderRadius: '0.5rem', fontSize: '0.75rem', fontWeight: '700', textDecoration: 'none' }}>
                      PAINEL
                    </Link>
                  )}
                  {user.perfil === 'servidor' && (
                    <Link to="/painel-servidor" style={{ background: '#127246', color: 'white', padding: '0.4rem 0.8rem', borderRadius: '0.5rem', fontSize: '0.75rem', fontWeight: '700', textDecoration: 'none' }}>
                      PAINEL
                    </Link>
                  )}

                  <button onClick={logout} style={{ background: '#f1f5f9', border: 'none', borderRadius: '0.5rem', padding: '0.5rem', cursor: 'pointer', color: '#64748b', display: 'flex' }} title="Sair">
                    <LogOut size={18} />
                  </button>
                </div>
              ) : (
                <Link to="/login" className="btn-header">
                  Entrar
                </Link>
              )}
            </div>
          </nav>

        </div>
      </header>

      <main style={{ minHeight: 'calc(100vh - 150px)', paddingBottom: '0' }}>
        <Outlet />
      </main>

      <footer style={{ backgroundColor: '#003a8c', color: 'white', padding: '4rem 0 2rem 0', marginTop: '4rem' }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr', gap: '2rem', alignItems: 'start' }}>

          {/* Column 1: Brand / Text */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <img src={brasao} alt="Brasão de Rio Claro" style={{ width: '56px', height: '56px', objectFit: 'contain' }} />
              <span style={{ fontSize: '1.5rem', fontWeight: '800' }}>Rio Claro - RJ</span>
            </div>
            <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.95rem', lineHeight: '1.6', maxWidth: '350px' }}>
              E-SIC - Sistema Eletrônico do Serviço de Informação ao Cidadão. Garantindo a transparência e o acesso à informação pública no município.
            </p>
          </div>

          {/* Column 2: Links */}
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: 'bold', marginBottom: '1.5rem', letterSpacing: '0.5px' }}>LINKS ÚTEIS</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <Link to="/novo-pedido" style={{ color: 'rgba(255, 255, 255, 0.8)', textDecoration: 'none', transition: 'color 0.2s' }}>Fazer um Pedido</Link>
              <Link to="/cidadao" style={{ color: 'rgba(255, 255, 255, 0.8)', textDecoration: 'none', transition: 'color 0.2s' }}>Acompanhar Pedido</Link>
              <Link to="https://rioclaro-rj.portaltp.com.br" style={{ color: 'rgba(255, 255, 255, 0.8)', textDecoration: 'none', transition: 'color 0.2s' }}>Portal da Transparência</Link>
              <Link to="/admin" style={{ color: 'rgba(255, 255, 255, 0.8)', textDecoration: 'none', transition: 'color 0.2s' }}>Entenda a Lei</Link>
            </div>
          </div>

          {/* Column 3: Contact */}
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: 'bold', marginBottom: '1.5rem', letterSpacing: '0.5px' }}>CONTATO</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1.25rem', lineHeight: '1.2' }}>📍</span>
                <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.95rem', margin: 0 }}>
                  Rua AV. João Batista Portugal, 230, Centro<br />RIO CLARO - RJ
                </p>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1.25rem', lineHeight: '1.2' }}>📞</span>
                <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.95rem', margin: 0 }}>
                  (24) 3332-1292<br />(24) 3332-1914
                </p>
              </div>
            </div>
          </div>

        </div>

        <div className="container" style={{ marginTop: '3rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.2)', textAlign: 'center', fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)' }}>
          © {new Date().getFullYear()} Prefeitura Municipal de Rio Claro RJ. Todos os direitos reservados.
        </div>
      </footer>
    </>
  );
}

export default App;
