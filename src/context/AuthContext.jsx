import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

const ADMIN_CREDENTIALS = { matricula: 'admin', senha: 'admin123' };

const SERVIDORES_INICIAIS = [
  { id: 1, nome: 'Ana Paula Rodrigues', matricula: 'S001', senha: 'senha123', secretaria: 'Secretaria de Saúde', email: 'ana.rodrigues@rioclaro.rj.gov.br', ativo: true },
  { id: 2, nome: 'Carlos Eduardo Lima', matricula: 'S002', senha: 'senha123', secretaria: 'Secretaria de Educação', email: 'carlos.lima@rioclaro.rj.gov.br', ativo: true },
  { id: 3, nome: 'Fernanda Costa', matricula: 'S003', senha: 'senha123', secretaria: 'Secretaria de Obras e Infraestrutura', email: 'fernanda.costa@rioclaro.rj.gov.br', ativo: true },
];

const PEDIDOS_INICIAIS = [
  { id: 'RC-2026-0014', cidadao: 'João Silva', cpf: '***.***.456-78', assunto: 'Licitações de Obras Públicas', detalhamento: 'Solicito informações sobre os contratos de licitação das obras públicas realizadas no último trimestre.', data: '28/03/2026', prazo: '18/04/2026', diasRestantes: 17, status: 'Novo', secretaria: 'Secretaria de Obras e Infraestrutura', resposta: null, respondidoPor: null, dataResposta: null },
  { id: 'RC-2026-0013', cidadao: 'Maria Oliveira', cpf: '***.***.123-90', assunto: 'Folha de Pagamento dos Servidores', detalhamento: 'Gostaria de obter acesso à folha de pagamento dos servidores municipais referente ao mês de fevereiro de 2026.', data: '25/03/2026', prazo: '04/04/2026', diasRestantes: 3, status: 'Em Análise', secretaria: 'Secretaria de Administração', resposta: null, respondidoPor: null, dataResposta: null },
  { id: 'RC-2026-0012', cidadao: 'Carlos Souza', cpf: '***.***.789-11', assunto: 'Contratos de Saúde Municipal', detalhamento: 'Solicito cópia dos contratos firmados com clínicas e hospitais credenciados à Secretaria de Saúde.', data: '20/03/2026', prazo: '30/03/2026', diasRestantes: -2, status: 'Atrasado', secretaria: 'Secretaria de Saúde', resposta: null, respondidoPor: null, dataResposta: null },
  { id: 'RC-2026-0011', cidadao: 'Ana Ferreira', cpf: '***.***.321-44', assunto: 'Gastos com Merenda Escolar', detalhamento: 'Solicito os dados de gastos com merenda escolar e os contratos com fornecedores do ano letivo 2025.', data: '15/03/2026', prazo: '25/03/2026', diasRestantes: 0, status: 'Respondido', secretaria: 'Secretaria de Educação', resposta: 'Os gastos com merenda escolar estão disponíveis no Portal da Transparência. O contrato com o fornecedor principal foi encaminhado ao e-mail da solicitante conforme protocolo.', respondidoPor: 'Carlos Eduardo Lima', dataResposta: '24/03/2026' },
  { id: 'RC-2026-0010', cidadao: 'Pedro Lima', cpf: '***.***.654-22', assunto: 'Obras de Pavimentação', detalhamento: 'Quero informações sobre o andamento das obras de pavimentação da Rua XV de Novembro.', data: '10/03/2026', prazo: '20/03/2026', diasRestantes: 0, status: 'Respondido', secretaria: 'Secretaria de Obras e Infraestrutura', resposta: 'As obras de pavimentação da Rua XV estão com 78% de conclusão, com previsão de término para 15/04/2026. Documentação completa disponível na Secretaria de Obras.', respondidoPor: 'Fernanda Costa', dataResposta: '18/03/2026' },
];

// Versão dos dados — incrementar aqui força reset dos servidores iniciais
const DATA_VERSION = 'v3';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = sessionStorage.getItem('esic_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [servidores, setServidores] = useState(() => {
    const versao = localStorage.getItem('esic_data_version');
    if (versao !== DATA_VERSION) {
      // Dados desatualizados: reseta servidores e pedidos para os valores iniciais
      localStorage.setItem('esic_data_version', DATA_VERSION);
      localStorage.setItem('esic_servidores', JSON.stringify(SERVIDORES_INICIAIS));
      localStorage.setItem('esic_pedidos', JSON.stringify(PEDIDOS_INICIAIS));
      return SERVIDORES_INICIAIS;
    }
    const saved = localStorage.getItem('esic_servidores');
    return saved ? JSON.parse(saved) : SERVIDORES_INICIAIS;
  });

  const [cidadaos, setCidadaos] = useState(() => {
    const saved = localStorage.getItem('esic_cidadaos');
    return saved ? JSON.parse(saved) : [];
  });

  const [pedidos, setPedidos] = useState(() => {
    const saved = localStorage.getItem('esic_pedidos');
    return saved ? JSON.parse(saved) : PEDIDOS_INICIAIS;
  });

  // ── Helpers de persistência ──
  function salvarServidores(lista) { setServidores(lista); localStorage.setItem('esic_servidores', JSON.stringify(lista)); }
  function salvarCidadaos(lista)  { setCidadaos(lista);  localStorage.setItem('esic_cidadaos',  JSON.stringify(lista)); }
  function salvarPedidos(lista)   { setPedidos(lista);   localStorage.setItem('esic_pedidos',   JSON.stringify(lista)); }

  // ── Pedidos ──
  function responderPedido(id, resposta, nomeServidor) {
    const hoje = new Date().toLocaleDateString('pt-BR');
    const lista = pedidos.map(p =>
      p.id === id
        ? { ...p, resposta, respondidoPor: nomeServidor, dataResposta: hoje, status: 'Respondido', diasRestantes: 0 }
        : p
    );
    salvarPedidos(lista);
  }

  function atualizarStatusPedido(id, status) {
    salvarPedidos(pedidos.map(p => p.id === id ? { ...p, status } : p));
  }

  // ── Auth ──
  function loginCidadao(cpf, senha) {
    const cidadao = cidadaos.find(c => c.cpf === cpf && c.senha === senha);
    if (!cidadao) return { ok: false, erro: 'CPF ou senha inválidos.' };
    const userData = { nome: cidadao.nome, perfil: 'cidadao', cpf: cidadao.cpf, email: cidadao.email, id: cidadao.id };
    setUser(userData);
    sessionStorage.setItem('esic_user', JSON.stringify(userData));
    return { ok: true, perfil: 'cidadao' };
  }

  function cadastrarCidadao(dados) {
    if (cidadaos.find(c => c.cpf === dados.cpf))   return { ok: false, erro: 'Já existe uma conta com esse CPF.' };
    if (cidadaos.find(c => c.email === dados.email)) return { ok: false, erro: 'Já existe uma conta com esse e-mail.' };
    const novo = { ...dados, id: Date.now() };
    salvarCidadaos([...cidadaos, novo]);
    const userData = { nome: novo.nome, perfil: 'cidadao', cpf: novo.cpf, email: novo.email, id: novo.id };
    setUser(userData);
    sessionStorage.setItem('esic_user', JSON.stringify(userData));
    return { ok: true };
  }

  function login(matricula, senha) {
    if (matricula === ADMIN_CREDENTIALS.matricula && senha === ADMIN_CREDENTIALS.senha) {
      const userData = { nome: 'Administrador SIC', perfil: 'admin', matricula };
      setUser(userData);
      sessionStorage.setItem('esic_user', JSON.stringify(userData));
      return { ok: true, perfil: 'admin' };
    }
    const servidor = servidores.find(s => s.matricula === matricula && s.senha === senha && s.ativo);
    if (servidor) {
      const userData = { nome: servidor.nome, perfil: 'servidor', matricula: servidor.matricula, secretaria: servidor.secretaria, email: servidor.email, id: servidor.id };
      setUser(userData);
      sessionStorage.setItem('esic_user', JSON.stringify(userData));
      return { ok: true, perfil: 'servidor' };
    }
    return { ok: false, erro: 'Matrícula ou senha inválidos.' };
  }

  function logout() { setUser(null); sessionStorage.removeItem('esic_user'); }

  // ── Servidores CRUD ──
  function cadastrarServidor(dados) {
    if (servidores.find(s => s.matricula === dados.matricula)) return { ok: false, erro: 'Já existe um servidor com essa matrícula.' };
    salvarServidores([...servidores, { ...dados, id: Date.now(), ativo: true }]);
    return { ok: true };
  }
  function editarServidor(id, dados) { salvarServidores(servidores.map(s => s.id === id ? { ...s, ...dados } : s)); return { ok: true }; }
  function toggleServidorAtivo(id)   { salvarServidores(servidores.map(s => s.id === id ? { ...s, ativo: !s.ativo } : s)); }
  function removerServidor(id)       { salvarServidores(servidores.filter(s => s.id !== id)); }

  return (
    <AuthContext.Provider value={{
      user, login, loginCidadao, logout,
      cadastrarCidadao, cidadaos,
      servidores, cadastrarServidor, editarServidor, toggleServidorAtivo, removerServidor,
      pedidos, responderPedido, atualizarStatusPedido,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
