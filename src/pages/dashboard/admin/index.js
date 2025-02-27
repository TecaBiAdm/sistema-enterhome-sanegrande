import ScreenDashboard from "@/app/content/screens/dashboardAdmin";
import withAuth from '../../../app/utils/withAuth'; // Importando o HOC que protege a rota

function DashboardContainer() {
  return (
    <ScreenDashboard />
  );
}

// Proteger a rota exigindo a role de "Administrador"
export default withAuth(DashboardContainer, 'Administrador');
