import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Animated,
  TouchableOpacity,
  RefreshControl,
  ScrollView,
} from "react-native";
import { List, IconButton, useTheme, Text } from "react-native-paper";
import { Swipeable } from "react-native-gesture-handler";
import { Task } from "../types/task";
import { format } from "date-fns";
import { useTaskContext } from "../context/TaskContext";

interface TaskListProps {
  onTaskPress: (task: Task) => void;
  onTaskComplete: (taskId: string) => void;
  onTaskDelete: (taskId: string) => void;
}

export const TaskList: React.FC<TaskListProps> = ({
  onTaskPress,
  onTaskComplete,
  onTaskDelete,
}) => {
  const { tasks, moveTask } = useTaskContext();
  const theme = useTheme();
  const [refreshing, setRefreshing] = useState(false);

  const handleTaskMove = async (taskId: string, newStatus: Task["status"]) => {
    moveTask(taskId, newStatus); // Update the global state
    try {
      await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate API call
    } catch (error) {
      console.error("Failed to move task:", error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate refresh
    } catch (error) {
      console.error("Failed to refresh tasks:", error);
    } finally {
      setRefreshing(false);
    }
  };

  const renderRightActions = (task: Task) => {
    return (
      <View style={styles.rightActions}>
        <IconButton
          icon="check"
          iconColor={theme.colors.success}
          onPress={() => onTaskComplete(task.id)}
          style={[
            styles.actionButton,
            { backgroundColor: theme.colors.surface },
          ]}
        />
        <IconButton
          icon="delete"
          iconColor={theme.colors.error}
          onPress={() => onTaskDelete(task.id)}
          style={[
            styles.actionButton,
            { backgroundColor: theme.colors.surface },
          ]}
        />
      </View>
    );
  };

  const renderLeftActions = (task: Task) => {
    return (
      <View style={styles.leftActions}>
        <IconButton
          icon="arrow-right"
          iconColor={theme.colors.primary}
          onPress={() => handleTaskMove(task.id, "next")} // Move to "next"
          style={[
            styles.actionButton,
            { backgroundColor: theme.colors.surface },
          ]}
        />
        <IconButton
          icon="clock-outline"
          iconColor={theme.colors.warning}
          onPress={() => handleTaskMove(task.id, "waiting")} // Move to "waiting"
          style={[
            styles.actionButton,
            { backgroundColor: theme.colors.surface },
          ]}
        />
      </View>
    );
  };

  if (tasks.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text variant="bodyLarge" style={{ color: theme.colors.text }}>
          No tasks found
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {tasks.map((task) => (
        <Swipeable
          key={task.id}
          renderRightActions={() => renderRightActions(task)}
          renderLeftActions={() => renderLeftActions(task)}
          friction={2}
          leftThreshold={30}
          rightThreshold={40}
          overshootLeft={false}
          overshootRight={false}
        >
          <View style={styles.taskCard}>
            <TouchableOpacity
              onPress={() => onTaskComplete(task.id)}
              style={styles.circle}
            />
            <List.Item
              title={task.title}
              description={task.description}
              right={(props) => (
                <View style={styles.rightContent}>
                  {task.dueDate && (
                    <Text
                      {...props}
                      style={[styles.dueDate, { color: theme.colors.text }]}
                    >
                      {" "}
                      {format(new Date(task.dueDate), "MMM d")}
                    </Text>
                  )}
                  <List.Icon {...props} icon="chevron-right" />
                </View>
              )}
              onPress={() => onTaskPress(task)}
              style={[
                styles.taskItem,
                task.status === "completed" && styles.completedTask,
              ]}
            />
          </View>
        </Swipeable>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  taskItem: {
    backgroundColor: "transparent",
  },
  completedTask: {
    opacity: 0.7,
  },
  rightActions: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    width: 120,
  },
  leftActions: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    width: 120,
  },
  actionButton: {
    margin: 0,
    borderRadius: 0,
  },
  rightContent: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 16, // Further increased margin for more space
  },
  dueDate: {
    marginRight: 8,
    fontSize: 14, // Increased font size for the date
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  taskCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    marginVertical: 8,
    marginHorizontal: 10,
    borderRadius: 10,
    backgroundColor: "#1c1c1c", // Black theme background
    shadowColor: "#fff", // Adjust shadow for black theme
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  circle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#000",
    marginRight: 10,
  },
  loadingContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
});
