import { projects } from "./projects";
import { tasks } from "./tasks";

export const getDashboardStats = () => {
  const totalProjects = projects.length;

  const activeProjects = projects.filter(
    (project) => project.status === "In Progress"
  ).length;

  const completedProjects = projects.filter(
    (project) => project.status === "Completed"
  ).length;

  const totalTasks = tasks.length;

  const completedTasks = tasks.filter(
    (task) => task.status === "Done"
  ).length;

  const inProgressTasks = tasks.filter(
    (task) => task.status === "In Progress"
  ).length;

  const todoTasks = tasks.filter(
    (task) => task.status === "To Do"
  ).length;

  const completionRate =
    totalTasks === 0
      ? 0
      : Math.round((completedTasks / totalTasks) * 100);

  const averageProjectProgress =
    totalProjects === 0
      ? 0
      : Math.round(
          projects.reduce((total, project) => total + project.progress, 0) /
            totalProjects
        );

  return {
    totalProjects,
    activeProjects,
    completedProjects,
    totalTasks,
    completedTasks,
    inProgressTasks,
    todoTasks,
    completionRate,
    averageProjectProgress,
  };
};

export const weeklyTaskCompletion = [
  { day: "Mon", completed: 3 },
  { day: "Tue", completed: 5 },
  { day: "Wed", completed: 4 },
  { day: "Thu", completed: 7 },
  { day: "Fri", completed: 6 },
  { day: "Sat", completed: 2 },
  { day: "Sun", completed: 1 },
];