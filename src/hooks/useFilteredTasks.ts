import { useMemo } from "react";
import { useTaskPlanner } from "./useTaskPlanner";
import { Task } from "../types";
import { addDays } from "../utils/dateUtils";

export const useFilteredTasks = (): Task[] => {
  const { state } = useTaskPlanner();
  const { tasks, filters } = state;

  return useMemo(() => {
    return tasks.filter((task) => {
      // Category filter
      if (
        filters.categories.length &&
        !filters.categories.includes(task.category)
      ) {
        return false;
      }

      // Time range filter
      if (filters.timeRange) {
        const cutoffDate = addDays(new Date(), parseInt(filters.timeRange) * 7);
        if (task.startDate > cutoffDate) return false;
      }

      // Search filter
      if (filters.searchQuery) {
        return task.name
          .toLowerCase()
          .includes(filters.searchQuery.toLowerCase());
      }

      return true;
    });
  }, [tasks, filters]);
};
