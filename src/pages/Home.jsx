import { Link } from 'react-router-dom';
import { FileText, Search, Scale, AlertCircle, ArrowRight, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const { user } = useAuth();

  return (
    <>
      <section className="hero">
        <div className="hero-bg"></div>
        <div className="hero-overlay"></div>
        <div className="container">
          <div className="hero-content">
            <span className="hero-badge">TRANSPARÊNCIA PÚBLICA</span>
            {user ? (
               <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                  <div style={{ background: 'rgba(255,255,255,0.2)', padding: '0.75rem', borderRadius: '50%', display: 'flex' }}>
                    <User size={32} color="white" />
                  </div>
                  <h1 style={{ marginBottom: 0, fontSize: '2.5rem' }}>Olá, {user.nome.split(' ')[0]}!</h1>
               </div>
            ) : (
              <h1>
                Sistema Eletrônico do<br />
                Serviço de Informação<br />
                ao Cidadão
              </h1>
            )}
            <p>
              O e-SIC permite que qualquer pessoa, física ou jurídica, encaminhe
              pedidos de acesso à informação para órgãos e entidades da Prefeitura
              de Rio Claro - RJ.
            </p>
            <div className="hero-buttons">
              <Link to="/novo-pedido" className="btn-hero-primary">
                <FileText size={18} /> Fazer um Pedido
              </Link>
              <Link to="/cidadao" className="btn-hero-outline">
                <Search size={18} /> Consultar Protocolo
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="container cards-section">
        <div className="grid-cols-3">
          {/* Card 1 */}
          <div style={{ background: 'white', borderRadius: '1rem', padding: '2rem', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05)', display: 'flex', flexDirection: 'column', height: '100%' }}>
            <div style={{ background: '#e0f2fe', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0369a1', marginBottom: '1.5rem' }}>
              <FileText size={24} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#0f172a', marginBottom: '1rem' }}>1. Faça seu pedido</h3>
            <p style={{ color: '#64748b', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '2rem', flexGrow: 1 }}>
              Preencha o formulário online com seus dados e detalhe a informação que deseja obter do poder público municipal.
            </p>
            <Link to="/novo-pedido" style={{ color: '#0369a1', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
              Registrar agora <ArrowRight size={16} />
            </Link>
          </div>
          
          {/* Card 2 */}
          <div style={{ background: 'white', borderRadius: '1rem', padding: '2rem', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05)', display: 'flex', flexDirection: 'column', height: '100%' }}>
            <div style={{ background: '#dcfce7', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#15803d', marginBottom: '1.5rem' }}>
              <Search size={24} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#0f172a', marginBottom: '1rem' }}>2. Acompanhe</h3>
            <p style={{ color: '#64748b', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '2rem', flexGrow: 1 }}>
              Ao registrar, você receberá um número de protocolo. Guarde-o para consultar o andamento e a resposta do seu pedido.
            </p>
            <Link to="/cidadao" style={{ color: '#15803d', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
              Consultar protocolo <ArrowRight size={16} />
            </Link>
          </div>

          {/* Card 3 */}
          <div style={{ background: 'white', borderRadius: '1rem', padding: '2rem', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05)', display: 'flex', flexDirection: 'column', height: '100%' }}>
            <div style={{ background: '#e0e7ff', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4338ca', marginBottom: '1.5rem' }}>
              <Scale size={24} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#0f172a', marginBottom: '1rem' }}>3. Entenda a Lei</h3>
            <p style={{ color: '#64748b', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '2rem', flexGrow: 1 }}>
              A Lei de Acesso à Informação (Lei 12.527/11) garante a qualquer pessoa o direito de solicitar informações públicas aos órgãos do governo.
            </p>
            <Link to="/admin" style={{ color: '#4338ca', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
              Saiba mais <ArrowRight size={16} />
            </Link>
          </div>
        </div>

        {/* Prazos e Normas Box */}
        <div style={{ marginTop: '3rem', background: 'rgba(255, 255, 255, 0.5)', border: '1px solid #e2e8f0', borderRadius: '1rem', padding: '2rem', display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          <div style={{ background: 'white', width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
            <AlertCircle size={32} color="#0f3d7a" />
          </div>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#0f172a', marginBottom: '0.5rem' }}>Prazos e Normas</h3>
            <p style={{ color: '#64748b', fontSize: '1rem', lineHeight: '1.6', margin: 0 }}>
              Conforme a legislação vigente, o órgão público tem o prazo de <strong>20 dias</strong> para responder ao seu pedido, podendo ser prorrogado por mais 10 dias, mediante justificativa expressa.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
