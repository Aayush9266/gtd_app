import { Tabs } from "expo-router";
import { useTheme } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

export default function TabLayout() {
  const theme = useTheme();

  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.border,
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.text,
        headerStyle: {
          backgroundColor: theme.colors.surface,
        },
        headerTintColor: theme.colors.text,
        headerTitleStyle: {
          fontWeight: "bold",
        },
        tabBarShowLabel: true,
        tabBarLabelStyle: {
          fontSize: 12,
        },
      }}
    >
      <Tabs.Screen
        name="inbox"
        options={{
          title: "Inbox",
          tabBarIcon: ({ color, size }: { color: string; size: number }) => (
            <Icon name="inbox" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="next"
        options={{
          title: "Next",
          tabBarIcon: ({ color, size }: { color: string; size: number }) => (
            <Icon name="arrow-right-circle" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="projects"
        options={{
          title: "Projects",
          tabBarIcon: ({ color, size }: { color: string; size: number }) => (
            <Icon name="view-grid-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="waiting"
        options={{
          title: "Waiting",
          tabBarIcon: ({ color, size }: { color: string; size: number }) => (
            <Icon name="clock-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="someday"
        options={{
          title: "Someday",
          tabBarIcon: ({ color, size }: { color: string; size: number }) => (
            <Icon name="calendar" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
