const { Dialog, DialogTitle, DialogContent, TextField, Button, DialogActions } = require("@mui/material");




// Componente do Modal
const EvaluationModal = ({ open, handleClose, evaluation }) => {
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>
        {evaluation ? 'Editar Avaliação' : 'Nova Avaliação'}
      </DialogTitle>
      <DialogContent>
        <TextField
          label="Mês/Ano"
          fullWidth
          margin="normal"
        />
        <TextField
          label="Desempenho (%)"
          type="number"
          fullWidth
          margin="normal"
        />
        <TextField
          label="Presença (%)"
          type="number"
          fullWidth
          margin="normal"
        />
        <TextField
          label="Produtividade (%)"
          type="number"
          fullWidth
          margin="normal"
        />
        <TextField
          label="Comentários"
          multiline
          rows={4}
          fullWidth
          margin="normal"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancelar</Button>
        <Button variant="contained" onClick={handleClose}>
          Salvar
        </Button>
      </DialogActions>
    </Dialog>
  );
};