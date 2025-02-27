import React from "react";
import { Card, CardContent, Typography, Grid, Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Users, UserCheck, Briefcase, MapPin } from "lucide-react";

const StatsCard = ({ title, count, icon: Icon, color }) => {
    const theme = useTheme();
    
    return (
      <Card
        sx={{
          backgroundColor: theme.palette.background.paper,
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            transform: 'translateY(-5px)',
            boxShadow: theme.shadows[4],
          },
        }}
      >
        <CardContent>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
            }}
          >
            <Box>
              <Typography
                variant="subtitle2"
                sx={{
                  color: theme.palette.text.secondary,
                  marginBottom: theme.spacing(0.5),
                }}
              >
                {title}
              </Typography>
              <Typography
                variant="h4"
                sx={{
                  color: theme.palette.text.primary,
                  fontWeight: theme.typography.fontWeightBold,
                }}
              >
                {count}
              </Typography>
            </Box>
            <Box
              sx={{
                backgroundColor: `${color}15`,
                borderRadius: theme.shape.borderRadius * 1.5,
                padding: theme.spacing(1),
              }}
            >
              <Icon size={24} color={color} />
            </Box>
          </Box>
        </CardContent>
      </Card>
    );
  };
  
const EmployeeStats = ({ employees }) => {
  const activeEmployees = employees.filter((employee) => !employee.deletedAt);
  const activeEmployeesStatus = employees.filter((employee)=> employee.status == 'Afastado')
  const activeEmployeesStatusInativo = employees.filter((employee)=> employee.status == 'Inativo')
  const totalEmployees = employees.length;
  const activeEmployeeCount = activeEmployees.length - activeEmployeesStatus.length - activeEmployeesStatusInativo.length;
  const departments = [...new Set(employees.map((employee) => employee.department))];
  const locations = [...new Set(employees.map((employee) => employee.codigoLocal?.name))];

  const stats = [
    {
      title: "Total de Funcionários",
      count: totalEmployees,
      icon: Users,
      color: "#3498db",
    },
    {
      title: "Funcionários Ativos",
      count: activeEmployeeCount,
      icon: UserCheck,
      color: "#2ecc71",
    },
    {
      title: "Departamentos",
      count: departments.length - 1,
      icon: Briefcase,
      color: "#9b59b6",
    },
    {
      title: "Localizações",
      count: locations.length - 1,
      icon: MapPin,
      color: "#e74c3c",
    },
  ];

  return (
    <Box sx={{mt: '-4rem'}}>
      <Grid container spacing={3}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <StatsCard
              title={stat.title}
              count={stat.count}
              icon={stat.icon}
              color={stat.color}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default EmployeeStats;