// First, fix the import
import { 
    Menu as MuiMenu,  // Rename to avoid conflict with Lucide Menu
    List,
    ListItem,
    ListItemText,
    ListItemAvatar,
    Paper,
    Typography,
    Box,
    Avatar,
    Fade,
  } from '@mui/material';
  import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
  import { format } from 'date-fns';
  import { ptBR } from 'date-fns/locale';
  
  export const NotificationMenu = ({ anchorEl, open, onClose, notifications }) => {
    console.log(notifications);
    
    return (
      <MuiMenu
        anchorEl={anchorEl}
        open={open}
        onClose={onClose}
        TransitionComponent={Fade}
        sx={{
          '& .MuiPaper-root': {
            width: 360,
            maxHeight: 480,
            borderRadius: '12px',
            mt: 1.5,
            boxShadow: 4,
          },
        }}
      >
      
          <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Notificações
            </Typography>
          </Box>
  
          {notifications.length === 0 ? (
            <Box sx={{ p: 3, textAlign: 'center' }}>
              <Typography color="text.secondary">
                Nenhuma notificação no momento
              </Typography>
            </Box>
          ) : (
            <List sx={{ p: 0 }}>
              {notifications.map((notification, index) => (
                <ListItem
                  key={index}
                  sx={{
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                    backgroundColor: notification.read ? 'transparent' : 'action.hover',
                    '&:hover': {
                      backgroundColor: 'action.hover',
                    },
                  }}
                  button
                >
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: 'primary.main' }}>
                      <ShoppingCartIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Typography variant="subtitle2">
                        Lembrete de Recompra
                      </Typography>
                    }
                    secondary={
                      <>
                        <Typography variant="body2" color="text.secondary">
                          {`Itens para recompra: ${notification?.items?.map(item => item.name).join(', ') || 'Sem itens'}`}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Próxima Compra: {format(new Date(notification.nextPurchaseDate), "dd 'de' MMMM ", { locale: ptBR })}
                        </Typography>
                        <Box>
                        <Typography variant="caption" color="text.secondary">
                          {format(new Date(notification.sentAt), "dd 'de' MMMM 'às' HH:mm", { locale: ptBR })}
                        </Typography>
                        </Box>
                       
                      </>
                    }
                  />
                </ListItem>
              ))}
            </List>
          )}

      </MuiMenu>
    );
  };