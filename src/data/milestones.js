// Milestones (Overview tab "Milestones" card + the diamond marker on the Timeline tab).

export const milestones = [
  { id: "ms-atlas-1", projectId: "atlas", title: "Beta release", date: "2026-10-31" },
  { id: "ms-clinic-1", projectId: "clinic", title: "Content freeze", date: "2026-10-30" },
  { id: "ms-clinic-2", projectId: "clinic", title: "Launch", date: "2026-11-14" },
  { id: "ms-ember-1", projectId: "ember", title: "App store submission", date: "2026-10-10" },
  { id: "ms-northwind-1", projectId: "northwind", title: "Copy approved", date: "2026-11-06" },
  { id: "ms-loom-1", projectId: "loom", title: "Checkout demo", date: "2026-11-27" },
  { id: "ms-analytics-1", projectId: "analytics", title: "Spreadsheets retired", date: "2026-11-02" },
];

export const getMilestonesByProject = (projectId) =>
  milestones.filter((milestone) => milestone.projectId === projectId);
