import {useState} from "react";
import {Plus} from "lucide-react";

import Button from "../components/common/Button";
import ProjectFilters, {
    ProjectViewToggle,
    useProjects,
} from "../components/projects/ProjectFilters";
import ProjectCards from "../components/projects/ProjectCard";
import ProjectForm from "../components/projects/ProjectForm";

function Projects() {
    const [formOpen,setFormOpen]=useState(false);
    const [editProject,setEditProject]=useState(null);

    const {
        projects,
        filtered,
        filters,
        view,
        setView,
        setFilter,
        clearFilters,
        addProject,
        updateProject,
        duplicateProject,
        archiveProject,
    }=useProjects();

    // Open an empty form to create a project
    const handleCreateClick=()=>{
        setEditProject(null);
        setFormOpen(true);
    };

    // Open the edit form only when Edit is clicked
    const handleEdit=(project)=>{
        setEditProject(project);
        setFormOpen(true);
    };

    // Save a new project or update an existing project
    const handleSubmit=(project)=>{
        if(editProject){
            updateProject(project);
        }else{
            addProject(project);
            clearFilters();
        }

        setEditProject(null);
        setFormOpen(false);
    };

    // Close the form without saving
    const handleClose=()=>{
        setEditProject(null);
        setFormOpen(false);
    };

    // Handle opening a project without entering edit mode
    const handleOpen=(project)=>{
        console.log("Selected project:",project);
    };

    return(
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
                    <ProjectViewToggle
                        view={view}
                        setView={setView}
                    />

                    <Button
                        size="lg"
                        onClick={handleCreateClick}
                        className="!bg-[var(--color-text-primary)]"
                    >
                        <Plus
                            size={15}
                            strokeWidth={2}
                            aria-hidden="true"
                        />
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
                    onOpen={handleOpen}
                    onEdit={handleEdit}
                    onClear={clearFilters}
                    onDuplicate={duplicateProject}
                    onArchive={archiveProject}
                />
            </div>

            <ProjectForm
                isOpen={formOpen}
                onClose={handleClose}
                onSubmit={handleSubmit}
                editProject={editProject}
            />
        </div>
    );
}

export default Projects;