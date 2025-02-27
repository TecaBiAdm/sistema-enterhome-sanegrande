import { useCompany } from "@/app/context/CompanyContext";
import { Typography, Box, useTheme, Fade, Divider } from "@mui/material";
import { useEffect, useState } from "react";

export default function TitleDashboardComponent({ title, subtitle }) {
  const { company } = useCompany();
  const theme = useTheme();

  const [selectedCompany, setSelectedCompany] = useState("");
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    if (company?.name !== selectedCompany) {
      setSelectedCompany(company.name || "");
      setAnimate(true);
      const timer = setTimeout(() => setAnimate(false), 500);
      return () => clearTimeout(timer);
    }
  }, [company, selectedCompany]);

  return (
    <Fade in={true} timeout={700}>
      <Box
        sx={{
          position: 'relative',
          mb: 4,
          mt: '-1.5rem',
          '&::after': {
            content: '""',
            position: 'absolute',
            bottom: 0,
            left: 0,
            bottom: '1.2rem',
            width: '100%',
            height: '1px',
            background: `linear-gradient(to right, ${theme.palette.primary.main}, ${theme.palette.primary.light}, transparent)`,
          }
        }}
      >
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column',
          gap: .5,
          pb: 3,
        }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              color: theme.palette.text.primary,
              letterSpacing: '-0.5px',
              fontSize: { xs: '1.5rem', sm: '2rem' },
              lineHeight: 1.2,
              textShadow: theme.palette.mode === 'dark' ? 'none' : '0 2px 4px rgba(0,0,0,0.05)',
            }}
          >
            {title}
          </Typography>

          <Box 
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
              color: theme.palette.text.secondary,
            }}
          >
            <Typography
              variant="subtitle1"
              sx={{
                fontSize: '0.975rem',
                lineHeight: 1.5,
                color: 'inherit',
              }}
            >
              {subtitle}
            </Typography>
            
            <Fade in={animate}>
              <Typography
                component="span"
                sx={{
                  fontWeight: 600,
                  color: theme.palette.primary.main,
                  backgroundColor: theme.palette.primary.main + '10',
                  px: 1,
                  py: 0.5,
                  borderRadius: 1,
                  fontSize: '0.875rem',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    backgroundColor: theme.palette.primary.main + '20',
                  }
                }}
              >
                {company?.name}
              </Typography>
            </Fade>
          </Box>
        </Box>
      </Box>
    </Fade>
  );
}