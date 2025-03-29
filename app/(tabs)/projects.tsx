import React, { useEffect, useState } from "react";
import { View, StyleSheet, FlatList } from "react-native";
import {
  Text,
  FAB,
  Portal,
  Modal,
  useTheme,
  Card,
  Button,
} from "react-native-paper";
import { Project } from "../../src/types/project";
import { projectService } from "../../src/services/projectService";
import { ProjectForm } from "../../src/components/ProjectForm";
import { spacing } from "../../src/theme";
import { Task } from "../../src/types/task";
import { taskService } from "../../src/services/taskService";
import { useRouter } from "expo-router";

export default function ProjectsScreen() {
  const theme = useTheme();
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | undefined>();

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    const allProjects = await projectService.getAllProjects();
    setProjects(allProjects);
  };

  const handleProjectPress = (project: Project) => {
    console.warn("Navigation to project details is not implemented yet.");
  };

  const handleProjectDelete = async (projectId: string) => {
    await projectService.deleteProject(projectId);
    loadProjects();
  };

  const handleProjectSubmit = async (
    projectData: Omit<Project, "id" | "createdAt">
  ) => {
    if (selectedProject) {
      await projectService.updateProject(selectedProject.id, projectData);
    } else {
      await projectService.addProject(projectData);
    }
    setShowProjectForm(false);
    setSelectedProject(undefined);
    loadProjects();
  };

  const renderProjectItem = ({ item }: { item: Project }) => (
    <Card
      style={[styles.projectCard, { backgroundColor: theme.colors.surface }]}
      onPress={() => handleProjectPress(item)}
    >
      <Card.Title title={item.name} subtitle={`${item.taskCount || 0} tasks`} />
      <Card.Content>
        {item.description && <Text>{item.description}</Text>}
      </Card.Content>
      <Card.Actions>
        <Button
          onPress={() => {
            setSelectedProject(item);
            setShowProjectForm(true);
          }}
        >
          Edit
        </Button>
        <Button
          textColor={theme.colors.error}
          onPress={() => handleProjectDelete(item.id)}
        >
          Delete
        </Button>
      </Card.Actions>
    </Card>
  );

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <View style={styles.content}>
        {projects.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text>No projects yet. Create your first project!</Text>
          </View>
        ) : (
          <FlatList
            data={projects}
            renderItem={renderProjectItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.projectsList}
          />
        )}
      </View>

      <FAB
        icon="plus"
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        onPress={() => setShowProjectForm(true)}
      />

      <Portal>
        <Modal
          visible={showProjectForm}
          onDismiss={() => {
            setShowProjectForm(false);
            setSelectedProject(undefined);
          }}
          contentContainerStyle={[
            styles.modal,
            { backgroundColor: theme.colors.surface },
          ]}
        >
          <ProjectForm
            project={selectedProject}
            onSubmit={handleProjectSubmit}
            onCancel={() => {
              setShowProjectForm(false);
              setSelectedProject(undefined);
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
  projectsList: {
    padding: spacing.md,
  },
  projectCard: {
    marginBottom: spacing.md,
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
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
