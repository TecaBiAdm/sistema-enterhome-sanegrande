import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useContext } from 'react';
import AuthContext from '../context/AuthContext';
import NotAuthorized from '../../pages/not-authorized'; // Componente que exibe a mensagem de acesso negado

// Higher Order Component para proteger rotas
const withAuth = (WrappedComponent, requiredRole = null) => {
  return function ProtectedRoute(props) {
    const { user, loading } = useContext(AuthContext); // Obtendo o contexto de autenticação
    const router = useRouter();

    useEffect(() => {
      // Se o usuário não estiver logado, redireciona para a página de login
      if (!loading && !user) {
        router.push('/login');
      }
    }, [loading, user, router]);

    if (loading) {
      return <div>Carregando...</div>; // Mostrar enquanto carrega
    }

    if (user) {
      // Verificar se o usuário tem a role necessária
      if (requiredRole && user.role !== requiredRole) {
        return <NotAuthorized />; // Exibir componente de acesso negado
      }

      return <WrappedComponent {...props} />;
    }

    return null;
  };
};

export default withAuth;
