// Tasks for all six projects (
export const TASK_STATUSES = ["Backlog", "To Do", "In Progress", "In Review", "Done"];
export const TASK_PRIORITIES = ["Low", "Medium", "High", "Urgent"];
export const TASK_LABELS = ["Design", "Frontend", "Backend", "QA", "Content", "Research", "Bug"];
export const BOARD_SORTS = ["Manual order", "Priority", "Due date", "Title"];

export const STATUS_META = {
  Backlog: { bg: "#EEF0F3", fg: "#4B5563", icon: "dashed", bar: "#9CA3AF" },
  "To Do": { bg: "#E6E8EC", fg: "#374151", icon: "circle", bar: "#667085" },
  "In Progress": { bg: "#FDEFD3", fg: "#92580A", icon: "half", bar: "#E8890C" },
  "In Review": { bg: "#EDE9FE", fg: "#5B3FD0", icon: "eye", bar: "#7C5CFA" },
  Done: { bg: "#E3F6EC", fg: "#0B7A4B", icon: "check", bar: "#12A06C" },
};

export const LABEL_STYLES = {
  Design: { bg: "#EDE9FE", fg: "#5B3FD0" },
  Frontend: { bg: "#D9F3F5", fg: "#0E6B72" },
  Backend: { bg: "#D9F3F5", fg: "#0E6B72" },
  QA: { bg: "#DDF5E6", fg: "#0B7A4B" },
  Content: { bg: "#FDEFD3", fg: "#92580A" },
  Research: { bg: "#E0ECFF", fg: "#1D4ED8" },
  Bug: { bg: "#FDE4E1", fg: "#B42318" },
};

// t(key, project, title, status, priority, assignee, label, start, due, extras)
const t = (n, projectId, title, status, priority, assigneeId, label, startDate, dueDate, extra = {}) => ({
  id: `NX-${n}`,
  projectId,
  title,
  description: "",
  status,
  priority,
  assigneeId,
  reporterId: "user-1",
  label,
  startDate,
  dueDate,
  estimateHours: 4,
  subtasksDone: 0,
  subtasksTotal: 0,
  attachments: 0,
  comments: 0,
  blocked: false,
  dependsOn: null,
  completedAt: status === "Done" ? dueDate : null,
  ...extra,
});

export const tasks = [
  // ---------------------------------------------------------------- Clinic
  t(1, "clinic", "Doctor profile template", "Done", "High", "user-5", "Design", "2026-09-08", "2026-09-22"),
  t(2, "clinic", "Booking flow wireframes", "Done", "High", "user-2", "Design", "2026-09-10", "2026-09-24"),
  t(3, "clinic", "Accessibility audit", "Done", "Medium", "user-5", "QA", "2026-09-22", "2026-10-02"),
  t(4, "clinic", "Online booking API", "Done", "High", "user-4", "Backend", "2026-09-15", "2026-10-05"),
  t(5, "clinic", "Homepage hero build", "Done", "Medium", "user-3", "Frontend", "2026-09-28", "2026-10-07"),
  t(6, "clinic", "Appointment form validation", "In Review", "Low", "user-1", "Frontend", "2026-10-08", "2026-10-13", { subtasksDone: 2, subtasksTotal: 3 }),
  t(7, "clinic", "Content migration", "In Progress", "High", "user-3", "Content", "2026-10-12", "2026-10-22", { subtasksDone: 1, subtasksTotal: 4 }),
  t(8, "clinic", "Insurance page copy", "To Do", "Medium", "user-2", "Content", "2026-10-20", "2026-10-28"),
  t(9, "clinic", "Doctor search filters", "Backlog", "Medium", "user-3", "Frontend", "2026-11-02", "2026-11-06"),
  t(10, "clinic", "Launch checklist", "To Do", "Medium", "user-1", "QA", "2026-10-09", "2026-10-12", { subtasksDone: 0, subtasksTotal: 5 }),

  // ----------------------------------------------------------------- Atlas
  t(11, "atlas", "KPI card component", "Done", "High", "user-5", "QA", "2026-10-02", "2026-10-06", {
    estimateHours: 2, subtasksDone: 2, subtasksTotal: 2, attachments: 3,
    reporterId: "user-1", completedAt: "2026-10-06",
  }),
  t(12, "atlas", "Chart library spike", "Done", "High", "user-1", "QA", "2026-10-02", "2026-10-11", {
    estimateHours: 8, subtasksDone: 5, subtasksTotal: 5, comments: 1,
  }),
  t(13, "atlas", "Data table with sorting", "Done", "High", "user-5", "Bug", "2026-09-14", "2026-09-20", { estimateHours: 6 }),
  t(14, "atlas", "Role-based navigation", "Done", "Medium", "user-3", "Bug", "2026-10-01", "2026-10-02", { estimateHours: 6 }),
  t(15, "atlas", "Dashboard filters", "In Review", "Urgent", "user-1", "Design", "2026-10-13", "2026-10-14", {
    estimateHours: 8, subtasksDone: 2, subtasksTotal: 3, attachments: 1,
  }),
  t(16, "atlas", "API mock layer", "In Progress", "High", "user-1", "QA", "2026-10-12", "2026-10-14", {
    estimateHours: 10, subtasksDone: 3, subtasksTotal: 5, attachments: 3,
  }),
  t(17, "atlas", "Empty & error states", "In Progress", "Urgent", "user-7", "Backend", "2026-10-16", "2026-10-27", {
    estimateHours: 12, attachments: 3, blocked: true, dependsOn: "NX-16",
  }),
  t(18, "atlas", "Dark theme tokens", "To Do", "High", "user-1", "Backend", "2026-11-03", "2026-11-10", { estimateHours: 6 }),
  t(19, "atlas", "Performance budget", "To Do", "Medium", "user-5", "Frontend", "2026-10-21", "2026-10-26", {
    estimateHours: 6, subtasksDone: 1, subtasksTotal: 4, attachments: 3,
  }),
  t(20, "atlas", "Usability test — round 2", "Backlog", "Urgent", "user-1", "Bug", "2026-10-03", "2026-10-08", {
    estimateHours: 8, subtasksDone: 0, subtasksTotal: 4, comments: 1,
  }),

  // ----------------------------------------------------------------- Ember
  t(21, "ember", "Menu browsing UI", "Done", "High", "user-9", "Frontend", "2026-07-27", "2026-08-14"),
  t(22, "ember", "Cart and checkout", "Done", "High", "user-9", "Frontend", "2026-08-10", "2026-08-28"),
  t(23, "ember", "Payment integration", "Done", "Urgent", "user-4", "Backend", "2026-08-17", "2026-09-04"),
  t(24, "ember", "Order history", "Done", "Medium", "user-2", "Design", "2026-08-31", "2026-09-14"),
  t(25, "ember", "Push notification copy", "Done", "Low", "user-9", "Content", "2026-09-14", "2026-09-22"),
  t(26, "ember", "Kitchen display sync", "Done", "High", "user-4", "Backend", "2026-09-07", "2026-09-28"),
  t(27, "ember", "Location picker", "Done", "Medium", "user-2", "Design", "2026-09-21", "2026-10-02"),
  t(28, "ember", "Live order tracking", "In Review", "High", "user-9", "Frontend", "2026-09-28", "2026-10-14"),
  t(29, "ember", "Loyalty points", "In Progress", "Medium", "user-4", "Backend", "2026-10-01", "2026-10-12", { blocked: true, dependsOn: "NX-28" }),
  t(30, "ember", "Store hours edge cases", "To Do", "Urgent", "user-5", "QA", "2026-10-05", "2026-10-11"),

  // ------------------------------------------------------------- Northwind
  t(31, "northwind", "Messaging framework", "Done", "High", "user-8", "Research", "2026-10-05", "2026-10-09"),
  t(32, "northwind", "Brand voice guide", "Done", "Medium", "user-6", "Content", "2026-10-06", "2026-10-10"),
  t(33, "northwind", "Pricing page layout", "In Progress", "High", "user-2", "Design", "2026-10-12", "2026-10-23"),
  t(34, "northwind", "Case study template", "In Progress", "Medium", "user-3", "Frontend", "2026-10-12", "2026-10-26"),
  t(35, "northwind", "Homepage copy", "In Progress", "Medium", "user-6", "Content", "2026-10-13", "2026-10-27"),
  t(36, "northwind", "Case study — Harbor Health", "In Review", "Medium", "user-8", "Content", "2026-10-09", "2026-10-16"),
  t(37, "northwind", "SEO redirects map", "To Do", "Low", "user-3", "Backend", "2026-11-02", "2026-11-09"),
  t(38, "northwind", "Analytics tagging", "To Do", "Low", "user-3", "Backend", "2026-11-09", "2026-11-16"),
  t(39, "northwind", "Testimonial section", "To Do", "Medium", "user-2", "Design", "2026-10-26", "2026-11-04"),
  t(40, "northwind", "Newsletter signup", "Backlog", "Low", "user-6", "Frontend", "2026-11-16", "2026-11-23"),

  // ------------------------------------------------------------------ Loom
  t(41, "loom", "Product filtering", "Done", "High", "user-3", "Frontend", "2026-10-12", "2026-10-12"),
  t(42, "loom", "Product detail page", "In Review", "High", "user-2", "Design", "2026-10-12", "2026-10-16"),
  t(43, "loom", "Mobile checkout", "In Review", "Medium", "user-9", "Frontend", "2026-10-12", "2026-10-20"),
  t(44, "loom", "Cart drawer", "In Progress", "High", "user-1", "Frontend", "2026-10-09", "2026-10-11", { subtasksDone: 1, subtasksTotal: 3 }),
  t(45, "loom", "Size guide modal", "In Progress", "Low", "user-3", "Frontend", "2026-10-14", "2026-10-21"),
  t(46, "loom", "Image zoom", "In Progress", "Medium", "user-2", "Design", "2026-10-14", "2026-10-23"),
  t(47, "loom", "Wishlist", "To Do", "Low", "user-9", "Backend", "2026-10-26", "2026-11-04"),
  t(48, "loom", "Shipping rates", "To Do", "Medium", "user-5", "QA", "2026-10-28", "2026-11-06"),
  t(49, "loom", "Fabric swatch gallery", "Backlog", "Low", "user-2", "Design", "2026-11-09", "2026-11-18"),
  t(50, "loom", "Gift wrap option", "Backlog", "Low", "user-9", "Frontend", "2026-11-16", "2026-11-24"),

  // ------------------------------------------------------------- Analytics
  t(51, "analytics", "Data source inventory", "Done", "Medium", "user-7", "Research", "2026-09-14", "2026-09-21"),
  t(52, "analytics", "Utilisation model", "Done", "High", "user-10", "Research", "2026-09-21", "2026-10-02"),
  t(53, "analytics", "Warehouse schema", "Done", "High", "user-4", "Backend", "2026-09-21", "2026-10-05"),
  t(54, "analytics", "Pipeline report", "Done", "Medium", "user-7", "Design", "2026-09-28", "2026-10-08"),
  t(55, "analytics", "Delivery burndown", "In Progress", "Medium", "user-7", "Frontend", "2026-10-08", "2026-10-22"),
  t(56, "analytics", "Spreadsheet cutover plan", "In Progress", "High", "user-10", "Content", "2026-10-05", "2026-10-12"),
  t(57, "analytics", "Access roles", "In Review", "Low", "user-4", "Backend", "2026-10-07", "2026-10-15"),
  t(58, "analytics", "Weekly digest email", "To Do", "Low", "user-3", "Frontend", "2026-10-19", "2026-10-28"),
  t(59, "analytics", "Forecast widget", "To Do", "Medium", "user-7", "Frontend", "2026-10-21", "2026-10-30"),
  t(60, "analytics", "Export to CSV", "Backlog", "Low", "user-3", "Backend", "2026-11-02", "2026-11-06"),
];

// Subtasks shown in the task drawer (keyed by task id).
export const subtasks = {
  "NX-11": [
    { id: "st-11-1", title: "Draft first pass", completed: true },
    { id: "st-11-2", title: "Internal review", completed: true },
  ],
  "NX-19": [
    { id: "st-19-1", title: "Draft first pass", completed: true },
    { id: "st-19-2", title: "Internal review", completed: false },
    { id: "st-19-3", title: "Address feedback", completed: false },
    { id: "st-19-4", title: "Final sign-off", completed: false },
  ],
};

export const getTasksByProject = (projectId) => tasks.filter((task) => task.projectId === projectId);
export const getTaskById = (id) => tasks.find((task) => task.id === id);
