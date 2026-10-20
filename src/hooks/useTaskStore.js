import { useState, useEffect } from "react";
import { tasks as seedTasks, subtasks as seedSubtasks, files as seedFiles, DEMO_TODAY, currentUserId } from "../data";
import { loadJSON, saveJSON } from "../utils/storage";
const KEY = "nexaspace.taskstore.v1";
// unique id for anything we create (two clicks in the same millisecond must not clash)
const uid = (prefix) => prefix + "-" + Date.now() + "-" + Math.random().toString(36).slice(2, 7);
const start = { tasks: seedTasks, subtasks: seedSubtasks, files: seedFiles, comments: {}, history: {}, activity: [] };
const fixSubCounts = (tasks, subs, id) => {
  const list = subs[id] || [];
  return tasks.map((t) => (t.id === id ? { ...t, subtasksTotal: list.length, subtasksDone: list.filter((s) => s.completed).length } : t));
};
const fixFileCount = (tasks, files, id) => tasks.map((t) => (t.id === id ? { ...t, attachments: files.filter((f) => f.taskId === id).length } : t));
export default function useTaskStore() {
  const [store, setStore] = useState(() => loadJSON(KEY, start));
  useEffect(() => {
    saveJSON(KEY, store);
  }, [store]);
  const updateTask = (id, changes) => {
    setStore((old) => {
      const task = old.tasks.find((t) => t.id === id);
      if (!task) return old;
      const next = { ...task, ...changes };
      if (changes.status) next.completedAt = changes.status === "Done" ? DEMO_TODAY : null;
      const notes = [];
      if (changes.status && changes.status !== task.status) notes.push("changed the status to " + changes.status);
      if (changes.priority && changes.priority !== task.priority) notes.push("set the priority to " + changes.priority);
      if (changes.assigneeId && changes.assigneeId !== task.assigneeId) notes.push("changed the assignee");
      const history = { ...old.history };
      if (notes.length) history[id] = [...notes.map((n) => ({ id: uid("h"), userId: currentUserId, text: n, ago: "just now" })), ...(history[id] || [])];
      let activity = old.activity;
      if (changes.status && changes.status !== task.status) {
        activity = [{ id: uid("act"), userId: currentUserId, projectId: task.projectId, verb: "moved", target: task.title, suffix: "to " + changes.status, ago: "just now" }, ...activity];
      }
      return { ...old, tasks: old.tasks.map((t) => (t.id === id ? next : t)), history, activity };
    });
  };
  const addTask = (data) => {
    setStore((old) => {
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
      const note = { id: uid("act"), userId: currentUserId, projectId: data.projectId, verb: "created", target: data.title, suffix: "", ago: "just now" };
      return { ...old, tasks: [...old.tasks, task], activity: [note, ...old.activity] };
    });
  };
  const deleteTask = (id) => setStore((old) => ({ ...old, tasks: old.tasks.filter((t) => t.id !== id) }));
  const toggleSubtask = (taskId, subId) => {
    setStore((old) => {
      const subs = { ...old.subtasks, [taskId]: (old.subtasks[taskId] || []).map((s) => (s.id === subId ? { ...s, completed: !s.completed } : s)) };
      return { ...old, subtasks: subs, tasks: fixSubCounts(old.tasks, subs, taskId) };
    });
  };
  const addSubtask = (taskId, title) => {
    setStore((old) => {
      const subs = { ...old.subtasks, [taskId]: [...(old.subtasks[taskId] || []), { id: uid("st"), title, completed: false }] };
      return { ...old, subtasks: subs, tasks: fixSubCounts(old.tasks, subs, taskId) };
    });
  };
  const removeSubtask = (taskId, subId) => {
    setStore((old) => {
      const subs = { ...old.subtasks, [taskId]: (old.subtasks[taskId] || []).filter((s) => s.id !== subId) };
      return { ...old, subtasks: subs, tasks: fixSubCounts(old.tasks, subs, taskId) };
    });
  };
  const addComment = (taskId, text) => {
    setStore((old) => {
      const c = { id: uid("c"), userId: currentUserId, text, ago: "just now" };
      const comments = { ...old.comments, [taskId]: [...(old.comments[taskId] || []), c] };
      return { ...old, comments, tasks: old.tasks.map((t) => (t.id === taskId ? { ...t, comments: t.comments + 1 } : t)) };
    });
  };
  const addFile = (task, file) => {
    setStore((old) => {
      const f = { id: uid("file"), projectId: task.projectId, name: file.name, type: file.type, sizeMb: file.sizeMb, taskTitle: task.title, taskId: task.id, uploadedBy: currentUserId };
      const files = [...old.files, f];
      return { ...old, files, tasks: fixFileCount(old.tasks, files, task.id) };
    });
  };
  const removeFile = (file) => {
    setStore((old) => {
      const files = old.files.filter((f) => f.id !== file.id);
      return { ...old, files, tasks: fixFileCount(old.tasks, files, file.taskId) };
    });
  };
  return { ...store, updateTask, addTask, deleteTask, toggleSubtask, addSubtask, removeSubtask, addComment, addFile, removeFile };
}
