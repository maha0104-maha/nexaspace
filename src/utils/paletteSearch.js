import { users, TASK_LABELS } from "../data";

// the sidebar button and the shortcut tell the header to open the palette with this
export const OPEN_PALETTE = "nexaspace:palette";

// things you can run from the palette (the two "create" ones open a dialog, the rest go to a page)
export const ACTIONS = [
  { id: "create-task", label: "Create task" },
  { id: "create-project", label: "Create project" },
  { id: "go-overview", label: "Go to Overview", to: "/" },
  { id: "go-projects", label: "Go to Projects", to: "/projects" },
  { id: "go-tasks", label: "Open My Tasks", to: "/mytasks" },
];

const has = (text, query) => String(text || "").toLowerCase().includes(query);

// turns what you typed into the sections shown in the palette
// with nothing typed you see the actions and every project, like the design
export const buildSections = (query, { projects, tasks, canCreateTask = true }) => {
  const q = query.trim().toLowerCase();
  const sections = [];

  const actions = ACTIONS.filter((a) => (canCreateTask || a.id !== "create-task") && (!q || has(a.label, q)));
  if (actions.length) {
    sections.push({ title: "Actions", items: actions.map((a) => ({ key: "action:" + a.id, kind: "action", id: a.id, label: a.label, to: a.to })) });
  }

  const projectItems = projects
    .filter((p) => !q || has(p.name, q) || has(p.client, q))
    .map((p) => ({ key: "project:" + p.id, kind: "project", label: p.name, hint: p.client, icon: p.icon, to: "/projects/" + p.id }));
  if (projectItems.length) sections.push({ title: "Projects", items: projectItems });

  // the rest only appear once you start typing
  if (q) {
    const taskItems = tasks
      .filter((t) => has(t.title, q) || has(t.id, q))
      .slice(0, 6)
      .map((t) => {
        const project = projects.find((p) => p.id === t.projectId);
        return { key: "task:" + t.id, kind: "task", label: t.title, hint: t.id + (project ? " · " + project.name : ""), status: t.status, to: "/projects/" + t.projectId };
      });
    if (taskItems.length) sections.push({ title: "Tasks", items: taskItems });

    const peopleItems = users
      .filter((u) => has(u.name, q) || has(u.role, q) || has(u.email, q))
      .slice(0, 5)
      .map((u) => ({ key: "person:" + u.id, kind: "person", label: u.name, hint: u.role, user: u, to: "/team" }));
    if (peopleItems.length) sections.push({ title: "People", items: peopleItems });

    const labelItems = TASK_LABELS.filter((l) => has(l, q)).slice(0, 5).map((l) => {
      const withLabel = tasks.filter((t) => t.label === l);
      return { key: "label:" + l, kind: "label", label: l, hint: withLabel.length + (withLabel.length === 1 ? " task" : " tasks"), to: withLabel.length ? "/projects/" + withLabel[0].projectId : "/projects" };
    });
    if (labelItems.length) sections.push({ title: "Labels", items: labelItems });
  }

  return sections;
};