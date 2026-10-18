import { daysUntil, formatShortDate } from "../data";
export const DUE_COLORS = { red: "#B42318", orange: "#C2410C", gray: "#6B7280" };
const PRIORITY_ORDER = { Urgent: 0, High: 1, Medium: 2, Low: 3 };
export const dayDiff = (from, to) => daysUntil(to, from);
export const toIso = (d) => {
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return d.getFullYear() + "-" + m + "-" + day;
};
export const addDaysIso = (iso, n) => {
  const d = new Date(iso + "T00:00:00");
  d.setDate(d.getDate() + n);
  return toIso(d);
};
export const mondayBefore = (iso) => {
  const d = new Date(iso + "T00:00:00");
  return addDaysIso(iso, -((d.getDay() + 6) % 7));
};
export const isOverdue = (task) => task.status !== "Done" && daysUntil(task.dueDate) < 0;
export const getDueLabel = (task) => {
  const d = daysUntil(task.dueDate);
  if (d < 0) return { text: Math.abs(d) + "d overdue", color: task.status === "Done" ? "gray" : "red" };
  if (d === 0) return { text: "Today", color: "orange" };
  if (d === 1) return { text: "Tomorrow", color: "orange" };
  return { text: formatShortDate(task.dueDate), color: "gray" };
};
export const sortTasks = (list, how) => {
  const copy = [...list];
  if (how === "Priority") copy.sort((a, b) => PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]);
  if (how === "Due date") copy.sort((a, b) => a.dueDate.localeCompare(b.dueDate));
  if (how === "Title") copy.sort((a, b) => a.title.localeCompare(b.title));
  return copy;
};