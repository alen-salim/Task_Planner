import React from "react";
import { TaskPlannerProvider } from "./context/TaskPlannerContext";
import CalendarGrid from "./components/Calender/CalendarGrid";
import FilterPanel from "./components/Filters/FiltersPanel";
import TaskModal from "./components/Modal/TaskModal";

const App: React.FC = () => {
  return (
    <TaskPlannerProvider>
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Task Planner
            </h1>
            <p className="text-gray-600">
              Drag across days to create tasks, double-click to edit, drag edges
              to resize
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1">
              <FilterPanel />
            </div>

            <div className="lg:col-span-3">
              <CalendarGrid />
            </div>
          </div>

          <TaskModal />
        </div>
      </div>
    </TaskPlannerProvider>
  );
};

export default App;
