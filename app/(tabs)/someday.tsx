import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import { Text, FAB, Portal, Modal, useTheme } from "react-native-paper";
import { Task } from "../../src/types/task";
import { taskService } from "../../src/services/taskService";
import { TaskList } from "../../src/components/TaskList";
import { TaskForm } from "../../src/components/TaskForm";
import { spacing } from "../../src/theme";

export default function SomedayScreen() {
  const theme = useTheme();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | undefined>();

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    console.log("Fetching tasks with status 'someday'...");
    const somedayTasks = await taskService.getTasksByStatus("someday");
    console.log("Fetched tasks:", somedayTasks);
    setTasks(somedayTasks);
    console.log("Tasks state updated:", somedayTasks);
  };

  const handleTaskPress = (task: Task) => {
    setSelectedTask(task);
    setShowTaskForm(true);
  };

  const handleTaskComplete = async (taskId: string) => {
    await taskService.completeTask(taskId);
    loadTasks();
  };

  const handleTaskDelete = async (taskId: string) => {
    await taskService.deleteTask(taskId);
    loadTasks();
  };

  const handleTaskMove = async (taskId: string, newStatus: Task["status"]) => {
    await taskService.moveTask(taskId, newStatus);
    loadTasks();
  };

  const handleTaskSubmit = async (taskData: Omit<Task, "id" | "createdAt">) => {
    console.log("Submitting task:", taskData);

    // Ensure the task is being created with the correct status
    if (!taskData.status || taskData.status !== "someday") {
      console.warn("Task status is not 'someday'. Setting it to 'someday'.");
      taskData = { ...taskData, status: "someday" };
    }

    if (selectedTask) {
      console.log("Updating existing task:", selectedTask.id);
      await taskService.updateTask(selectedTask.id, taskData);
    } else {
      console.log("Adding new task...");
      await taskService.addTask(taskData);
    }

    setShowTaskForm(false);
    setSelectedTask(undefined);
    console.log("Reloading tasks after submit...");
    loadTasks();
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
