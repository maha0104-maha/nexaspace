import {useEffect,useMemo,useState} from "react";
import {LayoutGrid,Table2} from "lucide-react";
import Button from "../common/Button";
import Dropdown from "../common/Dropdown";
import SearchInput from "../common/SearchInput";
import {loadJSON,saveJSON} from "../../utils/storage";
import {projects as seedProjects,
    users as allUsers,
    daysUntil,
    PROJECT_STATUSES,
    PROJECT_PRIORITIES,
    SORT_OPTIONS
} from "../../data";

// Default filter values
export const DEFAULT_FILTERS={
    search:"",
    status:"",
    lead:"",
    priority:"",
    deadline:"",
    sort:"deadline"
};

const DEADLINE_OPTIONS=[
    {label:"Overdue",value:"overdue"},
    {label:"Due this week",value:"week"},
    {label:"Due this month",value:"month"}
];

const SORT_VALUES={
    Deadline:"deadline",
    Name:"name",
    Newest:"newest",
    Completion:"completion"
};

const toOptions=(items)=>items.map((item)=>({label:item,value:item}));

const matchesDeadline=(project,deadline)=>{
    if(!deadline) return true;

    const days=daysUntil(project.dueDate);

    if(deadline==="overdue") return days<0;
    if(deadline==="week") return days>=0&&days<=7;
    if(deadline==="month") return days>=0&&days<=30;

    return true;
};

const sortProjects={
    deadline:(a,b)=>new Date(a.dueDate)-new Date(b.dueDate),
    name:(a,b)=>a.name.localeCompare(b.name),
    newest:(a,b)=>new Date(b.createdAt)-new Date(a.createdAt),
    completion:(a,b)=>
        b.taskDone/(b.taskTotal||1)-a.taskDone/(a.taskTotal||1),
};

// Apply search, filters and sorting
export const applyProjectFilters=(list,filters)=>{
    const searchText=filters.search.trim().toLowerCase();

    return list
        .filter((project)=>{
            if(searchText&&
                !project.name.toLowerCase().includes(searchText)&&
                !project.client.toLowerCase().includes(searchText)){
                return false;
            }

            if(filters.status&&project.status!==filters.status) return false;
            if(filters.lead&&project.leadId!==filters.lead) return false;
            if(filters.priority&&project.priority!==filters.priority) return false;

            return matchesDeadline(project,filters.deadline);
        })
        .sort(sortProjects[filters.sort]||sortProjects.deadline);
};

export const PROJECTS_STORAGE_KEY="nexaspace.projects.v1";

// Handles project data, filters and view settings
export const useProjects=(initial=seedProjects)=>{
    const [projects,setProjects]=useState(()=>{
        const saved=loadJSON(PROJECTS_STORAGE_KEY,null);
        return Array.isArray(saved)?saved:initial;
    });

    useEffect(()=>{
        saveJSON(PROJECTS_STORAGE_KEY,projects);
    },[projects]);

    const [filters,setFilters]=useState(DEFAULT_FILTERS);
    const [view,setView]=useState("grid");

    const filtered=useMemo(
        ()=>applyProjectFilters(projects,filters),
        [projects,filters]
    );

    return{
        projects,
        filtered,
        filters,
        view,
        setView,

        setFilter:(key,value)=>
            setFilters((prev)=>({...prev,[key]:value})),

        clearFilters:()=>
            setFilters((prev)=>({
                ...DEFAULT_FILTERS,
                sort:prev.sort,
            })),

        // Add a new project
        addProject:(project)=>
            setProjects((list)=>[...list,project]),

        // Update an existing project without creating a duplicate
        updateProject:(updatedProject)=>
            setProjects((list)=>list.map((project)=>
                project.id===updatedProject.id
                    ?{...project,...updatedProject}
                    :project
            )),

        // Duplicate a project
        duplicateProject:(project)=>
            setProjects((list)=>[
                ...list,
                {
                    ...project,
                    id:`${project.id}-copy-${Date.now()}`,
                    name:`${project.name} (copy)`,
                },
            ]),

        // Archive a project
        archiveProject:(project)=>
            setProjects((list)=>list.filter((item)=>item.id!==project.id)),
    };
};

// Grid and table view buttons
export const ProjectViewToggle=({view,setView})=>{
    const options=[
        {id:"grid",label:"Grid",icon:LayoutGrid},
        {id:"list",label:"Table",icon:Table2},
    ];

    return(
        <div
            role="group"
            aria-label="Project view"
            className="flex h-10 items-center gap-1 rounded-[10px] bg-[var(--color-background)] p-1"
        >
            {options.map(({id,label,icon:Icon})=>{
                const isActive=view===id;

                return(
                    <Button
                        key={id}
                        variant="ghost"
                        size="sm"
                        aria-pressed={isActive}
                        onClick={()=>setView(id)}
                        className={`!h-8 ${
                            isActive
                                ?"!bg-[var(--color-surface)] !text-[var(--color-text-primary)] shadow-[var(--shadow-sm)]"
                                :""
                        }`}
                    >
                        <Icon size={13} strokeWidth={1.8} aria-hidden="true"/>
                        {label}
                    </Button>
                );
            })}
        </div>
    );
};

// Project search and filters
const ProjectFilters=({
    filters=DEFAULT_FILTERS,
    onChange=()=>{},
    onClear,
    users=allUsers,
    projects=seedProjects,
})=>{
    const leadIds=new Set(projects.map((project)=>project.leadId));

    const leadOptions=users
        .filter((user)=>leadIds.has(user.id))
        .map((user)=>({label:user.name,value:user.id}));

    const hasActiveFilters=[
        "search",
        "status",
        "lead",
        "priority",
        "deadline",
    ].some((key)=>filters[key]!=="");

    const sortOptions=SORT_OPTIONS.map((label)=>({
        label,
        value:SORT_VALUES[label]??label.toLowerCase(),
    }));

    const handleChange=(key)=>(event)=>
        onChange(key,event.target.value);

    return(
        <div className="mt-6 flex flex-wrap items-center gap-2">
            <div className="w-full sm:w-[280px]">
                <SearchInput
                    value={filters.search}
                    onChange={handleChange("search")}
                    placeholder="Search by project or client"
                    aria-label="Search by project or client"
                />
            </div>

            <Dropdown
                value={filters.status}
                onChange={handleChange("status")}
                options={toOptions(PROJECT_STATUSES)}
                placeholder="Any status"
                aria-label="Filter by status"
                className="shrink-0 !w-[120px]"
            />

            <Dropdown
                value={filters.lead}
                onChange={handleChange("lead")}
                options={leadOptions}
                placeholder="Any lead"
                aria-label="Filter by lead"
                className="shrink-0 !w-[140px]"
            />

            <Dropdown
                value={filters.priority}
                onChange={handleChange("priority")}
                options={toOptions([...PROJECT_PRIORITIES].reverse())}
                placeholder="Any priority"
                aria-label="Filter by priority"
                className="shrink-0 !w-[130px]"
            />

            <Dropdown
                value={filters.deadline}
                onChange={handleChange("deadline")}
                options={DEADLINE_OPTIONS}
                placeholder="Any deadline"
                aria-label="Filter by deadline"
                className="shrink-0 !w-[140px]"
            />

            {hasActiveFilters&&onClear&&(
                <Button variant="ghost" onClick={onClear}>
                    Clear
                </Button>
            )}

            <div className="ml-auto flex shrink-0 items-center gap-2.5">
                <span className="text-[13px] text-[var(--color-text-secondary)]">
                    Sort
                </span>

                <Dropdown
                    value={filters.sort}
                    onChange={handleChange("sort")}
                    options={sortOptions}
                    placeholder={null}
                    aria-label="Sort projects"
                    className="shrink-0 !w-[130px]"
                />
            </div>
        </div>
    );
};

export default ProjectFilters;