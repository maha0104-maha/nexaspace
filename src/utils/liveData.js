import { loadJSON } from "./storage";
import { projects as seedProjects, tasks as seedTasks } from "../data";

// the same keys the rest of the app saves to (useTaskStore.js and ProjectFilters.jsx)
const PROJECTS_KEY = "nexaspace.projects.v1";
const STORE_KEY = "nexaspace.taskstore.v1";

// the order the demo projects were laid out in the design, new projects go after them
const DEMO_ORDER = ["clinic", "atlas", "ember", "northwind", "loom", "analytics"];
const rank = (project) => {
  const place = DEMO_ORDER.indexOf(project.id);
  return place === -1 ? DEMO_ORDER.length : place;
};

// saved projects, or the demo projects on the very first visit
export const getLiveProjects = () => {
  const saved = loadJSON(PROJECTS_KEY, null);
  const list = Array.isArray(saved) ? saved : seedProjects;
  return [...list].sort((a, b) => rank(a) - rank(b));
};

// saved tasks, or the demo tasks on the very first visit
export const getLiveTasks = () => {
  const saved = loadJSON(STORE_KEY, null);
  return saved && Array.isArray(saved.tasks) ? saved.tasks : seedTasks;
};

// whoever saves projects or tasks calls this, so parts of the screen that are
// already open (like the sidebar) can read the new numbers
export const DATA_EVENT = "nexaspace:data";
export const notifyDataChanged = () => window.dispatchEvent(new Event(DATA_EVENT));
