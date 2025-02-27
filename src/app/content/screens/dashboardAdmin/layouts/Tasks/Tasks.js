
import React, { useContext, useEffect, useState } from "react";
import { DragDropContext } from "react-beautiful-dnd";
import { Box, Paper} from "@mui/material";
import styles from "./Tasks.module.css";
import {
  createTasks,
  updateTasks,
  fetchTasks,
  deleteTaskById,
  updateTaskStatus,
} from "./API";
import toast from "react-hot-toast";
import AuthContext from "@/app/context/AuthContext";
import { useCompany } from "@/app/context/CompanyContext";
import TaskModal from "../../../../../components/Modal/Admin/ModalTasks/index";
import { TaskColumn } from "./TaskColumn";
import AssignUserDialog from "./AssignUserTaks";
import TitleDashboardComponent from "@/app/components/TitleDashboardComponent/TitleDashboardComponent";
import { theme } from "@/app/theme";
import HeaderDashboard from "@/app/components/HeaderDashboard";
export default function TaskBoard() {
  const { company } = useCompany();
  const { user } = useContext(AuthContext);
 

  // States
  const [newTaskDialog, setNewTaskDialog] = useState(false);
  const [assignUserDialog, setAssignUserDialog] = useState(false);
  const [selectedColumn, setSelectedColumn] = useState("");
  const [selectedTask, setSelectedTask] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [taskData, setTaskData] = useState({
    title: "",
    description: "",
    deadline: "",
    priority: "",
    notes: "",
    assignedUsers: [],
    createdBy: "",
    company: "",
  });

   // Updated columns with new styling
   const [columns, setColumns] = useState({
    todo: {
      name: "Pendente",
      tasks: [],
      color: theme.palette.primary.dark,
      icon: "🎯"
    },
    inProgress: {
      name: "Em Progresso",
      tasks: [],
      color: theme.palette.warning.main,
      icon: "⚡"
    },
    review: {
      name: "Em Revisão",
      tasks: [],
      color: theme.palette.info.main,
      icon: "👀"
    },
    done: {
      name: "Concluído",
      tasks: [],
      color: theme.palette.success.main,
      icon: "✅"
    },
  });

  const getPriorityColor = (priority) => ({
    high: theme.palette.error.main,
    medium: theme.palette.warning.main,
    low: theme.palette.success.main,
    default: theme.palette.grey[500]
  }[priority?.toLowerCase()] || theme.palette.grey[500]);

  // Fetch tasks e filtra no frontend por company
  const fetchAndSetTasks = async () => {
    try {
      const allTasks = await fetchTasks(); // Buscar todas as tarefas
      console.log(allTasks)

      // Filtra as tarefas com base na variável `company`
      const filteredTasks = allTasks.filter(task => task.company === company?.name);

      const updatedColumns = { ...columns };

      // Inicializando as tarefas nas colunas
      Object.keys(updatedColumns).forEach((key) => {
        updatedColumns[key].tasks = [];
      });

      filteredTasks.forEach((task) => {
        const status = task.status || "todo"; // Status padrão "todo"
        if (updatedColumns[status]) {
          updatedColumns[status].tasks.push(task);
        }
      });

      setColumns(updatedColumns); // Atualiza as colunas com as tarefas filtradas
    } catch (error) {
      console.error("Erro ao buscar tarefas:", error);
      toast.error("Erro ao carregar tarefas");
    }
  };

  useEffect(() => {
    if (company) {
      fetchAndSetTasks(); // Chama a função para buscar e filtrar as tarefas
    }
  }, [company]); // A função será chamada sempre que a empresa mudar

  const onDragEnd = async (result) => {
    const { source, destination, draggableId } = result;

    // Se não houver destino ou a tarefa for solta no mesmo lugar
    if (
      !destination ||
      (source.droppableId === destination.droppableId &&
        source.index === destination.index)
    ) {
      return;
    }

    // Atualizar UI otimisticamente
    const sourceColumn = columns[source.droppableId];
    const destColumn = columns[destination.droppableId];
    const sourceTasks = Array.from(sourceColumn.tasks);
    const destTasks = Array.from(destColumn.tasks);

    // Remover da origem e adicionar ao destino
    const [movedTask] = sourceTasks.splice(source.index, 1);
    const updatedTask = { ...movedTask, status: destination.droppableId };
    destTasks.splice(destination.index, 0, updatedTask);

    // Atualizar estado local imediatamente
    const newColumns = {
      ...columns,
      [source.droppableId]: { ...sourceColumn, tasks: sourceTasks },
      [destination.droppableId]: { ...destColumn, tasks: destTasks },
    };
    setColumns(newColumns);

    try {
      // Atualizar o status no backend
      await updateTaskStatus(movedTask._id, destination.droppableId);
      toast.success("Status da tarefa atualizado com sucesso");
    } catch (error) {
      // Se falhar, reverter UI ao estado anterior
      setColumns({
        ...columns,
        [source.droppableId]: sourceColumn,
        [destination.droppableId]: destColumn,
      });

      toast.error("Erro ao atualizar status da tarefa");
      console.error("Erro ao atualizar status:", error);
    }
  };

  // Task handlers
  const handleAddOrUpdateTask = async (taskData) => {
    if (taskData.title.trim()) {
      const columnId = selectedColumn;
      const column = columns[columnId];
  
      const taskPayload = {
        title: taskData.title,
        description: taskData.description,
        deadline: taskData.deadline,
        priority: taskData.priority,
        notes: taskData.notes,
        assignedUsers: taskData.assignedUsers,
        createdBy: user?.id,
        company: company?.name,
        status: "todo",
      };
  
      try {
        let response;
        if (taskData.id) {
          // Comparar dados para registrar detalhes no histórico
          const previousTask = column.tasks.find((task) => task.id === taskData.id);
          const changes = {};
  
          if (previousTask) {
            if (taskData.title !== previousTask.title) changes.title = { old: previousTask.title, new: taskData.title };
            if (taskData.description !== previousTask.description) changes.description = { old: previousTask.description, new: taskData.description };
            if (taskData.deadline !== previousTask.deadline) changes.deadline = { old: previousTask.deadline, new: taskData.deadline };
            if (taskData.priority !== previousTask.priority) changes.priority = { old: previousTask.priority, new: taskData.priority };
            if (taskData.notes !== previousTask.notes) changes.notes = { old: previousTask.notes, new: taskData.notes };
          }
  
          // Adiciona as mudanças ao payload
          response = await updateTasks({ ...taskPayload, changes }, taskData.id);
  
          if (response) {
            await fetchAndSetTasks(); // Refresh all tasks
            toast.success("Tarefa atualizada com sucesso");
            const updatedTasks = column.tasks.map((task) =>
              task.id === taskData.id ? { ...response, id: taskData.id } : task
            );
            setColumns({
              ...columns,
              [columnId]: { ...column, tasks: updatedTasks },
            });
          }
        } else {
          response = await createTasks(taskPayload);
          if (response) {
            toast.success("Tarefa criada com sucesso");
            const newTask = { id: response.id, ...response };
            const updatedTasks = [...column.tasks, newTask];
            setColumns({
              ...columns,
              [columnId]: { ...column, tasks: updatedTasks },
            });
          }
        }
        handleCloseDialog();
      } catch (error) {
        toast.error("Erro ao salvar a tarefa");
        console.error("Erro:", error);
      }
    } else {
      toast.error("O título da tarefa é obrigatório.");
    }
  
    setTaskData({
      title: "",
      description: "",
      deadline: "",
      priority: "",
      notes: "",
      assignedUsers: [],
      createdBy: "",
    });
  };
  

  const handleDeleteTask = async (columnId, taskId) => {
    try {
      const response = await deleteTaskById(taskId);
      if (response) {
        toast.success("Tarefa deletada com sucesso");
        const column = columns[columnId];
        const updatedTasks = column.tasks.filter((task) => task._id !== taskId);
        setColumns({
          ...columns,
          [columnId]: { ...column, tasks: updatedTasks },
        });
      }
    } catch (error) {
      console.error("Erro ao deletar a tarefa:", error);
      toast.error("Erro ao deletar a tarefa");
    }
  };

  const handleEditTask = (task, columnId) => {
    setIsEditing(true);
    setSelectedColumn(columnId);
    setTaskData({
      id: task._id,
      title: task.title,
      description: task.description || "",
      deadline: task.deadline
        ? new Date(task.deadline).toISOString().split("T")[0]
        : "",
      priority: task.priority || "",
      notes: task.notes || "",
      assignedUsers: task.assignedUsers || [],
      createdBy: task.createdBy || "",
      history: task?.history || []
    });
    setNewTaskDialog(true);
  };

  const handleCloseDialog = () => {
    setTaskData({
      title: "",
      description: "",
      deadline: "",
      priority: "",
      notes: "",
      assignedUsers: [],
      createdBy: "",
    });
    setIsEditing(false);
    setSelectedColumn("");
    setNewTaskDialog(false);
  };

  const handleAddNewTask = (columnId) => {
    setSelectedColumn(columnId);
    setIsEditing(false);
    setNewTaskDialog(true);
  };
  return (
    <Box sx={{ 
      height: '100vh',
      backgroundColor: theme.palette.background.default,
      p: 2,
      mt: -6,
      ml: -3
    }}>
      <Paper 
        elevation={0}
        sx={{ 
          backgroundColor: 'transparent',
          borderRadius: 2
        }}
      >
        <HeaderDashboard 
          subtitle="Gerencie as tarefas da"
          title="Quadro de Tarefas"
          
        />
        
        <Box sx={{ 
          display: 'flex',
          gap: '1rem',
       
          '::-webkit-scrollbar': {
            height: '8px',
          },
          '::-webkit-scrollbar-track': {
            background: theme.palette.background.paper,
            borderRadius: '4px',
          },
          '::-webkit-scrollbar-thumb': {
            background: theme.palette.primary.main,
            borderRadius: '4px',
          },
        }}>
          <DragDropContext onDragEnd={onDragEnd}>
            {Object.entries(columns).map(([columnId, column]) => (
              <TaskColumn
                key={columnId}
                columnId={columnId}
                column={column}
                onAddTask={handleAddNewTask}
                onEditTask={handleEditTask}
                onDeleteTask={handleDeleteTask}
                onAssignUser={(task) => {
                  setSelectedTask(task);
                  setAssignUserDialog(true);
                }}
                getPriorityColor={getPriorityColor}
                theme={theme}
              />
            ))}
          </DragDropContext>
        </Box>
      </Paper>

      <TaskModal
        open={newTaskDialog}
        onClose={handleCloseDialog}
        onSubmit={handleAddOrUpdateTask}
        initialData={taskData}
        isEditing={isEditing}
      />

      <AssignUserDialog
        open={assignUserDialog}
        onClose={() => setAssignUserDialog(false)}
        task={selectedTask}
        onAssignUser={(userId) => {
          // Implement your assign user logic here
        }}
      />
    </Box>
  );
}
