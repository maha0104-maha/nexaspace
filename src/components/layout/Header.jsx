import {useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {Search,Plus,Bell,ChevronDown,ChevronRight,X,Check,CheckSquare,FolderPlus,
} from "lucide-react";
import Button from "../common/Button";
import Input from "../common/Input";
import Dropdown from "../common/Dropdown";
import Avatar from "../common/Avatar";
import Badge from "../common/Badge";
import { loadJSON } from "../../utils/storage";
import { projects as seedProjects } from "../../data";

// project name
const getProjectName = (id) => {
  const saved = loadJSON("nexaspace.projects.v1", null);
  const list = Array.isArray(saved) ? saved : seedProjects;
  return list.find((p) => p.id === id)?.name || "Project";
};

function Header({title="Overview",onCreateTask,onCreateProject}) {
  const { pathname } = useLocation();
  const match = pathname.match(/^\/projects\/([^/]+)/);
  const heading = match ? getProjectName(match[1]) : pathname === "/projects" ? "Projects" : title;
  const [searchOpen,setSearchOpen]=useState(false);
  const [searchValue,setSearchValue]=useState("");
  const [notificationsOpen,setNotificationsOpen]=useState(false);
  const createOptions=[{label:"New task",
      description:"Add work to a project",
      icon:CheckSquare,
      color:"#4F46E5",
      onSelect:onCreateTask,
    },
    {
      label:"New project",
      description:"Set up team, dates and goals",
      icon:FolderPlus,
      color:"#0F9D75",
      onSelect:onCreateProject,
    },
  ];

  return (
    <header className="sticky top-0 z-30 w-full border-b border-[var(--color-border)] bg-[var(--color-surface)]">
      <div className="flex h-[64px] items-center justify-between gap-3 pl-[60px] pr-4 sm:pr-[20px] lg:pl-[34px]">
        <div className="flex min-w-0 items-center gap-[10px] text-[13px] leading-[18px]">
          {match?(
            <Link to="/projects" className="hidden truncate font-normal text-[#4B5563] hover:text-[var(--color-primary)] sm:inline">
              Projects
            </Link>
          ):(
            <span className="hidden truncate font-normal text-[#4B5563] sm:inline">
              Lumen Studio
            </span>
          )}
          <ChevronRight
            size={14}
            strokeWidth={1.8}
            className="hidden shrink-0 text-[var(--color-text-muted)] sm:block"/>
          <h1 className="truncate text-[13px] font-semibold leading-[18px] text-[var(--color-text-primary)]">
            {heading}
          </h1>
        </div>
        <div className="flex shrink-0 items-center gap-[12px]">
          {/* search */}
          <div className="relative">
            {searchOpen?(
              <div className="absolute right-0 top-0 z-40 flex h-[36px] w-[240px] items-center gap-[8px] rounded-[8px] border border-[var(--color-border)] bg-[var(--color-surface)] px-[12px] shadow-sm sm:static sm:w-[260px]">
                <Search size={15} strokeWidth={1.8}
                  className="shrink-0 text-[var(--color-text-muted)]"/>
                <Input autoFocus type="search" value={searchValue}
                  onChange={(event)=>setSearchValue(event.target.value)}
                  placeholder="Search projects, tasks, people"
                  aria-label="Search projects, tasks, and people"
                  className="!h-auto !min-w-0 !flex-1 !rounded-none !border-0 !bg-transparent !px-0 !py-0 !text-[13px] !shadow-none focus:!ring-0"/>
               <button
                  type="button"
                  onClick={()=>{
                    setSearchOpen(false);
                    setSearchValue("");
                  }}
                  aria-label="Close search"
                  className="shrink-0 text-[var(--color-text-muted)] hover:text-[var(--color-primary)]">
                  <X size={15}/>
                </button>
              </div>
            ):(
              <button
                type="button"
                onClick={()=>setSearchOpen(true)}
                aria-label="Open search"
                className="flex h-[36px] items-center gap-[8px] rounded-[8px] border border-[var(--color-border)] bg-[#F9FAFB] px-[12px] text-[var(--color-text-muted)] transition-colors hover:bg-[var(--color-background)] lg:w-[260px]">
                <Search size={15} strokeWidth={1.8} className="shrink-0"/>
                <span className="hidden flex-1 truncate text-left text-[13px] font-normal lg:inline">
                  Search projects, tasks, people
                </span>
                <kbd className="hidden shrink-0 rounded-[4px] border border-[var(--color-border)] bg-[var(--color-surface)] px-[5px] py-[1px] font-sans text-[10px] leading-[14px] text-[var(--color-text-muted)] lg:inline-block">
                  ⌘K
                </kbd>
              </button>
            )}
          </div>

          <Dropdown
            mode="menu"
            trigger={
              <Button
                type="button"
                className="flex h-[36px] items-center gap-[6px] rounded-[8px] bg-[var(--color-primary)] pl-[13px] pr-[11px] text-[13px] font-medium text-white transition-colors hover:bg-[var(--color-primary-hover)]">
                <Plus size={16} strokeWidth={1.8}/>
                <span>Create</span>
                <ChevronDown size={14} strokeWidth={1.8} className="hidden sm:block"/>
              </Button>}
            menuClassName="absolute right-0 top-[45px] z-50 w-[240px] rounded-[12px] border border-[var(--color-border)] bg-[var(--color-surface)] p-[8px] shadow-lg">
            {({close})=>createOptions.map((option)=>{
              const Icon=option.icon;
              return (
                <button key={option.label}
                  type="button"
                  role="menuitem"
                  onClick={()=>{
                    close();
                    option.onSelect?.();
                  }}
                  className="mb-[3px] flex w-full items-start gap-[12px] rounded-[8px] py-[7px] pl-[7px] pr-[8px] text-left transition-colors last:mb-0 hover:bg-[#F3F4F6]">
                  <Icon
                    size={14}
                    strokeWidth={1.8}
                    className="mt-[1px] shrink-0"
                    style={{color:option.color}} />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[13px] font-medium leading-[16px] text-[#111827]">
                      {option.label}
                    </span>
                    <span className="block truncate text-[12px] font-normal leading-[16px] text-[#6B7280]">
                      {option.description}
                    </span>
                  </span>
                </button>
              );
            })}
          </Dropdown>
          {/* notifications */}
          <Dropdown
            mode="menu"
            trigger={
              <button
                type="button"
                aria-label="Notifications"
                className="relative flex h-[36px] w-[36px] items-center justify-center rounded-[8px] border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-secondary)] transition-colors hover:bg-[var(--color-background)] hover:text-[var(--color-primary)]">
                <Bell size={16} strokeWidth={1.8}/>
                <Badge variant="danger"  className="absolute -right-[4px] -top-[6px] !flex !h-[16px] !min-w-[16px] !items-center !justify-center !rounded-full !bg-[#ff3b30] !px-[4px] !text-[9px] !font-semibold !leading-none !text-white ring-2 ring-[var(--color-surface)]">
                     4
                </Badge>
              </button>
            }
            menuClassName="absolute right-0 top-[44px] z-50 w-64 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-lg sm:w-72">
            {({close})=>(
              <>
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-semibold text-[var(--color-text-primary)]">
                    Notifications
                  </h2>
                  <button
                    type="button"
                    onClick={close}
                    aria-label="Close notifications"
                    className="text-[var(--color-text-muted)] hover:text-[var(--color-primary)]">
                    <X size={16}/>
                  </button>
                </div>
                <div className="mt-4 flex items-start gap-2">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary-light)] text-[var(--color-primary)]">
                    <Check size={15}/>
                  </div>

                  <div>
                    <p className="text-xs font-medium text-[var(--color-text-primary)]">
                      You're all caught up
                    </p>
                    <p className="mt-1 text-[11px] leading-4 text-[var(--color-text-muted)]">
                      New notifications will appear here.
                    </p>
                  </div>
                </div>
              </>
            )}
          </Dropdown>

          {/* avatar */}
          <div className="flex h-[34px] w-[34px] shrink-0 items-center justify-center">
            <Avatar
              name="Aarav Mehta"
              size="md"
              className="!h-[34px] !w-[34px] !bg-[#CFE0FD] !text-[12px] !font-semibold !text-[#1D4ED8]"/>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;