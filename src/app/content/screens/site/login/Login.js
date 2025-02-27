import React, { useContext } from "react";
import { Box, Button, TextField, Typography, CircularProgress, Paper, Divider } from "@mui/material";
import { useFormik } from 'formik';
import * as Yup from 'yup';
import AuthContext from "@/app/context/AuthContext";
import { useRouter } from "next/router";
import { useSnackbar } from 'notistack';
import styles from './login.module.css';
import Image from "next/image";
import LogoSanegrande from '../../../../../../public/icons/logo-sanegrande.png';
import LogoEnterhome from '../../../../../../public/icons/logo-enterhome.png';
import Wave from "@/app/components/Footer/Wave";

const URL_LOCAL = 'http://localhost:5000/api/';
const URL = 'https://sysgrande-nodejs.onrender.com/api/'

const LoginPage = () => {
    const { login } = useContext(AuthContext);
    const router = useRouter();
    const { enqueueSnackbar } = useSnackbar();

    const formik = useFormik({
        initialValues: {
            email: '',
            password: ''
        },
        validationSchema: Yup.object({
            email: Yup.string()
                .email('Email inválido')
                .required('Email é obrigatório'),
            password: Yup.string()
                .min(6, 'Senha deve ter no mínimo 6 caracteres')
                .required('Senha é obrigatória')
        }),
        onSubmit: async (values, { setSubmitting }) => {
            try {
                const response = await fetch(`${URL}login`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(values),
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || "Falha no login");
                }

                await login(data);
                enqueueSnackbar('Login realizado com sucesso!', { variant: 'success' });
                await router.push("/dashboard/admin");
            } catch (error) {
                console.error("Erro no login:", error);
                enqueueSnackbar(error.message || 'Erro no login. Verifique suas credenciais.', { variant: 'error' });
            } finally {
                setSubmitting(false);
            }
        },
    });

    return (
        <Box className={styles.containerLogin} sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            minHeight: "100vh",
            background: "linear-gradient(135deg, #f5f7fa 0%, #e4ecf7 100%)"
        }}>
            <Paper elevation={3} sx={{
                width: { xs: '90%', sm: '450px' },
                margin: '0 auto',
                borderRadius: '12px',
                overflow: 'hidden',
                height: '650px',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)'
            }}>
                {/* Header with logos */}
                <Box sx={{
                    padding: '24px',
                    background: 'linear-gradient(90deg, #5E899D 0%, #4A7185 100%)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center'
                }}>
                    <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '16px 0',
                        width: '100%'
                    }}>
                        <Box sx={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            backgroundColor: 'rgba(255, 255, 255, 0.9)',
                            padding: '12px 24px',
                            borderRadius: '12px',
                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
                        }}>
                            <Box sx={{ 
                                display: 'flex', 
                                alignItems: 'center',
                                marginRight: '16px'
                            }}>
                                <Image
                                    src={LogoSanegrande}
                                    width={60}
                                    height={60}
                                    style={{
                                        objectFit: 'contain',
                                        filter: 'drop-shadow(0px 2px 2px rgba(0, 0, 0, 0.2))'
                                    }}
                                    alt="Logo - Sanegrande"
                                />
                            </Box>
                            <Divider orientation="vertical" flexItem sx={{ 
                                height: '80px', 
                                backgroundColor: '#5E899D', 
                                width: '2px'
                            }} />
                            <Box sx={{ 
                                display: 'flex', 
                                alignItems: 'center',
                                marginLeft: '16px'
                            }}>
                                <Image
                                    src={LogoEnterhome}
                                    width={75}
                                    height={75}
                                    style={{
                                        objectFit: 'contain',
                                        filter: 'drop-shadow(0px 2px 2px rgba(0, 0, 0, 0.2))'
                                    }}
                                    alt="Logo - Enterhome"
                                />
                            </Box>
                        </Box>
                    </Box>
                    <Typography variant="h6" component="h1" color="white" sx={{ 
                        mt: 2,
                        fontWeight: 500,
                        letterSpacing: '0.5px',
                        textShadow: '0px 1px 2px rgba(0, 0, 0, 0.3)'
                    }}>
                        Sistema de Gestão Integrado
                    </Typography>
                </Box>

                {/* Form section */}
                <Box sx={{
                    padding: '32px 40px 40px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '16px'
                }}>
                    <Typography variant="h5" component="h2" align="center" sx={{ 
                        mb: 3,
                        fontWeight: 600,
                        color: '#2D3748'
                    }}>
                        Login
                    </Typography>
                    <form onSubmit={formik.handleSubmit} style={{ width: '100%' }}>
                        <TextField
                            fullWidth
                            id="email"
                            name="email"
                            label="E-mail"
                            variant="outlined"
                            value={formik.values.email}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.email && Boolean(formik.errors.email)}
                            helperText={formik.touched.email && formik.errors.email}
                            disabled={formik.isSubmitting}
                            sx={{ 
                                mb: 3,
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: '8px',
                                    '&.Mui-focused fieldset': {
                                        borderColor: '#5E899D',
                                    },
                                },
                                '& .MuiInputLabel-root.Mui-focused': {
                                    color: '#5E899D',
                                }
                            }}
                        />
                        <TextField
                            fullWidth
                            id="password"
                            name="password"
                            type="password"
                            label="Senha"
                            variant="outlined"
                            value={formik.values.password}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.password && Boolean(formik.errors.password)}
                            helperText={formik.touched.password && formik.errors.password}
                            disabled={formik.isSubmitting}
                            sx={{ 
                                mb: 3,
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: '8px',
                                    '&.Mui-focused fieldset': {
                                        borderColor: '#5E899D',
                                    },
                                },
                                '& .MuiInputLabel-root.Mui-focused': {
                                    color: '#5E899D',
                                }
                            }}
                        />
                        <Button 
                            type="submit"
                            variant="contained"
                            fullWidth
                            disabled={formik.isSubmitting}
                            sx={{ 
                                mt: 2, 
                                padding: '12px',
                                borderRadius: '8px',
                                background: 'linear-gradient(90deg, #5E899D 0%, #4A7185 100%)',
                                boxShadow: '0 4px 10px rgba(94, 137, 157, 0.3)',
                                textTransform: 'none',
                                fontSize: '16px',
                                fontWeight: 500,
                                '&:hover': {
                                    background: 'linear-gradient(90deg, #4A7185 0%, #3D5F74 100%)',
                                }
                            }}
                        >
                            {formik.isSubmitting ? (
                                <CircularProgress size={24} color="inherit" />
                            ) : 'Entrar'}
                        </Button>
                    </form>
                </Box>
            </Paper>
            
                <Wave />
         
        </Box>
    );
};

export default LoginPage;