import { projects, getProgress } from "./projects";
import { tasks, TASK_STATUSES, STATUS_META } from "./tasks";

// Dashboard / report numbers derived from the mock data above.
export const getDashboardStats = () => {
  const totalProjects = projects.length;
  const onTrack = projects.filter((p) => p.status === "On Track").length;
  const atRisk = projects.filter((p) => p.status === "At Risk").length;
  const delayed = projects.filter((p) => p.status === "Delayed").length;

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === "Done").length;
  const myOpenTasks = tasks.filter((t) => t.assigneeId === "user-1" && t.status !== "Done").length;

  const completionRate = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);
  const averageProjectProgress =
    totalProjects === 0
      ? 0
      : Math.round(projects.reduce((sum, p) => sum + getProgress(p), 0) / totalProjects);

  return {
    totalProjects,
    onTrack,
    atRisk,
    delayed,
    projectsAtRisk: atRisk + delayed,
    totalTasks,
    completedTasks,
    myOpenTasks,
    completionRate,
    averageProjectProgress,
  };
};

// Donut chart on the dashboard.
export const getStatusBreakdown = () =>
  TASK_STATUSES.map((status) => ({
    label: status,
    value: tasks.filter((t) => t.status === status).length,
    color: STATUS_META[status].bar,
  }));

// "Task completion — last 8 weeks" chart (completed total 23, created total 53).
export const weeklyTaskCompletion = [
  { label: "Aug 24", completed: 0, created: 0 },
  { label: "Aug 31", completed: 0, created: 2 },
  { label: "Sep 7", completed: 2, created: 2 },
  { label: "Sep 14", completed: 2, created: 5 },
  { label: "Sep 21", completed: 6, created: 6 },
  { label: "Sep 28", completed: 5, created: 18 },
  { label: "Oct 5", completed: 8, created: 11 },
  { label: "Oct 12", completed: 0, created: 9 },
];

export const teamUtilization = { percent: 32, window: "Next 14 days · estimated hours" };
