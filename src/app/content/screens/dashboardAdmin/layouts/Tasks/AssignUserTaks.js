import React, { useContext, useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Avatar,
  Typography,
  Chip,
  Button,
  Tooltip,
  CircularProgress,
  useTheme,
} from '@mui/material';
import { assignUserToTask, fetchUsers } from './API'; 
import AuthContext from '@/app/context/AuthContext';
import toast from 'react-hot-toast';

const AssignUserDialog = ({ 
  open, 
  onClose, 
  task, 
  onAssignUser 
}) => {
  const [systemUsers, setSystemUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const {user} = useContext(AuthContext);
  const theme = useTheme();

  useEffect(() => {
    if (open) {
      setLoading(true);
      fetchUsers()
        .then((data) => {
          setSystemUsers(data);
          setLoading(false);
        })
        .catch((error) => {
          console.error('Erro ao buscar usuários:', error);
          toast.error('Erro ao carregar usuários');
          setLoading(false);
        });
    }
  }, [open]);

  const isUserAssigned = (userId) => {
    return task?.assignedUsers?.some((u) => u.id === userId);
  };

  const handleUserClick = async (userId) => {
    try {
      setLoading(true);
      
      // Encontra o usuário selecionado para mostrar o nome na notificação
      const selectedUser = systemUsers.find(user => user.id === userId);
      
      if (!selectedUser) {
        throw new Error('Usuário não encontrado');
      }
  
      // Chama a API para atribuir/desatribuir o usuário
      const response = await assignUserToTask(
        task._id,
        userId,
        user._id // usuário atual do AuthContext
      );
      
      // Atualiza a lista de usuários atribuídos no componente pai
      onAssignUser();
      
      // Determina se o usuário foi removido ou adicionado
      const isRemoving = isUserAssigned(userId);
      
      // Mostra notificação de sucesso
      toast.success(
        isRemoving 
          ? `${selectedUser.name} removido da tarefa "${task.title}"`
          : `${selectedUser.name} atribuído à tarefa "${task.title}"`,
        {
          duration: 3000,
          position: 'top-center',
          style: {
            background: '#fff',
            color: '#333',
            boxShadow: '0 3px 10px rgba(0, 0, 0, 0.1)',
            borderRadius: '8px',
            padding: '16px',
          },
        }
      );
  
      // Se houver informação sobre email enviado na resposta da API
      if (response.emailSent) {
        toast.success('Notificação enviada por email', {
          duration: 3000,
          position: 'top-center',
        });
      }
  
    } catch (error) {
      console.error('Erro ao atribuir usuário:', error);
      toast.error(error.message || 'Erro ao atribuir usuário à tarefa');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      fullWidth
      maxWidth="xs"
    >
      <DialogTitle>
        <Typography variant="h6">Atribuir Usuários</Typography>
        <Typography variant="caption" color={theme.palette.text.secondary}>
          Tarefa: {task?.title}
        </Typography>
      </DialogTitle>
      
      <DialogContent>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Box sx={{ pt: 2 }}>
            {systemUsers.map((user) => {
              const isAssigned = isUserAssigned(user.id);
              
              return (
                <Box 
                  key={user.id}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    p: 1.5,
                    cursor: 'pointer',
                    borderRadius: 1,
                    '&:hover': {
                      backgroundColor: 'action.hover'
                    },
                    transition: 'background-color 0.2s ease'
                  }}
                  onClick={() => handleUserClick(user.id)}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Tooltip title={`${user.name} (${user.email})`}>
                      <Avatar 
                        sx={{ 
                          bgcolor: isAssigned ? 'primary.main' : 'grey.400',
                          width: 40, 
                          height: 40 
                        }}
                      >
                        {user.name[0]}{user.name.split(' ')[1]?.[0]}
                      </Avatar>
                    </Tooltip>
                    
                    <Box>
                      <Typography variant="subtitle2">
                        {user.name}
                      </Typography>
                      <Typography 
                        variant="caption" 
                        color={theme.palette.text.secondary}
                        sx={{ display: 'block' }}
                      >
                        {user.email}
                      </Typography>
                    </Box>
                  </Box>

                  <Chip
                    label={isAssigned ? "Atribuído" : "Atribuir"}
                    size="small"
                    color={isAssigned ? "primary" : "default"}
                    sx={{ 
                      minWidth: 85,
                      '&:hover': {
                        backgroundColor: isAssigned ? 'primary.dark' : 'action.hover'
                      }
                    }}
                  />
                </Box>
              );
            })}
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button 
          onClick={onClose}
          variant="outlined"
          size="medium"
        >
          Fechar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AssignUserDialog;