import { useContext } from "react";
import { TaskPlannerContext } from "../context/TaskPlannerContext";

export const useTaskPlanner = () => {
  const context = useContext(TaskPlannerContext);
  if (!context) {
    throw new Error("useTaskPlanner must be used within TaskPlannerProvider");
  }
  return context;
};
