import React from "react";
import { TaskProvider } from "./context/TaskContext";
// ...existing imports...

export default function Layout({ children }: { children: React.ReactNode }) {
  return <TaskProvider>{children}</TaskProvider>;
}
