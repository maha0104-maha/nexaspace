import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Card from "../components/common/Card";
import Button from "../components/common/Button";
import EmptyState from "../components/common/EmptyState";
import ProjectHeader from "../components/projects/details/ProjectHeader";
import OverviewTab from "../components/projects/details/OverviewTab";
import BoardTab from "../components/projects/details/BoardTab";
import ListTab from "../components/projects/details/ListTab";
import TimelineTab from "../components/projects/details/TimelineTab";
import FilesTab from "../components/projects/details/FilesTab";
import ActivityTab from "../components/projects/details/ActivityTab";
import { loadJSON, saveJSON } from "../utils/storage";
import { projects as seedProjects, getUserById, getTasksByProject, getFilesByProject, getMilestonesByProject, getActivitiesByProject } from "../data";

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
  }, [tab]);
  // tasks live in state so the board can change them (saved in localStorage)
  const [tasks, setTasks] = useState(() => loadJSON("nexaspace.tasks." + first.id, getTasksByProject(first.id)));
  useEffect(() => {
    saveJSON("nexaspace.tasks." + project.id, tasks);
  }, [tasks]);
  const updateTask = (id, changes) => setTasks(tasks.map((t) => (t.id === id ? { ...t, ...changes } : t)));
  const moveTask = (id, status) => updateTask(id, { status });
  const files = getFilesByProject(project.id);
  const milestones = getMilestonesByProject(project.id);
  const activities = getActivitiesByProject(project.id);
  const members = project.memberIds.map(getUserById).filter(Boolean);
  const isDemo = seedProjects.some((p) => p.id === project.id);

  const changeStatus = (status) => {
    saveJSON(KEY, getProjects().map((p) => (p.id === project.id ? { ...p, status } : p)));
    setProject({ ...project, status });
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
          onArchive={() => remove(false)} onDelete={() => remove(true)} />
        {tab === "overview" && (
          <OverviewTab project={project} tasks={tasks} milestones={milestones} activities={activities} />
        )}
        {tab === "board" && <BoardTab projectId={project.id} tasks={tasks} members={members} onMove={moveTask} />}
        {tab === "list" && <ListTab tasks={tasks} onUpdate={updateTask} />}
        {tab === "timeline" && <TimelineTab projectId={project.id} project={project} tasks={tasks} milestones={milestones} />}
        {tab === "files" && <FilesTab files={files} />}
        {tab === "activity" && <ActivityTab activities={activities} />}
      </Card>
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