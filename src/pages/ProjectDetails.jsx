import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Card from "../components/common/Card";
import Button from "../components/common/Button";
import EmptyState from "../components/common/EmptyState";
import ProjectHeader from "../components/projects/ProjectHeader";
import OverviewTab from "../components/projects/OverviewTab";
import BoardTab from "../components/projects/BoardTab";
import ListTab from "../components/projects/ListTab";
import TimelineTab from "../components/projects/TimelineTab";
import FilesTab from "../components/projects/FilesTab";
import ActivityTab from "../components/projects/ActivityTab";
import TaskDrawer from "../components/projects/TaskDrawer";
import CreateTaskModal from "../components/projects/CreateTaskModal";
import ProjectForm from "../components/projects/ProjectForm";
import useTaskStore from "../hooks/useTaskStore";
import { loadJSON, saveJSON } from "../utils/storage";
import { notifyDataChanged } from "../utils/liveData";
import { projects as seedProjects, getUserById, getMilestonesByProject, getActivitiesByProject, formatShortDate } from "../data";

const KEY = "nexaspace.projects.v1";
// same list the Projects page uses
const saveProjects = (list) => {
  saveJSON(KEY, list);
  notifyDataChanged();
};
const getProjects = () => {
  const saved = loadJSON(KEY, null);
  return Array.isArray(saved) ? saved : seedProjects;
};

function Details({ first }) {
  const navigate = useNavigate();
  const [project, setProject] = useState(first);
  const [tab, setTab] = useState(() => loadJSON("nexaspace.tab." + first.id, "overview"));
  useEffect(() => {
    saveJSON("nexaspace.tab." + project.id, tab);
  }, [project.id, tab]);
  // tasks, files, comments... all live in the task store (saved in localStorage)
  const store = useTaskStore();
  const [openId, setOpenId] = useState(null);
  const [create, setCreate] = useState({ open: false, status: "To Do" });
  const [settings, setSettings] = useState(false);
  const tasks = store.tasks.filter((t) => t.projectId === project.id);
  const files = store.files.filter((f) => f.projectId === project.id);
  const done = tasks.filter((t) => t.status === "Done").length;
  const updateTask = store.updateTask;
  const moveTask = (id, status) => updateTask(id, { status });
  const openTask = tasks.find((t) => t.id === openId);
  const milestones = getMilestonesByProject(project.id);
  const activities = [...store.activity.filter((a) => a.projectId === project.id), ...getActivitiesByProject(project.id)];
  const members = project.memberIds.map(getUserById).filter(Boolean);
  const isDemo = seedProjects.some((p) => p.id === project.id);

  useEffect(() => {
    const list = getProjects();
    const saved = list.find((p) => p.id === project.id);
    if (saved && (saved.taskTotal !== tasks.length || saved.taskDone !== done)) {
      saveProjects(list.map((p) => (p.id === project.id ? { ...p, taskTotal: tasks.length, taskDone: done } : p)));
    }
  }, [project.id, tasks.length, done]);

  const removeTask = (task) => {
    if (!window.confirm("Delete task " + task.id + "?")) return;
    setOpenId(null);
    store.deleteTask(task.id);
  };

  // save any change to this project 
  const changeProject = (changes) => {
    saveProjects(getProjects().map((p) => (p.id === project.id ? { ...p, ...changes } : p)));
    setProject({ ...project, ...changes });
  };
  const changeStatus = (status) => {
    changeProject({ status });
    store.logActivity({ projectId: project.id, verb: "changed the status of", target: project.name, suffix: "to " + status });
  };

  const saveSettings = (data) => {
    changeProject(data);
    if (data.status !== project.status) {
      store.logActivity({ projectId: project.id, verb: "changed the status of", target: data.name, suffix: "to " + data.status });
    }
    if (data.dueDate !== project.dueDate) {
      store.logActivity({ projectId: project.id, verb: "changed the deadline of", target: data.name, suffix: "to " + formatShortDate(data.dueDate) });
    }
    setSettings(false);
  };
  const addTask = (data) => {
    store.addTask(data);
    setCreate({ open: false, status: "To Do" });
  };
  const duplicate = () => {
    const copy = { ...project, id: project.id + "-copy-" + Date.now(), name: project.name + " (copy)" };
    saveProjects([...getProjects(), copy]);
    store.logActivity({ projectId: copy.id, verb: "duplicated", target: project.name });
    navigate("/projects/" + copy.id);
  };
  const remove = (ask) => {
    if (ask && !window.confirm("Delete this project? This can't be undone.")) return;
    saveProjects(getProjects().filter((p) => p.id !== project.id));
    navigate("/projects");
  };

  return (
    <div className="p-4 sm:p-[30px]">
      <Card className="overflow-hidden" contentClassName="!p-0">
        <ProjectHeader project={project} tasks={tasks} fileCount={files.length} members={members} isDemo={isDemo}
          tab={tab} onTab={setTab} onStatus={changeStatus} onDuplicate={duplicate}
          onAddTask={() => setCreate({ open: true, status: "To Do" })} onSettings={() => setSettings(true)}
          onArchive={() => remove(false)} onDelete={() => remove(true)} />
        {tab === "overview" && (
          <OverviewTab project={project} tasks={tasks} milestones={milestones} activities={activities} />
        )}
        {tab === "board" && <BoardTab projectId={project.id} tasks={tasks} members={members} onMove={moveTask} onOpen={(t) => setOpenId(t.id)}
          onAdd={(status) => setCreate({ open: true, status })} />}
        {tab === "list" && <ListTab tasks={tasks} onUpdate={updateTask} onOpen={(t) => setOpenId(t.id)} />}
        {tab === "timeline" && <TimelineTab projectId={project.id} project={project} tasks={tasks} milestones={milestones} />}
        {tab === "files" && <FilesTab files={files} />}
        {tab === "activity" && <ActivityTab activities={activities} />}
      </Card>
      {openTask && <TaskDrawer key={openTask.id} task={openTask} project={project} store={store} onClose={() => setOpenId(null)} onDelete={removeTask} />}
      <CreateTaskModal isOpen={create.open} status={create.status} projectId={project.id} projectList={getProjects()}
        onClose={() => setCreate({ open: false, status: "To Do" })} onCreate={addTask} />
      <ProjectForm isOpen={settings} project={project} onClose={() => setSettings(false)} onSubmit={saveSettings} />
    </div>
  );
}

function ProjectDetails() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const project = getProjects().find((p) => p.id === projectId);
  if (!project) {
    return (
      <div className="p-[30px]">
        <EmptyState title="Project not found" description="It may have been archived or deleted."
          action={<Button onClick={() => navigate("/projects")}>Back to projects</Button>} />
      </div>
    );
  }
  return <Details key={projectId} first={project} />;
}

export default ProjectDetails;