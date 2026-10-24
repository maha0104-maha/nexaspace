import { tasks as seedTasks, subtasks as seedSubtasks, files as seedFiles, DEMO_TODAY, currentUserId } from "../data";
import { loadJSON, saveJSON } from "./storage";
import { notifyDataChanged } from "./liveData";

export const STORE_KEY = "nexaspace.taskstore.v1";

// unique id for anything we create (two clicks in the same millisecond must not clash)
export const uid = (prefix) => prefix + "-" + Date.now() + "-" + Math.random().toString(36).slice(2, 7);

export const startStore = { tasks: seedTasks, subtasks: seedSubtasks, files: seedFiles, comments: {}, history: {}, activity: [] };

// read and write the whole store without needing a component (the header uses these)
export const readStore = () => loadJSON(STORE_KEY, startStore);
export const writeStore = (store) => {
  saveJSON(STORE_KEY, store);
  notifyDataChanged();
};

// the store with one more task in it (and a line in the activity feed)
export const withNewTask = (old, data) => {
  let big = 0;
  old.tasks.forEach((t) => {
    const n = Number(t.id.slice(3));
    if (n > big) big = n;
  });
  const task = {
    id: "NX-" + (big + 1), projectId: data.projectId, title: data.title, description: "", status: data.status,
    priority: data.priority, assigneeId: data.assigneeId, reporterId: currentUserId, label: data.label,
    startDate: data.dueDate < DEMO_TODAY ? data.dueDate : DEMO_TODAY, dueDate: data.dueDate, estimateHours: 4,
    subtasksDone: 0, subtasksTotal: 0, attachments: 0, comments: 0, blocked: false, dependsOn: null,
    completedAt: data.status === "Done" ? DEMO_TODAY : null,
  };
  const note = { id: uid("act"), userId: currentUserId, projectId: data.projectId, verb: "created", target: data.title, suffix: "", ago: "just now", at: Date.now() };
  return { ...old, tasks: [...old.tasks, task], activity: [note, ...old.activity] };
};

// things that are not about one task (a project was created, its status changed...)
export const withActivity = (old, entry) => ({
  ...old,
  activity: [{ id: uid("act"), userId: currentUserId, ago: "just now", at: Date.now(), suffix: "", ...entry }, ...old.activity],
});
