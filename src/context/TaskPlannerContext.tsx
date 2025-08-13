import React, { createContext, useReducer, ReactNode } from "react";
import { TaskPlannerState, TaskPlannerAction } from "../types";
import { taskReducer, initialState } from "../reducers/taskReducers";

interface TaskPlannerContextType {
  state: TaskPlannerState;
  dispatch: React.Dispatch<TaskPlannerAction>;
}

export const TaskPlannerContext = createContext<
  TaskPlannerContextType | undefined
>(undefined);

interface TaskPlannerProviderProps {
  children: ReactNode;
}

export const TaskPlannerProvider: React.FC<TaskPlannerProviderProps> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(taskReducer, initialState);

  const value = { state, dispatch };

  return (
    <TaskPlannerContext.Provider value={value}>
      {children}
    </TaskPlannerContext.Provider>
  );
};
