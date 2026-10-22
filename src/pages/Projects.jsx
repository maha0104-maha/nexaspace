import { useState } from "react";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

import Button from "../components/common/Button";
import ProjectFilters, {
    ProjectViewToggle,
    useProjects,
} from "../components/projects/ProjectFilters";
import ProjectCards from "../components/projects/ProjectCard";
import ProjectForm from "../components/projects/ProjectForm";
import useTaskStore from "../hooks/useTaskStore";

function Projects() {
    const navigate = useNavigate();
    const store = useTaskStore();
    const [formOpen, setFormOpen] = useState(false);

    const {
        projects,
        filtered,
        filters,
        view,
        setView,
        setFilter,
        clearFilters,
        addProject,
        duplicateProject,
        archiveProject,
    } = useProjects();

    const handleCreate = (project) => {
        addProject(project);
        store.logActivity({ projectId: project.id, verb: "created the project", target: project.name });
        clearFilters(); // make sure the new project isn't hidden by an active filter
        setFormOpen(false);
    };

    return (
        <div className="px-[var(--spacing-8)] pb-10 pt-[30px]">
            <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                    <h2 className="text-[length:var(--font-size-3xl)] font-bold leading-[34px] tracking-[-0.6px] text-[var(--color-text-primary)]">
                        Projects
                    </h2>
                    <p className="mt-1 text-[length:var(--font-size-base)] text-[var(--color-text-secondary)]">
                        {projects.length} active projects · Lumen Studio
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <ProjectViewToggle view={view} setView={setView} />
                    <Button
                        size="lg"
                        onClick={() => setFormOpen(true)}
                        className="!bg-[var(--color-text-primary)]"
                    >
                        <Plus size={15} strokeWidth={2} aria-hidden="true" />
                        New project
                    </Button>
                </div>
            </div>

            <ProjectFilters
                filters={filters}
                onChange={setFilter}
                onClear={clearFilters}
                projects={projects}
            />

            <div className="mt-4">
                <ProjectCards
                    projectList={filtered}
                    view={view}
                    onOpen={(project) => navigate("/projects/" + project.id)}
                    onClear={clearFilters}
                    onDuplicate={duplicateProject}
                    onArchive={archiveProject}
                />
            </div>

            <ProjectForm
                isOpen={formOpen}
                onClose={() => setFormOpen(false)}
                onSubmit={handleCreate}
            />
        </div>
    );
}

export default Projects;
