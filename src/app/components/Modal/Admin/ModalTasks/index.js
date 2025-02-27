import React, { useContext, useEffect, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  Typography,
  useTheme,
  Divider,
} from '@mui/material';
import { AttachFile, FormatBold, FormatItalic, FormatListBulleted, FormatListNumbered, Code } from '@mui/icons-material';
import AuthContext from '@/app/context/AuthContext';

const defaultData = {
  title: '',
  description: '',
  deadline: '',
  priority: '',
  comments: [],
  checklist: [],
  labels: [],
  attachments: [],
  history: [],
};

const MenuBar = ({ editor }) => {
  if (!editor) {
    return null;
  }

  return (
    <Box sx={{ 
      display: 'flex', 
      gap: 1, 
      mb: 1, 
      p: 1, 
      borderBottom: '1px solid', 
      borderColor: 'divider' 
    }}>
      <Button
        size="small"
        variant={editor.isActive('bold') ? 'contained' : 'outlined'}
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        <FormatBold />
      </Button>
      <Button
        size="small"
        variant={editor.isActive('italic') ? 'contained' : 'outlined'}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        <FormatItalic />
      </Button>
      <Button
        size="small"
        variant={editor.isActive('bulletList') ? 'contained' : 'outlined'}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      >
        <FormatListBulleted />
      </Button>
      <Button
        size="small"
        variant={editor.isActive('orderedList') ? 'contained' : 'outlined'}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      >
        <FormatListNumbered />
      </Button>
      <Button
        size="small"
        variant={editor.isActive('codeBlock') ? 'contained' : 'outlined'}
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
      >
        <Code />
      </Button>
    </Box>
  );
};

const TaskModal = ({ open, onClose, onSubmit, initialData, isEditing = false }) => {
  const [taskData, setTaskData] = useState(initialData || defaultData);
  const [activeTab, setActiveTab] = useState(0);
  const [comment, setComment] = useState('');
  const [checklistItem, setChecklistItem] = useState('');

  const { user } = useContext(AuthContext);
  const theme = useTheme();

  const editor = useEditor({
    extensions: [
      StarterKit,
      Link,
    ],
    content: taskData.description,
    onUpdate: ({ editor }) => {
      setTaskData(prev => ({
        ...prev,
        description: editor.getHTML()
      }));
    },
  });

  useEffect(() => {
    if (editor && initialData?.description) {
      editor.commands.setContent(initialData.description);
    }
  }, [editor, initialData]);

  useEffect(() => {
    setTaskData(initialData || defaultData);
  }, [initialData]);

  const handleChange = (field) => (event) => {
    setTaskData({ ...taskData, [field]: event.target.value });
  };

  const formatDetails = (details) => {
    return Object.entries(details).map(([key, value]) => (
      <Box key={key} sx={{ mt: 1 }}>
        <Typography variant="caption" color="text.secondary">
          {key.charAt(0).toUpperCase() + key.slice(1)}:
        </Typography>
        <Typography variant="body2" color="primary">
          {typeof value === 'object' && value !== null 
            ? `${value.old} → ${value.new}`
            : value}
        </Typography>
      </Box>
    ));
  };

  const getEventColor = (event) => {
    switch (event) {
      case 'Task Created': return 'success';
      case 'Task Updated': return 'info';
      case 'User Assigned': return 'primary';
      case 'User Unassigned': return 'warning';
      default: return 'default';
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>
        <TextField
          fullWidth
          value={taskData.title}
          onChange={handleChange('title')}
          variant="standard"
          placeholder="Título da Tarefa"
        />
      </DialogTitle>
      
      <DialogContent>
        <Tabs value={activeTab} onChange={(e, v) => setActiveTab(v)}>
          <Tab label="Detalhes" />
          <Tab label="Atividade" />
          <Tab label="Anexos" />
        </Tabs>

        <Box sx={{ mt: 2 }}>
          {activeTab === 0 && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ 
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 1,
                overflow: 'hidden'
              }}>
                <MenuBar editor={editor} />
                <Box sx={{ p: 2, minHeight: '200px' }}>
                  <EditorContent editor={editor} />
                </Box>
              </Box>
              
              <TextField
                type="date"
                label="Data Limite"
                InputLabelProps={{ shrink: true }}
                value={taskData.deadline}
                onChange={handleChange('deadline')}
              />

              <FormControl>
                <InputLabel>Prioridade</InputLabel>
                <Select
                  value={taskData.priority}
                  onChange={handleChange('priority')}
                  label="Prioridade"
                >
                  <MenuItem value="Low">Baixa</MenuItem>
                  <MenuItem value="Medium">Média</MenuItem>
                  <MenuItem value="High">Alta</MenuItem>
                </Select>
              </FormControl>
            </Box>
          )}

          {activeTab === 1 && (
            <List sx={{ maxWidth: 800, margin: 'auto', p: 2 }}>
              {taskData?.history?.sort((a, b) => new Date(b.date) - new Date(a.date)).map((entry, index, arr) => (
                <React.Fragment key={index}>
                  <ListItem sx={{ 
                    flexDirection: 'column', 
                    alignItems: 'flex-start', 
                    py: 2,
                    backgroundColor: index === 0 ? 'rgba(25, 118, 210, 0.08)' : 'transparent',
                    borderRadius: index === 0 ? 1 : 0
                  }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1, width: '100%' }}>
                      <Chip
                        label={
                          entry.event === 'Task Created' ? 'Tarefa Criada' :
                          entry.event === 'Task Updated' ? 'Tarefa Atualizada' :
                          entry.event === 'User Assigned' ? 'Usuário Atribuído' :
                          entry.event === 'User Unassigned' ? 'Usuário Removido' :
                          entry.event
                        }
                        color={index === 0 ? 'primary' : getEventColor(entry.event)}
                        variant={index === 0 ? "filled" : "outlined"}
                        size="small"
                      />
                      <Typography variant="caption" color="text.secondary">
                        {new Date(entry.date).toLocaleString('pt-BR')}
                      </Typography>
                    </Box>
                    {entry.details && (
                      <Box sx={{ pl: 2, borderLeft: '2px solid', borderColor: 'divider', width: '100%' }}>
                        {formatDetails(entry.details)}
                      </Box>
                    )}
                  </ListItem>
                  {index < arr.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          )}

          {activeTab === 2 && (
            <Box>
              <input
                type="file"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    setTaskData({
                      ...taskData,
                      attachments: [...(taskData.attachments || []), {
                        name: file.name,
                        size: file.size,
                        type: file.type,
                      }]
                    });
                  }
                }}
              />
              <List>
                {taskData.attachments?.map((file, index) => (
                  <ListItem key={index}>
                    <ListItemIcon>
                      <AttachFile />
                    </ListItemIcon>
                    <ListItemText 
                      primary={file.name}
                      secondary={`${(file.size / 1024).toFixed(2)} KB`}
                    />
                  </ListItem>
                ))}
              </List>
            </Box>
          )}
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button variant="contained" onClick={() => onSubmit(taskData)}>
          {isEditing ? 'Salvar' : 'Adicionar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TaskModal;