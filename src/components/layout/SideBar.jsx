import {useEffect,useRef,useState } from "react";
import { LayoutGrid, FolderKanban, CalendarDays, Users, SquareCheck, ChartColumn, Inbox, Plus, Settings, HelpCircle, ChevronsUpDown, X, Menu, Command } from "lucide-react";
import {NavLink} from "react-router-dom";
import Avatar from "../common/Avatar";

const mainNavigation = [
  {name:"Overview",path:"/",icon:LayoutGrid },
  {name:"Projects",path:"/projects",icon:FolderKanban },
  {name:"My Tasks",path:"/mytasks",icon:SquareCheck,count:14},
  {name:"Calendar",path:"/calendar",icon:CalendarDays },
  {name:"Team",path:"/team",icon:Users },
  {name:"Reports & Analytics",path:"/reports",icon:ChartColumn },
  {name:"Inbox",path:"/inbox",icon:Inbox,count:4},
];

const projects=[
  {name:"Clinic Website Redesign",
    path:"/projects/clinic",
    color:"#0F8F6B",
    progress:"50%",
  },
  {
    name: "Atlas SaaS Dashboard",
    path: "/projects/atlas",
    color: "#5457C9",
    progress: "40%",
  },
  {
    name: "Ember Ordering App",
    path: "/projects/ember",
    color: "#B4531E",
    progress: "70%",
  },
  {
    name: "Northwind Marketing Site",
    path: "/projects/northwind",
    color: "#B8447F",
    progress: "20%",
  },
  {
    name: "Loom & Co. Storefront",
    path: "/projects/loom",
    color: "#3F8A2E",
    progress: "10%",
  },
  {
    name: "Internal Analytics Hub",
    path: "/projects/analytics",
    color: "#0A84B8",
    progress: "40%",
  },
];

const navClass = ({isActive})=>
  `group flex h-[36px] w-full min-w-0 items-center gap-[12px] rounded-[8px] border px-[11px] text-[13.5px] leading-[18px] transition-colors ${
    isActive?"border-[var(--color-border)] bg-[var(--color-surface)] font-medium text-[var(--color-text-primary)] shadow-[var(--shadow-sm)] [&_svg]:text-[var(--color-primary)]"
      :"border-transparent font-normal text-[#1F2937] hover:bg-[var(--color-background)]"}`;

const projectClass = ({isActive})=>
  `group flex h-[32px] w-full min-w-0 items-center gap-[10px] rounded-[8px] border px-[10px] text-[13px] leading-[18px] transition-colors ${
    isActive?"border-transparent bg-[var(--color-primary-light)] font-semibold text-[var(--color-primary)]"
      :"border-transparent font-normal text-[#1F2937] hover:bg-[var(--color-background)]"}`;

function Sidebar(){
  const [mobileOpen, setMobileOpen]=useState(false);
  const [workspaceOpen, setWorkspaceOpen]=useState(false);
  const workspaceRef = useRef(null);

  useEffect(()=>{
    if (!workspaceOpen) return;

    const handleClickOutside=(event)=>{
      if(workspaceRef.current && !workspaceRef.current.contains(event.target)){
        setWorkspaceOpen(false);
      }
    };

    const handleEscape=(event)=>{
      if(event.key==="Escape"){
        setWorkspaceOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return()=>{
      document.removeEventListener("mousedown",handleClickOutside);
      document.removeEventListener("keydown",handleEscape);
    };
  },[workspaceOpen]);

  const closeMobileMenu=()=>{
    setMobileOpen(false);
  };

  return (
    <>
      {/* mobile menu button */}
      <button
        type="button"
        onClick={() => setMobileOpen(true)}
        aria-label="Open navigation menu"
        aria-expanded={mobileOpen}
        className="fixed left-4 top-4 z-40 rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] p-2 text-[var(--color-text-primary)] shadow-sm lg:hidden"
      >
        <Menu size={19} />
      </button>

      {/* background  mobile */}
      {mobileOpen && (
        <button type="button" aria-label="Close navigation menu"
          onClick={closeMobileMenu}
          className="fixed inset-0 z-40 bg-black/30 lg:hidden"
        />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex h-screen w-[var(--sidebar-width)] shrink-0 flex-col overflow-y-auto border-r border-[var(--color-border)] bg-[var(--color-sidebar)] transition-transform duration-200 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden] lg:sticky lg:top-0 lg:z-20 lg:translate-x-0 ${
          mobileOpen?"translate-x-0":"-translate-x-full"
        }`}>
        <div className="relative shrink-0 px-[8px] pb-[12px] pt-[15px]">
          <div ref={workspaceRef} className="relative">
            <button
              type="button"
              onClick={()=>setWorkspaceOpen(!workspaceOpen)}
              aria-haspopup="menu"
              aria-expanded={workspaceOpen}
              className={`flex h-[46px] w-full items-center gap-[10px] rounded-[8px] pl-[7px] pr-[11px] text-left transition-colors hover:bg-[#EEF0F3] ${
                workspaceOpen?"bg-[#EEF0F3]" : ""
              }`}>
              <div className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-[9px] bg-[var(--color-primary)] text-[15px] font-semibold text-white">
                N
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[14px] font-semibold leading-[17px] tracking-[-0.2px] text-[var(--color-text-primary)]">
                  NexaSpace
                </p>
                <p className="truncate text-[12px] font-normal leading-[16px] text-[#4B5563]">
                  Lumen Studio
                </p>
              </div>
              <ChevronsUpDown
                size={14}
                strokeWidth={1.8}
                className="shrink-0 text-[var(--color-text-muted)]"/>
            </button>

            {/* workspace dropdown */}
            {workspaceOpen && (
              <div
                role="menu"
                className="absolute left-0 right-0 top-full z-50 mt-[3px] rounded-[10px] border border-[var(--color-border)] bg-[var(--color-surface)] p-[8px] shadow-lg">
                <p className="px-[8px] pb-[7px] pt-[3px] text-[11px] font-semibold uppercase leading-[14px] tracking-[0.6px] text-[#6B7280]">
                  Workspace
                </p>
                <button type="button" role="menuitemradio"
                  aria-checked="true"
                  onClick={()=>setWorkspaceOpen(false)}
                  className="flex h-[40px] w-full items-center gap-[10px] rounded-[8px] bg-[#F3F4F6] px-[8px] text-left">
                  <div className="flex h-[24px] w-[24px] shrink-0 items-center justify-center rounded-[6px] bg-[var(--color-primary)] text-[11px] font-semibold text-white">
                    N
                  </div>
                  <span className="min-w-0 flex-1 truncate text-[13px] font-medium text-[#111827]">
                    Lumen Studio
                  </span>
                </button>
              </div>
            )}
          </div>
          {/* close button for mobile */}
          <button
            type="button"
              onClick={closeMobileMenu}
            aria-label="Close sidebar"
            className="absolute right-1 top-1 rounded-md p-1 text-[var(--color-text-secondary)] hover:bg-[var(--color-background)] lg:hidden"
          >
            <X size={18} />
          </button>
        </div>
        <nav className="flex-1 pb-[12px] pl-[9px] pr-[12px]">
          <div className="space-y-[2px]">
            {mainNavigation.map((item)=>{
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path==="/"}
                  onClick={closeMobileMenu}
                  className={navClass}>
                  <Icon
                    size={16}
                    strokeWidth={1.8}
                    className="shrink-0 text-[#4B5563] transition-colors group-hover:text-[var(--color-primary)]"/>
                  <span className="min-w-0 flex-1 truncate">
                    {item.name}
                  </span>
                  {item.count !== undefined && (
                    <span className="flex h-[20px] min-w-[22px] shrink-0 items-center justify-center rounded-full bg-[#E9EBEF] px-[6px] text-[11px] font-medium leading-none text-[#374151]">
                      {item.count}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </div>

          {/* projects list */}
          <div className="mt-[23px]">
            <div className="mb-[7px] flex h-[20px] items-center justify-between px-[10px]">
              <p className="text-[11px] font-medium uppercase leading-[14px] tracking-[0.6px] text-[#6B7280]">
                Projects
              </p>
              <button
                type="button"
                aria-label="Add project"
                className="flex h-[20px] w-[20px] items-center justify-center rounded-[4px] text-[var(--color-text-muted)] transition-colors hover:bg-[var(--color-background)] hover:text-[var(--color-primary)]">
                <Plus size={14} strokeWidth={1.8} />
              </button>
            </div>
            <div className="space-y-[1px]">
              {projects.map((project) => (
                <NavLink
                  key={project.path}
                  to={project.path}
                  onClick={closeMobileMenu}
                  className={projectClass}>
                  <span
                    className="h-[8px] w-[8px] shrink-0 rounded-full"
                    style={{backgroundColor:project.color}}/>
                  <span className="min-w-0 flex-1 truncate">
                    {project.name}
                  </span>
                  <span className="shrink-0 font-mono text-[11px] font-normal leading-[14px] text-[var(--color-text-muted)]">
                    {project.progress}
                  </span>
                </NavLink>
              ))}
            </div>
          </div>
        </nav>
        {/* settings and user profile */}
        <div className="mt-auto shrink-0 border-t border-[var(--color-border)] pb-[10px] pl-[9px] pr-[12px] pt-[9px]">
          <NavLink to="/settings" onClick={closeMobileMenu} className={navClass}>
            <Settings
              size={16}
              strokeWidth={1.8}
              className="shrink-0 text-[#4B5563] transition-colors group-hover:text-[var(--color-primary)]"/>
            <span className="min-w-0 flex-1 truncate">
              Workspace settings
            </span>
          </NavLink>
          <NavLink to="/help" onClick={closeMobileMenu}
            className={`${navClass({isActive:false})} mt-[2px]`}>
            <HelpCircle
              size={16}
              strokeWidth={1.8}
              className="shrink-0 text-[#4B5563] transition-colors group-hover:text-[var(--color-primary)]"/>
            <span className="min-w-0 flex-1 truncate">
              Help & shortcuts
            </span>
            <kbd className="hidden shrink-0 rounded-[4px] border border-[var(--color-border)] bg-[var(--color-background)] px-[5px] py-[2px] font-sans text-[10px] leading-[12px] text-[var(--color-text-muted)] sm:inline-block">
              <span className="inline-flex items-center gap-[2px]"><Command size={10} strokeWidth={1.8} />K</span>
            </kbd>
          </NavLink>

          {/* logged user */}
          <div className="mt-[8px] border-t border-[var(--color-border)] pt-[8px]">
            <div className="flex h-[48px] w-full items-center gap-[10px] rounded-[6px] px-[6px]">
              <div className="relative h-[32px] w-[32px] shrink-0">
                <Avatar
                  name="Aarav Mehta"
                  size="sm"
                  className="!h-[32px] !w-[32px] !bg-[var(--color-primary-light)] !text-[11px] !font-semibold !text-[var(--color-primary)]"/>
                <span className="absolute bottom-0 right-0 h-[9px] w-[9px] rounded-full border-2 border-[var(--color-sidebar)] bg-[var(--color-success)]" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[12px] font-semibold leading-[17px] text-[var(--color-text-primary)]">
                  Aarav Mehta
                </p>
                <p className="truncate text-[11px] font-normal leading-[15px] text-[var(--color-text-muted)]">
                  aarav@lumen.studio
                </p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;