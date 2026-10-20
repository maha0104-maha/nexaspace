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
import ProjectSettingsModal from "../components/projects/ProjectSettingsModal";
import useTaskStore from "../hooks/useTaskStore";
import { loadJSON, saveJSON } from "../utils/storage";
import { projects as seedProjects, getUserById, getMilestonesByProject, getActivitiesByProject } from "../data";

const KEY = "nexaspace.projects.v1";
// same list the Projects page uses
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

  // keep the "x of y tasks" on the project card correct (saved only, no extra render)
  useEffect(() => {
    const list = getProjects();
    const saved = list.find((p) => p.id === project.id);
    if (saved && (saved.taskTotal !== tasks.length || saved.taskDone !== done)) {
      saveJSON(KEY, list.map((p) => (p.id === project.id ? { ...p, taskTotal: tasks.length, taskDone: done } : p)));
    }
  }, [project.id, tasks.length, done]);

  const removeTask = (task) => {
    if (!window.confirm("Delete task " + task.id + "?")) return;
    setOpenId(null);
    store.deleteTask(task.id);
  };

  // save any change to this project (status, settings...)
  const changeProject = (changes) => {
    saveJSON(KEY, getProjects().map((p) => (p.id === project.id ? { ...p, ...changes } : p)));
    setProject({ ...project, ...changes });
  };
  const changeStatus = (status) => changeProject({ status });
  const addTask = (data) => {
    store.addTask(data);
    setCreate({ open: false, status: "To Do" });
  };
  const duplicate = () => {
    const copy = { ...project, id: project.id + "-copy-" + Date.now(), name: project.name + " (copy)" };
    saveJSON(KEY, [...getProjects(), copy]);
    navigate("/projects/" + copy.id);
  };
  const remove = (ask) => {
    if (ask && !window.confirm("Delete this project? This can't be undone.")) return;
    saveJSON(KEY, getProjects().filter((p) => p.id !== project.id));
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
      <ProjectSettingsModal isOpen={settings} project={project} onClose={() => setSettings(false)}
        onSave={(data) => { changeProject(data); setSettings(false); }} />
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
