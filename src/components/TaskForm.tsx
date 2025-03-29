import React, { useState } from "react";
import { View, StyleSheet, Platform } from "react-native";
import {
  TextInput,
  Button,
  useTheme,
  SegmentedButtons,
  Portal,
  Modal,
  Text,
} from "react-native-paper";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Task, TaskPriority, TaskContext } from "../types/task";

interface TaskFormProps {
  task?: Task;
  onSubmit: (task: Omit<Task, "id" | "createdAt">) => void;
  onCancel: () => void;
}

export const TaskForm: React.FC<TaskFormProps> = ({
  task,
  onSubmit,
  onCancel,
}) => {
  const theme = useTheme();
  const [title, setTitle] = useState(task?.title || "");
  const [description, setDescription] = useState(task?.description || "");
  const [priority, setPriority] = useState<TaskPriority>(
    task?.priority || "medium"
  );
  const [context, setContext] = useState<TaskContext>(
    task?.context || "personal"
  );
  const [dueDate, setDueDate] = useState<Date | undefined>(
    task?.dueDate ? new Date(task.dueDate) : undefined
  );
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [tags, setTags] = useState<string[]>(task?.tags || []);
  const [newTag, setNewTag] = useState("");

  const handleSubmit = () => {
    if (!title.trim()) return;

    onSubmit({
      title: title.trim(),
      description: description.trim(),
      priority,
      context,
      dueDate: dueDate?.toISOString(),
      tags,
      status: task?.status || "inbox",
    });
  };

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === "ios");
    if (selectedDate) {
      setDueDate(selectedDate);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        label="Title"
        value={title}
        onChangeText={setTitle}
        style={styles.input}
        mode="outlined"
      />

      <TextInput
        label="Description"
        value={description}
        onChangeText={setDescription}
        multiline
        numberOfLines={3}
        style={styles.input}
        mode="outlined"
      />

      <Text
        variant="bodyMedium"
        style={[styles.label, { color: theme.colors.text }]}
      >
        Priority
      </Text>
      <SegmentedButtons
        value={priority}
        onValueChange={(value) => setPriority(value as TaskPriority)}
        buttons={[
          { value: "low", label: "Low" },
          { value: "medium", label: "Medium" },
          { value: "high", label: "High" },
        ]}
        style={styles.segmentedButtons}
      />

      <Text
        variant="bodyMedium"
        style={[styles.label, { color: theme.colors.text }]}
      >
        Context
      </Text>
      <SegmentedButtons
        value={context}
        onValueChange={(value) => setContext(value as TaskContext)}
        buttons={[
          { value: "work", label: "Work" },
          { value: "home", label: "Home" },
          { value: "errands", label: "Errands" },
          { value: "personal", label: "Personal" },
        ]}
        style={styles.segmentedButtons}
      />

      <Button
        mode="outlined"
        onPress={() => setShowDatePicker(true)}
        style={styles.input}
      >
        {dueDate ? `Due: ${dueDate.toLocaleDateString()}` : "Set Due Date"}
      </Button>

      <View style={styles.tagsContainer}>
        <Text
          variant="bodyMedium"
          style={[styles.label, { color: theme.colors.text }]}
        >
          Tags
        </Text>
        <View style={styles.tagsInput}>
          <TextInput
            value={newTag}
            onChangeText={setNewTag}
            placeholder="Add tag"
            style={styles.tagInput}
            mode="outlined"
          />
          <Button mode="contained" onPress={addTag}>
            Add
          </Button>
        </View>
        <View style={styles.tagsList}>
          {tags.map((tag) => (
            <Button
              key={tag}
              mode="outlined"
              onPress={() => removeTag(tag)}
              style={styles.tag}
            >
              {tag} ×
            </Button>
          ))}
        </View>
      </View>

      <View style={styles.buttons}>
        <Button mode="outlined" onPress={onCancel} style={styles.button}>
          Cancel
        </Button>
        <Button mode="contained" onPress={handleSubmit} style={styles.button}>
          {task ? "Update" : "Add"} Task
        </Button>
      </View>

      {showDatePicker && (
        <DateTimePicker
          value={dueDate || new Date()}
          mode="date"
          display={Platform.select({ ios: "spinner", android: "calendar" })}
          onChange={handleDateChange}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  input: {
    marginBottom: 16,
  },
  label: {
    marginBottom: 8,
  },
  segmentedButtons: {
    marginBottom: 16,
  },
  tagsContainer: {
    marginBottom: 16,
  },
  tagsInput: {
    flexDirection: "row",
    marginBottom: 8,
  },
  tagInput: {
    flex: 1,
    marginRight: 8,
  },
  tagsList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  tag: {
    marginRight: 8,
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
