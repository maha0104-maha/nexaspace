import {useState,useEffect} from "react";
import {useNavigate} from "react-router-dom";
import {Search,CirclePlus,FolderPlus,LayoutGrid,FolderKanban,SquareCheck,CalendarDays,Users,ChartColumn,Inbox,Settings,Tag,ArrowUp,ArrowDown,CornerDownLeft,Command} from "lucide-react";
import Avatar from "../common/Avatar";
import {ICONS} from "../projects/ProjectCard";
import useLiveData from "../../hooks/useLiveData";
import {buildSections} from "../../utils/paletteSearch";
import {STATUS_META} from "../../data";

const ACTION_ICONS={
    "create-task":CirclePlus,
    "create-project":FolderPlus,
    "go-overview":LayoutGrid,
    "go-projects":FolderKanban,
    "go-tasks":SquareCheck,
    "go-calendar":CalendarDays,
    "go-team":Users,
    "go-reports":ChartColumn,
    "go-inbox":Inbox,
    "go-settings":Settings,
};

// the little picture in front of each row
const RowIcon=({item})=>{
    if(item.kind==="action"){
        const Icon=ACTION_ICONS[item.id];
        return <Icon size={16} strokeWidth={1.6} className="shrink-0"/>
    }
    if(item.kind==="project"){
        const Icon=ICONS[item.icon]||ICONS.rocket;
        return <Icon size={16} strokeWidth={1.6} className="shrink-0"/>
    }
    if(item.kind==="task"){
        return <span className="h-[12px] w-[12px] shrink-0 rounded-full border-2" style={{borderColor:STATUS_META[item.status].bar}}/>
    }
    if(item.kind==="person"){
        return <Avatar name={item.user.name} size="xs" style={{backgroundColor:item.user.avatarBg,color:item.user.avatarFg}}/>
    }
    return <Tag size={16} strokeWidth={1.6} className="shrink-0"/>
}

function CommandPalette({onClose,onCreateTask,onCreateProject}){
    const navigate=useNavigate();
    const {projects,tasks}=useLiveData();
    const [query,setQuery]=useState("");
    const [active,setActive]=useState(0);

    const sections=buildSections(query,{projects,tasks,canCreateTask:projects.length>0});
    const items=sections.flatMap((section)=>section.items);
    // if the list got shorter while typing, keep the highlight on a real row
    const current=Math.min(active,Math.max(items.length-1,0));

    // keep the highlighted row visible when moving with the arrow keys
    useEffect(()=>{
        document.getElementById("palette-row-"+current)?.scrollIntoView({block:"nearest"});
    },[current]);

    const run=(item)=>{
        if(!item)return;
        onClose();
        if(item.id==="create-task")onCreateTask();
        else if(item.id==="create-project")onCreateProject();
        else if(item.to)navigate(item.to);
    }

    const onKeyDown=(event)=>{
        if(event.key==="Escape"){
            event.preventDefault();
            onClose();
        }
        if(event.key==="ArrowDown"&&items.length){
            event.preventDefault();
            setActive((current+1)%items.length);
        }
        if(event.key==="ArrowUp"&&items.length){
            event.preventDefault();
            setActive((current-1+items.length)%items.length);
        }
        if(event.key==="Enter"){
            event.preventDefault();
            run(items[current]);
        }
    }

    return(
        <div
            className="fixed inset-0 z-[400] flex items-start justify-center bg-[#111827]/35 px-4 pt-[79px]"
            onMouseDown={(event)=>event.target===event.currentTarget&&onClose()}
            onKeyDown={onKeyDown}>
            <div role="dialog" aria-modal="true" aria-label="Command palette"
                className="w-full max-w-[620px] overflow-hidden rounded-[16px] bg-[var(--color-surface)] shadow-2xl">
                <div className="flex h-[56px] items-center gap-[12px] border-b border-[var(--color-border)] px-[18px]">
                    <Search size={18} strokeWidth={1.7} className="shrink-0 text-[#6B7280]"/>
                    <input
                        autoFocus
                        role="combobox"
                        aria-expanded="true"
                        aria-controls="palette-list"
                        aria-activedescendant={items.length?"palette-row-"+current:undefined}
                        value={query}
                        onChange={(event)=>{setQuery(event.target.value);setActive(0);}}
                        placeholder="Search projects, tasks, people, labels — or run a command"
                        className="min-w-0 flex-1 bg-transparent text-[15px] text-[#111827] outline-none placeholder:text-[#9CA3AF]"/>
                    <kbd className="shrink-0 rounded-[5px] border border-[var(--color-border)] bg-white px-[6px] py-[1px] font-sans text-[11px] leading-[16px] text-[#6B7280]">esc</kbd>
                </div>
                <div id="palette-list" role="listbox" className="max-h-[345px] overflow-y-auto py-[6px]">
                    {items.length===0&&(
                        <p className="px-5 py-10 text-center text-[13px] text-[#6B7280]">Nothing found for "{query}"</p>
                    )}
                    {sections.map((section)=>(
                        <div key={section.title}>
                            <p className="px-[17px] pb-[6px] pt-[10px] text-[11px] font-medium uppercase tracking-[0.6px] text-[#6B7280]">{section.title}</p>
                            {section.items.map((item)=>{
                                const index=items.indexOf(item);
                                const on=index===current;
                                return(
                                    <button
                                        key={item.key}
                                        id={"palette-row-"+index}
                                        type="button"
                                        role="option"
                                        aria-selected={on}
                                        onMouseMove={()=>setActive(index)}
                                        onClick={()=>run(item)}
                                        className={`mx-[6px] flex h-[35px] w-[calc(100%-12px)] items-center gap-[12px] rounded-[8px] px-[11px] text-left text-[13.5px] ${on?"bg-[#F1F0FF] text-[#3730A3]":"text-[#111827]"}`}>
                                        <RowIcon item={item}/>
                                        <span className="min-w-0 flex-1 truncate">
                                            <span className="font-medium">{item.label}</span>
                                            {item.hint&&<span className="ml-[8px] text-[12.5px] font-normal text-[#9CA3AF]">{item.hint}</span>}
                                        </span>
                                    </button>
                                )
                            })}
                        </div>
                    ))}
                </div>
                <div className="flex items-center gap-[16px] border-t border-[var(--color-border)] bg-[#FAFAFB] px-[17px] py-[11px] text-[12px] text-[#6B7280]">
                    <span className="flex items-center gap-[5px]"><ArrowUp size={12} strokeWidth={1.8}/><ArrowDown size={12} strokeWidth={1.8}/>to navigate</span>
                    <span className="flex items-center gap-[5px]"><CornerDownLeft size={12} strokeWidth={1.8}/>to open</span>
                    <span className="flex items-center gap-[5px]"><Command size={11} strokeWidth={1.8}/>K to toggle</span>
                </div>
            </div>
        </div>
    )
}
export default CommandPalette;
