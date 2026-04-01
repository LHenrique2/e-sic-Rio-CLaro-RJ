import { BookOpen, Scale, ShieldCheck, Clock, XCircle, CheckCircle, Users, FileText, ExternalLink } from 'lucide-react';

export default function Admin() {
  const principios = [
    { icon: <ShieldCheck size={22} />, cor: '#e0f2fe', corIcon: '#0369a1', titulo: 'Publicidade como Regra', texto: 'A divulgação de informações públicas é a norma. O sigilo só é permitido em casos previstos em lei.' },
    { icon: <Users size={22} />, cor: '#dcfce7', corIcon: '#15803d', titulo: 'Acesso Universal', texto: 'Qualquer pessoa, física ou jurídica, pode solicitar informações públicas, sem necessidade de apresentar motivo.' },
    { icon: <Clock size={22} />, cor: '#fef9c3', corIcon: '#a16207', titulo: 'Prazo de Resposta', texto: 'Os órgãos têm 20 dias para responder, podendo prorrogar por mais 10 dias com justificativa formal.' },
    { icon: <FileText size={22} />, cor: '#f3e8ff', corIcon: '#7c3aed', titulo: 'Gratuidade', texto: 'O acesso à informação é gratuito. Apenas o custo de reprodução dos documentos pode ser cobrado.' },
  ];

  const direitos = [
    'Solicitar qualquer informação pública a órgãos federais, estaduais e municipais',
    'Receber a informação no local, por e-mail ou pelo correio, conforme sua preferência',
    'Ter sua identidade preservada caso solicite sigilo na identificação',
    'Recorrer em caso de negativa de acesso à informação',
    'Ser informado sobre o andamento do seu pedido a qualquer momento',
    'Obter gratuitamente certidão, extrato ou cópia de documento público',
  ];

  const excecoes = [
    { cor: '#fee2e2', corIcon: '#dc2626', titulo: 'Sigilo Imprescindível', texto: 'Informações que possam colocar em risco a segurança do Estado ou da sociedade.' },
    { cor: '#fef9c3', corIcon: '#ca8a04', titulo: 'Dados Pessoais', texto: 'Informações pessoais que violem a intimidade, vida privada, honra e imagem das pessoas.' },
    { cor: '#fee2e2', corIcon: '#dc2626', titulo: 'Segredo de Justiça', texto: 'Processos e investigações que estejam sob segredo de justiça por determinação judicial.' },
    { cor: '#fef9c3', corIcon: '#ca8a04', titulo: 'Sigilo Fiscal e Bancário', texto: 'Informações cobertas pelo sigilo fiscal, bancário, comercial e profissional, conforme legislação específica.' },
  ];

  return (
    <>
      {/* Hero */}
      <section className="hero" style={{ padding: '6rem 0 8rem 0', minHeight: 'auto', alignItems: 'flex-start' }}>
        <div className="hero-bg"></div>
        <div className="hero-overlay" style={{ background: 'linear-gradient(135deg, rgba(144, 210, 178, 0.85) 0%, rgba(94, 169, 137, 0.8) 100%)' }}></div>
        <div className="container">
          <div className="hero-content" style={{ maxWidth: '850px', marginTop: '1rem' }}>
            <span style={{ backgroundColor: 'rgba(255,255,255,0.25)', color: 'rgba(255,255,255,0.95)', border: '1px solid rgba(255,255,255,0.4)', borderRadius: '50px', padding: '0.4rem 1.25rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', fontSize: '0.85rem', fontWeight: 'bold', letterSpacing: '0.5px' }}>
              <Scale size={16} /> LEI Nº 12.527 / 2011
            </span>
            <h1 style={{ color: '#0a4d8c', textShadow: '0 1px 2px rgba(255,255,255,0.3)', fontSize: '3.5rem', marginBottom: '1.5rem', fontWeight: '900', lineHeight: '1.1' }}>
              Lei de Acesso à Informação
            </h1>
            <p style={{ color: 'white', textShadow: '0 1px 3px rgba(0,0,0,0.3)', fontSize: '1.25rem', lineHeight: '1.6', margin: 0, fontWeight: '500' }}>
              A Lei de Acesso à Informação (LAI) regulamenta o direito constitucional de todo
              cidadão ao acesso às informações produzidas ou guardadas pelos órgãos e
              entidades públicas. Conheça seus direitos e como exercê-los.
            </p>
          </div>
        </div>
      </section>

      {/* Conteúdo */}
      <section style={{ backgroundColor: '#eaf5ee', padding: '4rem 0 0 0', marginTop: '-4rem', position: 'relative', zIndex: 10 }}>
        <div className="container" style={{ paddingBottom: '4rem' }}>

          {/* O que é a LAI */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
            <div style={{ background: '#cffafe', border: '1px solid #0a4d8c', color: '#0a4d8c', padding: '0.5rem', borderRadius: '8px', display: 'inline-flex' }}>
              <BookOpen size={24} />
            </div>
            <h2 style={{ fontSize: '1.75rem', color: '#0f172a', margin: 0, fontWeight: '800' }}>O que é a LAI?</h2>
          </div>

          <div style={{ background: 'white', borderRadius: '1rem', padding: '3rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', marginBottom: '3rem' }}>
            <p style={{ color: '#475569', fontSize: '1.1rem', lineHeight: '1.8', marginBottom: '1.5rem' }}>
              A <strong>Lei nº 12.527, de 18 de novembro de 2011</strong>, conhecida como <strong>Lei de Acesso à Informação (LAI)</strong>, regulamenta o inciso XXXIII do art. 5º, o inciso II do § 3º do art. 37 e o § 2º do art. 216 da Constituição Federal.
            </p>
            <p style={{ color: '#475569', fontSize: '1.1rem', lineHeight: '1.8', marginBottom: '1.5rem' }}>
              Em vigor desde <strong>16 de maio de 2012</strong>, a LAI estabelece que a <strong>publicidade é a regra</strong> e o sigilo é a exceção. Isso significa que os órgãos e entidades públicas devem divulgar informações de interesse coletivo de forma proativa e atender a qualquer pedido de acesso à informação realizado pelo cidadão.
            </p>
            <p style={{ color: '#475569', fontSize: '1.1rem', lineHeight: '1.8', margin: 0 }}>
              A lei se aplica a todos os órgãos e entidades dos Poderes Executivo, Legislativo e Judiciário da União, dos Estados, do Distrito Federal e dos <strong>Municípios</strong>, incluindo a Prefeitura Municipal de Rio Claro - RJ.
            </p>
          </div>

          {/* Princípios Fundamentais */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
            <div style={{ background: '#e0e7ff', border: '1px solid #4338ca', color: '#4338ca', padding: '0.5rem', borderRadius: '8px', display: 'inline-flex' }}>
              <Scale size={24} />
            </div>
            <h2 style={{ fontSize: '1.75rem', color: '#0f172a', margin: 0, fontWeight: '800' }}>Princípios Fundamentais</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem', marginBottom: '3rem' }}>
            {principios.map((p, i) => (
              <div key={i} style={{ background: 'white', borderRadius: '1rem', padding: '2rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.07)', display: 'flex', gap: '1.25rem', alignItems: 'flex-start' }}>
                <div style={{ background: p.cor, color: p.corIcon, padding: '0.75rem', borderRadius: '10px', flexShrink: 0, display: 'flex' }}>
                  {p.icon}
                </div>
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#0f172a', marginBottom: '0.5rem' }}>{p.titulo}</h3>
                  <p style={{ color: '#64748b', fontSize: '0.95rem', lineHeight: '1.6', margin: 0 }}>{p.texto}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Seus Direitos */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
            <div style={{ background: '#dcfce7', border: '1px solid #15803d', color: '#15803d', padding: '0.5rem', borderRadius: '8px', display: 'inline-flex' }}>
              <Users size={24} />
            </div>
            <h2 style={{ fontSize: '1.75rem', color: '#0f172a', margin: 0, fontWeight: '800' }}>Seus Direitos como Cidadão</h2>
          </div>

          <div style={{ background: 'white', borderRadius: '1rem', padding: '3rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.07)', marginBottom: '3rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              {direitos.map((d, i) => (
                <div key={i} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start', padding: '1rem', background: '#f8fafc', borderRadius: '0.75rem' }}>
                  <CheckCircle size={20} color="#15803d" style={{ flexShrink: 0, marginTop: '0.1rem' }} />
                  <p style={{ color: '#374151', fontSize: '0.95rem', lineHeight: '1.5', margin: 0 }}>{d}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Exceções ao Acesso */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
            <div style={{ background: '#fee2e2', border: '1px solid #dc2626', color: '#dc2626', padding: '0.5rem', borderRadius: '8px', display: 'inline-flex' }}>
              <XCircle size={24} />
            </div>
            <h2 style={{ fontSize: '1.75rem', color: '#0f172a', margin: 0, fontWeight: '800' }}>Exceções ao Acesso</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem', marginBottom: '3rem' }}>
            {excecoes.map((e, i) => (
              <div key={i} style={{ background: 'white', borderRadius: '1rem', padding: '2rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.07)', borderLeft: `4px solid ${e.corIcon}` }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                  <div style={{ background: e.cor, color: e.corIcon, padding: '0.4rem', borderRadius: '6px', display: 'flex' }}>
                    <XCircle size={18} />
                  </div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: '#0f172a', margin: 0 }}>{e.titulo}</h3>
                </div>
                <p style={{ color: '#64748b', fontSize: '0.95rem', lineHeight: '1.6', margin: 0 }}>{e.texto}</p>
              </div>
            ))}
          </div>

          {/* Banner - Texto completo da lei */}
          <div style={{ background: 'linear-gradient(135deg, #0a4d8c 0%, #127246 100%)', borderRadius: '1rem', padding: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
            <div>
              <h3 style={{ color: 'white', fontSize: '1.5rem', fontWeight: '800', marginBottom: '0.5rem' }}>Leia o texto completo da lei</h3>
              <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '1rem', margin: 0, lineHeight: '1.5' }}>
                Acesse o texto integral da Lei nº 12.527/2011 diretamente no Portal da Legislação do Governo Federal.
              </p>
            </div>
            <a
              href="https://www.planalto.gov.br/ccivil_03/_ato2011-2014/2011/lei/l12527.htm"
              target="_blank"
              rel="noopener noreferrer"
              style={{ background: 'white', color: '#0a4d8c', padding: '0.875rem 2rem', borderRadius: '0.5rem', fontWeight: '700', fontSize: '1rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', whiteSpace: 'nowrap' }}
            >
              Ver Lei Completa <ExternalLink size={18} />
            </a>
          </div>

        </div>
      </section>
    </>
  );
}
