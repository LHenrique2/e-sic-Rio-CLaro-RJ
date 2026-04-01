import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import App from './App.jsx';
import './index.css';

import { AuthProvider } from './context/AuthContext.jsx';
import RotaAdmin from './components/RotaAdmin.jsx';
import { useAuth } from './context/AuthContext.jsx';

import Home from './pages/Home.jsx';
import Cidadao from './pages/Cidadao.jsx';
import Admin from './pages/Admin.jsx';
import PainelAdmin from './pages/PainelAdmin.jsx';
import PainelServidor from './pages/PainelServidor.jsx';
import NovoPedido from './pages/NovoPedido.jsx';
import Login from './pages/Login.jsx';

// Guard para rota de servidor
function RotaServidor({ children }) {
  const { user } = useAuth();
  if (!user || user.perfil !== 'servidor') return <Navigate to="/login" replace />;
  return children;
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />}>
            <Route index element={<Home />} />
            <Route path="login" element={<Login />} />
            <Route path="cidadao" element={<Cidadao />} />
            <Route path="novo-pedido" element={<NovoPedido />} />
            <Route path="admin" element={<Admin />} />
            <Route
              path="painel-admin"
              element={<RotaAdmin><PainelAdmin /></RotaAdmin>}
            />
            <Route
              path="painel-servidor"
              element={<RotaServidor><PainelServidor /></RotaServidor>}
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>,
);
