const Tabs=({tabs=[],activeTab,onChange,className=""})=>{
    return(
        <div className={`flex items-center gap-1 overflow-x-auto border-b border-[var(--color-border)] ${className}`} role="tablist">
            {tabs.map((tab)=>(
                <button
                    key={tab.value}
                    type="button"
                    role="tab"
                    id={`tab-${tab.value}`}
                    aria-selected={activeTab===tab.value}
                    onClick={()=>onChange(tab.value)}
                    className={`shrink-0 border-b-2 px-3 py-2.5 text-[13px] font-medium transition-colors ${activeTab===tab.value?"border-[var(--color-primary)] text-[var(--color-primary)]":"border-transparent text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"}`}
                >
                    {tab.label}
                    {tab.count!==undefined&&(
                        <span className="ml-2 rounded-md bg-[var(--color-background)] px-1.5 py-0.5 text-xs text-[var(--color-text-secondary)]">
                            {tab.count}
                        </span>
                    )}
                </button>
            ))}
        </div>
    )
}

export default Tabs;