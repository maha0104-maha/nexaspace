
export const FILE_TYPE_STYLES = {
  fig: { color: "#7C5CFA", bg: "#F1EEFF", label: "Figma" },
  pdf: { color: "#E5484D", bg: "#FDECEC", label: "PDF" },
  png: { color: "#0F9D86", bg: "#E3F6F1", label: "Image" },
  doc: { color: "#2F8CF5", bg: "#E6F1FE", label: "DOC" },
};

const f = (n, projectId, name, type, sizeMb, taskTitle, taskId, uploadedBy) => ({
  id: `file-${projectId}-${n}`,
  projectId,
  name,
  type,
  sizeMb,
  taskTitle,
  taskId,
  uploadedBy,
});

export const files = [
  // Atlas SaaS Dashboard — 16 files
  f(1, "atlas", "kpi-card-component.fig", "fig", 4.0, "KPI card component", "NX-11", "user-5"),
  f(2, "atlas", "kpi-card-component-v2.png", "png", 5.1, "KPI card component", "NX-11", "user-1"),
  f(3, "atlas", "kpi-card-component-v3.fig", "fig", 4.7, "KPI card component", "NX-11", "user-3"),
  f(4, "atlas", "role-based-navigation.pdf", "pdf", 0.6, "Role-based navigation", "NX-14", "user-4"),
  f(5, "atlas", "role-based-navigation-v2.pdf", "pdf", 1.0, "Role-based navigation", "NX-14", "user-3"),
  f(6, "atlas", "role-based-navigation-v3.fig", "fig", 5.6, "Role-based navigation", "NX-14", "user-4"),
  f(7, "atlas", "dashboard-filters.png", "png", 0.3, "Dashboard filters", "NX-15", "user-1"),
  f(8, "atlas", "api-mock-layer.fig", "fig", 1.0, "API mock layer", "NX-16", "user-4"),
  f(9, "atlas", "api-mock-layer-v2.png", "png", 0.8, "API mock layer", "NX-16", "user-5"),
  f(10, "atlas", "api-mock-layer-v3.doc", "doc", 1.0, "API mock layer", "NX-16", "user-5"),
  f(11, "atlas", "empty-error-states.fig", "fig", 2.8, "Empty & error states", "NX-17", "user-7"),
  f(12, "atlas", "empty-error-states-v2.pdf", "pdf", 5.9, "Empty & error states", "NX-17", "user-7"),
  f(13, "atlas", "empty-error-states-v3.fig", "fig", 0.8, "Empty & error states", "NX-17", "user-1"),
  f(14, "atlas", "performance-budget.pdf", "pdf", 2.0, "Performance budget", "NX-19", "user-1"),
  f(15, "atlas", "performance-budget-v2.doc", "doc", 2.6, "Performance budget", "NX-19", "user-1"),
  f(16, "atlas", "performance-budget-v3.png", "png", 2.9, "Performance budget", "NX-19", "user-3"),

  // A few files for the other projects so their Files tab is not empty.
  f(1, "clinic", "doctor-profile-template.fig", "fig", 3.2, "Doctor profile template", "NX-1", "user-5"),
  f(2, "clinic", "booking-flow-wireframes.pdf", "pdf", 1.8, "Booking flow wireframes", "NX-2", "user-2"),
  f(3, "clinic", "accessibility-audit.doc", "doc", 0.9, "Accessibility audit", "NX-3", "user-5"),
  f(1, "ember", "live-order-tracking.fig", "fig", 6.4, "Live order tracking", "NX-28", "user-9"),
  f(2, "ember", "push-notification-copy.doc", "doc", 0.3, "Push notification copy", "NX-25", "user-9"),
  f(1, "northwind", "messaging-framework.pdf", "pdf", 1.2, "Messaging framework", "NX-31", "user-8"),
  f(2, "northwind", "pricing-page-layout.fig", "fig", 4.1, "Pricing page layout", "NX-33", "user-2"),
  f(1, "loom", "cart-drawer.fig", "fig", 2.2, "Cart drawer", "NX-44", "user-1"),
  f(1, "analytics", "data-source-inventory.png", "png", 0.7, "Data source inventory", "NX-51", "user-7"),
  f(2, "analytics", "warehouse-schema.pdf", "pdf", 1.5, "Warehouse schema", "NX-53", "user-4"),
];

export const getFilesByProject = (projectId) => files.filter((file) => file.projectId === projectId);
