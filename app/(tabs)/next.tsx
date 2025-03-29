import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import { Text, FAB, Portal, Modal, useTheme } from "react-native-paper";
import { Task } from "../../src/types/task";
import { taskService } from "../../src/services/taskService";
import { TaskList } from "../../src/components/TaskList";
import { TaskForm } from "../../src/components/TaskForm";
import { spacing } from "../../src/theme";

export default function NextScreen() {
  const theme = useTheme();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | undefined>();

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const nextTasks = await taskService.getTasksByStatus("next");
      setTasks(nextTasks);
    } catch (error) {
      console.error("Error loading tasks:", error);
    }
  };

  const handleTaskPress = (task: Task) => {
    setSelectedTask(task);
    setShowTaskForm(true);
  };

  const handleTaskComplete = async (taskId: string) => {
    try {
      await taskService.completeTask(taskId);
      loadTasks();
    } catch (error) {
      console.error("Error completing task:", error);
    }
  };

  const handleTaskDelete = async (taskId: string) => {
    try {
      await taskService.deleteTask(taskId);
      loadTasks();
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const handleTaskMove = async (taskId: string, newStatus: Task["status"]) => {
    try {
      await taskService.moveTask(taskId, newStatus);
      loadTasks();
    } catch (error) {
      console.error("Error moving task:", error);
    }
  };

  const handleTaskSubmit = async (taskData: Omit<Task, "id" | "createdAt">) => {
    try {
      if (selectedTask) {
        await taskService.updateTask(selectedTask.id, taskData);
      } else {
        await taskService.addTask(taskData);
      }
      setShowTaskForm(false);
      setSelectedTask(undefined);
      loadTasks();
    } catch (error) {
      console.error("Error submitting task:", error);
    }
  };

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <View style={styles.content}>
        <TaskList
          tasks={tasks}
          onTaskPress={handleTaskPress}
          onTaskComplete={handleTaskComplete}
          onTaskDelete={handleTaskDelete}
          onTaskMove={handleTaskMove}
        />
      </View>

      <FAB
        icon="plus"
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        onPress={() => setShowTaskForm(true)}
      />

      <Portal>
        <Modal
          visible={showTaskForm}
          onDismiss={() => {
            setShowTaskForm(false);
            setSelectedTask(undefined);
          }}
          contentContainerStyle={[
            styles.modal,
            { backgroundColor: theme.colors.surface },
          ]}
        >
          <TaskForm
            task={selectedTask}
            onSubmit={handleTaskSubmit}
            onCancel={() => {
              setShowTaskForm(false);
              setSelectedTask(undefined);
            }}
          />
        </Modal>
      </Portal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: spacing.lg,
  },
  content: {
    flex: 1,
  },
  fab: {
    position: "absolute",
    margin: spacing.lg,
    right: 0,
    bottom: 0,
  },
  modal: {
    margin: spacing.lg,
    borderRadius: 8,
    maxHeight: "80%",
  },
});
