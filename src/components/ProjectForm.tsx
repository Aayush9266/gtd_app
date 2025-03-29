import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { TextInput, Button, useTheme, Text } from "react-native-paper";
import { Project } from "../types/project";

interface ProjectFormProps {
  project?: Project;
  onSubmit: (project: Omit<Project, "id" | "createdAt">) => void;
  onCancel: () => void;
}

export const ProjectForm: React.FC<ProjectFormProps> = ({
  project,
  onSubmit,
  onCancel,
}) => {
  const theme = useTheme();
  const [name, setName] = useState(project?.name || "");
  const [description, setDescription] = useState(project?.description || "");

  const handleSubmit = () => {
    if (!name.trim()) return;

    onSubmit({
      name: name.trim(),
      description: description.trim(),
    });
  };

  return (
    <View style={styles.container}>
      <Text
        variant="titleLarge"
        style={[styles.title, { color: theme.colors.text }]}
      >
        {project ? "Edit Project" : "New Project"}
      </Text>

      <TextInput
        label="Project Name"
        value={name}
        onChangeText={setName}
        style={styles.input}
        mode="outlined"
      />

      <TextInput
        label="Description (optional)"
        value={description}
        onChangeText={setDescription}
        multiline
        numberOfLines={4}
        style={styles.input}
        mode="outlined"
      />

      <View style={styles.buttons}>
        <Button mode="outlined" onPress={onCancel} style={styles.button}>
          Cancel
        </Button>
        <Button
          mode="contained"
          onPress={handleSubmit}
          style={styles.button}
          disabled={!name.trim()}
        >
          {project ? "Update" : "Create"}
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  title: {
    marginBottom: 16,
  },
  input: {
    marginBottom: 16,
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 8,
  },
  button: {
    minWidth: 100,
  },
});
