import { Search, X } from "lucide-react";

const SearchInput=({value="",onChange,placeholder="Search...",className="",onClear,...props})=>{
    return(
        <div className={`relative flex h-9 w-full items-center ${className}`}>
            <Search className="absolute left-3 h-4 w-4 text-[var(--color-text-muted)]"/>
            <input
                type="search"
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className="h-full w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] pl-9 pr-9 text-[13px] text-[var(--color-text-primary)] outline-none placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/10"
                {...props}/>
            {value&&(
                <button type="button" onClick={()=>onClear?onClear():onChange?.({target:{value:""}})} aria-label="Clear search" className="absolute right-3 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]">
                    <X className="h-4 w-4"/>
                </button>
            )}
        </div>
    )
}

export default SearchInput;