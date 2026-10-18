const Tabs=({tabs=[],activeTab,onChange,className=""})=>{
    return(
        <div className={`flex items-center overflow-x-auto border-b border-[var(--color-border)] ${className}`} role="tablist">
            {tabs.map((tab)=>{
                const active=activeTab===tab.value;
                const Icon=tab.icon;
                return(
                    <button
                        key={tab.value}
                        type="button"
                        role="tab"
                        id={`tab-${tab.value}`}
                        aria-selected={active}
                        onClick={()=>onChange(tab.value)}
                        className={`-mb-px flex h-[42px] shrink-0 items-center gap-2 border-b-2 px-3.5 text-[13px] transition-colors ${active?"border-[var(--color-primary)] font-semibold text-[var(--color-text-primary)]":"border-transparent text-[#4B5563] hover:text-[var(--color-text-primary)]"}`}
                    >
                        {Icon&&<Icon size={14} strokeWidth={1.7}/>}
                        {tab.label}
                        {tab.count!==undefined&&(
                            <span className="rounded-full bg-[#EEF0F3] px-2 py-px text-[11px] font-medium text-[#4B5563]">
                                {tab.count}
                            </span>
                        )}
                    </button>
                )
            })}
        </div>
    )
}

export default Tabs;