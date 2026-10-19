// Projects for the Projects page (grid, table, filters and the New project form).

export const DEMO_TODAY = "2026-10-13";

export const PROJECT_STATUSES = ["On Track", "At Risk", "Delayed"];
export const PROJECT_PRIORITIES = ["Low", "Medium", "High", "Urgent"];
export const SORT_OPTIONS = ["Deadline", "Name", "Newest", "Completion"];

// Colour swatches shown in the New project form (in order).
export const PROJECT_COLORS = [
  "#6366D1",
  "#0F9D86",
  "#C2540A",
  "#C0398A",
  "#3F8A2E",
  "#0A84B8",
  "#C8443F",
  "#9B59B6",
];

// Icon keys shown in the New project form (in order). Map them to lucide icons in the page.
export const PROJECT_ICONS = [
  "rocket",
  "clinic",
  "chart",
  "store",
  "megaphone",
  "database",
  "utensils",
  "phone",
];

// Pill styles for status / priority badges.
export const STATUS_STYLES = {
  "On Track": { bg: "#E3F6EC", fg: "#0B7A4B", dot: "#12A06C", bar: "#0F9D86" },
  "At Risk": { bg: "#FEF3D6", fg: "#9A5B00", dot: "#E8890C", bar: "#E8890C" },
  Delayed: { bg: "#FDE4E1", fg: "#B42318", dot: "#E5484D", bar: "#E5484D" },
};

export const PRIORITY_STYLES = {
  Urgent: "#E5484D",
  High: "#E8890C",
  Medium: "#3B82F6",
  Low: "#9CA3AF",
};

export const projects = [
  {
    id: "atlas",
    name: "Atlas SaaS Dashboard",
    client: "Atlas Analytics",
    description:
      "Self-serve analytics dashboard with role-based navigation, configurable KPI cards and exportable tables.",
    status: "At Risk",
    priority: "Urgent",
    leadId: "user-1",
    memberIds: ["user-1", "user-3", "user-4", "user-7", "user-5"],
    startDate: "2026-08-18",
    dueDate: "2026-10-31",
    createdAt: "2026-08-14",
    taskTotal: 10,
    taskDone: 4,
    icon: "chart",
    iconBg: "#E6EBFF",
    iconColor: "#5457C9",
    color: "#5457C9",
    sidebarProgress: "40%",
    filesCount: 16,
    boardCount: 10,
    openTasks: 6,
    overdueTasks: 1,
    blockedTasks: 1,
    estHoursLeft: 50,
  },
  {
    id: "clinic",
    name: "Clinic Website Redesign",
    client: "Harbor Health",
    description:
      "Patient-first website with online booking, doctor profiles and an accessible content system.",
    status: "On Track",
    priority: "High",
    leadId: "user-1",
    memberIds: ["user-1", "user-2", "user-3", "user-5", "user-4"],
    startDate: "2026-09-01",
    dueDate: "2026-11-14",
    createdAt: "2026-08-28",
    taskTotal: 10,
    taskDone: 5,
    icon: "clinic",
    iconBg: "#D7F5EA",
    iconColor: "#0F9D75",
    color: "#0F8F6B",
    sidebarProgress: "50%",
    filesCount: 9,
    boardCount: 10,
    openTasks: 5,
    overdueTasks: 1,
    blockedTasks: 0,
    estHoursLeft: 42,
  },
  {
    id: "ember",
    name: "Ember Ordering App",
    client: "Ember Kitchen",
    description:
      "Mobile-first ordering for a three-location restaurant group, from menu browsing to live order tracking.",
    status: "Delayed",
    priority: "High",
    leadId: "user-2",
    memberIds: ["user-2", "user-9", "user-4", "user-5", "user-6"],
    startDate: "2026-07-20",
    dueDate: "2026-10-10",
    createdAt: "2026-07-15",
    taskTotal: 10,
    taskDone: 7,
    icon: "utensils",
    iconBg: "#FDE9DC",
    iconColor: "#C2540A",
    color: "#B4531E",
    sidebarProgress: "70%",
    filesCount: 12,
    boardCount: 10,
    openTasks: 3,
    overdueTasks: 2,
    blockedTasks: 1,
    estHoursLeft: 28,
  },
  {
    id: "northwind",
    name: "Northwind Marketing Site",
    client: "Northwind Co.",
    description:
      "Repositioned marketing site with a new messaging framework, pricing page and case-study library.",
    status: "On Track",
    priority: "Medium",
    leadId: "user-8",
    memberIds: ["user-8", "user-6", "user-2", "user-3"],
    startDate: "2026-10-05",
    dueDate: "2026-12-05",
    createdAt: "2026-10-01",
    taskTotal: 10,
    taskDone: 2,
    icon: "megaphone",
    iconBg: "#FCE4F1",
    iconColor: "#C0398A",
    color: "#B8447F",
    sidebarProgress: "20%",
    filesCount: 5,
    boardCount: 10,
    openTasks: 8,
    overdueTasks: 0,
    blockedTasks: 0,
    estHoursLeft: 64,
  },
  {
    id: "loom",
    name: "Loom & Co. Storefront",
    client: "Loom & Co.",
    description:
      "Responsive storefront for a textile brand: filtering, product detail, cart drawer and mobile checkout.",
    status: "On Track",
    priority: "Medium",
    leadId: "user-1",
    memberIds: ["user-1", "user-3", "user-9", "user-2", "user-5"],
    startDate: "2026-10-12",
    dueDate: "2027-01-16",
    createdAt: "2026-10-09",
    taskTotal: 10,
    taskDone: 1,
    icon: "store",
    iconBg: "#DDF3D8",
    iconColor: "#3F8A2E",
    color: "#3F8A2E",
    sidebarProgress: "10%",
    filesCount: 4,
    boardCount: 10,
    openTasks: 9,
    overdueTasks: 1,
    blockedTasks: 0,
    estHoursLeft: 96,
  },
  {
    id: "analytics",
    name: "Internal Analytics Hub",
    client: "Internal · Operations",
    description:
      "One place for studio metrics — utilisation, delivery and pipeline — replacing four scattered spreadsheets.",
    status: "At Risk",
    priority: "Low",
    leadId: "user-7",
    memberIds: ["user-7", "user-4", "user-10", "user-3"],
    startDate: "2026-09-14",
    dueDate: "2026-11-02",
    createdAt: "2026-09-10",
    taskTotal: 10,
    taskDone: 4,
    icon: "database",
    iconBg: "#DDF1FD",
    iconColor: "#0A84B8",
    color: "#0A84B8",
    sidebarProgress: "40%",
    filesCount: 7,
    boardCount: 10,
    openTasks: 6,
    overdueTasks: 1,
    blockedTasks: 0,
    estHoursLeft: 38,
  },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const DAY_MS = 24 * 60 * 60 * 1000;
const parse = (iso) => new Date(`${iso}T00:00:00`);

export const getProgress = (project) =>
  project.taskTotal === 0
    ? 0
    : Math.round((project.taskDone / project.taskTotal) * 100);

export const daysUntil = (iso, today = DEMO_TODAY) =>
  Math.round((parse(iso) - parse(today)) / DAY_MS);

// "18d left" / "3d past due" / "Due today"
export const getDeadlineNote = (iso, today = DEMO_TODAY) => {
  const diff = daysUntil(iso, today);
  if (diff > 0) return { text: `${diff}d left`, overdue: false };
  if (diff === 0) return { text: "Due today", overdue: false };
  return { text: `${Math.abs(diff)}d past due`, overdue: true };
};

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// "Oct 31"
export const formatShortDate = (iso) => {
  const d = parse(iso);
  return `${MONTHS[d.getMonth()]} ${d.getDate()}`;
};

// "Oct 31, 2026"
export const formatLongDate = (iso) => {
  const d = parse(iso);
  return `${MONTHS[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
};

export const getProjectById = (id) => projects.find((project) => project.id === id);

// Deadline filter options used by the "Any deadline" dropdown.
export const DEADLINE_FILTERS = [
  { id: "any", label: "Any deadline" },
  { id: "overdue", label: "Overdue" },
  { id: "7d", label: "Next 7 days" },
  { id: "30d", label: "Next 30 days" },
  { id: "later", label: "Later" },
];
