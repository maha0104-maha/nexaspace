// Activity feed. `ago` is the label shown on the project's Activity tab / Overview card,
// `dashboardAgo` is the label shown in the dashboard's "Recent activity" card.
// Render as: <b>{user}</b> {verb} <b>{target}</b> {suffix}

export const activities = [
  {
    id: "activity-1",
    userId: "user-5",
    projectId: "clinic",
    verb: "completed",
    target: "Doctor profile template",
    suffix: "",
    ago: "1h ago",
    dashboardAgo: "1h ago",
  },
  {
    id: "activity-2",
    userId: "user-1",
    projectId: "atlas",
    verb: "changed the deadline of",
    target: "Atlas SaaS Dashboard",
    suffix: "to Oct 31",
    ago: "55m ago",
    dashboardAgo: "2h ago",
  },
  {
    id: "activity-3",
    userId: "user-2",
    projectId: "ember",
    verb: "mentioned you in",
    target: "Order history",
    suffix: "",
    ago: "3h ago",
    dashboardAgo: "3h ago",
  },
  {
    id: "activity-4",
    userId: "user-7",
    projectId: "analytics",
    verb: "moved",
    target: "Internal Analytics Hub",
    suffix: "to At Risk",
    ago: "4h ago",
    dashboardAgo: "4h ago",
  },
  {
    id: "activity-5",
    userId: "user-6",
    projectId: "northwind",
    verb: "joined",
    target: "Northwind Marketing Site",
    suffix: "",
    ago: "6h ago",
    dashboardAgo: "6h ago",
  },
  {
    id: "activity-6",
    userId: "user-4",
    projectId: "atlas",
    verb: "commented on",
    target: "API mock layer",
    suffix: "",
    ago: "7h ago",
    dashboardAgo: "8h ago",
  },
  {
    id: "activity-7",
    userId: "user-9",
    projectId: "ember",
    verb: "completed",
    target: "Push notification copy",
    suffix: "",
    ago: "1d ago",
    dashboardAgo: "1d ago",
  },
  {
    id: "activity-8",
    userId: "user-3",
    projectId: "atlas",
    verb: "moved",
    target: "Role-based navigation",
    suffix: "to Done",
    ago: "1d ago",
    dashboardAgo: null, // only shown inside the Atlas project
  },
];

// Order used by the dashboard's Recent activity card.
export const dashboardActivityIds = [
  "activity-1",
  "activity-2",
  "activity-3",
  "activity-4",
  "activity-5",
  "activity-6",
  "activity-7",
];

export const getActivitiesByProject = (projectId) =>
  activities.filter((activity) => activity.projectId === projectId);
