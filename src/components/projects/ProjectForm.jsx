import {useState} from "react";
import {Check,Flag,Plus} from "lucide-react";
import Modal from "../common/Modal";
import Button from "../common/Button";
import Input from "../common/Input";
import Textarea from "../common/Textarea";
import Dropdown from "../common/Dropdown";
import Avatar from "../common/Avatar";
import {ICONS} from "./ProjectCard";
import {users,currentUserId,
    DEMO_TODAY,PROJECT_COLORS,PROJECT_ICONS,
    PROJECT_PRIORITIES,PROJECT_STATUSES,PRIORITY_STYLES,
    STATUS_STYLES} from "../../data";


const addDays=(iso,days)=>{
    const date=new Date(`${iso}T00:00:00`);
    date.setDate(date.getDate()+days);
    const pad=(n)=>String(n).padStart(2,"0");
    return `${date.getFullYear()}-${pad(date.getMonth()+1)}-${pad(date.getDate())}`;
};

const INITIAL_VALUES={
    name:"",
    description:"",
    client:"",
    leadId:currentUserId,
    startDate:DEMO_TODAY,
    dueDate:addDays(DEMO_TODAY,42),
    priority:"Medium",
    status:"On Track",
    memberIds:[currentUserId],
    color:PROJECT_COLORS[0],
    icon:PROJECT_ICONS[0]
};

// Build a new project or update an existing project's editable fields.
export const buildProject=(values,existingProject=null)=>({
    ...(existingProject||{}),
    id:existingProject?.id||`project-${Date.now()}`,
    name:values.name.trim(),
    client:values.client.trim()||"Internal",
    description:values.description.trim(),
    status:values.status,
    priority:values.priority,
    leadId:values.leadId,
    memberIds:values.memberIds.includes(values.leadId)
        ?values.memberIds
        :[values.leadId,...values.memberIds],
    startDate:values.startDate,
    dueDate:values.dueDate,
    createdAt:existingProject?.createdAt||new Date().toISOString().slice(0,10),
    taskTotal:existingProject?.taskTotal??0,
    taskDone:existingProject?.taskDone??0,
    icon:values.icon,
    iconBg:`${values.color}1F`,
    iconColor:values.color,
    color:values.color,
    sidebarProgress:existingProject?.sidebarProgress||"0%",
    filesCount:existingProject?.filesCount??0,
    boardCount:existingProject?.boardCount??0,
    openTasks:existingProject?.openTasks??0,
    overdueTasks:existingProject?.overdueTasks??0,
    blockedTasks:existingProject?.blockedTasks??0,
    estHoursLeft:existingProject?.estHoursLeft??0,
});

const validate=(values)=>{
    const errors={};

    if(!values.name.trim()) errors.name="Project name is required";
    if(!values.startDate) errors.startDate="Start date is required";
    if(!values.dueDate) errors.dueDate="Deadline is required";
    else if(values.startDate&&values.dueDate<values.startDate){
        errors.dueDate="Deadline must be on or after the start date";
    }

    if(!values.memberIds.length) errors.memberIds="Pick at least one team member";

    return errors;
};

const Required=({children})=>(
    <>
        {children}<span className="text-[var(--color-danger)]">*</span>
    </>
);

const Field=({label,required,error,children})=>(
    <div>
        <p className="mb-1.5 text-[13px] font-medium text-[var(--color-text-primary)]">
            {required?<Required>{label}</Required>:label}
        </p>
        {children}
        {error&&<p className="mt-1.5 text-xs text-[var(--color-danger)]">{error}</p>}
    </div>
);

const Segmented=({label,value,options,onChange})=>(
    <div
        role="radiogroup"
        aria-label={label}
        className="flex gap-1 rounded-[10px] bg-[var(--color-background)] p-1"
    >
        {options.map((option)=>{
            const active=value===option.value;

            return(
                <Button
                    key={option.value}
                    variant="ghost"
                    role="radio"
                    aria-checked={active}
                    onClick={()=>onChange(option.value)}
                    className={`!h-8 flex-1 !px-2 ${
                        active
                            ?"!bg-[var(--color-surface)] !text-[var(--color-text-primary)] shadow-[var(--shadow-sm)]"
                            :""
                    }`}
                >
                    {option.icon}
                    {option.value}
                </Button>
            );
        })}
    </div>
);

// Form for creating a new project or editing an existing one.
const FormBody=({onClose,onSubmit,editProject})=>{
    const [values,setValues]=useState(()=>{
        if(!editProject){
            return {
                ...INITIAL_VALUES,
                memberIds:[...INITIAL_VALUES.memberIds],
            };
        }

        return {
            ...INITIAL_VALUES,
            name:editProject.name||"",
            description:editProject.description||"",
            client:editProject.client||"",
            leadId:editProject.leadId||currentUserId,
            startDate:editProject.startDate||DEMO_TODAY,
            dueDate:editProject.dueDate||addDays(DEMO_TODAY,42),
            priority:editProject.priority||"Medium",
            status:editProject.status||"On Track",
            memberIds:editProject.memberIds?.length
                ?[...editProject.memberIds]
                :[editProject.leadId||currentUserId],
            color:editProject.color||editProject.iconColor||PROJECT_COLORS[0],
            icon:editProject.icon||PROJECT_ICONS[0],
        };
    });

    const [errors,setErrors]=useState({});

    const set=(key,value)=>{
        setValues((current)=>({...current,[key]:value}));

        if(errors[key]){
            setErrors((current)=>({...current,[key]:undefined}));
        }
    };

    const changeLead=(leadId)=>{
        setValues((current)=>({
            ...current,
            leadId,
            memberIds:current.memberIds.includes(leadId)
                ?current.memberIds
                :[...current.memberIds,leadId],
        }));

        if(errors.memberIds){
            setErrors((current)=>({...current,memberIds:undefined}));
        }
    };

    const toggleMember=(id)=>{
        if(id===values.leadId) return;

        set(
            "memberIds",
            values.memberIds.includes(id)
                ?values.memberIds.filter((memberId)=>memberId!==id)
                :[...values.memberIds,id]
        );
    };

    const handleSubmit=(event)=>{
        event.preventDefault();

        const found=validate(values);
        setErrors(found);

        if(Object.keys(found).length) return;

        onSubmit(buildProject(values,editProject));
    };

    return(
        <Modal
            isOpen
            onClose={onClose}
            title={editProject?"Edit project":"New project"}
            className="!max-w-[640px]"
            footer={
                <>
                    <Button variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button type="submit" form="project-form">
                        {editProject?"Update project":"Create project"}
                    </Button>
                </>
            }
        >
            <form id="project-form" onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
                <Input
                    name="project-name"
                    label={<Required>Project name</Required>}
                    placeholder="e.g. Harbor Health patient portal"
                    value={values.name}
                    onChange={(event)=>set("name",event.target.value)}
                    error={errors.name}
                    autoFocus
                />

                <Textarea
                    name="project-description"
                    label="Description"
                    rows={2}
                    placeholder="What does done look like?"
                    value={values.description}
                    onChange={(event)=>set("description",event.target.value)}
                />

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <Input
                        name="project-client"
                        label="Client or department"
                        placeholder="Internal"
                        value={values.client}
                        onChange={(event)=>set("client",event.target.value)}
                    />

                    <Dropdown
                        name="project-lead"
                        label="Project lead"
                        placeholder={null}
                        value={values.leadId}
                        onChange={(event)=>changeLead(event.target.value)}
                        options={users.map((user)=>({label:user.name,value:user.id}))}
                    />

                    <Input
                        type="date"
                        name="project-start"
                        label={<Required>Start date</Required>}
                        value={values.startDate}
                        onChange={(event)=>set("startDate",event.target.value)}
                        error={errors.startDate}
                    />

                    <Input
                        type="date"
                        name="project-deadline"
                        label={<Required>Deadline</Required>}
                        min={values.startDate}
                        value={values.dueDate}
                        onChange={(event)=>set("dueDate",event.target.value)}
                        error={errors.dueDate}
                    />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <Field label="Priority">
                        <Segmented
                            label="Priority"
                            value={values.priority}
                            onChange={(value)=>set("priority",value)}
                            options={PROJECT_PRIORITIES.map((value)=>({
                                value,
                                icon:(
                                    <Flag
                                        size={13}
                                        strokeWidth={1.8}
                                        style={{color:PRIORITY_STYLES[value]}}
                                    />
                                ),
                            }))}
                        />
                    </Field>

                    <Field label="Status">
                        <Segmented
                            label="Status"
                            value={values.status}
                            onChange={(value)=>set("status",value)}
                            options={PROJECT_STATUSES.map((value)=>({
                                value,
                                icon:(
                                    <span
                                        className="h-1.5 w-1.5 rounded-full"
                                        style={{backgroundColor:STATUS_STYLES[value].dot}}
                                    />
                                ),
                            }))}
                        />
                    </Field>
                </div>

                <Field label="Team members" required error={errors.memberIds}>
                    <div className="flex flex-wrap gap-2">
                        {users.map((user)=>{
                            const selected=values.memberIds.includes(user.id);
                            const Icon=selected?Check:Plus;

                            return(
                                <button
                                    key={user.id}
                                    type="button"
                                    aria-pressed={selected}
                                    onClick={()=>toggleMember(user.id)}
                                    className={`flex h-8 items-center gap-1.5 rounded-full border py-0 pl-1 pr-2.5 text-[13px] transition-colors ${
                                        selected
                                            ?"border-[var(--color-primary)]/40 bg-[var(--color-primary-light)] font-medium text-[var(--color-text-primary)]"
                                            :"border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-secondary)] hover:bg-[var(--color-background)]"
                                    }`}
                                >
                                    <Avatar
                                        name={user.name}
                                        size="xs"
                                        style={{backgroundColor:user.avatarBg,color:user.avatarFg}}
                                    />
                                    {user.firstName}
                                    <Icon size={12} strokeWidth={2} aria-hidden="true"/>
                                </button>
                            );
                        })}
                    </div>
                </Field>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <Field label="Color">
                        <div role="radiogroup" aria-label="Project color" className="flex flex-wrap gap-2.5 p-1">
                            {PROJECT_COLORS.map((color)=>{
                                const selected=values.color===color;

                                return(
                                    <button
                                        key={color}
                                        type="button"
                                        role="radio"
                                        aria-checked={selected}
                                        aria-label={color}
                                        onClick={()=>set("color",color)}
                                        style={{backgroundColor:color,"--tw-ring-color":color}}
                                        className={`h-6 w-6 rounded-full ring-offset-2 transition-shadow ${
                                            selected?"ring-2":"hover:ring-2 hover:ring-offset-1"
                                        }`}
                                    />
                                );
                            })}
                        </div>
                    </Field>

                    <Field label="Icon">
                        <div role="radiogroup" aria-label="Project icon" className="flex flex-wrap gap-2">
                            {PROJECT_ICONS.map((key)=>{
                                const Icon=ICONS[key];
                                const selected=values.icon===key;

                                return(
                                    <button
                                        key={key}
                                        type="button"
                                        role="radio"
                                        aria-checked={selected}
                                        aria-label={key}
                                        onClick={()=>set("icon",key)}
                                        className={`flex h-8 w-8 items-center justify-center rounded-lg border transition-colors ${
                                            selected
                                                ?"border-[var(--color-primary)]/40 bg-[var(--color-primary-light)] text-[var(--color-primary)]"
                                                :"border-[var(--color-border)] text-[var(--color-text-secondary)] hover:bg-[var(--color-background)]"
                                        }`}
                                    >
                                        <Icon size={15} strokeWidth={1.7}/>
                                    </button>
                                );
                            })}
                        </div>
                    </Field>
                </div>
            </form>
        </Modal>
    );
};

const ProjectForm=({isOpen,onClose,onSubmit,editProject})=>
    isOpen
        ?<FormBody
            key={editProject?.id||"new-project"}
            onClose={onClose}
            onSubmit={onSubmit}
            editProject={editProject}
        />
        :null;

export default ProjectForm;