import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { PaperProvider } from "react-native-paper";
import { theme } from "@/theme";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import React from "react";
import { View, Text, Button } from "react-native";
import { TaskProvider, useTaskContext } from "./context/TaskContext";

export {
  ErrorBoundary, // Catch any errors thrown by the Layout component.
} from "expo-router";

SplashScreen.preventAutoHideAsync(); // Prevent the splash screen from auto-hiding.

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require("@/assets/fonts/SpaceMono-Regular.ttf"),
    ...FontAwesome.font,
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PaperProvider theme={theme}>
        <TaskProvider>
          <Stack
            screenOptions={{
              headerStyle: {
                backgroundColor: theme.colors.surface,
              },
              headerTintColor: theme.colors.text,
              headerTitleStyle: {
                fontWeight: "bold",
              },
            }}
          />
        </TaskProvider>
      </PaperProvider>
    </GestureHandlerRootView>
  );
}

export function ExampleScreen() {
  const { tasks, addTask, deleteTask, loading } = useTaskContext();

  const handleAddTask = async () => {
    await addTask({ title: "New Task", status: "inbox" });
  };

  return (
    <View>
      <Text>Tasks:</Text>
      {loading ? (
        <Text>Loading...</Text>
      ) : (
        tasks.map((task) => (
          <View key={task.id}>
            <Text>{task.title}</Text>
            <Button title="Delete" onPress={() => deleteTask(task.id)} />
          </View>
        ))
      )}
      <Button title="Add Task" onPress={handleAddTask} />
    </View>
  );
}
