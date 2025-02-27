import React from "react";
import { Droppable, Draggable } from "react-beautiful-dnd";
import {
  Box,
  Paper,
  Typography,
  Chip,
  Button,
  IconButton,
  Avatar,
  AvatarGroup,
  Tooltip,
  Divider,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import PersonAddOutlinedIcon from "@mui/icons-material/PersonAddOutlined";
import ScheduleIcon from "@mui/icons-material/Schedule";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import FlagOutlinedIcon from "@mui/icons-material/FlagOutlined";
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import PauseCircleOutlineIcon from '@mui/icons-material/PauseCircleOutline';
import PropTypes from 'prop-types'; // Adicione esta linha


export const TaskColumn = ({
  columnId,
  column,
  onAddTask,
  onEditTask,
  onDeleteTask,
  onAssignUser,
  getPriorityColor,
  theme,
}) => {
  const getColumnIcon = (columnType) => {
    const iconProps = { 
      sx: { 
        fontSize: '1.2rem',
        color: column.color || theme.palette.primary.main
      }
    };

    switch (columnType?.toLowerCase()) {
      case 'todo':
        return <FormatListBulletedIcon {...iconProps} />;
      case 'in progress':
        return <AutorenewIcon {...iconProps} />;
      case 'done':
        return <CheckCircleOutlineIcon {...iconProps} />;
      case 'blocked':
        return <PauseCircleOutlineIcon {...iconProps} />;
      default:
        return <FormatListBulletedIcon {...iconProps} />;
    }
  };

  return (
    <Box
      sx={{
        width: 320,
        minWidth: 320,
        height: 'calc(100vh - 200px)',
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
        backgroundColor: theme.palette.background.default,
        p: 1,
        borderRadius: 1,
        border: `1px solid ${theme.palette.divider}`,
        bgcolor: `rgba(235, 238, 245, ${theme.palette.mode === 'dark' ? '0.05' : '0.5'})`,
      }}
    >
      {/* Column Header */}
      <Paper
        elevation={0}
        sx={{
          p: 2,
          borderRadius: 1,
          backgroundColor: theme.palette.background.paper,
          borderBottom: `2px solid ${column.color || theme.palette.primary.main}`,
          boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {getColumnIcon(column.type)}
              <Typography
                sx={{
                  fontWeight: 600,
                  fontSize: '0.9375rem',
                  color: theme.palette.text.primary,
                  letterSpacing: '-0.025em',
                }}
              >
                {column.name}
              </Typography>
            </Box>
            <Chip
              label={column.tasks.length}
              size="small"
              sx={{
                height: 20,
                fontSize: '0.75rem',
                fontWeight: 600,
                backgroundColor: column.color ? `${column.color}15` : theme.palette.primary.light,
                color: column.color || theme.palette.primary.main,
                '& .MuiChip-label': {
                  px: 1,
                },
              }}
            />
          </Box>
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            <Tooltip title="Adicionar tarefa">
              <IconButton
                size="small"
                onClick={() => onAddTask(columnId)}
                sx={{
                  color: theme.palette.text.secondary,
                  '&:hover': {
                    backgroundColor: theme.palette.action.hover,
                    color: column.color || theme.palette.primary.main,
                  },
                }}
              >
                <AddIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Mais opções">
              <IconButton
                size="small"
                sx={{
                  color: theme.palette.text.secondary,
                  '&:hover': {
                    backgroundColor: theme.palette.action.hover,
                  },
                }}
              >
                <MoreHorizIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </Paper>

      {/* Tasks Container */}
      <Droppable droppableId={columnId}>
        {(provided, snapshot) => (
          <Box
          {...provided.droppableProps}
          ref={provided.innerRef}
          sx={{
            flex: 1,
            overflowY: 'auto',
            px: 0.5,
            py: 1,
            '::-webkit-scrollbar': {
              width: '4px',
            },
            '::-webkit-scrollbar-thumb': {
              backgroundColor: theme.palette.divider,
              borderRadius: '4px',
            },
          }}
        >
          {column.tasks.map((task, index) => (
            <Draggable
              key={task._id}
              draggableId={task._id?.toString()}
              index={index}
            >
              {(provided, snapshot) => (
                <Paper
                  ref={provided.innerRef}
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}
                  elevation={snapshot.isDragging ? 4 : 0}
                  onClick={() => onEditTask(task, columnId)}
                  sx={{
                    p: 2,
                    mb: 1.5,
                    backgroundColor: theme.palette.background.paper,
                    borderRadius: 1,
                    cursor: 'pointer',
                    border: `1px solid ${theme.palette.divider}`,
                    transition: 'all 0.2s ease',
                    position: 'relative',
                    '&:hover': {
                      backgroundColor: theme.palette.background.paper,
                      transform: 'translateY(-2px)',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                      '& .task-actions': {
                        opacity: 1,
                      },
                    },
                  }}
                >
                  {/* Task Content */}
                  <Box sx={{ mb: 2 }}>
                    <Typography
                      sx={{
                        fontSize: '0.9375rem',
                        fontWeight: 500,
                        color: theme.palette.text.primary,
                        mb: 1,
                        lineHeight: 1.5,
                      }}
                    >
                      {task.title}
                    </Typography>
                    
                  </Box>

                  {/* Task Metadata */}
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {/* Assigned Users */}
                    {task.assignedUsers?.length > 0 && (
                      <AvatarGroup
                        max={3}
                        sx={{
                          justifyContent: 'flex-start',
                          '& .MuiAvatar-root': {
                            width: 24,
                            height: 24,
                            fontSize: '0.75rem',
                            border: `2px solid ${theme.palette.background.paper}`,
                          },
                        }}
                      >
                        {task.assignedUsers.map((user) => (
                          <Tooltip key={user.id} title={user.name}>
                            <Avatar
                              alt={user.name}
                              src={user.avatar}
                              sx={{
                                bgcolor: theme.palette.primary.main,
                              }}
                            >
                              {user.name[0]}
                            </Avatar>
                          </Tooltip>
                        ))}
                      </AvatarGroup>
                    )}

                    {/* Task Footer */}
                    <Box sx={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      mt: 'auto',
                    }}>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        {task.deadline && (
                          <Chip
                            icon={<ScheduleIcon sx={{ fontSize: '0.875rem' }} />}
                            label={new Date(task.deadline).toLocaleDateString()}
                            size="small"
                            sx={{
                              height: 24,
                              backgroundColor: theme.palette.action.hover,
                              '& .MuiChip-label': {
                                px: 1,
                                fontSize: '0.75rem',
                                fontWeight: 500,
                              },
                              '& .MuiChip-icon': {
                                color: theme.palette.text.secondary,
                              },
                            }}
                          />
                        )}
                        <Chip
                          icon={<FlagOutlinedIcon sx={{ fontSize: '0.875rem' }} />}
                          label={
                            task.priority?.toLowerCase() === "high" ? "Alta" :
                            task.priority?.toLowerCase() === "medium" ? "Média" :
                            task.priority?.toLowerCase() === "low" ? "Baixa" :
                            "Normal"
                          }
                          size="small"
                          sx={{
                            height: 24,
                            backgroundColor: `${getPriorityColor(task.priority)}15`,
                            color: getPriorityColor(task.priority),
                            '& .MuiChip-label': {
                              px: 1,
                              fontSize: '0.75rem',
                              fontWeight: 500,
                            },
                            '& .MuiChip-icon': {
                              color: getPriorityColor(task.priority),
                            },
                          }}
                        />
                      </Box>

                      {/* Task Actions */}
                      <Box 
                        className="task-actions"
                        sx={{ 
                          display: 'flex', 
                          gap: 0.5,
                          opacity: 0,
                          transition: 'opacity 0.2s ease',
                        }}
                      >
                        <Tooltip title="Atribuir usuários">
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              onAssignUser(task);
                            }}
                            sx={{
                              p: 0.5,
                              color: theme.palette.text.secondary,
                              '&:hover': {
                                backgroundColor: theme.palette.primary.light,
                                color: theme.palette.primary.main,
                              },
                            }}
                          >
                            <PersonAddOutlinedIcon sx={{ fontSize: '1rem' }} />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Remover tarefa">
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              onDeleteTask(columnId, task._id);
                            }}
                            sx={{
                              p: 0.5,
                              color: theme.palette.text.secondary,
                              '&:hover': {
                                backgroundColor: theme.palette.error.light,
                                color: theme.palette.error.main,
                              },
                            }}
                          >
                            <DeleteOutlineIcon sx={{ fontSize: '1rem' }} />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </Box>
                  </Box>
                </Paper>
              )}
            </Draggable>
          ))}
          {provided.placeholder}
        </Box>
      )}
    </Droppable>

    {/* Add Task Button */}
    <Button
      startIcon={<AddIcon />}
      onClick={() => onAddTask(columnId)}
      sx={{
        py: 1.5,
        px: 2,
        justifyContent: 'flex-start',
        color: theme.palette.text.secondary,
        backgroundColor: theme.palette.background.paper,
        borderRadius: 1,
        textTransform: 'none',
        fontWeight: 500,
        fontSize: '0.875rem',
        border: `1px dashed ${theme.palette.divider}`,
        '&:hover': {
          backgroundColor: theme.palette.action.hover,
          borderStyle: 'dashed',
        },
      }}
    >
      Adicionar tarefa
    </Button>
  </Box>
  );
};

// Você também pode adicionar PropTypes para melhor documentação e validação
TaskColumn.propTypes = {
  columnId: PropTypes.string.isRequired,
  column: PropTypes.shape({
    name: PropTypes.string.isRequired,
    type: PropTypes.string,
    color: PropTypes.string,
    icon: PropTypes.node,
    tasks: PropTypes.arrayOf(
      PropTypes.shape({
        _id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        title: PropTypes.string.isRequired,
        description: PropTypes.string,
        priority: PropTypes.string,
        deadline: PropTypes.string,
        assignedUsers: PropTypes.arrayOf(
          PropTypes.shape({
            id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
            name: PropTypes.string.isRequired,
            avatar: PropTypes.string,
          })
        ),
      })
    ).isRequired,
  }).isRequired,
  onAddTask: PropTypes.func.isRequired,
  onEditTask: PropTypes.func.isRequired,
  onDeleteTask: PropTypes.func.isRequired,
  onAssignUser: PropTypes.func.isRequired,
  getPriorityColor: PropTypes.func.isRequired,
  theme: PropTypes.object.isRequired,
};

export default TaskColumn;