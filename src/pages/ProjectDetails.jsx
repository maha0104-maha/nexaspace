import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Button from "../components/common/Button";
import Card from "../components/common/Card";
import EmptyState from "../components/common/EmptyState";
import ProjectHeader from "../components/projects/ProjectHeader";
import { loadJSON, saveJSON } from "../utils/storage";
import { projects as seedProjects, getUserById, getTasksByProject, getFilesByProject } from "../data";

const KEY = "nexaspace.projects.v1";
// same list the Projects page uses
const getProjects = () => {
  const saved = loadJSON(KEY, null);
  return Array.isArray(saved) ? saved : seedProjects;
};

const TAB_TEXT = {
  overview: "Overview",
  board: "Board",
  list: "List",
  timeline: "Timeline",
  files: "Files",
  activity: "Activity",
};

function Details({ first }) {
  const navigate = useNavigate();
  const [project, setProject] = useState(first);
  const [tab, setTab] = useState(() => loadJSON("nexaspace.tab." + first.id, "overview"));
  useEffect(() => {
    saveJSON("nexaspace.tab." + project.id, tab);
  }, [tab]);
  const tasks = getTasksByProject(project.id);
  const files = getFilesByProject(project.id);
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
        <div className="p-5">
          <EmptyState title={TAB_TEXT[tab] + " tab"} description="This tab gets built in the next step." />
        </div>
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