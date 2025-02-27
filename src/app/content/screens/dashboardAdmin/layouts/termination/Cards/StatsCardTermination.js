import React from "react";
import { Card, CardContent, Typography, Grid, Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Users, UserCheck, Briefcase, MapPin, UserRoundX } from "lucide-react";
import { theme } from "@/app/theme";


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
  
const TerminationStats = ({ terminations }) => {

    console.log(terminations)
  const pendingTerminations = terminations.filter((termination)=> 
    termination.status == 'Pendente')
  const totalTerminations = terminations;
    const finishTerminations = ''

  const stats = [
    {
      title: "Total de Rescisões",
      count: totalTerminations.length,
      icon: UserRoundX,
      color: theme.palette.error.light,
    },
    {
      title: "Rescisões Pendentes",
      count: pendingTerminations.length,
      icon: UserCheck,
      color: theme.palette.warning.main,
    },
    {
      title: "Rescisões Concluídas",
      count: finishTerminations.length - 1,
      icon: Briefcase,
      color: "#9b59b6",
    },
   
  ];

  return (
    <Box>
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

export default TerminationStats;